import http from "http";
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

const httpServer = http.createServer(app); // http server 생성
const wsServer = SocketIO(httpServer);

const handleListen = () => console.log(`http://localhost:3000`);
httpServer.listen(3000, handleListen);
