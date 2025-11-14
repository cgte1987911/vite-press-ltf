## input.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="input.css">
</head>
<body>
    <div class="wrapper">
        <div class="input-data">
            <input type="text" required>
            <div class="underline">

            </div>
            <label>用户名：</label>
        </div>
        <div class="input-data" style="margin-top:30px;">
            <input type="password" required>
            <div class="underline">

            </div>
            <label>密码：</label>
        </div>
    </div>

</body>
</html>
```
## input.css 
```css
*{
    margin:0;
    padding:0;
    outline:none;
    box-sizing:border-box;
    font-family: 'Poppins',sans-serif;
}

body{
    display:flex;
    align-items:center;
    justify-content:center;
    min-height:100vh;
    background:linear-gradient(-135deg,#c850c0,#4158d0)
}
.wrapper{
    width:450px;
    background:#fff;
    padding:30px;
    box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
}

.wrapper .input-data{
    height:40px;
    width:100%;
    position:relative;
}
.wrapper .input-data input{
    height:100%;
    width:100%;
    border:none;
    font-size:17px;
    border-bottom:2px solid silver;
}
.input-data input:focus ~ label,
.input-data input:valid ~ label
{
    transform:translateY(-20px);
    font-size:15px;
    color:#4158d0;
}
.wrapper .input-data label{
    position:absolute;
    bottom:10px;
    left:0;
    color:grey;
    pointer-events:none;
    transition:all 0.3s ease
}

.wrapper .input-data .underline{
    position: absolute;
    bottom:0;
    height:2px;
    width:100%;
}
.input-data .underline:before{
    position:absolute;
    content:'';
    height:100%;
    width:100%;
    background:#4158d0;
    transform:scaleX(0);
    transition:transform 0.3s ease;
}
.input-data input:focus ~ .underline:before
{
    transform:scaleX(1)

}
```
