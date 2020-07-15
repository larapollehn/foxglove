const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://buchling.larapollehn.de',
            "logLevel": "debug",
            changeOrigin: true,
        })
    );
};
