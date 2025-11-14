## 1高阶函数.html
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
        //写了一个业务代码，扩展当前业务代码
        function say(a,b){
            console.log('say',a,b)
        }

        //给某个方法，添加一个方法在他之前执行调用
        Function.prototype.before=function(callback){
            return (...args)=>{
                callback()
                this(...args)
            }
        }

        let beforeSay=say.before(function(){
            console.log('before say')
        })
        beforeSay('hello','world');

    </script>
    
</body>
</html>
```
## 2柯里化.html
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
        /* 
            判断变量的类型
            常用的判断类型的方法有四种：
            1.typeof 不能判断对象类型 typeof [] typeof {}
            2.constructor 可以找到这个变量是通过谁构造出来的
            3.instanceof 判断谁是谁的实例 __protp__
            4.Object.prototype.toString.call() 缺陷就是不能细分谁是谁的实例
        */

        function isType(type){
            return function(value){
                return Object.prototype.toString.call(value)===`[object ${type}]`;
            }
        }
        let isArray=isType('Array')
        console.log(isArray([]))
        console.log(isArray('hello'))


        const currying=(fn,arr=[])=>{
            let len=fn.length;
            return function(...args){
                arr=[...arr,...args]
                if(arr.length<len){
                    return currying(fn,arr)
                }else{
                    return fn(...arr)
                }
            }
        }
        function sum(a,b,c,d,e,f){
            return a+b+c+d+e+f
        }
        let r=currying(sum)(1,2)(3,4)(5)(6)
        console.log(r)
        </script>
</body>
</html>
```