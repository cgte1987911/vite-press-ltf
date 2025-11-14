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
        var regex = /^[a-zA-Z]:\\([^\\:*<>|"?\r\n/]+\\)*([^\\:*<>|"?\r\n/]+)?$/;
        console.log(regex.test("F:\\study\\javascript\\regex\\regular expression.pdf"));
        console.log(regex.test("F:\\study\\javascript\\regex\\"));
        console.log(regex.test("F:\\study\\javascript"));
        console.log(regex.test("F:\\"));
        // => true
        // => true
        // => true
        // => true
    </script>
</body>

</html>
```