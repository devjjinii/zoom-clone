const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function showRoom() {
    // console.log(`backend says : ${msg}`);
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;

}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    // emit의 마지막 argument => callback function
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = ""
}

form.addEventListener("submit", handleRoomSubmit);