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
        function countBinarySubstrings(str) {
            let r = []
            for (let i = 0; i < str.length - 1; i++) {
                let sub = match(str.slice(i))
                if (sub)
                    r.push(sub)
            }
            return r;
            function match(str) {
                let j = str.match(/^(0+|1+)/)[0]
                let o = (j[0] ^ 1).toString().repeat(j.length)
                let reg = new RegExp(`^(${j}${o})`)
                if (reg.test(str))
                    return RegExp.$1;
            }
        }
    </script>
</body>

</html>
```