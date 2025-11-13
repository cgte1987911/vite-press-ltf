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
        class Promise2 {
            constructor(cb) {
                this.end = false;
                this.err = false;
                this.result = null;

                cb((...args) => {
                    this.end = true;
                    this.err = false;
                    this.result = args;

                    if (this.succ) {
                        this.succ(...args);
                    }
                }, (...args) => {
                    this.end = true;
                    this.err = true;
                    this.result = args;

                    if (this.faild) {
                        this.faild(...args);
                    }
                });
            }

            then(succ, faild) {
                this.succ = succ;
                this.faild = faild;

                if (this.end) {
                    if (this.err) {
                        faild(...this.result);
                    } else {
                        succ(...this.result);
                    }
                }
            }
        }
    </script>
</body>

</html>
```