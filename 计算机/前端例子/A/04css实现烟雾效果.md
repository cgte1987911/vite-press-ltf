```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        *{
            margin:0;
            padding:0;
            box-sizing:border-box;
            font-family:sans-serif;
        }
        section{
            position:relative;
            display:flex;
            justify-content:center;
            align-items:center;
            min-height:100vh;
            background:#111;
            overflow:hidden;
        }
        section .text{
            position:relative;
            color:#fff;
            margin:40px;
            max-width:800px;
            user-select:none;
        }
        section .text span{
            position:relative;
            display:inline-block;
            cursor:pointer;

        }
        section .text span.active{
            animation:smoke 2s linear forwards;
            transform-origin:bottom;
        }
        @keyframes smoke{
            0%{
                opacity:1;
                filter:blur(0);
                transform:translateX(0) translateY(0) rotate(0deg) scale(1);
            }
            50%{
                opacity:1;
                pointer-events:none;
            }
            100%{
                opacity:0;
                filter:blur(20px);
                transform:translateX(300px) translateY(-300px) rotate(720deg)
                scale(4);
            }
        }
    </style>
</head>

<body>
    <section>
        <p class="text">
            Enroll My Course : Next Level CSS Animation and Hover Effects
            https://www.udemy.com/course/css-hove...​

            Another Course : Build Complete Real World Responsive Websites from Scratch
            https://www.udemy.com/course/complete...​
            ------------------
            Join Our Channel Membership And Get Source Code of My New Video's Everyday!
            Join : https://www.youtube.com/channel/UCbwX...​
            ------------------

            Source Code : https://www.patreon.com/onlinetutorials​
            Facebook Page : https://www.facebook.com/onlinetutori...​
            Instagram : https://www.instagram.com/onlinetutor...​
            Twitter : https://twitter.com/OnlineTutoria16​
            Website : http://www.onlinetutorialsweb.com​

            Buy Me A Coffee : https://www.buymeacoffee.com/onlineTu...
        </p>
        <script>
            let text=document.querySelector('.text');
            text.innerHTML=text.textContent.replace(/\S/g,"<span>$&</span>")

            const letters=document.querySelectorAll('span')
            for(let i=0;i<letters.length;i++){
                letters[i].addEventListener("mouseover",function(){
                    letters[i].classList.add('active')
                })
            }
        </script>
    </section>
</body>

</html>
```