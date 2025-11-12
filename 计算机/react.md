# 1. 手写react

### 版本1

1. `npm i create-react-app -g`     `create-react-app react1`

2. 基本框架

   - index.js

     ```js
     import React from "./react";
     React.render("hello", document.getElementById("root"));
     
     ```

   - react .js

     ```js
     import { createUnit } from "./unit";
     import $ from "jquery";
     let React = {
       render,
       rootIndex: 0,
     };
     function render(element, container) {
       let unit = createUnit(element);
       let markUp = unit.getMarkUp(React.rootIndex);
       $(container).html(markUp);
     }
     
     export default React;
     
     ```

   - unit.js

     ```js
     class Unit {
       constructor(element) {
         this._currentElement = element;
       }
       getMarkUp() {
         throw Error("此方法不能被调用");
       }
     }
     
     class TextUnit extends Unit {
       getMarkUp(reactid) {
         this.reactid = reactid;
         return `<span data-reactid="${reactid}">${this._currentElement}</span>`;
       }
     }
     
     export function createUnit(element) {
       if (typeof element === "string" || typeof element === "number") {
         return new TextUnit(element);
       }
     }
     
     ```

     

   

3. 渲染dom元素

   - index.js

     ```js
     import React from "./react";
     function sayHello() {
       alert("hello");
     }
     /* let element = (
       <button
         id="sayHello"
         style={{ color: "red", backgroundColor: "green" }}
         onClick={sayHello}
       >
         say<b>hello</b>
       </button>
     ); */
     let element = React.createElement(
       "button",
       {
         id: "sayHello",
         style: { color: "red", backgroundColor: "green" },
         className: "cls-name",
         onClick: sayHello,
       },
       "say",
       React.createElement("b", {}, "Hello")
     );
     React.render(element, document.getElementById("root"));
     
     
     ```

   - react .js

     ```js
     import { createUnit } from "./unit";
     import $ from "jquery";
     import { createElement } from "./element";
     let React = {
       render,
       rootIndex: 0,
       createElement,
     };
     function render(element, container) {
       let unit = createUnit(element);
       let markUp = unit.getMarkUp(React.rootIndex);
       $(container).html(markUp);
     }
     
     export default React;
     
     
     ```

   - unit.js

     ```js
     import { Element } from "./element";
     import $ from "jquery";
     class Unit {
       constructor(element) {
         this._currentElement = element;
       }
       getMarkUp() {
         throw Error("此方法不能被调用");
       }
     }
     
     class TextUnit extends Unit {
       getMarkUp(reactid) {
         this._reactid = reactid;
         return `<span data-reactid="${reactid}">${this._currentElement}</span>`;
       }
     }
     class NativeUnit extends Unit {
       getMarkUp(reactid) {
         this._reactid = reactid;
         let { type, props } = this._currentElement;
         let tagStart = `<${type} data-reactid="${this._reactid}"`;
         let childString = "";
         let tagEnd = `</${type}>`;
         for (let propName in props) {
           if (/^on[A-Z]/.test(propName)) {
             let eventName = propName.slice(2).toLowerCase();
             $(document).delegate(
               `[data-reactid='${this._reactid}']`,
               `${eventName}.${this._reactid}`,
               props[propName]
             );
           } else if (propName === "style") {
             let styleObj = props[propName];
             let styles = Object.entries(styleObj)
               .map(([attr, value]) => {
                 return `${attr.replace(
                   /[A-Z]/g,
                   (m) => `-${m.toLowerCase()}`
                 )}:${value}`;
               })
               .join(";");
             tagStart += ` style=${styles} `;
           } else if (propName === "className") {
             tagStart += ` class=${props[propName]}`;
           } else if (propName === "children") {
             let children = props[propName];
             // eslint-disable-next-line no-loop-func
             children.forEach((child, index) => {
               let childUnit = createUnit(child);
               let childMarkUp = childUnit.getMarkUp(`${this._reactid}.${index}}`);
               childString += childMarkUp;
             });
           } else {
             tagStart += ` ${propName}=${props[propName]}`;
           }
         }
         console.log(tagStart + ">" + childString + tagEnd);
         return tagStart + ">" + childString + tagEnd;
       }
     }
     export function createUnit(element) {
       if (typeof element === "string" || typeof element === "number") {
         return new TextUnit(element);
       }
       if (element instanceof Element && typeof element.type == "string") {
         return new NativeUnit(element);
       }
     }
     
     
     ```

   - element.js

     ```js
     class Element {
       constructor(type, props) {
         this.type = type;
         this.props = props;
       }
     }
     
     function createElement(type, props, ...children) {
       props.children = children || [];
       return new Element(type, props);
     }
     
     export { Element, createElement };
     
     
     ```

4. 渲染自定义组件

   - index.js

     ```js
     import React from "./react";
     class Counter extends React.Component {
       constructor(props) {
         super(props);
         this.state = { number: 0 };
       }
       componentWillMount() {
         console.log("Count componentWillMount");
       }
       componentDidMount() {
         console.log("Count componentDidMount");
       }
       increment = () => {
         this.setState({
           number: this.state.number + 1,
         });
       };
       render() {
         let p = React.createElement(
           "p",
           { style: { color: "red" } },
           this.props.name,
           this.state.number
         );
         let button = React.createElement(
           "button",
           { onClick: this.increment },
           "+"
         );
         return React.createElement("div", { id: "counter" }, p, button);
       }
     }
     let element = React.createElement(Counter, { name: "计数器" });
     React.render(element, document.getElementById("root"));
     
     ```

   - react.js

     ```js
     import { createUnit } from "./unit";
     import $ from "jquery";
     import { createElement } from "./element";
     import { Component } from "./component";
     let React = {
       render,
       rootIndex: 0,
       createElement,
       Component,
     };
     function render(element, container) {
       let unit = createUnit(element);
       let markUp = unit.getMarkUp(React.rootIndex);
       $(container).html(markUp);
       $(document).trigger("mounted");
     }
     
     export default React;
     
     ```

   - unit.js

     ```js
     import { Element } from "./element";
     import $ from "jquery";
     class Unit {
       constructor(element) {
         this._currentElement = element;
       }
       getMarkUp() {
         throw Error("此方法不能被调用");
       }
     }
     
     class TextUnit extends Unit {
       getMarkUp(reactid) {
         this._reactid = reactid;
         return `<span data-reactid="${reactid}">${this._currentElement}</span>`;
       }
     }
     class NativeUnit extends Unit {
       getMarkUp(reactid) {
         this._reactid = reactid;
         let { type, props } = this._currentElement;
         let tagStart = `<${type} data-reactid="${this._reactid}"`;
         let childString = "";
         let tagEnd = `</${type}>`;
         for (let propName in props) {
           if (/^on[A-Z]/.test(propName)) {
             let eventName = propName.slice(2).toLowerCase();
             $(document).delegate(
               `[data-reactid='${this._reactid}']`,
               `${eventName}.${this._reactid}`,
               props[propName]
             );
           } else if (propName === "style") {
             let styleObj = props[propName];
             let styles = Object.entries(styleObj)
               .map(([attr, value]) => {
                 return `${attr.replace(
                   /[A-Z]/g,
                   (m) => `-${m.toLowerCase()}`
                 )}:${value}`;
               })
               .join(";");
             tagStart += ` style=${styles} `;
           } else if (propName === "className") {
             tagStart += ` class=${props[propName]}`;
           } else if (propName === "children") {
             let children = props[propName];
             // eslint-disable-next-line no-loop-func
             children.forEach((child, index) => {
               let childUnit = createUnit(child);
               let childMarkUp = childUnit.getMarkUp(`${this._reactid}.${index}`);
               childString += childMarkUp;
             });
           } else {
             tagStart += ` ${propName}=${props[propName]}`;
           }
         }
         return tagStart + ">" + childString + tagEnd;
       }
     }
     class CompositeUnit extends Unit {
       getMarkUp(reactid) {
         this._reactid = reactid;
         let { type: Component, props } = this._currentElement;
         let componentInstance = (this._componentInstance = new Component(props));
         componentInstance.currentUnit = this;
         componentInstance.componentWillMount &&
           componentInstance.componentWillMount();
         let renderedElement = componentInstance.render();
         let renderedUnitInstance = (this._renderUnitInstance =
           createUnit(renderedElement));
         let renderedMarkUp = renderedUnitInstance.getMarkUp();
         $(document).on("mounted", () => {
           componentInstance.componentDidMount &&
             componentInstance.componentDidMount();
         });
         return renderedMarkUp;
       }
     }
     export function createUnit(element) {
       if (typeof element === "string" || typeof element === "number") {
         return new TextUnit(element);
       }
       if (element instanceof Element && typeof element.type == "string") {
         return new NativeUnit(element);
       }
       if (element instanceof Element && typeof element.type == "function") {
         return new CompositeUnit(element);
       }
     }
     
     ```

   - element.js

     ```js
     class Element {
       constructor(type, props) {
         this.type = type;
         this.props = props;
       }
     }
     
     function createElement(type, props, ...children) {
       props.children = children || [];
       return new Element(type, props);
     }
     
     export { Element, createElement };
     
     ```

   - component.js

     ```js
     class Component {
       constructor(props) {
         this.props = props;
       }
     }
     
     export { Component };
     
     ```