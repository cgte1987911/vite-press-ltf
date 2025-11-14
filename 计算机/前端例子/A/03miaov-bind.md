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
        Function.prototype.miaovBind=function(argThis,...args){
            let self=this
            let Bound= function(...list){
                self.apply(argThis,[...args,...list])
            }
            Bound.prototype=Object.create(self.prototype)
            return Bound;
        }
        function test(...args){
            console.log(this)
            console.log(...args)
        }
        test.prototype.miaov=function(){
            console.log('miaov')
        }
        let fun1=test.bind({a:1},1,2,3,4,5)
        fun1(6,7,8)
        console.log('------------')
        let fun2=test.miaovBind({a:1},1,2,3,4,5)
        fun2(6,7,8)
        console.log('-------------')
        let obj1=new fun1()
        let obj2=new fun2()
        obj1.miaov()
        obj2.miaov()

    </script>
</body>
</html>
```