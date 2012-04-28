var http = require('http');
var port    = process.argv[2] || 8080;
var url     = require("url");
var path    = require("path");
var fs      = require("fs");
var sio = require('./node_modules/socket.io/lib/socket.io');
var log = require('./xserver/log.js');
var util = require('./xserver/util.js');

String.prototype.startsWith = function(str) {
    return (this.match("^"+str)==str);
}

String.prototype.endsWith = function(str) {
    return (this.match(str+"$")==str)
}

var mime_types = {
        "txt"   : "text/plain",
        "html"  : "text/html",
        "json"  : "application/json",
        "js"    : "application/javascript",
        "jpg"   : "image/jpeg",
        "png"   : "image/png",
        "css"   : "text/css"
};

function get_cont_type(sfile)
{
    var chunks = sfile.split('.');
    var end = chunks.pop();

    for (var key in mime_types)
    {
        if (key == end)
            return mime_types[key];
    }
    return "text/plain";
}

/*function static_handler(request, response)
{
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);

    path.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) 
            filename += 'xmain/index.html';

        var stype = get_cont_type(filename);

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {        
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write('[ERROR]' + err + "\n");
                response.end();
                return;
            }

            //send the static file
            log.quicklog('[main]send static file : '+uri+' ['+stype+']\n');
            log.quicklog('[main]uri = '+uri);
            log.quicklog('[main]filename = '+filename);

            response.writeHead(200, {"Content-Type": stype });
            response.write(file, "binary");
            response.end();
        });
    });
}*/

function static_handler(request, response)
{
    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);

    path.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) 
            filename += 'index.html';

        var stype = get_cont_type(filename);

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {        
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write('[ERROR]' + err + "\n");
                response.end();
                return;
            }

            //send the static file
            log.quicklog('[main]send static file : '+uri+' ['+stype+']\n');
            log.quicklog('[main]uri = '+uri);
            log.quicklog('[main]filename = '+filename);

            response.writeHead(200, {"Content-Type": stype });
            response.write(file, "binary");
            response.end();
        });
    });
}

function handler_menu(request, response)
{
    //var uri = url.parse(request.url).pathname;
	var uri = '/xmain/xmenu';
    var filename = path.join(process.cwd(), uri);
    
    var content_type = request.headers['content-type'];
    log.quicklog("content_type="+content_type);
    if (!content_type || !(content_type).startsWith("application/json")){
    	log.quicklog("invalid request : content_type="+content_type);
    	response.end();
        return;
    }

    request.setEncoding('utf8');
    var sdata="";

    request.on('data', function(chunk) {
    	log.quicklog("request.on[data] : chunk="+chunk);
    	sdata += chunk;
    });
    
    request.on('end', function() {
    	if (!sdata || sdata.length==0)
    		return util.jdeny(request, response, 'bad json');
    	var r = JSON.parse(sdata);
        if (!r)
            return util.jdeny(request, response, "bad json");
        
        if(r.action == 'menu_main'){
        	log.quicklog("request.on[end] : r.action="+r.action);
        	log.quicklog("request.on[end] : r.menu_id="+r.menu_id);
        }
        
        if(r.action == 'menu_main'){
        	var job = {"action":"menu_main", "status":"success"};
        	util.jsend(response, job)
        	return;
        	
        }
        
    });

    
    
    
    /*path.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) 
            filename += '/index.html';

        var stype = get_cont_type(filename);

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {        
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write('[ERROR]' + err + "\n");
                response.end();
                return;
            }

            //send the static file

            log.quicklog('[menu--]send static file : '+uri+' ['+stype+']\n');
            log.quicklog('[menu--]uri = '+uri);
            log.quicklog('[menu--]filename = '+filename);

            response.writeHead(200, {"Content-Type": stype });
            response.write(file, "binary");
            response.end();
        });
    });*/
}

var app = http.createServer(function (req, res) {
	var uri = url.parse(req.url).pathname;
	log.quicklog("Events server running on uri : " + uri );
	/*if(uri == '/'){
		static_handler(req, res);
	}else{
		if (uri.startsWith("/xmain"))
	    {
			static_handler(req, res);
	    }else if(uri.startsWith("/go_menu")){
	    	handler_menu(req, res);
	    }
	}*/
	if(uri.startsWith("/")){
		static_handler(req, res);
	}

	return;
}).listen(parseInt(port, 10));
log.quicklog("Events server running on port : " + port );

//===================web socket======================
var io = sio.listen(app)
, nicknames = {};

io.sockets.on('connection', function (socket) {
socket.on('user message', function (msg) {
  socket.broadcast.emit('user message', socket.nickname, msg);
});

socket.on('nickname', function (nick, fn) {
  if (nicknames[nick]) {
    fn(true);
  } else {
    fn(false);
    nicknames[nick] = socket.nickname = nick;
    socket.broadcast.emit('announcement', nick + ' connected');
    io.sockets.emit('nicknames', nicknames);
  }
});

socket.on('disconnect', function () {
  if (!socket.nickname) return;

  delete nicknames[socket.nickname];
  socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
  socket.broadcast.emit('nicknames', nicknames);
});
});








