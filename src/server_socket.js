import http from "http";
// import WebSocket from "ws";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
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
const wsServer = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true,
    },
});

instrument(wsServer, {
    auth: false,
});

function publicRooms() {
    const {
        sockets: {
            adapter : { sids, rooms },
         },
        } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms; 
}

function countRoom(roomName) {
   return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", socket => {
    // console.log(socket);
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        // console.log(wsServer.sockets.adapter); // 메모리에 존재
        console.log(`Socket Events: ${event}`);
    });

    socket.on("enter_room", (roomName, done) => {
        // console.log(roomName);
        // console.log(socket.id);
        // console.log(socket.rooms);
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
        wsServer.sockets.emit("room_change", publicRooms());

    });

    // 방을 나가기 직전
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
    });

    // disconnecting 전에 발생 
    socket.on("disconnect", () => {
        wsServer.sockets.emit("room_change", publicRooms());
    });

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done(); // 프론트에서 실행
    });

    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(3000, handleListen);
