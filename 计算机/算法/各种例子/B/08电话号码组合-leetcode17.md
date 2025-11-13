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
        function letterCombation(str){
            if(str.length<1) return []
            let map=['',1,'abc','def','ghi','jkl','mno','pqrs','tuv','wxyz']
            if(str.length<2) return map[str].split('')

            let num=str.split('')
            let code=[]
            num.forEach(item=>{
                if(map[item]){
                    code.push(map[item])
                }
            })
            let comb=(arr)=>{
                let tmp=[]
                for(let i=0;i<arr[0].length;i++){
                    for(let j=0;j<arr[1].length;j++)
                        tmp.push(`${arr[0][i]}${arr[1][j]}`)
                }
                arr.splice(0,2,tmp)
                if(arr.length>1){
                    comb(arr)
                }else{
                    return tmp
                }
                return arr[0]
            }
            return comb(code)
        }
        console.log(letterCombation('23'))
    </script>
</body>
</html>
```