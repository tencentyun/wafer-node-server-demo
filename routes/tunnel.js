'use strict';

const TunnelService = require('qcloud-weapp-server-sdk').TunnelService;
const ChatTunnelHandler = require('../business/chat-tunnel-handler');

module.exports = (req, res) => {
    let handler = new ChatTunnelHandler();
    TunnelService.create(req, res).handle(handler, {
        'checkLogin': true,
    });
};