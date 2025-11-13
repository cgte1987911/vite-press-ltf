# 1. startMove时间版

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<script>
    window.onload = function () {
        let oDiv = document.querySelector('div')
        startMove(oDiv, {
            left: 300,
            top: 300,
            opacity: 50
        }, 1000, () => {
            alert(1)
        })
    }

    function startMove(ele,json,times,fn){
        clearInterval(ele.timer)

        let iCur={}
        for(let attr in json){
            if(attr=='opacity')
                iCur[attr]=Math.round(parseFloat(getComputedStyle(ele,false)[attr])*100)
            else
                iCur[attr]=parseInt(getComputedStyle(ele,false)[attr])
        }
        let startTime=Date.now();
        ele.timer=setInterval(()=>{
            let currentTime=Date.now();
            let t=times-Math.max(startTime-currentTime+times,0)
            for(let attr in json){
                let val=Tween.linear(t,times,json[attr]-iCur[attr],iCur[attr])
                if(attr=='opacity'){
                    ele.style[attr]=val/100
                }
                else
                    ele.style[attr]=val+'px'
            }
            if(t==times){
                clearInterval(ele.timer)
                fn&&fn(ele)
            }
        },16)

        let Tween={
            linear(t,d,c,b){
                return b+c*t/d
            }
        }
    }
</script>

<body>
    <div style="width:100px;height:100px;background:red;position:absolute;left:0;top:0;"></div>
</body>

</html>
```

## 用requestAnimationFrame

```js
import { Tween } from './Tween.js';

export function startMove(ele, durationTime, json, fn) {
  let iCur = {};
  for (let attr in json) {
    iCur[attr] = parseInt(getComputedStyle(ele)[attr]);
  }

  let startTime = Date.now();
  
  function animate() {
    let nowTime = Date.now() - startTime;
    let bEnd = true;

    for (let attr in json) {
      if (nowTime <= durationTime) {
        ele.style[attr] = Tween.linear(durationTime, nowTime, iCur[attr], json[attr] - iCur[attr]) + 'px';
        bEnd = false;
      } else {
        ele.style[attr] = json[attr] + 'px';
      }
    }

    if (!bEnd) {
      requestAnimationFrame(animate);
    } else if (nowTime >= durationTime) {
      fn();
    }
  }
  
  requestAnimationFrame(animate);
}

```



# 2. 背包算法

##  波波

```c++
#include <iostream>
#include <vector>
#include <cassert>
using namespace std;
class Knapsack01{
public:
    int knapsack01(const vector<int>&w,const vector<int>&v,int C){
        assert(w.size()==v.size()&&C>=0);
        int n=w.size();
        if(n==0||C==0)
            return 0;
        vector<int> memo(C+1,0);
        for(int i=0;i<=C;i++)
            memo[i]=i>=w[0]?v[0]:0;
        for(int i=1;i<n;i++){
            for(int j=C;j>=w[i];j--)
                memo[j]=max(memo[j],v[i]+memo[j-w[i]]);
        }
        return memo[C];
    }
};
int main(){
    int n,W;
    cin>>n>>W;
    int w,v;
    vector<int>ws,vs;
    for(int i=0;i<n;i++){
        cin>>w>>v;
        ws.push_back(w);
        vs.push_back(v);
    }
    cout<<Knapsack01().knapsack01(ws,vs,W)<<endl;
}
```

## 杜鹏

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
        let M=5,W=10
        let ws=[2,2,3,3,4],vs=[3,4,3,4,5]
        function show(M,W,ws,vs){
            let res=[]
            for(let i=0;i<=M;i++){
                res[i]=[]
                for(let j=0;j<=W;j++){
                    if(i==0)
                        res[i][j]=0
                    else if(ws[i-1]>j)
                        res[i][j]=res[i-1][j]
                    else
                        res[i][j]=Math.max(res[i-1][j],vs[i-1]+res[i-1][j-ws[i-1]])
                }
            }
            return res[M][W]
        }
        console.log(show(M,W,ws,vs))
    </script>
</body>
</html>
```



# 3. Promise

## PromiseA+基本实现

```js
// 1.默认三个状态
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        reject(new TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]'));
    }
    // 如何判断一个值是不是promise?  有没有then方法，有then方法的前提得是 x是一个对象或者函数
    if ((typeof x === 'object' && x !== null) || (typeof x === 'function')) {
        let called = false;
        try {
            let then = x.then; // 有then就是promise吗？ {then:123}
            if (typeof then === 'function') { // {then:function(){}}
                //  如果有一个then方法那么就说他是promise
                // 这里就是promise 要判断是成功的promise还是失败的promise
                // 这里直接用上次取出的then来继续使用，防止再次取then发生异常
                then.call(x, y => {
                    if (called) return
                    called = true;
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {
                    if (called) return;
                    called = true;
                    reject(r);
                }); // x.then(成功的回调，失败的回调)
            } else {
                // {}  {then:'123'}
                resolve(x); // 这里直接成功即可 普通值的情况
            }
        } catch (e) {
            if (called) return
            called = true;
            reject(e); // 直接失败即可
        }
    } else {
        resolve(x); // 这里直接成功即可 普通值的情况
    }
}
class Promise {
    constructor(executor) {
        this.status = PENDING;
        // 这里可以用一个变量，为了看的清除 用2来表示
        this.value = undefined;
        this.reason = undefined;
        this.onResolvedCallbacks = []; // 存放成功的回调的
        this.onRejectedCallbacks = []; // 存放失败的回调的
        const resolve = (value) => {
            // 这里我们添加一个规范外的逻辑 让value值是promise的话可以进行一个解析
            if(value instanceof Promise){
                // 递归解析值
                return value.then(resolve,reject)
            }
            if (this.status === PENDING) {
                this.status = FULFILLED
                this.value = value;
                this.onResolvedCallbacks.forEach(fn => fn());
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason;
                this.onRejectedCallbacks.forEach(fn => fn());
            }
        }
        try {
            executor(resolve, reject); // 3.这个代码执行的时候可能会发生异常
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) { // 4.调用then的时候来判断成功还是失败
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                        reject(e);
                    }
                }, 0);
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    // 放自己的逻辑....
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                            reject(e);
                        }
                    }, 0)
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) { // 执行对应的回调时发生异常就执行promise2的失败
                            reject(e);
                        }
                    }, 0)
                })
            }
        });

        return promise2
    }

    catch(errorCallback){
        return this.then(null,errorCallback)
    }
}
// 原生不支持此方法
Promise.deferred = function () {
    let dfd = {};
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd
}
// npm install promises-aplus-tests -g 全局安装只能在命令行中使用
// promises-aplus-tests promise-3.js

Promise.reject = function(reason){
    return new Promise((resolve,reject)=>{
        reject(reason)
    })
}
Promise.resolve = function(value){
    return new Promise((resolve,reject)=>{
        resolve(value)
    })
}
module.exports = Promise;
```

## 添加finally实现

```js
// ...其他代码
class Promise {
  // ...构造函数和其他方法

  finally(callback) {
    return this.then(
      value => Promise.resolve(callback()).then(() => value),
      reason => Promise.resolve(callback()).then(() => { throw reason })
    );
  }

  // ...其他代码
}
// ...其他代码

```

## promise执行顺序相关

```js
function aaa() {
  let p = new Promise((resolve, reject) => {
    resolve()
  })
  return p
    .then(() => {
      return new Promise((resolve, reject) => {
        resolve()
      }).then(() => {
        console.log(123)
      })
    })
    .catch(() => {
      console.log(111)
    })
}

async function bbb() {
  aaa().finally(() => {
    console.log(444)
  })
}

bbb()
```



# 4. 设计模式

## 发布订阅模式

- blue版本

```js
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        class Pipe {
            constructor() {
                this.pipes = {};
            }

            addListener(type, fn) {
                this.pipes[type] = this.pipes[type] || [];

                if (this.pipes[type].findIndex(func => func == fn) == -1) {
                    this.pipes[type].push(fn);
                }
            }

            off(type, fn) {
                if (this.pipes[type]) {
                    this.pipes[type] = this.pipes[type].filter(func => func != fn);

                    if (this.pipes[type].length == 0) {
                        delete this.pipes[type];
                    }
                }
            }

            dispatch(type, ...args) {
                if (this.pipes[type]) {
                    this.pipes[type].forEach(fn => {
                        fn(...args);
                    });
                }
            }
        }
    </script>
</body>

</html>
```



## 单例模式

### 使用了代理模式的单例模式

```js
	var CreateDiv = function( html ){
		this.html = html;

		this.init();
	};
	CreateDiv.prototype.init = function(){
		var div = document.createElement( 'div' );
		div.innerHTML = this.html;
		document.body.appendChild( div );
	};

	var ProxySingletonCreateDiv = (function(){
		var instance;
		return function( html ){
			if ( !instance ){
				instance = new CreateDiv( html );
			}
			return instance;
		}
	})();

	var a = new ProxySingletonCreateDiv( 'sven1' );
	var b = new ProxySingletonCreateDiv( 'sven2' );
	alert ( a === b );
```

### 通用单例模式

```js
	var createLoginLayer = (function(){
		var div;
		return function(){
			if ( !div ){
				div = document.createElement( 'div' );
				div.innerHTML = '我是登录浮窗';
				div.style.display = 'none';
				document.body.appendChild( div );
			}
			return div;
		}
	})();

	document.getElementById( 'loginBtn' ).onclick = function(){
		var loginLayer = createLoginLayer();
		loginLayer.style.display = 'block';
	};

	var createIframe= (function(){
		var iframe;
		return function(){
			if ( !iframe){
				iframe= document.createElement( 'iframe' );
				iframe.style.display = 'none';
				document.body.appendChild( iframe);
			}
			return iframe;
		}
	})();

	var getSingle = function( fn ){
		var result;
		return function(){
			return result || ( result = fn .apply(this, arguments ) );
		}
	};

	var createLoginLayer = function(){
		var div = document.createElement( 'div' );
		div.innerHTML = '我是登录浮窗';
		div.style.display = 'none';
		document.body.appendChild( div );
		return div;
	};
	var createSingleLoginLayer = getSingle( createLoginLayer );
	document.getElementById( 'loginBtn' ).onclick = function(){
		var loginLayer = createSingleLoginLayer();
		loginLayer.style.display = 'block';
	};

	//下面我们再试试创建唯一的iframe 用于动态加载第三方页面：
	var createSingleIframe = getSingle( function(){
		var iframe = document.createElement ( 'iframe' );
		document.body.appendChild( iframe );
		return iframe;
	});
	document.getElementById( 'loginBtn' ).onclick = function(){
		var loginLayer = createSingleIframe();
		loginLayer.src = 'http://baidu.com';
	};

	var bindEvent = function(){
		$( 'div' ).one( 'click', function(){
			alert ( 'click' );
		});
	};
	var render = function(){
		console.log( '开始渲染列表' );
		bindEvent();
	};
	render();

	render();
	render();

	var bindEvent = getSingle(function(){
		document.getElementById( 'div1' ).onclick = function(){
			alert ( 'click' );
		}
		return true;
	});
	var render = function(){
		console.log( '开始渲染列表' );
		bindEvent();
	};
	render();
	render();
	render();
```



## 节流防抖

```js
import isObject from './isObject'
const FUNC_ERROR_TEXT = 'Expected a function'
const nativeMax = Math.max
const nativeMin = Math.min
const now = function () {
  return Date.now()
}
export default function debounce(func, wait, options) {
  let lastArgs
  let lastThis
  let maxWait
  let result
  let timerId
  let lastCallTime
  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true
  if (typeof func !== 'function') {
    throw new TypeError(FUNC_ERROR_TEXT)
  }
  wait = Number(wait) || 0
  if (isObject(options)) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? nativeMax(Number(options.maxWait) || 0, wait) : maxWait
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }
  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis
    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }
  function leadingEdge(time) {
    lastInvokeTime = time
    timerId = setTimeout(timerExpired, wait)
    return leading ? invokeFunc(time) : result
  }
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall
    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }
  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }
  function timerExpired() {
    const time = now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    timerId = setTimeout(timerExpired, remainingWait(time))
  }
  function trailingEdge(time) {
    timerId = undefined
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }
  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }
  function flush() {
    return timerId === undefined ? result : trailingEdge(now())
  }
  function debounced() {
    const time = now()
    const isInvoking = shouldInvoke(time)
    lastArgs = arguments
    lastThis = this
    lastCallTime = time
    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        clearTimeout(timerId)
        timerId = setTimeout(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  return debounced
}

```

- 看似很复杂，其实可以分解成3个参数逐步扩展成以示例

  1. leading

  2. maxWait

  3. trailing



​     

# 5. Mac设置右键用VSCode打开文件和文件夹

  1. 在启动台中搜索自动操作

  2. 选取快速操作

  3. 点击左侧栏`实用工具`菜单项=》点击`运行shell脚本`

  4. 工作流程收到当前=》`文件或文件夹`=》`任何应用程序`

  5. ```bash
     for f in "$@"
     do
         open -a "Visual Studio Code" "$f"
     done
     ```

  5. 传递输入：`作为自变量`
     
  6. 然后command+S，填写用VSCode打开



# 6. typescript

## 安装typecript等npm操作

1. `npm i typescript -g`
2. 查看ts当前版本`tsc -v`
3. 查看typescript最新版本`npm show typescipt version`
4. 初始化配置文件`tsc --init`
5. 使用code runner插件来直接运行ts会报`/bin/sh: ts-node: command not found`的错误
   - 先安装`npm i -g ts-node`
   - 再右键运行code runner插件（需要把package.json的`type:module`去掉）

## 使用rollup来构建

1. `npm i rollup typescript rollup-plugin-typescript2 @rollup/plugin-node-resolve`

2. 根目录下创建`rollup.config.js`

   ```js
   import ts from 'rollup-plugin-typescript2'
   import { nodeResolve } from '@rollup/plugin-node-resolve'
   import path from 'path'
   import { fileURLToPath } from 'url'
   const __filename = fileURLToPath(import.meta.url)
   const __dirname = path.dirname(__filename)
   
   export default {
       input: './src/index.ts',
       output: {
           file: path.resolve(__dirname, 'dist/bundle.js'),
           format: 'iife', //(function(){})()
           sourcemap:true
       },
       plugins: [
           nodeResolve({ 
               extensions: ['.js', '.ts']
           }),
           ts({
               tsconfig: path.resolve(__dirname, 'tsconfig.json')
           })
       ]
   }
   ```

   `import.meta.url`输出的是当前文件的绝对路径：`file://xxxxx/xxxx/xx`

   可以使用`import {fileURLToPath} from "url"`来转成等价于commonJs的`__filename`

3. package.json添加命令`    "dev": "rollup -c -w"`

4. tsconfig.json文件中打开`"sourceMap": true,`字段并且修改module字段为`"module": "ESNext"`

## ts类型

安装Error Lens插件

### 基本类型

- 基础类型&包装类型

```ts
let str:string='abc'
let num:number=12
let str2:String=new String('123')
```

- 数组

  ```ts
  let arr1:number[]=[1,2,3,4,5]
  let arr2:Array<number>=[1,2,3,4,5]
  let arr3:(number|string)[]=[1,2,3,'a','b','c'] //不关心指定类型的顺序
  ```

- 元组

  ```ts
  let tuple:[string,number,string,number]=['1',1,'1',1] //必须符合指定类型的顺序
  ```

  - 注意
    - 不能增加指定类型以外的类型的值
    - 增加了超过指定类型数量以外的值后也无法访问

- 枚举

  ```ts
  enum STATUS{
      'TODO',
      'DONE'=100,
      'UNDO'='undo'
  }
  ```

- void

  ```ts
  function a():void{
      return undefined
  }
  ```

- never

  ```ts
  function whileTrue():never{
      while(true){}
  }
  ```
  
  ```ts
  function throwError():never{
      throw Error()
  }
  ```
  
  ```ts
  function validateCheck(v:never){
  
  }
  function toArray(val:number|string|boolean){
      if(typeof val==='number'){
          return val.toString().split('').map(Number)
      }
      if(typeof val==='string'){
          return val.split('')
      }
      if(typeof val==='boolean'){
          return val.toString().split('')
      }
      validateCheck(val)
  }
  toArray('abc')
  ```
  
- any (能不用就不用，范围最大的类型，等于放弃检测也就是不用ts)

### 类型断言

1. 没有赋值的变量默认值是undefinded 但是类型是any

2. ！的作用

   ```ts
   let strOrNum: string | number | undefined | null;
   let str: string = (strOrNum! as string);
   ```

   `!` 后缀表达式操作符用于从一个可能为 `null` 或 `undefined` 的值中去除这两种可能性。当你确定某个值一定存在时，可以使用 `!` 来告诉 TypeScript 编译器忽略 `null` 和 `undefined`。

   ```js
   以下是等价的
   let strOrNum: string | number | undefined | null;
   <number>strOrNum!
   strOrNum as string!
   ```

3. 类型别名

   ```ts
   type Direction='up'|'down'|'left'|'right'
   let direction:Direction
   let up:'down'=direction! as 'down'
   ```

### 函数类型

1. 对与ts来说：函数关键字申明的函数，不能标注函数类型

   ```ts
   function sum(a,b){
     return a+b
   }
   ```

   ```ts
   function sum(a:number,b:number):any{
     return a+b
   }
   ```

2. 通过表达式来申明的函数才能标注类型

   ```ts
   const sum:(a:any,b:any)=>any=function(a,b){
     return a+b
   }
   ```
   
   ```ts
   const sum:{(a:any,b:any):any}=function(a,b){
     return a+b
   }
   ```
   
   ```ts
   type ISum={(a:any,b:any):any}
   // 或者
      type ISum=(a:any,b:any)=>any
   const sum:ISum=function(a:string,b:string){
   	return a+b
   }
   ```
   
   





# 7. GIT

## 基本使用

- 初始化项目

  1. git init

  2. 创建.gitignore

     ```js
     node_modules/
     packages/**/node_modules
     ```

  3. 创建git项目现在默认是main分支，可以重命名

     - `git branch -m main master`

  4. `git add .`

     ` git commit -m '初始提交'`
  
     `git remote add origin git@github.com:cgte1987911/learn-code.git`
  
     - 需要先生成ssh key
       - `ls -al ~/.ssh`查看是否已经有ssh key
         - 如果你看到 `id_rsa.pub` 和 `id_rsa` 文件，那么你已经有一个 SSH key。
       - 如果你没有 SSH key 或者需要一个新的
         - `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`
         - 一路回车默认会保存到~/.ssh/下
       - 把`id_rsa.pub`的内容复制到github上的ssh key里面
  
     `git push -u origin master`
  
- tag使用

  1. 列出标签
     - 列出本地所有标签 `git tag`
     - 列出远程所有标签 `git ls-remote --tags 远程仓库名别名(比如origin)`
     - 列出所有以 `v1`开头的标签
       - `git tag -l "v1.*"`
  
  2. 在某个标签上进行开发
     - 检出标签名：`git checkout 标签名`
     - 创建新分支：git checkout -b 新分支名
  
  3. 创建标签
  
     - `git tag -a <tagname> -m "<tagmessage>"`
  
  4. 推送标签到远程
  
     - `git push origin <tagname>`
  
     - 推送所有标签到远程
  
       - `git push origin --tags`
  
  5. 同步远程标签到本地
  
     - `git fetch --tags`
  
       
  
- 删除分支

  1. 删除本地分支

     - 先切到你要删除的分支的以外的分支

     - `git branch -d 你要删除的分支名` -D是强制删除
  1. 删除远程分支
  - `git push 远程仓库别名(如origin) --delete   分支名`
  - 如果要想删除主分支，先要在仓库设置里面把主分支设置给其他分支
  
- 合并分支

  1. 切换到目标分支：使用 `git checkout` 命令切换到你希望合并进去的分支（即目标分支）

     - `git checkout 目标分支名`

  2. 执行合并操作 ：使用 `git merge` 命令将源分支合并到目标分支
     - `git merge 源分支名`
  
- 新建的分支提交到远程

  - `git push -u origin 新分支名`

- 查找分支

  1. 查找本地分支

     - `git branch | grep "分支名或部分关键词"`

  2. 查找远程分支
  
     - `git branch -r | grep "分支名或部分关键词"`
  
  3. 查找所有分支（本地和远程）
  
     - `git branch -a | grep "分支名或部分关键词"`
  
- 撤销命令

  1. `git checkout .`工作区撤销
  2. `git reset --hard`  工作区和暂存区都撤销

- 切换到前一个分支

  `git checkout -`
  
- 查看文件改动

  1. 查看工作区与某次特定提交之间的区别
  
     `git diff <commit-hash>`
  
  2. 查看工作区和master区别
  
     `git diff master`
  
  3. 查看暂存区与master分支的差异：
  
     `git diff --cached master`
  
  4. 查看当前分支最新提交与master分支最新提交的差异
  
     `git diff master..HEAD`
  
  5. 查看某一文件和master的区别
  
     ` git diff master -- src/utils/reinforceFetch.js`
  
  6. 把某一文件恢复到master状态
  
     `git checkout master src/utils/reinforceFetch.js`
  
     
  
- 删除主分支，并且从远程重新拉

  1. 先切到其它分支`git checkout -b dev`
  2. 删除主分支 `git branch -D master`
  3. git fetch origin
  4. git checkout -b master origin/master
  
- 查看分支引用

  `git show-ref origin/master`
  
  



 


# 8. npm

## 上传项目

- npm login
- npm publish
- 每次上传改版本号

## 源相关操作

- 查看当前的源

  `npm config get registry`

- 设置当前源

  `npm config set registry https://registry.npmjs.org/`

- 临时设置，支队当前命令有效

  `npm install 包名 --registry https://registry.npm.taobao.org/`



# 9. nvm

## 设置node默认版本 

1.  nvm alias stable 版本号
2.  查看包版本(info,show,view都行)
    - 所有版本`npm info portal-vue@2 versions`
    - 最新版本`npm info portal-vue@2 version`



# 10. MYSQL

## 基本命令

1. 登录`mysql -u root -p`

   - 如果没有添加进环境变量需要如下设置

     - `find /usr/local -name mysql`找到mysql命令路径,如下示例

       - ```bash
         /usr/local/mysql
         /usr/local/mysql-8.0.32-macos13-arm64/bin/mysql
         /usr/local/mysql-8.0.32-macos13-arm64/include/mysql
         ```

     - `open -e ~/.zshrc` 打开.zshrc文件在下面添加

       - `export PATH="/usr/local/mysql-8.2.0-macos13-arm64/bin/:$PATH"`
       
     - `source ~/.zshrc`

2. 修改密码：`ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';`





# 11. 有用的工具

### oh my zsh  

-  https://ohmyz.sh/#install

1. `git clone https://github.com/robbyrussell/oh-my-zsh.git ~/.oh-my-zsh`

2. `cp ~/.oh-my-zsh/templates/zshrc.zsh-template ~/.zshrc`

   - 只是追加的话用这个命令：`cat ~/.oh-my-zsh/templates/zshrc.zsh-template >> ~/.zshrc`

3. `chsh -s /bin/zsh`

4. 安装自动提示插件

   `git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions`

5. 编辑`~/.zshrc`文件,找到`plugins`  这一行，修改成`plugins=(git zsh-autosuggestions)`

6. `source ~/.zshrc`



## vscode 插件

1. vue-peek插件，可以自动跳转省略index.js和index.vue结尾的路径

   - 根目录下新建jsconfig.json

   ```js
   {
     "compilerOptions": {
       "baseUrl": "./",
       "paths": {
         "@/*": ["src/*"]
       }
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules"]
   }
   
   ```

   



# 13. 各种快捷键

## zsh

- 删除所有 `control+u`

- 删除一个单词 `control+w`

  


​         

  # 12. nginx

### 基本命令

- 启动：`nginx`

- 停止：`nginx -s stop`
- 重启：`nginx -s reload`

### 基本配置规则

1. ```js
   server {
       location ~ \.json$ {
           root   data;
            add_header 'Access-Control-Allow-Origin' '*';
       }
   }
   ```

   - ~ 符号表示接下来的是一个正则表达式。Nginx 会使用这个正则表达式来匹配请求的 URL 路径。
   - .json$ 是一个正则表达式，它匹配任何以 .json 结尾的 URL 路径



# 13 CSS

1. calc使用注意，必须要有空格

   - 比如这个减号两边要有空格`  height: calc(100vh - 300px);`  

2. 固定定位左右居中

   - ```css
       position: fixed;
       left: 50%;
       transform: translate(-50%);
     ```



# 14. JS语法及使用

- 类的静态方法也可以被继承

  ```js
  class A{
  
  }
  A.speak=function(){
    alert(111)
  }
  
  class B extends A{}
  
  B.speak()
  ```

  

# 15. 学习网站

1. markdown学习
   - https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax



# 16. markdown使用

### 数学公式

1. 分数
   - $\frac{a}{b} = c$

2. 极限：
   - $\lim_{x \to a} f(x) = L$

3. 导数
   - $f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}$

4. 积分
   - $\int_a^b f(x)\,dx = F(b) - F(a)$

5. 概率
   - 贝叶斯定理
     - $P(A|B) = \frac{P(B|A)P(A)}{P(B)}$
   - 期望值
     - $E(X) = \sum_{i=1}^n x_i P(x_i)$  ✅ 添加了 $ 符号
   - 方差
     - $\text{Var}(X) = E[(X - E(X))^2]$
   - 正态分布
     - $f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$

6. 线性代数

   - 矩阵乘法
     - $(AB)_{ij} = \sum_{k=1}^n A_{ik}B_{kj}$

   - 行列式定义
     - $\text{det}(A) = \sum_{\sigma \in S_n} \text{sgn}(\sigma) \prod_{i=1}^n a_{i,\sigma(i)}$

   - 特征值和特征向量
     - $A\mathbf{v} = \lambda \mathbf{v}$  ✅ 添加了 $ 符号和向量符号

   - 单位矩阵
     - $AA^{-1} = A^{-1}A = I$

   - 2×2矩阵
     - $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$  ✅ 使用 pmatrix 环境

   - 带括号矩阵
     - 带圆括号
       - $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$
     - 带方括号
       - $\begin{bmatrix} a & b \\ c & d \end{bmatrix}$

   - 3×3矩阵
     - $\begin{pmatrix} a_{11} & a_{12} & a_{13} \\ a_{21} & a_{22} & a_{23} \\ a_{31} & a_{32} & a_{33} \end{pmatrix}$

   - 行列式计算
     - $\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$  ✅ 添加了计算结果



# 17.JS实例

- performance

  ```js
  // 标记开始时间
  performance.mark('startDataProcessing');
  
  // 执行一些数据处理任务
  // for loop or any other task
  for(let i = 0; i < 10000; i++) {
      // 数据处理逻辑
  }
  
  // 标记结束时间
  performance.mark('endDataProcessing');
  
  // 测量从开始到结束的时间
  performance.measure('dataProcessingDuration', 'startDataProcessing', 'endDataProcessing');
  
  // 获取并输出测量结果
  const measures = performance.getEntriesByName('dataProcessingDuration');
  console.log(measures[0].duration);
  
  // 清除标记和测量记录
  performance.clearMarks();
  performance.clearMeasures();
  
  ```

- 实现工具把指定字符串转成base64

  ```js
  function toUTF8Bin(text) {
      const encoder = new TextEncoder(); // 用于将字符串转换为字节
      return encoder.encode(text);
  }
  
  function toBase64(utf8Bytes) {
      const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      let result = '';
      let binaryString = '';
  
      // 将每个字节转换为二进制字符串
      utf8Bytes.forEach(byte => {
          binaryString += byte.toString(2).padStart(8, '0');
      });
  
      // 将二进制字符串划分为6位一组
      for (let i = 0; i < binaryString.length; i += 6) {
          const chunk = binaryString.substring(i, i + 6).padEnd(6, '0'); // 确保每个chunk都是6位
          const index = parseInt(chunk, 2);
          result += base64Chars[index];
      }
  
      // 添加填充字符
      while (result.length % 4 !== 0) {
          result += '=';
      }
  
      return result;
  }
  
  const text = '珠峰培训';
  const utf8Bytes = toUTF8Bin(text);
  console.log(utf8Bytes)
  const base64 = toBase64(utf8Bytes);
  console.log(base64);
  ```
  
- createWriteStream和createReadStream不适用pipe的使用示例

  ```js
  const fs = require('fs');
  const path = require('path');
  
  // 定义源文件和目标文件的路径
  const sourcePath = path.join(__dirname, 'source.txt');
  const destinationPath = path.join(__dirname, 'destination.txt');
  
  // 创建一个可读流
  const readStream = fs.createReadStream(sourcePath);
  
  // 创建一个可写流
  const writeStream = fs.createWriteStream(destinationPath);
  
  // 监听 `data` 事件来读取数据块
  readStream.on('data', (chunk) => {
      // 数据块准备好后，写入目标文件
      const isDrainNeeded = writeStream.write(chunk);
      if (!isDrainNeeded) {
          // 如果返回 false，则暂停读取流
          readStream.pause();
  
          // 监听 'drain' 事件，恢复读取流
          writeStream.once('drain', () => {
              readStream.resume();
          });
      }
  });
  
  // 监听读取完成（'end' 事件）
  readStream.on('end', () => {
      writeStream.end(); // 完成写入过程
      console.log('文件复制完成。');
  });
  
  // 错误处理
  readStream.on('error', (err) => {
      console.error('读取文件时发生错误:', err);
      writeStream.end();
  });
  writeStream.on('error', (err) => {
      console.error('写入文件时发生错误:', err);
  });
  
  ```
  
  
  
   
  
   
  
   
  
   

