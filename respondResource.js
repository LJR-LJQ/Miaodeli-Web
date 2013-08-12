exports.respondResource = respondResource;

var fs = require('fs'),
	path = require('path');

var resDir = path.resolve(__dirname, 'resource');

function respondResource(reqUrl, req, res) {
	var fileName = getFileName(reqUrl.pathname);
	if (!fileName) {
		notFound();
		return;
	}

	fs.readdir(resDir, onReadDirCb);

	function onReadDirCb(err, fileList) {
		if (err) {
			notFound();
			return;
		}

		if (fileList.indexOf(fileName) !== -1) {
			respondFile();
		} else {
			notFound();
		}
	}

	function getFileName(pathname) {
		var match = /^\/res\/([^$]+)$/.exec(pathname);
		if (match) {
			return match[1];
		} else {
			return false;
		}
	}

	function respondFile() {
		var fileNameAbs = path.resolve(resDir, fileName);

		// 获得文件长度
		fs.lstat(fileNameAbs, onLstatCb);

		function onLstatCb(err, stat) {
			var readStream;

			// 开始发送文件
			res.setHeader('Content-Length', stat.size);
			res.setHeader('Content-Type', guessMIME(path.extname(fileName)));
		
			readStream = fs.createReadStream(fileNameAbs);
			readStream.pipe(res);
		}
	}

	function notFound() {
		res.statusCode = 404;
		res.end();
	}
}

function guessMIME(ext) {
	switch(ext) {
		case '.css':
			return 'text/css';
		case '.js':
			return 'text/javascript';
		default:
			return 'application/octet-stream';
	}
}