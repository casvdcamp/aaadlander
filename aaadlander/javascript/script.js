const BASE_URL = "http://145.49.127.248:1880/groep4";

let currentCommand = "";
let movementTimeout = null;



const commands = {

    forward: {
        left: 127,   
        right: 255 
    },

    backward: {
        left: 255,   
        right: 127   
    },

    left: {
        left: 255,   
        right: 255   
    },

    right: {
        left: 127,   
        right: 127   
    },

    stop: {
        left: 0,
        right: 0
    }
};

// Verstuur commando naar NodeRED
function sendCommand(command) {

    if (currentCommand === command) return;

    currentCommand = command;

    const values = commands[command];

    const url =
        `${BASE_URL}?digital_output_2=${values.left}&digital_output_3=${values.right}`;

    console.log("Sending:", command);
    console.log(url);

    fetch(url, {
        method: "POST"
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

// Toets indrukken
document.addEventListener("keydown", (event) => {

    if (event.repeat) return;

    const key = event.key.toLowerCase();

    let command = "";

    switch(key) {

        case "w":
            command = "forward";
            break;

        case "s":
            command = "backward";
            break;

        case "a":
            command = "left";
            break;

        case "d":
            command = "right";
            break;

        case " ":
        case "space":
        case "spacebar":
            command = "stop";
            break;


        default:
            return;
    }

    const activeKey = key === " " ? "stop" : key;
    activateKey(activeKey);

    sendCommand(command);



});

document.addEventListener("keyup", (event) => {

    const key = event.key.toLowerCase();

    if (!["w", "a", "s", "d", " "].includes(key)) return;

    deactivateKeys();

    currentCommand = "";
});

// Highlight knop
function activateKey(key) {

    deactivateKeys();

    const keys = document.querySelectorAll(".control-button");

    keys.forEach(k => {

        if (k.textContent.toLowerCase() === key) {
            k.classList.add("active");
        }
    });
}

// Reset alle knoppen
function deactivateKeys() {

    const keys = document.querySelectorAll(".control-button");

    keys.forEach(k => {
        k.classList.remove("active");
    });
}