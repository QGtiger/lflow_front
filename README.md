dashboard ui

https://mui.com/material-ui/getting-started/templates/dashboard/

设计稿

https://insight.antv.antgroup.com/#/open/assets-manage?tab=relation

antd-pro

https://preview.pro.ant.design/dashboard/analysis/

## 实现技术方案

generateMenu 通过 import.meta.glob 构建时 API 生成菜单

通过 import.meta.glob 构建时 API 生成路由。 文件是路由

## keepAlive 思路

页面组件在虚拟 dom 是挂载在 `root` 下的， 做空渲染，页面需要显示的时候才会去 appendChild

https://cloud.tencent.com/developer/article/2009295

https://cloud.tencent.com/developer/article/1726781

[react-activation](https://github.com/CJY0208/react-activation/blob/master/README_CN.md)

最小实现

```jsx
import React, { Component, createContext } from "react";

const { Provider, Consumer } = createContext();
const withScope = (WrappedComponent) => (props) =>
  <Consumer>{(keep) => <WrappedComponent {...props} keep={keep} />}</Consumer>;

export class AliveScope extends Component {
  nodes = {};
  state = {};

  keep = (id, children) =>
    new Promise((resolve) =>
      this.setState(
        {
          [id]: { id, children },
        },
        () => resolve(this.nodes[id])
      )
    );

  render() {
    return (
      <Provider value={this.keep}>
        {this.props.children}
        {Object.values(this.state).map(({ id, children }) => (
          <div
            key={id}
            ref={(node) => {
              this.nodes[id] = node;
            }}
          >
            {children}
          </div>
        ))}
      </Provider>
    );
  }
}

@withScope
class KeepAlive extends Component {
  constructor(props) {
    super(props);
    this.init(props);
  }

  init = async ({ id, children, keep }) => {
    const realContent = await keep(id, children);
    this.placeholder.appendChild(realContent);
  };

  render() {
    return (
      <div
        ref={(node) => {
          this.placeholder = node;
        }}
      />
    );
  }
}

export default KeepAlive;
```

## 做纯前端搜索的

https://www.fusejs.io/

## 内页，设计稿，走飞书集成平台

https://anycross.feishu.cn/console/integration/7321568877564100612/workflow/7381360962961539075

# 重难点

## 节点重绘问题

- 问题

> 使用 `resize-observer-polyfill` 对节点进行监听。 dom 元素修改，会引起 flowNodeLayoutEngine 重绘，这里初次渲染的时候，每一个 dom 节点都会 被监听到，会导致重复渲染。

- 解决方案

采用微任务队列，防止重复注册

Q:为什么不用 函数防抖呢？
A:函数防抖基本都是用宏任务的，会导致闪一下哦。
