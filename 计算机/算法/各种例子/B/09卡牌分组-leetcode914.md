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
        function hasGroupsSizeX(arr){
            let group=[]
            let tmp={}
            arr.forEach(item=>{
                tmp[item]=tmp[item]?tmp[item]+1:1
            })
            for(let v of Object.values(tmp)){
                group.push(v)
            }

            let gcd=(a,b)=>{
                if(b===0){
                    return a;
                }else{
                    return gcd(b,a%b)
                }
            }
            while(group.length>1){
                let a=group.shift()
                let b=group.shift()
                let v=gcd(a,b)
                if(v===1){
                    return false;
                }else{
                    group.unshift(v)
                }
            }
            return group.length?group[0]>1:false
        }

        console.log(hasGroupsSizeX([1,2,1,1,2,2]))
    </script>
</body>
</html>
```