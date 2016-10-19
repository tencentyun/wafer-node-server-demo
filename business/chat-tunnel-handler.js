'use strict';

const TunnelService = require('qcloud-weapp-server-sdk').TunnelService;

/**
 * 调用 TunnelService.broadcast() 进行广播
 * @param  {String} type    消息类型
 * @param  {String} content 消息内容
 */
const $broadcast = (type, content) => {
    TunnelService.broadcast(connectedTunnelIds, type, content)
        .then(result => {
            let invalidTunnelIds = result.data && result.data.invalidTunnelIds || [];

            if (invalidTunnelIds.length) {
                debug('检测到无效的信道 IDs =>', invalidTunnelIds);

                // 从`userMap`和`connectedTunnelIds`中将无效的信道记录移除
                invalidTunnelIds.forEach(tunnelId => {
                    delete userMap[tunnelId];

                    let index = connectedTunnelIds.indexOf(tunnelId);
                    if (~index) {
                        connectedTunnelIds.splice(index, 1);
                    }
                });
            }
        });
};

/**
 * 调用 TunnelService.closeTunnel() 关闭信道
 * @param  {String} tunnelId 信道ID
 */
const $close = (tunnelId) => {
    TunnelService.closeTunnel(tunnelId);
};

// 保存 WebSocket 信道对应的用户
// 在实际的业务中，应该使用数据库进行存储跟踪，这里作为示例只是演示其作用
let userMap = {};

// 保存 当前已连接的 WebSocket 信道ID列表
let connectedTunnelIds = [];

/**
 * 实现 WebSocket 信道处理器
 * 本示例配合客户端 Demo 实现一个简单的聊天室功能
 */
class ChatTunnelHandler {
    /**
     * 实现 onRequest 方法
     * 在客户端请求 WebSocket 信道连接之后，
     * 会调用 onRequest 方法，此时可以把信道 ID 和用户信息关联起来
     */
    onRequest(tunnelId, userInfo) {
        debug(`${this.constructor.name} [onRequest] =>`, { tunnelId, userInfo });

        if (typeof userInfo === 'object') {
            // 保存 信道ID => 用户信息 的映射
            userMap[tunnelId] = userInfo;
        }
    }

    /**
     * 实现 onConnect 方法
     * 在客户端成功连接 WebSocket 信道服务之后会调用该方法，
     * 此时通知所有其它在线的用户当前总人数以及刚加入的用户是谁
     */
    onConnect(tunnelId) {
        debug(`${this.constructor.name} [onConnect] =>`, { tunnelId });

        if (tunnelId in userMap) {
            connectedTunnelIds.push(tunnelId);

            $broadcast('people', {
                'total': connectedTunnelIds.length,
                'enter': userMap[tunnelId],
            });
        } else {
            debug(`Unknown tunnelId(${tunnelId}) was connectd, close it`);
            $close(tunnelId);
        }
    }

    /**
     * 实现 onMessage 方法
     * 客户端推送消息到 WebSocket 信道服务器上后，会调用该方法，此时可以处理信道的消息。
     * 在本示例，我们处理 `speak` 类型的消息，该消息表示有用户发言。
     * 我们把这个发言的信息广播到所有在线的 WebSocket 信道上
     */
    onMessage(tunnelId, type, content) {
        debug(`${this.constructor.name} [onMessage] =>`, { tunnelId, type, content });

        switch (type) {
        case 'speak':
            if (tunnelId in userMap) {
                $broadcast('speak', {
                    'who': userMap[tunnelId],
                    'word': content.word,
                });
            } else {
                $close(tunnelId);
            }
            break;

        default:
            // ...
            break;
        }
    }

    /**
     * 实现 onClose 方法
     * 客户端关闭 WebSocket 信道或者被信道服务器判断为已断开后，
     * 会调用该方法，此时可以进行清理及通知操作
     */
    onClose(tunnelId) {
        debug(`${this.constructor.name} [onClose] =>`, { tunnelId });

        if (!(tunnelId in userMap)) {
            debug(`${this.constructor.name} [onClose][Invalid TunnelId]=>`, tunnelId);
            $close(tunnelId);
            return;
        }

        const leaveUser = userMap[tunnelId];
        delete userMap[tunnelId];

        const index = connectedTunnelIds.indexOf(tunnelId);
        if (~index) {
            connectedTunnelIds.splice(index, 1);
        }

        // 聊天室没有人了（即无信道ID）不再需要广播消息
        if (connectedTunnelIds.length > 0) {
            $broadcast('people', {
                'total': connectedTunnelIds.length,
                'leave': leaveUser,
            });
        }
    }
}

module.exports = ChatTunnelHandler;