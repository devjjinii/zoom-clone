import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";

const app = express();

//view 설정
app.set("view engine","pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

//router 설정
app.get("/", (req,res) => res.render("home"));
app.get("/*", (req,res) => res.redirect("/")); //home만 사용

const handleListen = () => console.log(`http://localhost:3000`);
// app.listen(3000, handleListen);


// 아래와 같이 하는 이유 : 같은 포트에 두개의 서버를 띄우기 위해
const httpServer = http.createServer(app); // http server 생성
// const wss = new WebSocket.Server({server}); // Ws server 생성 (http 서버 전달 )
const wsServer = SocketIO(httpServer);

wsServer.on("connection", socket => {
    // console.log(socket);
    socket.onAny((event) => {
        console.log(`Socket Events: ${event}`);
    });

    socket.on("enter_room", (roomName, done) => {
        // console.log(roomName);
        console.log(socket.id);
        socket.join(roomName);
        console.log(socket.rooms);
        done();

        // setTimeout(() => {
        //     done("hello from the backend"); // 백에서 프론트의코드를 실행 --> 보안문제, backendDone을 실행
        // },10000);
    });
})

/* function onSocketClose() {
    console.log("Disconnected from Browser XX");
}

function onSocketMessage(message) {
    console.log(message.toString('utf8'));
}

const sockets = [];
// websocket을 이용해 새로운 connection 을 기다림
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    // console.log(socket);
    console.log("Connected to Browser ~");
    socket.on("close", onSocketClose); 
    socket.on("message", (msg) => {  // 메세지를 구분하여야 함. (message type)
        const message = JSON.parse(msg);
        switch (message.type) {
            case "new_message" :
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
                break;
            case "nickname" :
                socket["nickname"] = message.payload;
                // console.log(message.payload);
                break;
        }

    });
}); */

httpServer.listen(3000, handleListen);
