### 生命周期

+ 挂载
  + constructor()
  + render()
  + componentDidMount()
    + 触发：插入DOM树时
+ 更新
  + render()
  + componentDidUpdate()
    + 触发：DOM更新后
+ 移除
  + componentWillUnmount()
    + 触发：从DOM中移除

### 重要 API 

###  SetState 原理

### 虚拟 DOM

人们自然而然想到的做法，总结成一个套路然后给了一个名字。

用 JavaScript 对象表示 DOM 信息和结构，当状态变更的时候，重新计算这个 JavaScript 对象的最终属性，用新渲染的对象树去和旧的树进行对比，记录这两棵树差异。记录下来的不同就是我们需要对页面真正的 DOM 操作，然后把它们应用在真正的 DOM 树上，页面就变更了。这样就可以做到：视图的结构确实是整个全新渲染了，但是最后操作DOM的时候确实只变更有不同的地方。

JavaScript 对象怎么表示 DOM 信息和结构：记录其节点类型、父节点、子节点、属性

这就是所谓的 Virtual DOM 算法。包括几个步骤：

1. 用 JavaScript 对象结构表示 DOM 树的结构；然后用这个树构建一个真正的 DOM 树，插到文档当中
2. 当状态变更的时候，重新构造一棵新的对象树。然后用新的树和旧的树进行比较，记录两棵树差异
3. 把2所记录的差异应用到步骤1所构建的真正的DOM树上，视图就更新了

Virtual DOM 本质上就是在 JS 和 DOM 之间做了一个缓存。

### DOM diff 算法

+ 怎么遍历DOM树

   新旧两棵树进行一个深度优先的遍历

+ 对于每一个节点，依据什么标准对比节点的信息

+ 拿出节点的更新方案

  如何以最少地操作步骤（插入、删除节点）达到新旧DOM树一致的目标？

  假设现在可以英文字母唯一地标识每一个子节点：

  旧的节点顺序：

  ```
  a b c d e f g h i
  ```

  现在对节点进行了删除、插入、移动的操作。新增`j`节点，删除`e`节点，移动`h`节点：

  新的节点顺序：

  ```
  a b c h d f g i j
  ```

  现在知道了新旧的顺序，求最少的插入、删除操作（移动可以看成是删除和插入操作的结合）。这个问题抽象出来其实是字符串的最小编辑距离问题（[Edition Distance](https://en.wikipedia.org/wiki/Edit_distance)），最常见的解决算法是 [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance)，通过动态规划求解，时间复杂度为 O(M * N)。但是我们并不需要真的达到最小的操作，我们只需要优化一些比较常见的移动情况，牺牲一定DOM操作，让算法时间复杂度达到线性的（O(max(M, N))。具体算法细节比较多，这里不累述，有兴趣可以参考[代码](https://github.com/livoras/list-diff/blob/master/lib/diff.js)。

  我们能够获取到某个父节点的子节点的操作，就可以记录下来：

  ```
  patches[0] = [{
    type: REORDER,
    moves: [{remove or insert}, {remove or insert}, ...]
  }]
  ```

  但是要注意的是，因为`tagName`是可重复的，不能用这个来进行对比。所以需要给子节点加上唯一标识`key`，列表对比的时候，使用`key`进行对比，这样才能复用老的 DOM 树上的节点。

  这样，我们就可以通过深度优先遍历两棵树，每层的节点进行对比，记录下每个节点的差异了。完整 diff 算法代码可见 [diff.js](https://github.com/livoras/simple-virtual-dom/blob/master/lib/diff.js)。