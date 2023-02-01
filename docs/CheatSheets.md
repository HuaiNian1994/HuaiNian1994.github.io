## CLI

1. 查看全局安装的包列表: npm list -g --dept 0
2. 查看全部npm默认设置：npm config ls -l
3. 查看非全局的模块版本：npx webpack -v
4. 清除缓存：npm cache clean
5. 快速代理一个目录： http-server ./ -p 5278
6. 全局安装：npm i *** -g
7. 临时设置代理 set http_proxy=socks5://127.0.0.1:7890
8. netsh winhttp set proxy proxy-server="socks=127.0.0.1:7890"
9. 如果有用户名和密码 set http_proxy_user=jake set http_proxy_pass=abcd
10. 取消代理设置 set http_proxy= set https_proxy=
11. 把webform branch项目打包（npm run lib:pro)）然后yarn link "vue_ts"

## Git

1. 生成仓库

   将当前所在目录作为仓库的根目录，当前目录名作为仓库名

   ~~~git
   git init
   ~~~

   

2. 用户信息配置

   配置的是你个人的用户名称和电子邮件地址。这两条配置很重要，每次 Git 提交时都会引用这两条信息，说明是谁提交了更新，所以会随更新内容一起被永久纳入历史记录：

   ```git
   $ git config --global user.name "你的名字"
   $ git config --global user.email 你的邮箱
   ```

   用了 --global 选项，更改的配置文件就是位于你用户主目录下的那个`.gitconfig`文件，以后你所有的仓库都会默认使用这里配置的用户信息。如果要在某个特定的仓库中使用其他名字或者电邮，只要去掉 --global 选项重新配置即可，新的设定保存在当前仓库的 .git/config 文件里。

   >   在 Windows 系统上，主目录即 $HOME 变量指定的目录，一般都是 `C:\Documents and Settings\$USER`

3. 的

4. 

## VSCode

1. Alt + Enter 同时选中所有匹配的词
2. [\u4e00-\u9fa5] 匹配中文
3. 平移代码：选中后，按TAB右移，按SHIFT+TAB左移

## 正则表达式

- prop="\w*"

- label="[\u4e00-\u9fa5A-Za-z. ]*"\s*  prop="[\u4e00-\u9fa5A-Za-z. ]*"

- v-model="\w*\.\w*"

## CSS

+ flex

  + 父元素内设置

    display:flex;
    flex-flow:`flex-direction` `flex-wrap`;

    > flex-direction:(row、row-reverse、column、column-reverse)
    > flex-wrap:(nowrap、wrap、wrap-reverse)

    justify-content:主轴方向上如何排列以处理空白部分(flex-start,flex-end,center,space-between,space-around);
    align-items:交叉轴方向上如何排列以处理空白部分（strech,flex-start,flex-end,center,baseline）;
    align-content:定义两个轴线方向的综合对齐方式。见https://developer.mozilla.org/zh-CN/docs/Web/CSS/align-content;

    

  + 子元素内设置

    flex:`flex-grow` `flex-shrink` `flex-basis`;

    >flex-grow:放大比例，默认为1，0表示不放大
    >flex-shrink:缩小比例，默认为1，当空白不够又不换行时缩小。0表示不缩小
    >flex-basis:声明自身的长度，带单位。默认为0，表示自适应

    align-self:重写父元素的align-items属性应用于本元素上的效果，取值与align-items一致
    order：数字，定义排列顺序，越小越靠前

    

+ grid

  + 容器属性
    display:grid;
    grid-template-cloumns:1fr 20px;
    grid-template-rows:repeat(8,minmax(200px,1fr));
    grid-auto-rows：20px;
    grid-auto-columns:minmax(100px;auto);
    grid-column-gap:10px;
    grid-row-gap:1em;

    + 为自己的网格区域命名
      ```css
      grid-template-areas: 
                "b b a"
                "b b c"
                "b b c";
      ```

      

  + 子元素属性
    
    + 数值表示网格线编号
      grid-column-start:1;
      grid-column-end:6;
      grid-row-start:2;
      grid-row-start:9;
    + 表示自己所占用的父级盒子的网格矩形区域
      grid-area:"在父级盒子CSS属性grid-template-areas定义的区域名"



## Html

- meta

  name属性与itemprop属性、 http-equiv属性 或charset 属性不共存
  content属性总是与name属性或http-equiv属性互动

  + 编码
      ```html
      <meta charset="UTF-8">
      ```

  + 设定layout viewport
    (快捷键：meta:vp+Tab，让layout viewport==visual viewport，且用户不可缩放)
      ```html
      <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      ```

  + 重定向
      ```html
      <meta http-equiv="refresh"  content="2;www.baidu.com">
      ```

  + SEO
      ```html
      <meta name="description" content="本站点的基本信息">
      <meta name="keywords" content="本站点的关键字">
      ```

 ## 项目重构的环境问题

+ 全局工具

  你的全局工具都安装了哪些？把全局目录下所有的工具都列出并指出他们的版本号。

+ NodeJs版本

+ 网络环境

  你安装依赖的时候用了梯子吗？什么梯子？

+ 版本源

  你用的安装包都来自淘宝镜像源吗？ 