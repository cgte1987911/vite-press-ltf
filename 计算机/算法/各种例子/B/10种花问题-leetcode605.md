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
        /*         假设有一个很长的花坛，一部分地块种植了花，另一部分却没有。可是，花不能种植在相邻的地块上，它们会争夺水源，两者都会死去。
                   给你一个整数数组  flowerbed 表示花坛，由若干 0 和 1 组成，其中 0 表示没种植花，1 表示种植了花。另有一个数 n ，
                   能否在不打破种植规则的情况下种入 n 朵花？能则返回 true ，不能则返回 false。
         */
        function canPlaceFlowers(flowerbed, n) {
            let arr = flowerbed
            let max = 0
            // 右边界补充[0,0,0],最后一块地能不能种只取决于前面的是不是1，所以默认最后一块地的右侧是0（无须考虑右侧边界有阻碍）（LeetCode测试用例）
            arr.push(0)
            for (let i = 0, len = arr.length - 1; i < len; i++) {
                if (arr[i] === 0) {
                    if (i === 0 && arr[1] === 0) {
                        max++
                        i++
                    } else if (arr[i - 1] === 0 && arr[i + 1] === 0) {
                        max++ 
                        i++
                    }
                }
            }
            return max >= n
        }
        console.log(canPlaceFlowers([1, 0, 0, 0, 0], 2))
    </script>
</body>

</html>
```