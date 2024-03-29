const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log("connection build");

    socket.on('requestTraces', () => {
        const tracesFilePath = path.join('/tmp', 'otelcol', 'file_exporter', 'traces.json');
        fs.readFile(tracesFilePath, (err, data) => {
            console.log('trace file path', tracesFilePath);
            if (err) {
                console.error('Error reading log file:', err);
                return;
            }
            console.log('Received request for traces');
            socket.emit('sendTraces', data);
        })
    })

    socket.on('requestMetrics', () => {
        const metricsFilePath = path.join('/tmp', 'otelcol', 'file_exporter', 'metrics.json');
        fs.readFile(metricsFilePath, (err, data) => {
            if (err) {
                console.error('Error reading log file:', err);
                return;
            }

            console.log('Received request for metrics');
            socket.emit('sendMetrics', data);
        })
    })

    socket.on('requestLogs', () => {
        const logsFilePath = path.join('/tmp', 'otelcol', 'file_exporter', 'logs.json');
        fs.readFile(logsFilePath, (err, data) => {
            if (err) {
                console.error('Error reading log file:', err);
                return;
            }

            console.log('Received request for logs');
            socket.emit('sendLogs', data);
        })
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
})
