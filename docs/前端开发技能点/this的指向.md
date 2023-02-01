# JavaScript 的 this 指向问题

> 在网上，关于JavaScript 中 `this` 的指向问题的解析有很多，然鹅由于诸如“作者语文不好”、“作者英语不好” 、“作者技术不好”的问题，我学习时吐血好多次。于是自己专门查阅各方资料整理出此文。本文首发于公众号Huainian_1994，禁止盈利用途的转载，其余目的的转载注明出处即可。

### 0、先说结论

0.1、在 全局作用域中的this总是指向全局对象。

例：

```js
const myThis=this;
console.log(myThis);//打印出的是全局对象

const obj={
    that:this
}
console.log(obj.that);//打印出的是全局对象
```



0.2、而对于“一个函数执行后，其作用域所含有的this的指向谁“的问题，我们依下列两类情况来确定该问题的解：

* **第一类**：函数**不是箭头函数**，那么该函数作用域内的this的指向根据该函数的**调用方式**确定：

  1、普通调用：

  ​	1.1）函数的直接调用——指向全局对象

  ​	1.2）函数作为方法由对象调用——指向这个方法所属的对象

  2、特殊调用：

  ​	2.1）通过 `bind()` 将函数绑定到对象之后再进行调用——绑定了谁就指向谁

  ​	2.2）通过 `call()`和`apply()` 进行调用——指定了谁就指向谁

  ​	2.3）通过操作符 `new` 调用——指向构造函数创建的实例

* **第二类**：函数**是箭头函数**，那么this的指向根据该函数的**定义形式**确定：

  1、箭头函数内部this的指向由其定义的形式决定

  ​	1.1）箭头函数没有定义在一个函数的参数列表中——箭头函数中的this 与 “包含这个箭头函数的作用域”中的this一致。

  ​	1.2）箭头函数被定义在了一个函数的参数列表中作参数——箭头函数中的this 与  “$用该箭头函数作参数的函数$所在的作用域” 中的this一致。



  下面列出了ECMAScript中确定this的值的流程[（点此查看大图）](this.png)：



  <img src="this.png" alt="this"  />



## 分情况展开说明：

### 1、普通调用

#### 1.1）函数的直接调用

调用格式： `函数名(...)` 

该函数的作用域中this的指向：全局对象，在浏览器中全局对象是 `window`，在 NodeJs 中全局对象是 `global`。

1.1.1例：函数的直接调用

```js
//声明函数xixi
function xixi(){
    console.log(this);
}
//调用函数xixi
xixi();//打印出全局对象
```



说明：

* 只要符合调用格式，“该函数的作用域”中的this就指向全局对象。

* 之所以强调“该函数的作用域”，是因为有这样的情形——函数内部含有子作用域。**子作用域的所有内容不能算作该函数的作用域**，子作用域作为整体存在于该函数的作用域中，若将“该函数的作用域”表述为“该函数的this”则不准确。那么对于子作用域中this的指向，其又回归为大问题——确定this的指向的依据是什么。具体情况具体分析即可。



1.1.2例：作用域的区分

```js
//声明函数father1
function father1(){
    function son1(){
        console.log(this);
    }
    son1();
}
father1();//打印的this指向全局对象
//分析：son1()被直接调用，那么this就指向全局对象 



//声明函数father2
function father2(){
    var son2={
        speak:function(){
        	console.log(this);
        }
    }
    son2.speak();
}
father2();//打印的this指向son2
//分析：speak()以方法的形式由对象son2调用，那么this就指向son2 
```



#### 1.2）函数作为方法由对象调用

通过对象来调用其方法，它是 `对象.方法(...)` 这样的调用形式。这种情况下，函数中的 `this` 指向调用该方法的对象。但是，同样需要注意 `bind()` 的影响。

```js
const obj = {
    // 第一种方式，定义对象的时候定义其方法
    test() {
        console.log(this === obj);
    }
};

// 第二种方式，对象定义好之后为其附加一个方法(函数表达式)
obj.test2 = function() {
    console.log(this === obj);
};

// 第三种方式和第二种方式原理相同
// 是对象定义好之后为其附加一个方法(函数定义)
function t() {
    console.log(this === obj);
}
obj.test3 = t;

// 这也是为对象附加一个方法函数
// 但是这个函数绑定了一个不是 obj 的其它对象
obj.test4 = (function() {
    console.log(this === obj);
}).bind({});

obj.test();     // true
obj.test2();    // true
obj.test3();    // true

// 受 bind() 影响，test4 中的 this 指向不是 obj
obj.test4();    // false
```

这里需要注意的是，后三种方式都是预定定义函数，再将其附加给 `obj` 对象作为其方法。再次强调，函数内部的 `this` 指向与定义无关，受调用方式的影响。

### 普通调用时,方法中 this 指向全局对象的情况

注意这里说的是**方法**中而不是**方法调用**中。方法中的 `this` 指向全局对象，如果不是因为 `bind()`影响，那就一定是因为用了非 `对象.方法(...)` 的调用方式，比如

```js
const obj = {
    test() {
        console.log(this === obj);
    }
};

const t = obj.test;
t();    // false
```

`t` 就是 `obj` 的 `test` 方法，但是 `t()` 调用时，其中的 `this` 指向了全局。

之所以要特别提出这种情况，主要是因为常常将一个对象方法作为回调传递给某个函数之后，却发现运行结果与预期不符——因为忽略了调用方式对 `this` 的影响。比如下面的例子是在页面中对某些事情进行封装之后特别容易遇到的问题：

```js
class Handlers {
    // 这里 $button 假设是一个指向某个按钮的 jQuery 对象
    constructor(data, $button) {
        this.data = data;
        $button.on("click", this.onButtonClick);
    }

    onButtonClick(e) {
        console.log(this.data);
    }
}

const handlers = new Handlers("string data", $("#someButton"));
// 对 #someButton 进行点击操作之后
// 输出 undefined
// 但预期是输出 string data
```

`this.onButtonClick` 作为一个参数传入 `on()` 之后，事件触发时，理论上是对这个函数进行的直接调用，而不是方法调用，所以其中的 `this` 会指向全局对象 —— 但实际上由于调用事件处理函数的时候，`this` 指向会绑定到触发事件的 DOM 元素上，所以这里的 `this` 是指向触发事件的的 DOM 元素(注意：`this` 并非 jQuery 对象)，即 `$button.get(0)`(注意代码前注释中的假设)。

要解决这个问题有很多种方法：

```js
// 这是在 es5 中的解决办法之一
var _this = this;
$button.on("click", function() {
    _this.onButtonClick();
});

// 也可以通过 bind() 来解决
$button.on("click", this.onButtonClick.bind(this));

// es6 中可以通过箭头函数来处理，在 jQuery 中慎用
$button.on("click", e => this.onButtonClick(e));
```

不过请注意，将箭头函数用作 jQuery 的回调时造成要小心函数内对 `this` 的使用。jQuery 大多数回调函数(非箭头函数)中的 `this` 都是表示调用目标，所以可以写 `$(this).text()` 这样的语句，但 jQuery 无法改变箭头函数的 `this` 指向，同样的语句语义完全不同。



### bind() 对直接调用的影响

还有一点需要注意的是 `bind()` 的影响。`Function.prototype.bind()` 的作用是将当前函数与指定的对象绑定，并返回一个新函数，这个新函数无论以什么样的方式调用，其 `this` 始终指向绑定的对象。还是来看例子：

```js
const obj = {};

function test() {
    console.log(this === obj);
}

const testObj = test.bind(obj);
test();     // false
testObj();  // true
```

那么 `bind()` 干了啥？不妨模拟一个 `bind()` 来了解它是如何做到对 `this` 产生影响的。

```js
const obj = {};

function test() {
    console.log(this === obj);
}

// 自定义的函数，模拟 bind() 对 this 的影响
function myBind(func, target) {
    return function() {
        return func.apply(target, arguments);
    };
}

const testObj = myBind(test, obj);
test();     // false
testObj();  // true
```

从上面的示例可以看到，首先，通过闭包，保持了 `target`，即绑定的对象；然后在调用函数的时候，对原函数使用了 `apply` 方法来指定函数的 `this`。当然原生的 `bind()` 实现可能会不同，而且更高效。但这个示例说明了 `bind()` 的可行性。

### call 和 apply 对 this 的影响

上面的示例中用到了 [Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)，与之类似的还有 [Function.prototype.call()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)。这两方法的用法请大家自己通过链接去看文档。不过，它们的第一个参数都是指定函数运行时其中的 `this` 指向。

不过使用 `apply` 和 `call` 的时候仍然需要注意，如果目录函数本身是一个绑定了 `this` 对象的函数，那 `apply` 和 `call`不会像预期那样执行，比如

```js
const obj = {};

function test() {
    console.log(this === obj);
}

// 绑定到一个新对象，而不是 obj
const testObj = test.bind({});
test.apply(obj);    // true

// 期望 this 是 obj，即输出 true
// 但是因为 testObj 绑定了不是 obj 的对象，所以会输出 false
testObj.apply(obj); // false
```

由此可见，`bind()` 对函数的影响是深远的，慎用！



## new 调用

在 es6 之前，每一个函数都可以当作是构造函数，通过 `new` 调用来产生新的对象(函数内无特定返回值的情况下)。而 es6 改变了这种状态，虽然 `class` 定义的类用 `typeof` 运算符得到的仍然是 `"function"`，但它不能像普通函数一样直接调用；同时，`class` 中定义的方法函数，也不能当作构造函数用 `new` 来调用。

而在 es5 中，用 `new` 调用一个构造函数，会创建一个新对象，而其中的 `this` 就指向这个新对象。这没有什么悬念，因为 `new` 本身就是设计来创建新对象的。

```js
var data = "Hi";    // 全局变量

function AClass(data) {
    this.data = data;
}

var a = new AClass("Hello World");
console.log(a.data);    // Hello World
console.log(data);      // Hi

var b = new AClass("Hello World");
console.log(a === b);   // false
```

## 箭头函数中的 this

先来看看 [MDN 上对箭头函数的说明](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

> An arrow function expression has a shorter syntax than a function expression and does **not** bind its own `this`, `arguments`, `super`, or `new.target`. Arrow functions are always anonymous. These function expressions are best suited for non-method functions, and they cannot be used as constructors.

这里已经清楚了说明了，箭头函数没有自己的 `this` 绑定。箭头函数中使用的 `this`，其实是直接包含它的那个函数或函数表达式中的 `this`。比如

```js
const obj = {
    test() {
        const arrow = () => {
            // 这里的 this 是 test() 中的 this，
            // 由 test() 的调用方式决定
            console.log(this === obj);
        };
        arrow();
    },

    getArrow() {
        return () => {
            // 这里的 this 是 getArrow() 中的 this，
            // 由 getArrow() 的调用方式决定
            console.log(this === obj);
        };
    }
};

obj.test();     // true

const arrow = obj.getArrow();
arrow();        // true
```

示例中的两个 `this` 都是由箭头函数的直接外层函数(方法)决定的，而方法函数中的 `this` 是由其调用方式决定的。上例的调用方式都是方法调用，所以 `this` 都指向方法调用的对象，即 `obj`。

箭头函数让大家在使用闭包的时候不需要太纠结 `this`，不需要通过像 `_this` 这样的局部变量来临时引用 `this` 给闭包函数使用。来看一段 Babel 对箭头函数的转译可能能加深理解：

```js
// ES6
const obj = {
    getArrow() {
        return () => {
            console.log(this === obj);
        };
    }
}    
// ES5，由 Babel 转译
var obj = {
    getArrow: function getArrow() {
        var _this = this;
        return function () {
            console.log(_this === obj);
        };
    }
};
```

另外需要注意的是，箭头函数不能用 `new` 调用，不能 `bind()` 到某个对象(虽然 `bind()` 方法调用没问题，但是不会产生预期效果)。不管在什么情况下使用箭头函数，它本身是没有绑定 `this` 的，它用的是直接外层函数(即包含它的最近的一层函数或函数表达式)绑定的 `this`。

