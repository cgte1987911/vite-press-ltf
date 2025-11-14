```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- 
        1.任何容器元素都可以用flex特性，行内元素用display:inline-flex
        2.设为flex元素后，子级元素的float,clear,vertical-align属性消失
     -->
</head>
<style>
    .wrap1{display:flex;flex-wrap:wrap;}
    .wrap1 div{width:500px;border:1px solid red;}


    .wrap2{display:flex;margin-top:100px;justify-content:center}
    .wrap2 div{width:500px;border:1px solid black;}

    .wrap3{display:flex;margin-top:100px;align-items:center;border:1px solid red;}
    .wrap3 div{width:500px;border:1px solid blue;}
    .wrap3 div:nth-of-type(1){height:300px;}
    .wrap3 div:nth-of-type(2){height:500px;}
    .wrap3 div:nth-of-type(3){height:200px;}

    .wrap4{display:flex;flex-direction:column;height:500px;align-items:center;justify-content:center;border:1px solid #ccc;margin-top:100px;}
    .wrap4 div{width:500px;height:50px;border:1px solid black;}

</style>
<body>
    <div class="wrap1">
        <div>1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
        <div>8</div>
        <div>9</div>
    </div>

    <div class="wrap2">
        <div>1</div>
        <div>2</div>
        <div>3</div>
    </div>

    <div class="wrap3">
        <div>1</div>
        <div>2</div>
        <div>3</div>
    </div>

    <div class="wrap4">
        <div>1</div>
        <div>2</div>
        <div>3</div>
    </div>
</body>
</html>
```