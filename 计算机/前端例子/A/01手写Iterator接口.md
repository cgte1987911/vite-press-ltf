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
        const arr=[1,2,3];
        function iterator(arr){
            let index=0;
            return {
                next:function(){
                    return index<arr.length?
                    {value:arr[index++],done:false}: 
                    {value:undefined,done:true}
                }
            }
        }
        const it=iterator(arr);
        console.log(it.next())
        console.log(it.next())
        console.log(it.next())
        console.log(it.next())
    </script>

    <script>
        const arr2=[1,2,3]
        const set=new Set(['a','b','c'])
        const map=new Map([['a',1],['b',2]])

        const itArr=arr2[Symbol.iterator]();
        const itSet=set[Symbol.iterator]();
        const itMap=map[Symbol.iterator]();

        console.log(itArr.next())
        console.log(itMap.next())
        console.log(itMap.next())
    </script>
</body>
</html>
```