// [模块]
var http = require('http'),
	url = require('url');

var respondIndexPage = require('./respondIndexPage').respondIndexPage,
	respondResource = require('./respondResource').respondResource;

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
		redirectToIndex();
	} else if ('/index' === pathname) {
		respondIndexPage(reqUrl, req, res);
	} else if (/^\/res\//.test(pathname)) {
		respondResource(reqUrl, req, res);
	} else {
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