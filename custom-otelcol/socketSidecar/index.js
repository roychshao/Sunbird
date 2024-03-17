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

    const tracesFilePath = path.join('/var', 'lib', 'otelcol', 'exporter_otlp__traces');
    fs.readFile(tracesFilePath, (err, data) => {
        console.log('trace file path', tracesFilePath);
        if (err) {
            console.error('Error reading log file:', err);
            return;
        }
        socket.on('requestTraces', () => {
            console.log('Received request for traces');
            socket.emit('sendTraces', data);
        })
    })

    const metricsFilePath = path.join('/var', 'lib', 'otelcol', 'exporter_otlp__metrics');
    fs.readFile(metricsFilePath, (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return;
        }
        socket.on('requestMetrics', () => {
            console.log('Received request for metrics');
            socket.emit('sendMetrics', data);
        })
    })

    const logsFilePath = path.join('/var', 'lib', 'otelcol', 'exporter_otlp__logs');
    fs.readFile(logsFilePath, (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return;
        }
        socket.on('requestLogs', () => {
            console.log('Received request for logs');
            socket.emit('sendLogs', data);
        })
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
})
