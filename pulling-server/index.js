import socketIOClient from 'socket.io-client';
const socket = socketIOClient('http://10.97.130.229:3000');
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


var tracesTimestamp = new Date().getTime();
var metricsTimestamp = new Date().toISOString();
var logsTimestamp = new Date().toISOString();

socket.on('connect', () => {
  console.log('Connected to telemetry server');
  rl.on('line', (input) => {
    if (input === 'requestTraces') {
      socket.emit('requestTraces', tracesTimestamp);
    }
    if (input === 'requestMetrics') {
      socket.emit('requestMetrics', metricsTimestamp);
    }
    if (input === 'requestLogs') {
      socket.emit('requestLogs', logsTimestamp);
    }
  });
});

socket.on('sendTraces', (data) => {
    
    tracesTimestamp = data.timestamp;

    data.files.forEach(file => {
        const fileContent = file.content;
        const filePath = path.join('./receivedData/', file.name);

        fs.writeFileSync(filePath, fileContent, (err) => {
            if (err) {
                console.error(`Failed to save file ${file.name}:`, err);
            } else {
                console.log(`File ${file.name} saved successfully.`);
            }
        })
    });
});

socket.on('sendMetrics', (data) => {
  
    metricsTimestamp = data.timestamp;
    var file = data.file;

    const fileContent = file.content;
    const filePath = path.join('./receivedData/', file.name);

    fs.writeFileSync(filePath, fileContent, (err) => {
        if (err) {
            console.error(`Failed to save file ${file.name}:`, err);
        } else {
            console.log(`File ${file.name} saved successfully.`);
        }
    })
});

socket.on('sendLogs', (data) => {

    logsTimestamp = data.timestamp;

    data.files.forEach(file => {
        const fileContent = file.content;
        const filePath = path.join('./receivedData/', file.name);

        fs.writeFileSync(filePath, fileContent, (err) => {
            if (err) {
                console.error(`Failed to save file ${file.name}:`, err);
            } else {
                console.log(`File ${file.name} saved successfully.`);
            }
        })
    });
});

