# q-select

一个高性能的移动端下拉选择插件 同时支持 js 和 vue

[Vue文档](##Vue)

## JavaScript

### 在线体验

[demo 在线体验](https://qymh.github.io/q-select/gitpage/js/index.html)

### 下载

- npm

```shell
npm install @qymh/q-select
```

- cnpm

```shell
cnpm install @qymh/q-select
```

- yarn

```shell
yarn add @qymh/q-select
```

下载完后引用

- es6

```javascript
import QSelect from '@qymh/q-select';
import '@qymh/q-select/dist/q-select.css';

new Qselect({});
```

- commonjs

```javascript
const QSelect = require('@qymh/q-select/dist/q-select.common.js');
require('@qymh/q-select/dist/q-select.css');

new Qselect({});
```

- cdn

如果没有引入模块化的打包工具比如`webpack` `rollup`等,可以去拷贝[仓库](https://github.com/Qymh/q-select/blob/master/packages/%40qymh/q-select/dist/q-select.min.js)中的 js 到自己的项目或者 cdn,也可以直接通过 unpkg 提供的 cdn 进行访问

如下是 unpkg 的 cdn

```javascript
<script src="https://unpkg.com/@qymh/q-select/dist/q-select.min.js"></script>
```

同时也需要引入 css

```javascript
<link rel="stylesheet" href="https://unpkg.com/@qymh/q-select/dist/q-select.css">
```

### 沙盒演示

沙盒演示可以配合 options 一起查看 食用更佳

> 沙盒演示中无法触发`touchmove`事件,点击沙盒右侧网址的右边的`新窗口打开`,在新窗口中查看演示,在当前页面查看代码

- 一层非联动 [沙盒演示](https://codesandbox.io/s/yicengfeiliandong-7x0zy?fontsize=14)

- 非联动内联展示异步设置值 [沙盒演示](https://codesandbox.io/s/feiliandongneilianzhanshiyibushezhizhi-4wtvb?fontsize=14)

- 多层非联动实测 [沙盒演示](https://codesandbox.io/s/duocengfeiliandongshice-8hf8n?fontsize=14)

- 简单联动 [沙盒演示](https://codesandbox.io/s/jiandanliandong-bhyxr?fontsize=14)

- 省市区联动实测 [沙盒演示](https://codesandbox.io/s/shengshiquliandongshice-ubxqx?fontsize=14)

- 省市区非联动异步实测

占位

### options

#### data

- 解释: 展示的下拉数据值

- 联动

  联动下是一个数组对象结构,对象一共有三个值

  - value(必填) 展示的值
  - key 标志
  - children 子联动数据

```javascript
new QSelect({
  data:[
    {
      value: '外部1',
      children: [
        '外部1-内部1',
        {
          key: '1-2',
          value: '外部1-内部2'
        }
      ]
    },
    {
      value: '外部2',
      children: ['外部2-内部1', '外部2-内部2']
    }
  ];
})
```

这里为了区分联动和非联动的数据格式,第一层数据必须是对象,到子联动数据后,如果不指定 key 值和 children,可以直接用数组

- 非联动

  非联动下是一个数组包含数组的结构,如果需要指定 key 那么值就得是一个对象

  对象的数据结构

  - value(必填) 展示的值
  - key 标志

```javascript
new QSelect({
  data: [
    ['1', '2', '3'],
    ['4', '5', '6'],
    [
      { key: '7k', value: '7' },
      { key: '8k', value: '8' },
      { key: '9k', value: '9' }
    ]
  ]
});
```

> 注释非联动和联动的区别,联动是数组包含对象,内部子联动通过 children 连接,而非联动是数组包含数组,一个数组就是一层联动

> 这个值指定后如果需要重新渲染 data,请参考下面的 setData 方法,直接改值是无效的

#### index

- 解释 默认索引值
- 数据格式 数组包含数字

```javascript
new QSelect({
  data: [[1, 2, 3]],
  index: [0]
});
```

如果当前指定的索引值大于当前滚动栏目的最大值,那么索引会重置为当前最大值,也就是滚动到当前栏目的最后一项,同样如果指定的索引个数大于联动栏目的个数多余的会忽略,少的会补全

> 这个值指定后如果需要重新渲染 index,请参考下面的 setIndex 方法,直接改值是无效的

#### count

- 解释 一个栏目展示多少数目
- 数据格式 数字 因为双数不好看 只能是 5 7 9 默认是 7

```javascript
new QSelect({
  data: [[1, 2, 3]],
  count: 9
});
```

#### chunkHeight

- 解释 一个栏目块的高度
- 数据格式 数字 默认是 40 也就是 40px 最小 30 最大 100

```javascript
new QSelect({
  data: [[1, 2, 3]],
  chunkHeight: 50
});
```

#### bkIndex

- 解释 背景的 z-index
- 数据格式 数字 默认是 500

```javascript
new QSelect({
  data: [[1, 2, 3]],
  bkIndex: 1000
});
```

#### selectIndex

- 解释 选择栏的 z-index
- 数据格式 数字 默认是 600

```javascript
new QSelect({
  data: [[1, 2, 3]],
  selectIndex: 2000
});
```

> 这个值别小于 bkIndex 不然背景会挡住下拉选择框

#### title

- 解释 选择栏的标题
- 数据格式 字符 默认是 请选择

```javascript
new QSelect({
  data: [[1, 2, 3]],
  title: '选择下面的内容'
});
```

#### confirmBtn

- 解释 选择栏的确认文案
- 数据格式 字符 默认是 确定

```javascript
new QSelect({
  data: [[1, 2, 3]],
  confirmBtn: '同意'
});
```

#### cancelBtn

- 解释 选择栏的取消文案
- 数据格式 字符 默认是 取消

```javascript
new QSelect({
  data: [[1, 2, 3]],
  cancelBtn: '关闭'
});
```

#### disableDefaultCancel

- 解释 默认点击选择栏取消会关闭背景蒙层,如果这个值为 true,则点击了关闭也不会关闭
- 数据格式 布尔 默认是 false

```javascript
new QSelect({
  data: [[1, 2, 3]],
  disableDefaultCancel: true
});
```

> 这个值指定了为 true,请参考下面的 close 手动关闭选择框

#### target

- 解释 如果不想让选择栏有背景蒙层,而是内联流式布局放在页面中,这个值要指定挂载元素,比如 id 就是`#test`,而 class 就是`.test`
- 数据格式 字符

```javascript
new QSelect({
  data: [[1, 2, 3]],
  target: '#test'
});
```

> 这个值为 true,不会有导航栏也就是不会有取消确认事件

#### loading

- 解释 这个值为 true 会在选择栏上放一个滚动 loading,且不可点击,在异步加载的时候有用
- 数据格式 布尔 默认是 false

```javascript
new QSelect({
  data: [[1, 2, 3]],
  loading: true
});
```

> 这个值指定了为 true,请参考下面的 cancelLoading 手动关闭 loading

#### ready

- 解释 选择栏挂载准备好的时候触发 在手动调用`setData` `setKey` `setValue` `setIndex`后也会触发
- 数据格式 function
- 回调参数

  - values 当前选择的值 如 [1]
  - keys 当前选择的 key 如 ['1k']
  - data 完整的 data 值
    - 数组第一项
      - 同 values
    - 数组第二项
      - 同 keys
    - 数组第三项
      - 当前的详情 data
      - 数据格式 数组对象
        - value 当前 value
        - key 当前 key
        - index 当前索引

```javascript
new QSelect({
  data: [[1, 2, 3]],
  ready(values, keys, data) {}
});
```

#### show

- 解释 选择栏显示的时候触发
- 数据格式 function
- 回调参数

  - values 当前选择的值 如 [1]
  - keys 当前选择的 key 如 ['1k']
  - data 完整的 data 值
    - 数组第一项
      - 同 values
    - 数组第二项
      - 同 keys
    - 数组第三项
      - 当前的详情 data
      - 数据格式 数组对象
        - value 当前 value
        - key 当前 key
        - index 当前索引

```javascript
new QSelect({
  data: [[1, 2, 3]],
  show(values, keys, data) {}
});
```

#### hide

- 解释 选择栏隐藏的时候触发
- 数据格式 function
- 回调参数

  - values 当前选择的值 如 [1]
  - keys 当前选择的 key 如 ['1k']
  - data 完整的 data 值
    - 数组第一项
      - 同 values
    - 数组第二项
      - 同 keys
    - 数组第三项
      - 当前的详情 data
      - 数据格式 数组对象
        - value 当前 value
        - key 当前 key
        - index 当前索引

```javascript
new QSelect({
  data: [[1, 2, 3]],
  hide(values, keys, data) {}
});
```

#### confirm

- 解释 选择栏导航点击确认触发
- 数据格式 function
- 回调参数

  - values 当前选择的值 如 [1]
  - keys 当前选择的 key 如 ['1k']
  - data 完整的 data 值
    - 数组第一项
      - 同 values
    - 数组第二项
      - 同 keys
    - 数组第三项
      - 当前的详情 data
      - 数据格式 数组对象
        - value 当前 value
        - key 当前 key
        - index 当前索引

```javascript
new QSelect({
  data: [[1, 2, 3]],
  confirm(values, keys, data) {}
});
```

#### cancel

- 解释 选择栏导航点击取消触发
- 数据格式 function
- 没有回调参数

```javascript
new QSelect({
  data: [[1, 2, 3]],
  cancel() {}
});
```

#### change

- 解释 选择栏数据更改且**全部动画结束后**触发
- 数据格式 function
- **在调用`setData` `setIndex` `setKey` `setValue`后不会触发`change`只会触发`readt`**
- 回调参数

  - weight 当前更改的最高权值的栏目索引 比如第一栏和第二栏同时滚动 这个值就是 第一栏的索引 0
  - values 当前选择的值 如 [1]
  - keys 当前选择的 key 如 ['1k']
  - data 完整的 data 值
    - 数组第一项
      - 同 values
    - 数组第二项
      - 同 keys
    - 数组第三项
      - 当前的详情 data
      - 数据格式 数组对象
        - value 当前 value
        - key 当前 key
        - index 当前索引

```javascript
new QSelect({
  data: [[1, 2, 3]],
  change(weight, values, keys, data) {}
});
```

### 实例上的方法

#### setData

- 解释 重新渲染选择栏的数据
- 参数
  - data(必填) 同 options 中的 data
  - index 同 options 中的 index

```javascript
const s1 = new QSelect({
  data: [[1, 2, 3]]
});

setTimeout(() => {
  s1.setData([[4, 5, 6]], [2]);
}, 1000);
```

#### getData

- 解释 获取当前 data
- 数据格式
  - values 当前选择的值 如 [1]
  - keys 当前选择的 key 如 ['1k']
  - data 完整的 data 值
    - 数组第一项
      - 同 values
    - 数组第二项
      - 同 keys
    - 数组第三项
      - 当前的详情 data
      - 数据格式 数组对象
        - value 当前 value
        - key 当前 key
        - index 当前索引

```javascript
const s1 = new QSelect({
  data: [[1, 2, 3]]
});

console.log(s1.getData());
```

#### setValue

- 解释 在当前选择栏下设定选择的值,选择栏会自动聚焦到当前值,如果没有这个值,则会聚焦到当前栏目第一项
- 参数
  - value(必填)
    - 数据格式 数组 直接指定要聚焦到的值如 [1,2,3]

```javascript
const s1 = new QSelect({
  data: [[1, 2, 3]]
});

setTimeout(() => {
  s1.setValue([3]);
}, 1000);
```

#### getValue

- 解释 获取当前 value
- 数据格式
  - values 当前选择的值 如 [1]

```javascript
const s1 = new QSelect({
  data: [[1, 2, 3]]
});

console.log(s1.getValue());
```

#### setKey

- 解释 在当前选择栏下设定选择的 key 值,选择栏会自动聚焦到当前值,如果没有这个值,则会聚焦到当前栏目第一项
- 参数
  - key(必填)
    - 数据格式 数组 直接指定要聚焦到的 key 值如 ['1k','2k','3k']

```javascript
const s1 = new QSelect({
  data: [[{ value: 1, key: '1k' }, { value: 2, key: '2k' }]]
});

setTimeout(() => {
  s1.setKey(['2k']);
}, 1000);
```

#### getKey

- 解释 获取当前 key
- 数据格式
  - keys 当前选择的 key 值 如 ['1k']

```javascript
const s1 = new QSelect({
  data: [[{ value: 1, key: '1k' }, 2, 3]]
});

console.log(s1.getKey());
```

#### setIndex

- 解释 在当前选择栏下设定选择的索引值,选择栏会自动聚焦到当前值,如果没有这个值,则会聚焦到当前栏目第一项
- 参数
  - key(必填)
    - 数据格式 数组 直接指定要聚焦到的索引如 [0,0,0]

```javascript
const s1 = new QSelect({
  data: [[{ value: 1, key: '1k' }, { value: 2, key: '2k' }]]
});

setTimeout(() => {
  s1.setIndex([0]);
}, 1000);
```

#### scrollTo

- 解释 这个是`setIndex`的子方法,scrollTo 可以指定特定的栏目的特定栏目的索引,而`setIndex`需要指定当前栏目和当前栏目前的索引
- 参数
  - column(必填) 栏目 Number
  - index（必填） 栏目索引 Number

```javascript
const s1 = new QSelect({
  data: [[{ value: 1, key: '1k' }, { value: 2, key: '2k' }]]
});

setTimeout(() => {
  s1.scrollTo(0, 0);
}, 1000);
```

#### getIndex

- 解释 获取当前索引
- 数据格式
  - index 当前选择的值 如 [0]

```javascript
const s1 = new QSelect({
  data: [[1, 2, 3]]
});

console.log(s1.getIndex());
```

#### setColumnData

- 解释 setData 是设置所有的 data,而 setColumnData 是设定指定栏目的 data,也就是异步一栏一栏加载 data 的
- 参数
  - column(必填) 栏目索引 可以指定多个栏目 多个栏目用数组表示比如[1,2] 单栏目就直接是数字比如 1
  - data(必填) 当前栏目的值 同 options 中**非联动**下的 data

```javascript
const s1 = new QSelect({
  data: [[{ value: 1, key: '1k' }, { value: 2, key: '2k' }]]
});

setTimeout(() => {
  s1.setColumnData(1, [[1, 2, 3]]);
}, 1000);
```

#### setLoading

- 解释 调出 loading 加载图案

```javascript
const s1 = new QSelect({
  data: [[{ value: 1, key: '1k' }, { value: 2, key: '2k' }]]
});

s1.setLoading();
setTimeout(() => {
  s1.setData([[1, 2, 3]]);
  s1.cancelLoading();
}, 1000);
```

#### cancelLoading

- 解释 关闭 loading 加载图案

```javascript
const s1 = new QSelect({
  data: [[{ value: 1, key: '1k' }, { value: 2, key: '2k' }]]
});

s1.setLoading();
setTimeout(() => {
  s1.setData([[1, 2, 3]]);
  s1.cancelLoading();
}, 1000);
```

#### show

- 解释 手动呼出下拉选择

```javascript
const s1 = new QSelect({
  data: [[{ value: 1, key: '1k' }, { value: 2, key: '2k' }]]
});

s1.show();
setTimeout(() => {
  s1.setData([[1, 2, 3]]);
  s1.hide();
}, 1000);
```

#### close

- 解释 手动关闭下拉选择

```javascript
const s1 = new QSelect({
  data: [[{ value: 1, key: '1k' }, { value: 2, key: '2k' }]]
});

s1.show();
setTimeout(() => {
  s1.close();
}, 1000);
```

#### destroy

- 解释 摧毁下拉选择

```javascript
const s1 = new QSelect({
  data: [[{ value: 1, key: '1k' }, { value: 2, key: '2k' }]]
});

setTimeout(() => {
  s1.destroy();
}, 1000);
```

## Vue

### 在线体验

[demo 在线体验](https://qymh.github.io/q-select/gitpage/vue/index.html)

### 下载

- npm

```shell
npm install @qymh/vue-q-select
```

- cnpm

```shell
cnpm install @qymh/vue-q-select
```

- yarn

```shell
yarn add @qymh/vue-q-select
```

下载完后在入口 js 文件中引用

```javascript
import Vue from 'vue';
import QSelect from '@qymh/vue-q-select';
import '@qymh/vue-q-select/dist/q-select.css';
Vue.use(QSelect);
```

然后就可以在 vue 文件中使用了

```vue
<template>
  <div>
    <q-select></q-select>
  </div>
</template>
```

你也可以通过`Vue.use`的`options`更改注册组件的名字,默认是`QSelect`

```javascript
import Vue from 'vue';
import QSelect from '@qymh/vue-q-select';
import '@qymh/vue-q-select/dist/q-select.css';
Vue.use(QSelect, { name: 'QPicker' });
```

对应的组件就是这样

```vue
<template>
  <div>
    <q-picker></q-picker>
  </div>
</template>
```

### props

| prop                 |  类型   | 是否必填 | 默认值 |       描述       |                                         数据格式 |
| -------------------- | :-----: | :------: | :----: | :--------------: | -----------------------------------------------: |
| v-model              | Boolean |   true   | false  | 是否显示下拉组件 |                                                  |
| data                 |  Array  |   true   |  [[]]  |    下拉数据值    |                                 [同 data](#data) |
| index                |  Array  |  false   |  [0]   |      索引值      |                               [同 index](#index) |
| count                | Number  |  false   |   7    |   栏目展示数目   |                               [同 count](#count) |
| chunkHeight          | Number  |  false   |   40   |   栏目块的高度   |                   [同 chunkHeight](#chunkHeight) |
| bkIndex              | Number  |  false   |  500   |  背景的 z-index  |                            [同 bkIndex](#bkIndx) |
| selectIndex          | Number  |  false   |  600   | 选择栏的 z-index |                    [同 selectIndex](#selectIndx) |
| title                | String  |  false   | 请选择 |   选择栏的标题   |                               [同 title](#title) |
| confirmBtn           | String  |  false   |  确定  | 选择栏的确认文案 |                     [同 confirmBtn](#confirmBtn) |
| cancelBtn            | String  |  fales   |  取消  | 选择栏的取消文案 |                       [同 cancelBtn](#cancelBtn) |
| disableDefaultCancel | Boolean |  false   | false  | 禁止默认取消事件 | [同 disableDefaultCancel](#disableDefaultCancel) |
| target               | String  |  false   |   ''   |   内联挂载元素   |                             [同 target](#target) |
| loading              | Boolean |  false   | false  |  是否启用加载图  |                           [同 loading](#loading) |
|                      |         |          |   ''   |                  |                                                  |

### refs

 以下方法通过在组件上绑定 ref 通过 `this.$refs.select`调用

```vue
<template>
  <q-select ref="select"></q-select>
</template>
```

- setData

  - 解释 重新渲染选择栏的数据
  - 参数
    - data(必填) 同 options 中的 data
    - index 同 options 中的 index

```javascript
this.$refs.select.setData([[4, 5, 6], [2]]);
```

- setValue

  - 解释 在当前选择栏下设定选择的值,选择栏会自动聚焦到当前值,如果没有这个值,则会聚焦到当前栏目第一项
  - 参数
    - value(必填)
      - 数据格式 数组 直接指定要聚焦到的值如 [1,2,3]

```javascript
this.$refs.select.setValue([3]);
```

- setKey

  - 解释 在当前选择栏下设定选择的 key 值,选择栏会自动聚焦到当前值,如果没有这个值,则会聚焦到当前栏目第一项
  - 参数
  - key(必填)
    - 数据格式 数组 直接指定要聚焦到的 key 值如 ['1k','2k','3k']

```javascript
this.$refs.select.setKey(['2k']);
```

- setIndex

  - 解释 在当前选择栏下设定选择的索引值,选择栏会自动聚焦到当前值,如果没有这个值,则会聚焦到当前栏目第一项
  - 参数
    - key(必填)
      - 数据格式 数组 直接指定要聚焦到的索引如 [0,0,0]

```javascript
this.$refs.select.setIndex([0]);
```

- scrollTo

  - 解释 这个是`setIndex`的子方法,scrollTo 可以指定特定的栏目的特定栏目的索引,而`setIndex`需要指定当前栏目和当前栏目前的索引
  - 参数
    - column(必填) 栏目 Number
    - index（必填） 栏目索引 Number

```javascript
this.$refs.select.scrollTo(0, 0);
```

- setColumnData

  - 解释 setData 是设置所有的 data,而 setColumnData 是设定指定栏目的 data,也就是异步一栏一栏加载 data 的
  - 参数
    - column(必填) 栏目索引 可以指定多个栏目 多个栏目用数组表示比如[1,2] 单栏目就直接是数字比如 1
    - data(必填) 当前栏目的值 同 options 中**非联动**下的 data

```javascript
this.$refs.select.setColumnData(1, [[1, 2, 3]]);
```

- getData

  - 解释 获取当前 data
  - 数据格式
    - values 当前选择的值 如 [1]
    - keys 当前选择的 key 如 ['1k']
    - data 完整的 data 值
      - 数组第一项
        - 同 values
      - 数组第二项
        - 同 keys
      - 数组第三项
        - 当前的详情 data
        - 数据格式 数组对象
          - value 当前 value
          - key 当前 key
          - index 当前索引

```javascript
this.$refs.select.getData();
```

- getValue

  - 解释 获取当前 value
  - 数据格式
    - values 当前选择的值 如 [1]

```javascript
this.$refs.select.getValue();
```

- getKey

  - 解释 获取当前 key
  - 数据格式
    - keys 当前选择的 key 值 如 ['1k']

```javascript
this.$refs.select.getKey();
```

- getIndex

  - 解释 获取当前索引
  - 数据格式
    - index 当前选择的索引 如 [0]

```javascript
this.$refs.select.getIndex();
```

- setLoading

  - 解释 调出 loading 加载图案

```javascript
this.$refs.select.setLoading();
```

- cancelLoading

  - 解释 关闭 loading 加载图案

```javascript
this.$refs.select.cancelLoading();
```

- show

  - 解释 手动呼出下拉选择

```javascript
this.$refs.select.show();
```

- close

  - 解释 手动关闭下拉选择

```javascript
this.$refs.select.close();
```

- destroy

  - 解释 摧毁下拉选择

```javascript
this.$refs.select.destroy();
```

### events

- ready

  - 解释 选择栏挂载准备好的时候触发 在手动调用`setData` `setKey` `setValue` `setIndex`后也会触发
  - 数据格式 function
  - 回调参数

    - values 当前选择的值 如 [1]
    - keys 当前选择的 key 如 ['1k']
    - data 完整的 data 值
      - 数组第一项
        - 同 values
      - 数组第二项
        - 同 keys
      - 数组第三项
        - 当前的详情 data
        - 数据格式 数组对象
          - value 当前 value
          - key 当前 key
          - index 当前索引

```vue
<template>
  <q-select @ready="doReady"></q-select>
</template>

<script>
export default {
  methods: {
    doReady(values, keys, data) {}
  }
};
</script>
```

- show

  - 解释 选择栏显示的时候触发
  - 数据格式 function
  - 回调参数

    - values 当前选择的值 如 [1]
    - keys 当前选择的 key 如 ['1k']
    - data 完整的 data 值
      - 数组第一项
        - 同 values
      - 数组第二项
        - 同 keys
      - 数组第三项
        - 当前的详情 data
        - 数据格式 数组对象
          - value 当前 value
          - key 当前 key
          - index 当前索引

```vue
<template>
  <q-select @show="doShow"></q-select>
</template>

<script>
export default {
  methods: {
    doShow(values, keys, data) {}
  }
};
</script>
```

- hide

  - 解释 选择栏隐藏的时候触发
  - 数据格式 function
  - 回调参数

    - values 当前选择的值 如 [1]
    - keys 当前选择的 key 如 ['1k']
    - data 完整的 data 值
      - 数组第一项
        - 同 values
      - 数组第二项
        - 同 keys
      - 数组第三项
        - 当前的详情 data
        - 数据格式 数组对象
          - value 当前 value
          - key 当前 key
          - index 当前索引

```vue
<template>
  <q-select @hide="doHide"></q-select>
</template>

<script>
export default {
  methods: {
    doHide(values, keys, data) {}
  }
};
</script>
```

- confirm

  - 解释 选择栏导航点击确认的时候触发
  - 数据格式 function
  - 回调参数

    - values 当前选择的值 如 [1]
    - keys 当前选择的 key 如 ['1k']
    - data 完整的 data 值
      - 数组第一项
        - 同 values
      - 数组第二项
        - 同 keys
      - 数组第三项
        - 当前的详情 data
        - 数据格式 数组对象
          - value 当前 value
          - key 当前 key
          - index 当前索引

```vue
<template>
  <q-select @confirm="doConfirm"></q-select>
</template>

<script>
export default {
  methods: {
    doConfirm(values, keys, data) {}
  }
};
</script>
```

- cancel

  - 解释 选择栏导航点击取消触发
  - 数据格式 function
  - 没有回调参数

```vue
<template>
  <q-select @cancel="doCancel"></q-select>
</template>

<script>
export default {
  methods: {
    doCancel(values, keys, data) {}
  }
};
</script>
```

- change

  - 解释 选择栏数据更改且**全部动画结束后**触发
  - 数据格式 function
  - **在调用`setData` `setIndex` `setKey` `setValue`后不会触发`change`只会触发`readt`**
  - 回调参数

    - weight 当前更改的最高权值的栏目索引 比如第一栏和第二栏同时滚动 这个值就是 第一栏的索引 0
    - values 当前选择的值 如 [1]
    - keys 当前选择的 key 如 ['1k']
    - data 完整的 data 值
      - 数组第一项
        - 同 values
      - 数组第二项
        - 同 keys
      - 数组第三项
        - 当前的详情 data
        - 数据格式 数组对象
          - value 当前 value
          - key 当前 key
          - index 当前索引

```vue
<template>
  <q-select @change="doChange"></q-select>
</template>

<script>
export default {
  methods: {
    doChange(values, keys, data) {}
  }
};
</script>
```

## 项目即将支持

- [] 沙盒演示
- [] 单元测试

## 项目延后支持

- [] React 组件化
