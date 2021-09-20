const messageList =document.querySelector("ul");
const messageForm = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`);

function handleOpen() {
    console.log("Connected to Server ~");
}

socket.addEventListener("open", handleOpen);

socket.addEventListener("message", (message) => {
    console.log("New message: ", message.data);
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
    socket.send(input.value); // 클라이언트에서 서버로 보냄

    console.log(input.value);
}

messageForm.addEventListener("submit", handleSubmit);