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
        // console.log(socket.id);
        // console.log(socket.rooms);
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");

    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye"));
    });

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", msg);
        done(); // 프론트에서 실행
    });
});

httpServer.listen(3000, handleListen);
