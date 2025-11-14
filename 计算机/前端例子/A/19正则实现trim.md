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
        //方法一：
        function trim(str) {
            return str.replace(/^\s+|\s+$/g, '');
        }
        console.log(trim(" foobar "));
        // => "foobar"

        //方法二：
        function trim(str) {
            return str.replace(/^\s*(.*?)\s*$/g, "$1");  //.*? 表示匹配任意数量的重复，但是在能使整个匹配成功的前提下使用最少的重复。
        }
        console.log(trim(" foobar "));
        // => "foobar"


    </script>
</body>

</html>
```