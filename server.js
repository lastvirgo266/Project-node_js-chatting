// server.js



var express = require('express');
var app = express();
var http = require('http').Server(app); 
var io = require('socket.io')(http);    
var path = require('path');

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {  
  res.render('chat');
});


//connection은 socket.io의 기본 이벤트임(웹사이트를 열면 자동적으로 발생하는 이벤트)
//connection 안에 각 이벤트를 작성할때는 socket.on('EVENT 이름', 함수) 형식으로 작성하면됨(변수전달가능)

//socket.emit은 event를 발생시키는 함수, 이렇게 서버쪽에서 이벤트를 발생시키면 클라이언트 페이지의 해당 이벤트 리스너에서 처리하게됨(socket.emit을 이용하면 해당 socket을 통해 상대편으로 전달, io.emit을 이용하면 서버가 현재 접속해있는 모든 클라이언트에게 이벤트 전달)

var count=1;
var name_list = [];

io.on('connection', function(socket){ 
  	console.log('user connected: ', socket.id);  
  	var name = "익명" + count++;                 
	socket.name = name;
	name_list.push(name);
  	io.to(socket.id).emit('create name', name);   
	io.emit('new_connect', name);
	io.emit('print name_list', name_list);
	socket.on('disconnect', function(){ 
	  console.log('user disconnected: '+ socket.id + ' ' + socket.name);
	  io.emit('new_disconnect', socket.name);
	});
	
	

	socket.on('send message', function(name, text){ 
		var msg = name + ' : ' + text;
		if(name != socket.name)
			io.emit('change name', socket.name, name);
		
			for(var i=0; i<name_list.length; i++){
				console.log(name_list[i]);
				if(name_list[i] == socket.name){
					name_list[i] = name;
				}
			}
		
		socket.name = name;
    	console.log(msg);
		console.log(name_list);
    	io.emit('receive message', msg);
		io.emit('print name_list', name_list)
	});
	
});

http.listen(3000, function(){ 
	console.log('server on..');
});
