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
        window.onload = function () {
            var s1 = new Sel("div1");
            s1.add('0', ['1', '2', '3']);
            s1.add('0_0', ['1-1', '1-2', '1-3'])
            s1.add('0_0_0', ['1-1-1', '1-1-2', '1-1-3'])
            s1.add('0_0_1', ['1-2-1', '1-2-2', '1-2-3'])
            s1.add('0_0_2', ['1-3-1', '1-3-2', '1-3-3'])
            s1.add('0_1', ['2-1', '2-2', '2-3'])
            s1.add('0_1_0', ['2-1-1', '2-1-2', '2-1-3'])
            s1.add('0_1_1', ['2-2-1', '2-2-2', '2-2-3'])
            s1.add('0_1_2', ['2-3-1', '2-3-2', '2-3-3'])
            s1.add('0_2', ['3-1', '3-2', '3-3'])
            s1.add('0_2_0', ['3-1-1', '3-1-2', '3-1-3'])
            s1.add('0_2_1', ['3-2-1', '3-2-2', '3-2-3'])
            s1.add('0_2_2', ['3-3-1', '3-3-2', '3-3-3'])
            s1.init(3);
        }

        function Sel(id) {
            this.oParent = document.querySelector('#' + id);
            this.data = {}
            this.aSel = this.oParent.getElementsByTagName("select");
        }
        Sel.prototype = {
            init: function (num) {
                for (let i = 1; i <= num; i++) {
                    let oSel = document.createElement('select');
                    let oPt = document.createElement('option');
                    oPt.innerHTML = '默认'
                    oSel.index = i;
                    oSel.appendChild(oPt);
                    this.oParent.appendChild(oSel);
                    oSel.onchange = () => {
                        this.change(i)
                    }
                }
                this.first()
            },
            add: function (key, value) {
                this.data[key] = value;
            },
            first: function () {
                let arr = this.data['0'];
                for (let i = 0; i < arr.length; i++) {
                    let oPt = document.createElement('option');
                    oPt.innerHTML = arr[i]
                    this.aSel[0].appendChild(oPt);
                }
            },
            change(iNow) {
                let str = '0';
                for (let i = 0; i < iNow; i++) {
                    str += '_' + (this.aSel[i].selectedIndex - 1)
                }
                if (this.data[str]) {
                    let arr = this.data[str]
                    this.aSel[iNow].options.length = 1;
                    for (let i = 0; i < arr.length; i++) {
                        let oPt = document.createElement('option');
                        oPt.innerHTML = arr[i];
                        this.aSel[iNow].appendChild(oPt);
                    }
                    this.aSel[iNow].options[1].selected = true;
                    iNow++;
                    if (iNow < this.aSel.length) {
                        this.change(iNow)
                    }
                }
                else {
                    if (iNow < this.aSel.length)
                        this.aSel[iNow].options.length = 1;
                }
            }
        }
    </script>
    <div id="div1"></div>
</body>

</html>
```