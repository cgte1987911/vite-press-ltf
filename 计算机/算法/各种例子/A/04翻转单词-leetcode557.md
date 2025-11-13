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
        let str='hello world ltf\'s dream';
        function reverseWords(str){
            return str.split(' ').map((item)=>{
                return item.split('').reverse().join('')
            }).join(' ')
        }
        function reverseWords2(str){
            return str.split(/\s/g).map((item)=>{
                return item.split('').reverse().join('')
            }).join(' ')
        }
        function reverseWords3(str){
            return str.match(/[\w']+/g).map((item)=>{
                return item.split('').reverse().join('')
            }).join(' ')
        }
        console.log(reverseWords3(str))
    </script>
</body>
</html>
```