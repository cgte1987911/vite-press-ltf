### 自动化部署

1. 在服务器上准备项目目录并配置 SSH（让服务器能从 Gitee 拉取）

   - 登录服务器，创建目录并切换到部署用户（示例 deploy）

     - `sudo useradd -m -s /bin/bash deploy || true`

     - `sudo mkdir -p /var/www/ltf-todo-list`

     - `sudo chown deploy:deploy /var/www/ltf-todo-list`

     - `sudo su - deploy`

     - `cd ~`

     - ```bash
       # 生成 SSH key（回车接受默认）
       ssh-keygen -t rsa -b 4096 -C "deploy@$(hostname)"
       # 把公钥内容复制到 Gitee 仓库设置 -> Deploy Keys（勾选 Write 权限）或你的账户 SSH keys
       cat ~/.ssh/id_rsa.pub
       ```

2. 在仓库中（或 /var/www/ltf-todo-list）创建 deploy.sh（部署脚本）

   - `git clone git@gitee.com:dreamneverdie/ltf-todo-list.git /var/www/ltf-todo-list`

3. 在仓库中（或 /var/www/ltf-todo-list）创建 deploy.sh（部署脚本）

   - ```bash
     # filepath: /var/www/ltf-todo-list/server/deploy.sh
     #!/usr/bin/env bash
     set -e
     APP_DIR="/var/www/ltf-todo-list"
     FRONT_DIR="$APP_DIR/front/todo-list-front"
     SERVER_DIR="$APP_DIR/server"
     
     echo "[deploy] starting at $(date)"
     
     # 后端：安装依赖并重启 pm2
     cd "$SERVER_DIR"
     npm ci --production || npm install --production
     pm2 restart ltf-todo-backend || pm2 start index.js --name ltf-todo-backend --cwd "$SERVER_DIR"
     
     # 前端：构建并复制到 nginx 指定目录（如果 repo 包含源代码需要构建）
     cd "$FRONT_DIR"
     npm ci
     npm run build -- --base /todo-list/ --mode production
     
     sudo mkdir -p /usr/share/nginx/html/blog/todo-list
     sudo rm -rf /usr/share/nginx/html/blog/todo-list/*
     sudo cp -r dist/* /usr/share/nginx/html/blog/todo-list/
     sudo chown -R nginx:nginx /usr/share/nginx/html/blog/todo-list || true
     
     # reload nginx
     sudo nginx -t && sudo	nginx -s reload
     
     echo "[deploy] finished at $(date)"
     ```

   - `chmod +x /var/www/ltf-todo-list/server/deploy.sh`

4. 在服务器上添加一个简单的 webhook 接收器（Node），放在 tools 目录：

   - ```javascript
     // filepath: /var/www/ltf-todo-list/tools/webhook-server.js
     const http = require('http');
     const { exec } = require('child_process');
     const SECRET = process.env.GITEE_WEBHOOK_SECRET || 'replace_with_secret';
     const REPO_DIR = '/var/www/ltf-todo-list';
     
     function run(cmd, cb) {
       exec(cmd, { cwd: REPO_DIR, maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
         console.log('> CMD:', cmd);
         if (stdout) console.log('STDOUT:', stdout);
         if (stderr) console.log('STDERR:', stderr);
         cb(err, stdout, stderr);
       });
     }
     
     const server = http.createServer((req, res) => {
       if (req.method !== 'POST' || req.url !== '/gitee-webhook') {
         res.statusCode = 404; res.end('Not found'); return;
       }
       const token = req.headers['x-gitee-token'] || req.headers['x-git-token'] || '';
       if (!token || token !== SECRET) {
         res.statusCode = 401; res.end('Unauthorized'); return;
       }
     
       let body = '';
       req.on('data', chunk => body += chunk);
       req.on('end', () => {
         console.log('[webhook] payload received');
         // 拉取最新代码并执行 deploy 脚本
         run('git reset --hard HEAD && git pull origin master', (err) => {
           if (err) {
             console.error('git pull failed', err);
             res.statusCode = 500; res.end('git pull failed');
             return;
           }
           run('bash server/deploy.sh >> server/deploy.log 2>&1', (err2) => {
             if (err2) {
               console.error('deploy failed', err2);
               res.statusCode = 500; res.end('deploy failed');
               return;
             }
             res.statusCode = 200; res.end('ok');
           });
         });
       });
     });
     
     const PORT = process.env.WEBHOOK_PORT || 9000;
     server.listen(PORT, '127.0.0.1', () => {
       console.log(`Webhook server listening on http://127.0.0.1:${PORT}/gitee-webhook`);
     });
     ```

   - 安装依赖并用 pm2 启动监听器（在 /var/www/ltf-todo-list/tools）

     ```bash
     cd /var/www/ltf-todo-list/tools
     # 初始化并确保 node 可用
     npm init -y
     # 本示例不需要额外包，只用 Node 内置 http
     # 启动并守护
     export GITEE_WEBHOOK_SECRET='your_secret_here'
     pm2 start webhook-server.js --name gitee-webhook --cwd /var/www/ltf-todo-list/server/tools --env production
     pm2 save
     ```
     
   - 将 webhook 路由接入 nginx（把请求代理到本地监听端口）

     ```bash
         location = /gitee-webhook {
             proxy_pass http://127.0.0.1:9000/gitee-webhook;
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
         }
     ```
     
     
     
   - 添加缺失的 sudo 权限

     ```bash
     # 切换到 root
     sudo su -
     # 删除旧文件
     rm -f /etc/sudoers.d/deploy
     # 更新 sudoers 配置，添加 nginx -s reload
     cat > /etc/sudoers.d/deploy << 'EOF'
     deploy ALL=(ALL) NOPASSWD: /usr/sbin/nginx -t
     deploy ALL=(ALL) NOPASSWD: /usr/sbin/nginx -s reload
     deploy ALL=(ALL) NOPASSWD: /bin/systemctl reload nginx
     deploy ALL=(ALL) NOPASSWD: /bin/systemctl status nginx
     deploy ALL=(ALL) NOPASSWD: /bin/mkdir
     deploy ALL=(ALL) NOPASSWD: /bin/rm
     deploy ALL=(ALL) NOPASSWD: /bin/cp
     deploy ALL=(ALL) NOPASSWD: /bin/chown
     EOF
     
     # 设置权限
     chmod 440 /etc/sudoers.d/deploy
     
     # 验证语法
     visudo -c
     ```

   - 重载 nginx：`sudo nginx -t && sudo nginx -s reload`

   

5. 在 Gitee 仓库设置 Webhook

   - 进入仓库 -> 设置 -> 服务钩子（或 Webhook）
   - 添加 webhook 地址： [https://www.ltf.cool/gitee-webhook](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-browser/workbench/workbench.html)
   - 在 Secret/Token 填入你在服务器上设置的 SECRET（上面示例为 GITEE_WEBHOOK_SECRET）
   - 选择触发事件：Push events（推送事件）

6. 测试流程

   - 本地 push 到 Gitee

   - 在服务器查看 pm2 日志：

     ```bash
     pm2 logs gitee-webhook --lines 200
     # deploy 脚本日志
     tail -n 200 /var/www/ltf-todo-list/server/deploy.log
     # 后端 pm2 日志
     pm2 logs ltf-todo-backend --lines 200
     ```

   - 也可以用 curl 模拟 Gitee 触发：

     - `curl -v -H "X-Gitee-Token: your_secret_here" -X POST https://www.ltf.cool/gitee-webhook -d '{}'`

7. fdas





