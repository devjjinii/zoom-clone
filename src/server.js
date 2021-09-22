import http from "http";
import WebSocket from "ws";
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
const server = http.createServer(app); // http server 생성
const wss = new WebSocket.Server({server}); // Ws server 생성 (http 서버 전달 )

function onSocketClose() {
    console.log("Disconnected from Browser XX");
}

function onSocketMessage(message) {
    console.log(message.toString('utf8'));
}

const sockets = [];

// websocket을 이용해 새로운 connection 을 기다림
wss.on("connection", (socket) => {
    sockets.push(socket);
    // console.log(socket);
    console.log("Connected to Browser ~");
    socket.on("close", onSocketClose); 
    socket.on("message", (message) => {
        // 메세지를 구분하여야 함. (message type)
        sockets.forEach(aSocket => aSocket.send(message.toString('utf8')))
    });
});

server.listen(3000, handleListen);