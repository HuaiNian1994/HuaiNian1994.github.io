## WorkerOrGlobalScope.fetch()

```
Promise<Response> fetch(input[, init]);
```

~~~js
fetch(URL,{
    method：//请求使用的方法，如 GET、POST
    headers:{
    	//HTTP报文首部及其值
	},
    body://HTTP报文实体主体
    mode: //请求的模式，如 `cors、` `no-cors 或者` `same-origin。
    credentials://请求证书，为了在当前域名内自动发送cookie，必须提供这个选项
    cache:  //请求报文的 cache 选项
	redirect: //可用的 redirect 模式
    referrer: //URL。默认是 `client。`
    referrerPolicy: //指定了HTTP头部referer字段的值。可能为以下值之一： `no-referrer、` `no-referrer-when-downgrade、` `origin、` `origin-when-cross-origin、` `unsafe-url 。`
    integrity: //请求文件的哈希值与该哈希算法名的组合
})
~~~



## XMLHttpRequest

~~~js
//1、创建XHR对象（必须）
var myRequest = new XMLHttpRequest();
//2、初始化请求（必须）
myRequest.open(请求方法, url[,是否异步, 用户名, 密码]);
//3、设定请求头（可选）
myRequest.setRequestHeader(首部1,值1)
myRequest.setRequestHeader(首部2,值2)//.....
//3、设定返回数据类型（可选），默认为blob
myRequest.responseType="arraybuffer";
//5、发送请求
myRequest.send(请求主体)
//6、操作数据
myRequest.onreadystatechange=function (){
    if(myRequest.status==200 && myRequest.readyState==4){
        //操作载有返回数据的myRequest.responseText 或者 myRequest.responseXML（客户端根据响应报文的MIME类型，将实体主体转化为responseText 或者responseXML中的一种）
    }
}
~~~

一般不需要通过主动设置Content-Type首部，浏览器会自动设定其MIME类型

### XMLHttpRequest.responseType

| responseType取值 | 结果                                                         | 名词释义                                                     |
| ---------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| "text" 或者 ""   | XMLHttpRequest.response是 [`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString) 对象中的文本。 | 指的是UTF-16字符串，而JavaScript正是使用了这种编码的字符串，因此，在Ajax中，DOMString就等同于JS中的普通字符串。 |
|                  | [Document](https://developer.mozilla.org/zh-CN/docs/Web/API/Document) | 类XML文档的数据                                              |
|                  |                                                              |                                                              |

 `DOMString`、`Document`、`FormData`、`Blob`、`File`、`ArrayBuffer` 、`URLSearchParams`

+ (responseType="text"或responseType="")

   `DOMString`

+ 

  

+ [URLSearchParams](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)

   `URLSearchParams`接口定义了一些实用的方法来处理 URL 的查询字符串。 

+ [FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)

  ​	专门表示表单数据键值对的对象，如果表单含有上传文件，文件也会被编码包含进去。在提交<code><Form></code>>元素包含的表单内容时提交的正是FormData。一般，HTML元素的name属性值为键，value属性值为值。

  + 浏览器识别MIME类型： multipart/form-data 

+ [Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)

  封装了一个二进制文件的原始数据的对象。`xhr.responseType = "blob"`即可请求blob类型的数据

  + 浏览器识别MIME类型： 需自行设定

+ [File](https://developer.mozilla.org/zh-CN/docs/Web/API/File)

   `File` 对象是来自用户在一个  `<input>` 元素上选择文件后返回的 [`FileList`](https://developer.mozilla.org/zh-CN/docs/Web/API/FileList) 对象,也可以是来自由拖放操作生成的 [`DataTransfer`](https://developer.mozilla.org/zh-CN/docs/Web/API/DataTransfer) 对象，或者来自 [`HTMLCanvasElement`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement) 上的 `mozGetAsFile`() API ，它继承自`Blob`

+ [ArrayBuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) 

  表示了储存有二进制数据的一段内存。不能直接读/写，只能通过TypedArray和DataView来访问（二者的作用均为以指定的格式读取二进制数据）。
  
  **XMLHttpRequest.readyState** 属性返回一个 XMLHttpRequest 代理当前所处的状态。一个 XHR 代理总是处于下列状态中的一个：
  
  | 值   | 状态               | 描述                                                |
  | ---- | ------------------ | --------------------------------------------------- |
  | `0`  | `UNSENT`           | 代理被创建，但尚未调用 open() 方法。                |
  | `1`  | `OPENED`           | `open()` 方法已经被调用。                           |
  | `2`  | `HEADERS_RECEIVED` | `send()` 方法已经被调用，并且头部和状态已经可获得。 |
  | `3`  | `LOADING`          | 下载中； `responseText` 属性已经包含部分数据。      |
  | `4`  | `DONE`             | 下载操作已完成。                                    |