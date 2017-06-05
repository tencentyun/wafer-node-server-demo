# Wafer 服务端 Demo - Node.js

本项目是 [腾讯云微信小程序服务端 SDK - Node.js](https://github.com/tencentyun/wafer-node-server-sdk) 的使用示例。示例需要和 [微信小程序客户端示例](https://github.com/tencentyun/wafer-client-demo) 配合一起使用。

## 运行示例

按照[小程序创建资源配置指引](https://github.com/tencentyun/weapp-doc)进行操作，可以得到运行本示例所需的资源和服务，其中包括已部署好的示例代码及自动下发的 SDK 配置文件 `/etc/qcloud/sdk.config`。

- 示例代码部署目录：`/data/release/node-weapp-demo`
- 运行示例的 Node 版本：`v4.6.0`
- Node 进程管理工具：`pm2`

## 项目结构

```
Demo
├── README.md
├── app.js
├── business
│   └── chat-tunnel-handler.js
├── config.js
├── globals.js
├── package.json
├── process.json
├── routes
│   ├── index.js
│   ├── welcome.js
│   ├── login.js
│   ├── user.js
│   └── tunnel.js
└── setup-qcloud-sdk.js
```

其中，`app.js` 是 启动文件，`config.js` 配置了启动服务监听的端口号，`process.json` 是运行本示例 的 `pm2` 配置文件。

`setup-qcloud-sdk.js` 用于初始化 SDK 配置，配置从文件 `/etc/qcloud/sdk.config` 中读取。 配置文件包含如下配置项：

```json
{
    "serverHost": "业务服务器的主机名",
    "authServerUrl": "鉴权服务器地址",
    "tunnelServerUrl": "信道服务器地址",
    "tunnelSignatureKey": "和信道服务器通信的签名密钥"
}
```

`routes/` 目录包含了示例用到的4个路由，路由和处理文件映射关系如下：

```
// 首页指引
/ => routes/welcome.js

// 登录
/login => routes/login.js

// 获取微信用户信息
/user => routes/user.js

// 处理信道请求
/tunnel => routes/tunnel.js
```

`business/chat-tunnel-handler.js` 是业务处理信道请求的示例代码。

## 如何在demo基础上进行开发
进入目录 `/data/release/node-weapp-demo`，将写好的代码上传到routes目录下

重启服务：  pm2 restart all


## 更新 SDK 版本

进入目录 `/data/release/node-weapp-demo`，然后先后执行命令 `npm update`、`pm2 restart process.json` 即可。
