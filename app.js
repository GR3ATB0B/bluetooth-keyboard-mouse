let bleDevice;
let keyboardCharacteristic;

const SERVICE_UUID = '180F'; // Custom service UUID, replace with your actual UUID
const CHARACTERISTIC_UUID = '2A19'; // Custom characteristic UUID, replace with your actual UUID

// Connect to the Nano 33 IoT
document.getElementById('connectButton').addEventListener('click', async () => {
    try {
        bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: [SERVICE_UUID] }]
        });

        const server = await bleDevice.gatt.connect();
        const service = await server.getPrimaryService(SERVICE_UUID);
        keyboardCharacteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

        alert('Connected to Nano 33 IoT!');
    } catch (error) {
        console.error('Bluetooth connection failed!', error);
        alert('Failed to connect to Bluetooth device.');
    }
});

// Handle keyboard input
document.getElementById('keyboardInput').addEventListener('input', async (event) => {
    const text = event.target.value;
    if (keyboardCharacteristic) {
        for (const char of text) {
            await sendKeyboardCommand(char);
        }
    }
    event.target.value = ''; // Clear input after sending
});

// Send keyboard command to Nano 33 IoT
async function sendKeyboardCommand(character) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(character);
        await keyboardCharacteristic.writeValue(data);
        console.log('Sent key:', character);
    } catch (error) {
        console.error('Error sending keyboard command:', error);
    }
}

// Send mouse commands
async function sendMouseCommand(direction) {
    try {
        const commands = {
            'UP': 'MOUSE_UP',
            'DOWN': 'MOUSE_DOWN',
            'LEFT': 'MOUSE_LEFT',
            'RIGHT': 'MOUSE_RIGHT'
        };
        const command = commands[direction];
        const encoder = new TextEncoder();
        const data = encoder.encode(command);
        await keyboardCharacteristic.writeValue(data);
        console.log('Sent mouse command:', direction);
    } catch (error) {
        console.error('Error sending mouse command:', error);
    }
}