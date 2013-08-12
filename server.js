// [模块]
var http = require('http'),
	url = require('url');

var respondIndexPage = require('./respondIndexPage').respondIndexPage,
	respondResource = require('./respondResource').respondResource,
	respondTag = require('./respondTag').respondTag;

// [变量]
var server;

// [流程]
server = http.createServer();
server.on('request', onRequest);
server.on('error', onError);
server.listen(80);

// [函数]
function onRequest(req, res) {
	var reqUrl = url.parse(req.url, true),
		pathname = reqUrl.pathname;

	if ('/' === pathname) {
		// 重定向到首页
		redirectToIndex();
	} else if ('/tag' === pathname) {
		// 标记，用于实现自动刷新
		respondTag(reqUrl, req, res);
	} else if ('/index' === pathname) {
		// 首页
		respondIndexPage(reqUrl, req, res);
	} else if (/^\/res\//.test(pathname)) {
		// 返回资源文件
		respondResource(reqUrl, req, res);
	} else {
		// 未找到
		notFound();
	}

	function redirectToIndex() {
		res.statusCode = 301;
		res.setHeader('Location', '/index');
		res.end();
	}

	function notFound() {
		res.statusCode = 404;
		res.end();
	}
}

function onError(err) {
	console.log(err.toString());
}