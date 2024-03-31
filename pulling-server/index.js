import socketIOClient from 'socket.io-client';
const socket = socketIOClient('http://10.103.7.125:3000');
import fs from 'fs';
import readline from 'readline';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// TODO: file format wrong, file.content and file.name undefined.
// TODO: make the timestamp transmitted be little later

var tracesTimestamp = new Date().getTime();
var metricsTimestamp = new Date().toISOString();
var logsTimestamp = new Date().toISOString();

socket.on('connect', () => {
  console.log('Connected to telemetry server');
  rl.on('line', (input) => {
    if (input === 'requestTraces') {
      socket.emit('requestTraces', new Date().toISOString());
    }
    if (input === 'requestMetrics') {
      socket.emit('requestMetrics', new Date().toISOString());
    }
    if (input === 'requestLogs') {
      socket.emit('requestLogs', new Date().toISOString());
    }
  });
});

socket.on('sendTraces', (data) => {
    
    tracesTimestamp = data.timestamp;

    data.files.forEach(file => {
        const fileContent = Buffer.from(file.content, 'base64');
        const filePath = path.join('./receivedData/', file.name);

        fs.writeFileSync(filePath, fileContent, (err) => {
            if (err) {
                console.error(`Failed to save file ${file.name}:`, err);
            } else {
                console.log(`File ${file.name} saved successfully.`);
            }
        })
    });
    // fs.writeFileSync('./receivedData/traces.json', traces, (err) => {
    //     if (err) {
    //         console.log(`Error writing traces to file: ${err}`);
    //     } else {
    //         console.log('Traces written to file successfully.');
    //     }
    // });
    // console.log('Traces received.')
});

socket.on('sendMetrics', (data) => {
  
    console.log("receive sendMetrics response");
    console.log(data);
    metricsTimestamp = data.timestamp;

    data.files.forEach(file => {
        console.log(file);
        const fileContent = Buffer.from(file.content, 'base64');
        const filePath = path.join('./receivedData/', file.name);

        fs.writeFileSync(filePath, fileContent, (err) => {
            if (err) {
                console.error(`Failed to save file ${file.name}:`, err);
            } else {
                console.log(`File ${file.name} saved successfully.`);
            }
        })
    });

    // fs.writeFileSync('./receivedData/metrics.json', metrics, (err) => {
    //     if (err) {
    //         console.log(`Error writing metrics to file: ${err}`);
    //     } else {
    //         console.log('Metrics written to file successfully.');
    //     }
    // })
    // console.log('Metrics received.');
});

socket.on('sendLogs', (data) => {

    logsTimestamp = data.timestamp;

    data.files.forEach(file => {
        const fileContent = Buffer.from(file.content, 'base64');
        const filePath = path.join('./receivedData/', file.name);

        fs.writeFileSync(filePath, fileContent, (err) => {
            if (err) {
                console.error(`Failed to save file ${file.name}:`, err);
            } else {
                console.log(`File ${file.name} saved successfully.`);
            }
        })
    });

    // fs.writeFileSync('./receivedData/logs.json', logs, (err) => {
    //     if (err) {
    //         console.log(`Error writing logs to file: ${err}`);
    //     } else {
    //         console.log('Logs written to file successfully.');
    //     }
    // })
    // console.log('Logs received.')
});

