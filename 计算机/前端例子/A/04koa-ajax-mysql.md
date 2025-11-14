## app.js
```js
const Koa = require('koa')
const static = require('koa-static')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const bcryptjs = require("bcryptjs")
const basicAuth = require("basic-auth")
const jwt = require('jsonwebtoken')
const mysql = require('mysql2/promise');
const app = new Koa()
app.use(static('./www'))
app.use(bodyParser())
let router = new Router()
app.use(router.routes())
console.log(bcryptjs.hashSync('123456',bcryptjs.genSaltSync(15)))
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rbac',
    waitForConnections: 10,
    connectionLimit: 10,
    queueLimit: 0
})



class Auth {
    constructor() {
        Auth.USER = 8
        Auth.ADMIN = 16
        Auth.SUPER_ADMIN = 32
    }
    get m() {
        return async (ctx, next) => {
            let userToken = basicAuth(ctx.req)
            let decode = jwt.verify(userToken.name, config.secretKey)
            ctx.auth = {
                uid: decode.uid,
                scope: decode.scope
            }
            await next();
        }
    }
}

function generateToken(uid, scope) {
    return jwt.sign({
        uid, scope
    }, config.secretKey, {
        expiresIn: config.expiresIn
    })
}
const config = {
    secretKey: '1987911',
    expiresIn: 60 * 60
}

router.get('/login', async (ctx, next) => {
    let uname = ctx.query.username
    let passw = ctx.query.password
    if (uname == 'dreamneverdie') {
        if (bcryptjs.compareSync(passw, '$2a$15$5Qa8Kcvkqfory8DX6b.nDO/tN67YR7LlfcX3/7FoY53IR8BeG/B8u')) {
            ctx.body = {
                msg: 'success',
                token: generateToken(uname, Auth.SUPER_ADMIN)
            }
        } else {
            ctx.body = {
                msg: 'pw_err'
            }
        }
    }
    else {
        ctx.body = {
            msg: 'account_err'
        }
    }
})

router.post('/permission', new Auth().m, async (ctx, next) => {
    if (ctx.auth.scope == Auth.SUPER_ADMIN) {
        let rows = await pool.query(`select *from user where id=${39}`)
        console.log(rows[0])
        ctx.body = {

            msg: '1',
            rows
        }
    } else {
        ctx.body = {
            msg: '0'
        }
    }
})

app.listen(3000)

```
## test.html
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
    <form>
        账号：<input type="text"/><br>
        密码：<input type="text"/><br>
        <input type="button" value="登录"/>
        <input type='button' value="权限"/>
    </form>
    <script>
        window.onload=function(){
            let loginBtn=document.querySelectorAll('input[type=button]')[0]
            let permissionBtn=document.querySelectorAll('input[type=button]')[1]
            let token=''
            loginBtn.onclick=function(){
                ajax({
                    url:'/login',
                    data:{
                        username:document.querySelectorAll('input[type=text]')[0].value,
                        password:document.querySelectorAll('input[type=text]')[1].value
                    },
                    success(res){
                        let data=JSON.parse(res)
                        if(data.msg=='success'){
                            console.log('登录成功')
                            token=data.token
                        }else if(data.msg=='pw_err'){
                            console.log('密码错误')
                        }else{
                            console.log('账号错误')
                        }
                    },
                    fail(err){
                        console.log(err)
                    }
                })
            }
            permissionBtn.onclick=function(){
                ajax({
                    method:'post',
                    url:'/permission',
                    header:{
                        contentType:'application/json',
                        authorization:'Basic '+btoa(token+':')
                    },
                    success(res){
                        let data=JSON.parse(res)
                        console.log(data)
                        if(data.msg=='1'){
                            console.log(data.rows)
                        }else{
                            console.log('权限不足')
                        }
                    },
                    fail(err){
                        console.log(err)
                    }
                })
            }
        }
        function ajax(config){
            function json2url(json){
                let arr=[]
                for(let key in json){
                    arr.push(key+'='+json[key])
                }
                return arr.join('&')
            }
            return new Promise((resolve,reject)=>{
                let method=!config.method||config.method=='get'?'get':config.method
                let xhr=new XMLHttpRequest()
                xhr.open(method,config.url+'?'+json2url(config.data),true)
                for(let key in config.header){
                    xhr.setRequestHeader(key,config.header[key])
                }
                switch(method){
                    case 'get':
                        xhr.send();
                        break;
                    case 'post':
                        xhr.send(JSON.stringify(config.data))
                }
                xhr.onreadystatechange=function(){
                    if(xhr.readyState==4){
                        if(xhr.status>=200&&xhr.status<300||xhr.status==304){
                            config.success&&config.success(xhr.responseText)
                            resolve(xhr.responseText)
                        }else{
                            config.fail&&config.fail(xhr.statusText)
                            reject(xhr.statusText)
                        }
                    }
                }
            })
        }
    </script>

</body>
</html>
```