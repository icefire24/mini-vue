# vue设计与实现

## 第 2 章 框架设计的核心要素

### 2.1 提升用户的开发体验

1、在框架设计和开发过程中，提供友好的警告信息至关重要。如果这一点做得不好，那么很可能会经常收到用户的抱怨。始终提供友好的警告信息不仅能够帮助用户快速定位问题，节省用户的时间，还能够让框架收获良好的口碑，让用户认可框架的专业性。

2、浏览器

允许我们编写自定义的 formatter，从而自定义输出形式。在Vue.js3 的源码中，你可以搜索到名为 initCustomFormatter 的函数，该函数就是用来在开发环境下初始化自定义 formatter 的。以 Chrome例，我们可以打开 DevTools 的设置，然后选“Console”→“Enablecustom formatters”选项

### 2.3 Tree-Shaking

想要实现 Tree-Shaking，必须满足一个条件，即模块必须是

ESM（ES Module），因为 Tree-Shaking 依赖 ESM 的静态结构。

副作用。如果一个函数调用会产生副作用，那么就不能将其移除。

```javascript
import {foo} from './utils'
/*#__PURE__*/ foo()
```

注意注释代码 /*#__PURE__*/，其作用就是告诉 rollup.js，对于foo 函数的调用不会产生副作用

### 2.4 框架应该输出怎样的构建产物

1. IIFE

2. esm:vue.runtime.esm-bundler.js 文件 ESM 资源是给 rollup.js 或 webpack 等打包工具使用的，而带有 -browser 字

   样的 ESM 资源是直接给 <script type="module"> 使用的。它们之间有何区别？这就不得不提到上文中的 __DEV__ 常量。当构建用于

   <script> 标签的 ESM 资源时，如果是用于开发环境，那么

   ```javascript
   //
   if (__DEV__) {
   warn(`useCssModule() is not supported in the global build.`)
   }
   //
   if ((process.env.NODE_ENV !== 'production')) {
   warn(`useCssModule() is not supported in the global build.`)
   }
   ```

   __DEV__ 会设置为 true；如果是用于生产环境，那么 __DEV__ 常量

   会设置为 false，从而被 Tree-Shaking 移除。但是当我们构建提供给打包工具的 ESM 格式的资源时，不能直接把 __DEV__ 设置为 true或 false，而要使用 (process.env.NODE_ENV !==

   'production') 替换 __DEV__ 常量。

3. cjs  

### 2.5 特性开关

```javascript
01 // webpack.DefinePlugin 插件配置
02 new webpack.DefinePlugin({
03 __VUE_OPTIONS_API__: JSON.stringify(true) // 开启特性
04 })
```

为了兼容 Vue.js 2，在 Vue.js 3 中仍然可以使用选项 API 的方

式编写代码。但是如果明确知道自己不会使用选项 API，用户就可以使

用 __VUE_OPTIONS_API__ 开关来关闭该特性，这样在打包的时候

Vue.js 的这部分代码就不会包含在最终的资源中，从而减小资源体积。

### 2.6 错误处理

```javascript
01 // utils.js
02 let handleError = null
03 export default {
04 foo(fn) {
05 callWithErrorHandling(fn)
06 },
07 // 用户可以调用该函数注册统一的错误处理函数
08 registerErrorHandler(fn) {
09 handleError = fn
10 }
11 }
12 function callWithErrorHandling(fn) {
13 try {
14 fn && fn()
15 } catch (e) {
16 // 将捕获到的错误传递给用户的错误处理程序
17 handleError(e)
18 }
19 }

//vue注册统一的错误处理函数
01 import App from 'App.vue'
02 const app = createApp(App)
03 app.config.errorHandler = () => {
04 // 错误处理程序
05 }

```

## 第 3 章 Vue.js 3 的设计思路

### 3.2 初识渲染器

渲染函数：一个组件要渲染的内容是通过渲染函数来描述的，也就是上面代码中的 render 函数，

```javascript
 export default {
 render() {
 return {
 tag: 'h1',
 props: { onClick: handler }
 }
 }
 }
```

渲染器：渲染器的作用就是把虚拟 DOM 渲染为真实 DOM

```javascript
01 const vnode = {
02 tag: 'div',
03 props: {
04 onClick: () => alert('hello')
05 },
06 children: 'click me'
07 }

01 function renderer(vnode, container) {
02 // 使用 vnode.tag 作为标签名称创建 DOM 元素
03 const el = document.createElement(vnode.tag)
04 // 遍历 vnode.props，将属性、事件添加到 DOM 元素
05 for (const key in vnode.props) {
06 if (/^on/.test(key)) {
07 // 如果 key 以 on 开头，说明它是事件
08 el.addEventListener(
09 key.substr(2).toLowerCase(), // 事件名称 onClick --->click
10 vnode.props[key] // 事件处理函数
11 )
12 }
13 }
14
15 // 处理 children
16 if (typeof vnode.children === 'string') {
17 // 如果 children 是字符串，说明它是元素的文本子节点
18 el.appendChild(document.createTextNode(vnode.children))
19 } else if (Array.isArray(vnode.children)) {
20 // 递归地调用 renderer 函数渲染子节点，使用当前元素 el 作为挂载点
21 vnode.children.forEach(child => renderer(child, el))
22 }
23
24 // 将元素添加到挂载点下
25 container.appendChild(el)
26 }
```

## 响应式

### WeakMap、Map 和 Set 之间的关系

为了方便描述，我们把图 4-3 中的 Set 数据结构所存储的副作用函数集合称为 key 的依赖集合。搞清了它们之间的关系，我们有必要解释一下这里为什么要使用WeakMap，这其实涉及 WeakMap 和 Map 的区别，我们用一段代码来讲解：

```javascript
01 const map = new Map();

02 const weakmap = new WeakMap();

03

04 (function(){

05 const foo = {foo: 1};

06 const bar = {bar: 2};

07

08 map.set(foo, 1);

09 weakmap.set(bar, 2);

10 })()
```

首先，我们定义了 map 和 weakmap 常量，分别对应 Map 和WeakMap 的实例。接着定义了一个立即执行的函数表达式（IIFE），在函数表达式内部定义了两个对象：foo 和 bar，这两个对象分别作为 map 和 weakmap 的 key。当该函数表达式执行完毕后，对于对象foo 来说，它仍然作为 map 的 key 被引用着，因此垃圾回收器（grabage collector）不会把它从内存中移除，我们仍然可以通map.keys 打印出对象 foo。然而对于对象 bar 来说，由于 WeakMap的 key 是弱引用，它不影响垃圾回收器的工作，所以一旦表达式执行完毕，垃圾回收器就会把对象 bar 从内存中移除，并且我们无法获取weakmap 的 key 值，也就无法通过 weakmap 取得对象 bar。简单地说，WeakMap 对 key 是弱引用，不影响垃圾回收器的工作。据这个特性可知，一旦 key 被垃圾回收器回收，那么对应的键和值就访问不到了。所以 WeakMap 经常用于存储那些只有当 key 所引用的对象存在时（没有被回收）才有价值的信息，例如上面的场景中，如果 target 对象没有任何引用了，说明用户侧不再需要它了，这时垃圾回收器会完成回收任务。但如果使用 Map 来代替 WeakMap，那么即使用户侧的代码对 target 没有任何引用，这个 target 也不会被回收，最终可能导致内存溢出。

hello