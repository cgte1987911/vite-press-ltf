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
        // 将HTML特殊字符转换成等值的实体
        function escapeHTML(str) {
            var escapeChars = {
                '<': 'lt',
                '>': 'gt',
                '"': 'quot',
                '&': 'amp',
                '\'': '#39'
            };
            return str.replace(new RegExp('[' + Object.keys(escapeChars).join('') + ']', 'g'),
                function (match) {
                    return '&' + escapeChars[match] + ';';
                });
        }
        console.log(escapeHTML('<div>Blah blah blah</div>'));
        // => "&lt;div&gt;Blah blah blah&lt;/div&gt";



        // 实体字符转换为等值的HTML。
        function unescapeHTML(str) {
            var htmlEntities = {
                nbsp: ' ',
                lt: '<',
                gt: '>',
                quot: '"',
                amp: '&',
                apos: '\''
            };
            return str.replace(/\&([^;]+);/g, function (match, key) {
                if (key in htmlEntities) {
                    return htmlEntities[key];
                }
                return match;
            });
        }
        console.log(unescapeHTML('&lt;div&gt;Blah blah blah&lt;/div&gt;'));
        // => "<div>Blah blah blah</div>"
    </script>
</body>

</html>
```