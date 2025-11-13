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
        var twoSum = function (nums, target) {
            let hash = {}
            for (let i = 0; i < nums.length; i++) {
                let temp=hash[target - nums[i]];
                console.log(temp,target - nums[i])
                if (hash[target - nums[i]]!==undefined) {
                    return [hash[target - nums[i]], i]
                } else {
                    hash[nums[i]] = i
                }
            }
        };
        console.log(twoSum([2, 7, 11, 15],9))
    </script>
</body>

</html>
```