## 01-模拟基本的三维环境.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title></title>
  <style>
    canvas {
      background-color: #000;
    }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script src="../assets/script/utils.js"></script>
  <script src="../assets/components/Ball.js"></script>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    let W = canvas.width = 800;
    let H = canvas.height = 600;
    
    let x = 0, y = 0, z = 0;
    let hx = W/2, hy = H/2;
    let f1 = 200;
    
    const ball = new Ball({
      r: 80
    });
    
    let mouse = C.getOffset(canvas);
    
    window.addEventListener('keydown', function (e){
      let keyCode = e.keyCode;
      if(keyCode === 38) z += 5;
      if(keyCode === 40) z -= 5;
    });
    
    (function drawFrame(){
      window.requestAnimationFrame(drawFrame);
      ctx.clearRect(0, 0, W, H);
      
      if(z > -f1){
        let scale = f1 / (f1 + z);
        
        x = mouse.x - hx;
        y = mouse.y - hy;
        
        ball.scaleX = ball.scaleY = scale;
        
        ball.x = hx + x*scale;
        ball.y = hy + y*scale;
        
        ball.show = true;
      }else{
        ball.show = false;
      }
      
      ball.show && ball.render(ctx);
    })();
    
  </script>
</body>
</html>
```
## 02-三维环境下的简单动画.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title></title>
  <style>
    html, body {
      height: 100%;
      overflow: hidden;
      margin: 0;
    }
    canvas {
      background-color: #000;
    }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script src="../assets/script/utils.js"></script>
  <script src="../assets/components/Ball.js"></script>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    
    let balls = [], num = 200, g = 0.2, bounce = -0.8, floor = 300;
    let f1 = 250, hx = W/2, hy = H/2;
    
    const ballColor = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
    ballColor.addColorStop(0, "rgb(255, 255, 255)");
    ballColor.addColorStop(0.3, "rgba(0, 255, 240, 1)");
    ballColor.addColorStop(0.5, "rgba(0, 240, 255, 1)");
    ballColor.addColorStop(0.8, "rgba(0, 110, 255, 0.8)");
    ballColor.addColorStop(1, "rgba(0, 0, 0, 0.2)");
    
    for(let i=0; i<num; i++){
      balls.push(new Ball({
        y3d: -200,
        r: 10,
        fillStyle: ballColor,
        vx: C.rp([-6, 6]),
        vy: C.rp([-3, -6]),
        vz: C.rp([-5, 5])
      }))
    }
    
    function move(ball){
      ball.vy += g;
      ball.x3d += ball.vx;
      ball.y3d += ball.vy;
      ball.z3d += ball.vz;
      
      if(ball.y3d > floor){
        ball.y3d = floor;
        ball.vy *= bounce;
      }
      if(ball.z3d > -f1){
        const scale = f1 / (f1 + ball.z3d);
        ball.scaleX = ball.scaleY = scale;
        ball.x = hx + ball.x3d * scale;
        ball.y = hy + ball.y3d * scale;
        ball.show = true;
      }else{
        ball.show = false;
      }
    }
    
    function draw(ball){
      ball.show && ball.render(ctx);
    }
    
    function zSort(a, b){
      return b.z3d - a.z3d;
    }
    
    (function drawFrame(){
      window.requestAnimationFrame(drawFrame);
      ctx.clearRect(0, 0, W, H);
      
      balls.forEach(move);
      balls.sort(zSort);
      balls.forEach(draw);
    })();
    
  </script>
</body>
</html>
```
## 03-3d动画星海.html 
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title></title>
  <style>
    html, body {
      height: 100%;
      overflow: hidden;
      margin: 0;
    }
    canvas {
      background-color: #000;
    }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script src="../assets/script/utils.js"></script>
  <script src="../assets/components/Ball.js"></script>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    let W, H, hx, hy, f1 = 250, particles = [], maxZ = 1200, f = 0.8;
    
    const ballColor = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
    ballColor.addColorStop(0, "rgb(255, 255, 255)");
    ballColor.addColorStop(0.3, "rgba(0, 255, 240, 1)");
    ballColor.addColorStop(0.5, "rgba(0, 240, 255, 1)");
    ballColor.addColorStop(0.8, "rgba(0, 110, 255, 0.8)");
    ballColor.addColorStop(1, "rgba(0, 0, 0, 0.2)");
    
    window.onresize = function (){
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      hx = W/2;
      hy = H/2;
      createParticles( W * H / 3200);
    };
    
    function createParticles(num){
      if(particles.length !== num){
        particles = [];
      }
      for(let i=0; i<num; i++){
        particles.push(new Ball({
          x3d: C.rp([-1.5*W, 2*W]),
          y3d: C.rp([-1.5*H, 2*H]),
          z3d: C.rp([0, maxZ]),
          r: 10,
          fillStyle: ballColor,
          vz: C.rp([-2, 2]),
          // az: C.rp([-2, -1])
          az: C.rp([1, 2])
        }))
      }
    }
    
    window.onresize();
    
    function move(p){
      p.vz += p.az;
      p.vz *= f;
      p.z3d += p.vz;
      
      if(p.z3d < -f1){
        p.z3d += maxZ;
      }
      
      if(p.z3d > maxZ - f1){
        p.z3d -= maxZ;
      }
      
      let scale = f1 / (f1 + p.z3d);
      p.scaleX = p.scaleY = scale;
      p.x = hx + p.x3d * scale;
      p.y = hy + p.y3d * scale;
      p.alpha = Math.min(Math.abs(scale)*1.5, 1);
    }
    
    function draw(p){
      p.render(ctx);
    }
    
    function zSort(a, b){
      return b.z3d - a.z3d;
    }
    
    (function drawFrame(){
      window.requestAnimationFrame(drawFrame);
      ctx.clearRect(0, 0, W, H);
      
      particles.forEach(move);
      particles.forEach(zSort);
      particles.forEach(draw);
    })();
    
  </script>
</body>
</html>
```