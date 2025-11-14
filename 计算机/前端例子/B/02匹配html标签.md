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
        var regex = /<([^>]+)>[\d\D]*<\/\1>/;
        var string1 = "<title>regular expression</title>";
        var string2 = "<p>laoyao bye bye</p>";
        var string3 = "<title>wrong!</p>";
        console.log(regex.test(string1)); // true
        console.log(regex.test(string2)); // true
        console.log(regex.test(string3)); // false
    </script>
</body>

</html>
```