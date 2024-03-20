const socketIOClient = require('socket.io-client');
const socket = socketIOClient('http://10.98.102.49:3000');
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
    fs.writeFileSync('./receivedData/traces.json', traces, (err) => {
        if (err) {
            console.log(`Error writing traces to file: ${err}`);
        } else {
            console.log('Traces written to file successfully.');
        }
    });
    console.log('Traces received.')
});

socket.on('sendMetrics', (metrics) => {
    fs.writeFileSync('./receivedData/metrics.json', metrics, (err) => {
        if (err) {
            console.log(`Error writing metrics to file: ${err}`);
        } else {
            console.log('Metrics written to file successfully.');
        }
    })
    console.log('Metrics received.');
});

socket.on('sendLogs', (logs) => {
    fs.writeFileSync('./receivedData/logs.json', logs, (err) => {
        if (err) {
            console.log(`Error writing logs to file: ${err}`);
        } else {
            console.log('Logs written to file successfully.');
        }
    })
    console.log('Logs received.')
});

