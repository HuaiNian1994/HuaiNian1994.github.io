## Summary

本文用于介绍[Controlnet Extension for webUI](https://github.com/Mikubill/sd-webui-controlnet)使用过程中遇到的概念



## Common options

介绍Controlnet Extension for webUI的通用选项：

todo

+ Enable：是否启用ControlNet。

+ Low VRAM：面向显存小于8GB的GPU。这是一个实验性功能。请检查您是否已经用尽了GPU内存，或者想增加要处理的图像数量。

+ Pixel Perfect：启用Pixel Perfect模式，就不需要手动设置`Preprocessor Resolution`。ControlNet会自动计算最佳的`Preprocessor Resolution`，以便每个像素完美匹配Stable Diffusion。

+ Allow Preview：勾选此选项以在参考图像旁边启用预览窗口。我建议您选择此选项。使用预处理器下拉菜单旁边的爆炸图标来预览预处理器的效果。

+ Preprocessor

+ Model

+ Control Weight：控制模型对control map（即预处理后的图像）的遵循程度，数值越低越不遵循。类似于prompt中的强调，例如（myprompt: 1.2）。在技术上，它是在将ControlNet输出与原始的SD Unet合并之前，将其乘以的因子。

+ Starting Control Step：ControlNet开始应用的第一个step。

+ Ending Control Step：ControlNet生效的最后一个step。一般来说，改变`Ending Control Step`对结果的影响较小。因为初始step设置了global composition（[sampler](https://stable-diffusion-art.com/samplers/)在每一步中去除最大量的噪声，并从latent space的随机tensor开始），而global composition已在开始的steps中设置好了。

  > Starting Control Step和Ending Control Step的进一步说明：
  >
  > 二者取值均为小数，控制ControlNet应用的总steps的百分比。类似于[Prompt editing](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Features#prompt-editing)，例如 [myprompt::0.8]（它从开始一直应用到总步骤的80%）。

  

+ Control Mode
  
  ControlNet 对结果的影响方式。
  
  + Balanced
  
  + My prompt is more important
  
  + ControlNet is more important
  
    CFG（Conditional Fine-Grained）比例也充当了ControlNet效果的乘数。
  
+ Resize Mode
  
  control map尺寸适配输出图像尺寸的方式。用于控制：当“作为输入的控制图（control map）”的尺寸与待生成图像的尺寸不同时的处理方式。如果二者具有相同的宽高比，您就不需要考虑这些选项。
  
  + Just Resize
  
    缩放control map的宽度和高度以和待生成图像的尺寸保持一致。这将改变control map的宽高比。如输出图像的大小被设置为512x512，那么control map的大小也是512x512。
  
  + Crop and Resize
  
    裁剪control map，使control map与待生成图像的尺寸相同。裁剪后的control map的图像的中心点（横纵平分线交点）的内容正是预处理后的输入图像的中心点的内容。
  
  + Resize and Fill
  
    缩放control map的宽度和高度并使用空值扩展control map，使control map与待生成图像的尺寸相同。扩展后的control map的图像的中心点（横纵平分线交点）的内容正是预处理后的输入图像的中心点的内容。
  
+ Batch Mode：指定一个输入的文件夹目录，批处理里面的每一张图像。

+ Multi-ControlNet：对于单次生成，允许启用多个controlnet以复合控制输出的图像。

## 功能

介绍ControlNet的功能。有些功能需要预处理器+控制模型配合使用，有些仅需要预处理器。如果有了适合控制模型的已经预处理好的图片，仅需要使用模型而预处理器选择`none`。

预处理器用于生成最终结果或者符合控制模型需要的图像。控制模型根据输入的图像得到最终输出。todo

通用预处理器选项

+ Preprocessor Resolution

  todo

模型命名规则如下：

[![img](images/spec.png)](https://github.com/lllyasviel/ControlNet-v1-1-nightly/blob/main/github_docs/imgs/spec.png)



### canny

[Canny edge detector](https://en.wikipedia.org/wiki/Canny_edge_detector) 是一种通用的经典边缘检测器，它用于提取图像的轮廓线条。而Canny控制模型生成的图像将保持与原始图像相似的轮廓。

*预处理器*

+ canny

*预处理器选项*

todo

+ Canny Low Threshold
+ Canny High Threshold

### depth

*预处理器*

depth预处理器根据参考图像生成猜测的深度图。

- depth_midas：经典的深度估计器。
- depth_zoe：细节级别介于Midas和Leres之间。
- depth_leres：提供更多细节，但也倾向于渲染背景。
- depth_leres++：提供更多细节。

> 深度图是一种与原始图像大小相同的简单灰度图像，用于编码深度信息。完全白色表示物体离观察者最近，而越黑表示物体离观察者越远。深度图以灰度值的形式表示不同深度的距离。

*预处理器选项*

+ Remove Near %

+ Remove Background %

### inpaint

ControlNet inpainting允许您在修复过程中使用较高的去噪强度，以生成较大的变化，同时不会牺牲与整体图像的一致性。

> img2img的inpaint选项在使用高的denoising strength时会生成与图像整体不连贯的图片

*预处理器*

+ inpaint_global_harmonious：配合img2img进行局部重绘，无需再次上传参考图像。denoising strength可以高达1。

*预处理器选项*：无

### ip2p

用自然语言的语句改变输入的图像。与官方的[InstructPix2Pix](https://www.timothybrooks.com/instruct-pix2pix/)不同，这个模型是用50%的指令提示和50%的描述提示进行训练的。例如，"a cute boy"是一个描述提示，而"make the boy cute"是一个指令提示。由于这是一个ControlNet，您不需要费心进行原始IP2P的双重配置调整。而且，这个模型可以应用于任何基础模型。此外，似乎像"make it into X"这样的指令比"make Y into X"效果更好。

*预处理器*：无
*预处理器选项*：无

### lineart

线描（Line Art）渲染的是图像的轮廓线条。它试图将图像转换为简单的绘画风格。线描处理会着重提取图像的边缘和轮廓，以生成类似于手绘的简化线条图，控制模型会根据简化线条图生成对应的图像。模型经过充分的数据增强训练，可以接收手绘的线条图案作为输入。

*预处理器*

+ lineart_anime
+ lineart_anime_denoise
+ lineart_coarse
+ lineart_realistic
+ lineart_standard (from white bg &amp; black line)

*预处理器选项*：无

### lineart_anime

与[lineart](#lineart) 类似。但由于模型不同故分开介绍。

该模型可以接受真实的动漫线条图或提取的线条图作为输入。一些重要的注意事项：

1. 使用的stable diffusion model需要为anime风格。例如"anything-v3-full.safetensors"。 
2. 该模型是使用3x token长度和跳过2的clip训练的。 
3. 这是一个适用于长提示（long prompts）的模型。除非使用LoRAs，否则长提示会得到更好的结果。 

*预处理器*：见[lineart](#lineart) 

*预处理器选项*：无

### mlsd

[M-LSD](https://github.com/navervision/mlsd) (Mobile Line Segment Detection) 是一种直线检测器。它适用于提取具有直边轮廓的图像元素，如室内设计、建筑物、街景、画框和纸张边缘。曲线将被忽略。模型根据预处理的图像生成符合的图片，无线条部分则随机填充图像。

*预处理器*

+ mlsd：生成符合输入图像的直边轮廓

*预处理器选项*

+ MLSD Value Threshold：用于控制MLSD算法对直线检测的敏感度。较高的值会使算法更敏感，而较低的值会使其不那么敏感。
+ MLSD Distance Threshold：用于控制两条直线被视为一条直线所需的最小距离。较高的值将允许更接近的直线，而较低的值则要求直线之间的距离更远。

### normalbae

法线贴图（Normal map）指定了一个表面的方向。对于ControlNet来说，它是一张图像，用于指定每个像素所在表面的方向。与颜色值不同，图像像素表示表面面朝的方向。法线贴图的用法类似于深度图。它们用于传输参考图像的三维构成。本来应该取名normal，但因为其对应的模型模型名称为normalbae，故跟随此名。

*预处理器*

生成Normal map。遵循[ScanNet's](http://www.scan-net.org/) protocol的预处理器生成的图像才可以被控制模型所使用。

+ 
  normal_midas：从[Midas](https://github.com/isl-org/MiDaS)深度图中估计并生成法线贴图。像Midas深度图一样，Midas法线贴图也适用于将主体与背景分离。
+ normal_bae：使用Bae等人提出的[normal uncertainty method](https://github.com/baegwangbin/surface_normal_uncertainty)（法线不确定性方法）估计并生成法线贴图。Bae法线贴图往往会在背景和前景中呈现出细节。

*预处理器选项*：

+ Normal Background Threshold：normal_midas专属，

### openpose

OpenPose可以检测人体关键点，如头部、肩部、手部等的位置。它适用于模仿人体姿势，而不复制其他细节，如服装、发型和背景。所有的OpenPose预处理器需要与ControlNet的模型下拉菜单中的OpenPose模型一起使用。

*预处理器*

- OpenPose: 眼睛、鼻子、眼睛、颈部、肩膀、肘部、腕部、膝盖和踝部。
- OpenPose_face: OpenPose + 面部细节
- OpenPose_hand: OpenPose + 手部和手指
- OpenPose_faceonly: 仅面部细节
- OpenPose_full: 包含以上所有内容

*预处理器选项*：无

### reference

Reference是一组新的预处理器，可让您生成与参考图像类似的图像。这些图像仍然受到Stable Diffusion model(checkpoints)和prompt的影响。

Reference**不使用控制模型**。您只需要选择预处理器，而不选择模型。

*预处理器*：

- reference_adain：通过**Ada**ptive **I**nstance **N**ormalization进行风格转移。([paper](https://arxiv.org/abs/1703.06868))
- reference_only：直接将输入的图像link到attention layers。
- reference_adain+attn：以上两者的组合。

*预处理器选项*：

+ Style Fidelity (only for "Balanced" mode)

### scribble

将参考图转化为手绘的简陋线条，再按照线条输出符合手绘线条的图片。

*预处理器*

涂鸦（Scribble）预处理器可以将一张图片转换为手绘的涂鸦风格。

- scribble_hed：[Holistically-Nested Edge Detection](https://arxiv.org/abs/1504.06375) (HED)是一种边缘检测器，能够产生类似于实际人工绘制的粗糙的涂鸦线。根据ControlNet的作者所说，HED适用于对图像进行重新上色和重新风格化。
- scribble_pidinet：[Pixel Difference network](https://github.com/zhuoinoulu/pidinet) (Pidinet）可以检测曲线和直线边缘。它的结果与HED类似，但通常会产生更干净、细节更少的线条。它非常适合复制没有细节的电路板轮廓。
- scribble_xdog：[E**X**tended **D**ifference **o**f **G**aussian](https://users.cs.northwestern.edu/~sco590/winnemoeller-cag2012.pdf) (XDoG)是一种边缘检测方法。通过调整**XDoG threshold**，灵活调整线条风格和细节。

*预处理器选项*

+ XDoG Threshold

  针对预处理器scribble_xdog的选项。通过调整阈值，您可以控制生成的线条是更精细还是更粗糙，从而实现对涂鸦风格的细节程度的控制。这使得xDoG成为在绘画过程中灵活调整线条风格和细节的有用工具。

*预处理器*
*预处理器选项*

### seg

将图片按物品种类分割为色块，并根据分割图像的信息输出符合的图片。

*预处理器*

分割（Segmentation）预处理器对图像中的对象按色块进行标记，以指示它们属于哪种类型。您可以在[此处](https://docs.google.com/spreadsheets/d/1se8YEtb2detS7OuPE86fXGyD269pMycAWe2mtKUj2W8/edit#gid=0)找到ufade20k和ofade20k的颜色映射中的物体类别和颜色信息。请注意，ADE20K和COCO分割的颜色映射是不同的。

+ ufade20k：基于ADE20K数据集训练的UniFormer (uf)分割模型。 
+ ofade20k：基于ADE20K数据集训练的OneFormer (of)分割模型。 
+ ofcoco：基于COCO数据集训练的OnFormer分割模型。

*预处理器选项*

### shuffle

一般用于转移参考图像的颜色方案。

*预处理器*

+ shuffle：输出一个搅乱的输入图像。与其他预处理器不同，Shuffle预处理器是随机的，并受到种子值的影响。


*预处理器选项*：无

### softedge

*预处理器*
*预处理器选项*

### tile

ControlNet Tile是用于重建图像细节的ControlNet模型。

1. 模型会忽略输入图像中的具体细节，并生成全新的细节内容。
2. 如果局部区域的语义和全局prompts不匹配，则忽略全局prompts并以局部上下文填充局部细节。

这种行为使其非常适合在tiles中进行图像放大，因此可以在低VRAM设置下使用。

*预处理器*

+ tile_resample

*预处理器选项*

+ Down Sampling Rate

  控制对ControlNet Tile进行的降采样程度。增加此值会使控制图像更模糊。控制图像越模糊，ControlNet Tile模型在补充细节方面的自由度就越大。













softedge_hed
softedge_hedsafe
softedge_pidinet
softedge_pidisafe
t2ia_color_grid
t2ia_sketch_pidi
t2ia_style_clipvision



## 孤儿

以下预处理器没有适配的专属controlnet model:

+ mediapipe_face
  + 选项：Max Faces
  + 选项：Min Face Confidence
+ invert (from white bg &amp; black line)
+ threshold
  + 选项：Binarization Threshold

## Extra

Controlnet official release：https://github.com/lllyasviel/ControlNet-v1-1-nightly

Controlnet Extension for webUI：https://github.com/Mikubill/sd-webui-controlnet

The ControlNet Guide(blog)：https://stable-diffusion-art.com/controlnet/

