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
        function clone(obj){
            let vv=null
            if(typeof obj=='object'&&obj!==null){
                 vv=obj instanceof Array?[]:{}
                for(let v in obj){
                    vv[v]=clone(obj[v])
                }
            }else{
                return obj
            }
            return vv
        }

        let obj1=[1,{
            str:'234',
            key:{
                attr:'abc',
                attr2:'fdsg'
            },
            fn(){
                console.log(123)
            }
        }]
    let obj2=clone(obj1)
    obj1.str="1987"
    obj1.key="911"
    console.log(obj2)

    </script>
</body>
</html>
```