const socketIOClient = require('socket.io-client');
const socket = socketIOClient('http://10.107.148.125:3000');
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
    const tracesJson = JSON.stringify(traces);
    fs.writeFileSync('traces.json', tracesJson, 'utf8', (err) => {
        if (err) {
            console.log(`Error writing traces to file: ${err}`);
        } else {
            console.log('Traces written to file successfully.');
        }
    });
});

socket.on('sendMetrics', (metrics) => {
    console.log('Received metrics.');
    const metricsJson = JSON.stringify(metrics);
    fs.writeFileSync('metrics.json', metricsJson, 'utf8', (err) => {
        if (err) {
            console.log(`Error writing metrics to file: ${err}`);
        } else {
            console.log('Metrics written to file successfully.');
        }
    })
});

socket.on('sendLogs', (logs) => {
    console.log('Received logs.');
    const logsJson = JSON.stringify(logs);
    fs.writeFileSync('logs.json', logsJson, 'utf8', (err) => {
        if (err) {
            console.log(`Error writing logs to file: ${err}`);
        } else {
            console.log('Logs written to file successfully.');
        }
    })
});

