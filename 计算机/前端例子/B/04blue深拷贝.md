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
        function clone(data){
            if(typeof data=='symbol'){
                return Symbol.for(data.description);
            }else if(typeof data!='object'){
                return data;
            }else if(data instanceof Array){
                return data.map(item=>clone(item));
            }else if(data.constructor==Object){
                let res={};
                for(let key in data){
                    res[key]=clone(data[key]);
                }
                return res;
            }else {
                return new data.constructor(data);
            }
        }
    </script>
</body>
</html>
```