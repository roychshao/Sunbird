const socketIOClient = require('socket.io-client');
const socket = socketIOClient('http://10.98.108.84:3000');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on('connect', () => {
  console.log('Connected to telemetry server');
  rl.on('line', (input) => {
    if (input === 'requestTraces') {
      socket.emit('requestTraces');
    }
    if (input === 'requestMetrics') {
      socket.emit('requestMetrics');
    }
    if (input === 'requestLogs') {
      socket.emit('requestLogs');
    }
  });
});

socket.on('sendTraces', (traces) => {
    console.log('Received traces.');
    fs.writeFileSync('./receivedData/exporter_otlphttp__traces', traces, (err) => {
        if (err) {
            console.log(`Error writing traces to file: ${err}`);
        } else {
            console.log('Traces written to file successfully.');
        }
    });
});

socket.on('sendMetrics', (metrics) => {
    console.log('Received metrics.');
    fs.writeFileSync('./receivedData/exporter_otlphttp__metrics', metrics, (err) => {
        if (err) {
            console.log(`Error writing metrics to file: ${err}`);
        } else {
            console.log('Metrics written to file successfully.');
        }
    })
});

socket.on('sendLogs', (logs) => {
    console.log('Received logs.');
    fs.writeFileSync('./receivedData/exporter_otlphttp__logs', logs, (err) => {
        if (err) {
            console.log(`Error writing logs to file: ${err}`);
        } else {
            console.log('Logs written to file successfully.');
        }
    })
});

