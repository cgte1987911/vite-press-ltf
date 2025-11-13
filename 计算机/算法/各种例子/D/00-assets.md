## assets/components/Arrow.js
```js
/**
 * 绘制箭头类
 */

class Arrow {
  constructor(props){
    this.x = 0;
    this.y = 0;
    this.w = 60;
    this.h = 30;
    this.rotation = 0;
    this.fillStyle = 'rgb(57, 119, 224)';
    this.strokeStyle = 'rgba(0, 0, 0, 0)';
    Object.assign(this, props);
    return this;
  }
  createPath(ctx){
    let {w, h} = this;
    ctx.beginPath();
    ctx.moveTo(-w/2, -h/2);
    ctx.lineTo(w/10, -h/2);
    ctx.lineTo(w/10, -h);
    ctx.lineTo(w/2, 0);
    ctx.lineTo(w/10, h);
    ctx.lineTo(w/10, h/2);
    ctx.lineTo(-w/2, h/2);
    ctx.closePath();
    return this;
  }
  render(ctx){
    let {fillStyle, strokeStyle, rotation, x, y} = this;
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    this.createPath(ctx);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return this;
  }
}
```
## assets/components/Ball.js
```js
/**
 * 小球类
 */

class Ball {
  constructor(props){
    this.x = 0;
    this.y = 0;
    this.x3d = 0;
    this.y3d = 0;
    this.z3d = 0;
    this.r = 20;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.strokeStyle = 'rgba(0, 0, 0, 0)';
    this.fillStyle = 'rgb(57, 119, 224)';
    this.alpha = 1;
    Object.assign(this, props);
    return this;
  }
  render(ctx){
    let {x, y, r, scaleX, scaleY, fillStyle, strokeStyle, alpha} = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scaleX, scaleY);
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return this;
  }
  isPoint(pos){
    let {x, y} = pos;
    return this.r >= Math.sqrt((x - this.x)**2 + (y - this.y)**2);
  }
}
```
## assets/components/Box.js
```js

class Box {
  constructor(opt){
    this.x = 0;
    this.y = 0;
    this.w = 100;
    this.h = 100;
    this.vx = 0;
    this.vy = 0;
    this.strokeStyle = 'rgba(0, 0, 0, 0)';
    this.fillStyle = 'rgb(57, 119, 224)';
    this.rotation = 0;
    this.lineWidth = 0;
    Object.assign(this, opt);
    return this;
  }
  render(ctx){
    let {x, y, w, h, lineWidth, strokeStyle, fillStyle, rotation, scale} = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.lineTo(0, 0);
    ctx.lineTo(w, 0);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return this;
  }
  isPoint(mouse){
    let {x, y} = mouse;
    return (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
  }
}
```
## assets/components/Line.js
```js

class Line {
  constructor(props){
    this.x = 0;
    this.y = 0;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.rotation = 0;
    this.strokeStyle = '#000';
    this.lineWidth = 1;
    Object.assign(this, props);
    return this;
  }
  render(ctx){
    let {x, y, x1, y1, x2, y2, rotation, lineWidth, strokeStyle} = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
    return this;
  }
}
```
## assets/script/utils.js
```js
/**
 * canvas一些基本的工具函数
 */

let C = {};

// 获取鼠标在元素上的坐标
C.getOffset = function (ele){
  let mouse = {x: 0, y: 0};
  ele.addEventListener('mousemove', function (e){
    let {x, y} = C.eventWrapper(e);
    mouse.x = x;
    mouse.y = y;
  });
  return mouse;
};

// 坐标系转换
C.eventWrapper = function (ev){
  let {pageX, pageY, target} = ev;
  let {left, top} = target.getBoundingClientRect();
  return {x: pageX - left, y: pageY - top};
};

// 角度转弧度
C.toRad = function (angle){
  return angle * Math.PI / 180
}

// 弧度转角度
C.toAngle = function (rad){
  return rad * 180 / Math.PI
}

// 生成随机数
C.rp = function (arr, int){  // C.rp([10, 20], true)
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const num = Math.random() * (max - min) + min;
  return int ? Math.round(num) : num;
};

// 生成随机颜色
C.createColor = function (){
  return `rgb(${C.rp([55, 255], true)}, ${C.rp([55, 255], true)}, ${C.rp([55, 255], true)})`;
};

// 矩形之间的碰撞检测
C.rectDuang = function (rect1, rect2){ 
  return (rect1.x + rect1.w >= rect2.x && rect1.x <= rect2.x + rect2.w && rect1.y + rect1.h >= rect2.y && rect1.y <= rect2.y + rect2.h);
};

// 求俩点间的距离
C.getDist = function (x1, y1, x2, y2){
  return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);
};

// 对小球进行边界反弹处理
C.checkBallBounce = function (ball, W, H, bounce){
  if(ball.x - ball.r <= 0){
    ball.x = ball.r;
    ball.vx *= bounce;
  }else if(ball.x + ball.r >= W){
    ball.x = W - ball.r;
    ball.vx *= bounce;
  }
  if(ball.y - ball.r <= 0){
    ball.y = ball.r;
    ball.vy *= bounce;
  }else if(ball.y + ball.r >= H){
    ball.y = H - ball.r;
    ball.vy *= bounce;
  }
};


C.checkBallHit = function (b1, b2){
  let dx = b2.x - b1.x;
  let dy = b2.y - b1.y;
  let dist = Math.sqrt(dx**2 + dy**2);
  if(dist < b1.r + b2.r){
    let angle = Math.atan2(dy, dx);
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);
    
    // 以b1为参照物，设定b1的中心点为旋转基点
    let x1 = 0;
    let y1 = 0;
    let x2 = dx * cos + dy * sin;
    let y2 = dy * cos - dx * sin;
    
    // 旋转b1和b2的速度
    let vx1 = b1.vx * cos + b1.vy * sin;
    let vy1 = b1.vy * cos - b1.vx * sin;
    let vx2 = b2.vx * cos + b2.vy * sin;
    let vy2 = b2.vy * cos - b2.vx * sin;
    
    // 求出b1和b2碰撞之后的速度
    let vx1Final = ((b1.m - b2.m) * vx1 + 2 * b2.m * vx2) / (b1.m + b2.m);
    let vx2Final = ((b2.m - b1.m) * vx2 + 2 * b1.m * vx1) / (b1.m + b2.m);
    
    // 处理两个小球碰撞之后，将它们进行归位
    let lep = (b1.r + b2.r) - Math.abs(x2 - x1);
    
    x1 = x1 + (vx1Final < 0 ? -lep/2 : lep/2);
    x2 = x2 + (vx2Final < 0 ? -lep/2 : lep/2);
    
    b2.x = b1.x + (x2 * cos - y2 * sin);
    b2.y = b1.y + (y2 * cos + x2 * sin);
    b1.x = b1.x + (x1 * cos - y1 * sin);
    b1.y = b1.y + (y1 * cos + x1 * sin);
    
    b1.vx = vx1Final * cos - vy1 * sin;
    b1.vy = vy1 * cos + vx1Final * sin;
    b2.vx = vx2Final * cos - vy2 * sin;
    b2.vy = vy2 * cos + vx2Final * sin;
  }
};
```