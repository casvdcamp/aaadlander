// Open één keer de verbinding
const socketGroep4 = new WebSocket('ws://145.49.127.248:1880/ws/groep4');

// Haal ALLE HTML elementen eenmalig op (met de juiste ID's uit je HTML!)
const pitchElement = document.getElementById('pitch-value');
const rollElement = document.getElementById('roll-value');
const movementStatus = document.getElementById('movementStatus');
const tiltWarning = document.getElementById('tilt-warning');

// Timer om te detecteren wanneer we langer dan 5s geen berichten krijgen
let websocketAliveTimer = null;
const WEBSOCKET_TIMEOUT = 5000; // ms
const ROLL_WARNING = 15; // degrees / percent

function showTiltWarning() {
    if (tiltWarning) {
        tiltWarning.classList.add('active');
    }
}

function hideTiltWarning() {
    if (tiltWarning) {
        tiltWarning.classList.remove('active');
    }
}

function checkTiltWarning(rollValue) {
    const rollNumber = Number(rollValue);

    if (Number.isFinite(rollNumber) && (rollNumber > ROLL_WARNING || rollNumber < -ROLL_WARNING)) {
        showTiltWarning();
    } else {
        hideTiltWarning();
    }
}

function markConnected() {
    if (movementStatus) {
        movementStatus.textContent = 'CONNECTED';
        movementStatus.classList.remove('disconnected');
        movementStatus.classList.add('connected');
    }
}

function markDisconnected() {
    if (movementStatus) {
        movementStatus.textContent = 'NOT CONNECTED';
        movementStatus.classList.remove('connected');
        movementStatus.classList.add('disconnected');
    }
}

function resetWebsocketTimer() {
    // Bij elk bericht markeren we als connected en herstarten de timeout
    markConnected();
    if (websocketAliveTimer) clearTimeout(websocketAliveTimer);
    websocketAliveTimer = setTimeout(() => {
        markDisconnected();
    }, WEBSOCKET_TIMEOUT);
}

socketGroep4.onopen = function(event) {
    console.log('WebSocket connected');
    markConnected();
    // start timer in geval er geen berichten binnenkomen
    resetWebsocketTimer();
};

socketGroep4.onmessage = function(event) {
    console.log('Received message:', event.data);
    try {
        const onderdelen = JSON.parse(event.data);

        // Update de Pitch & Roll (Helling)
        if (onderdelen.gyro_x_2) {
            pitchElement.textContent = onderdelen.gyro_x_2.y;
            rollElement.textContent = onderdelen.gyro_x_2.x;
            checkTiltWarning(onderdelen.gyro_x_2.x);
        } else {
            hideTiltWarning();
        }

        // Reset de 5s timer bij elk ontvangen bericht
        resetWebsocketTimer();
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
};

socketGroep4.onerror = function(error) {
    console.error('WebSocket error:', error);
    markDisconnected();
};

socketGroep4.onclose = function(event) {
    console.log('WebSocket connection closed');
    if (websocketAliveTimer) clearTimeout(websocketAliveTimer);
    markDisconnected();
};



