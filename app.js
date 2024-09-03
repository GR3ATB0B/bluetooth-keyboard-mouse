let bluetoothDevice;
let keyCharacteristic;

document.getElementById('connect').addEventListener('click', async () => {
    try {
        bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ services: ['19b10000-e8f2-537e-4f6c-d104768a1214'] }]
        });

        const server = await bluetoothDevice.gatt.connect();
        const service = await server.getPrimaryService('19b10000-e8f2-537e-4f6c-d104768a1214');
        keyCharacteristic = await service.getCharacteristic('19b10001-e8f2-537e-4f6c-d104768a1214');

        console.log('Connected to Arduino');
    } catch (error) {
        console.error('Connection failed', error);
    }
});

document.getElementById('leftClick').addEventListener('click', () => {
    sendCommand('left_click');
});

document.getElementById('rightClick').addEventListener('click', () => {
    sendCommand('right_click');
});

document.getElementById('keyboardInput').addEventListener('input', (event) => {
    const inputValue = event.target.value;
    if (inputValue) {
        sendCommand('key_' + inputValue);
        event.target.value = ''; // Clear input after sending
    }
});

async function sendCommand(command) {
    if (keyCharacteristic) {
        try {
            await keyCharacteristic.writeValue(new TextEncoder().encode(command));
            console.log(`Command sent: ${command}`);
        } catch (error) {
            console.error('Error sending command', error);
        }
    } else {
        console.error('No characteristic found. Please connect first.');
    }
}
