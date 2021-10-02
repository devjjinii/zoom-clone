const messageList =document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");
// socketIO 와 호환이 안됨
const socket = new WebSocket(`ws://${window.location.host}`); // websocket API 브라우저가 제공


function makeMessage(type, payload) {
    const msg = {type, payload};
    return JSON.stringify(msg);
}

function handleOpen() {
    console.log("Connected to Server ~");
}

socket.addEventListener("open", handleOpen);

socket.addEventListener("message", (message) => {
    // console.log("New message: ", message.data);
    const li = document.createElement("li");
    li.innerText = message.data;
    messageList.append(li);
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server XX");
});

// setTimeout(() => {
//     socket.send("hello from the browser!");
// }, 10000);

function handleSubmit(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value)); // 클라이언트에서 서버로 보냄
    console.log(input.value);
    input.value = "";
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);