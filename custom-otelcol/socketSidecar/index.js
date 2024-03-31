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

    socket.on('requestTraces', (timestamp) => {

        const directoryPath = path.join('/tmp', 'otelcol/file_exporter');
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error("Could not list the directory.", err);
                return;
            }
            // filter files
            const filteredFiles = files.filter(file => {

                const timestampRegex = /traces-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})\.\d{3}\.json/;
                const match = file.match(timestampRegex);

                if (!match) {
                    return false;
                }

                const fileTimestamp = match[1];
                return fileTimestamp > timestamp;
            });
            // emit with timestamp
            socket.emit('sendTraces', {
                files: filteredFiles,
                timestamp: new Date().toISOString()
            });
        })

        // const tracesFilePath = path.join('/tmp', 'otelcol', 'file_exporter', 'traces.json');
        // fs.readFile(tracesFilePath, (err, data) => {
        //     console.log('trace file path', tracesFilePath);
        //     if (err) {
        //         console.error('Error reading log file:', err);
        //         return;
        //     }
        //     console.log('Received request for traces');
        //     socket.emit('sendTraces', data);
        // })
    })

    socket.on('requestMetrics', (timestamp) => {

        console.log("receive requestMetrics request");
        console.log("timestamp: " + timestamp);
        const directoryPath = path.join('/tmp', 'otelcol/file_exporter');
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error("Could not list the directory.", err);
                return;
            }
            // filter files 
            const filteredFiles = files.filter(file => {

                const timestampRegex = /metrics-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})\.\d{3}\.json/;
                const match = file.match(timestampRegex);

                if (!match) {
                    return false;
                }

                const fileTimestamp = match[1];
                return fileTimestamp > timestamp;
            });
            // emit with timestamp
            console.log("filter process finished, start emitting...");
            console.log(filteredFiles);
            socket.emit('sendTraces', {
                files: filteredFiles,
                timestamp: new Date().toISOString()
            });
        })
        // const metricsFilePath = path.join('/tmp', 'otelcol', 'file_exporter', 'metrics.json');
        // fs.readFile(metricsFilePath, (err, data) => {
        //     if (err) {
        //         console.error('Error reading log file:', err);
        //         return;
        //     }
        //
        //     console.log('Received request for metrics');
        //     socket.emit('sendMetrics', data);
        // })
    })

    socket.on('requestLogs', (timestamp) => {

        const directoryPath = path.join('/tmp', 'otelcol/file_exporter');
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error("Could not list the directory.", err);
                return;
            }
            // filter files
            const filteredFiles = files.filter(file => {

                const timestampRegex = /logs-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})\.\d{3}\.json/;
                const match = file.match(timestampRegex);

                if (!match) {
                    return false;
                }

                const fileTimestamp = match[1];
                return fileTimestamp > timestamp;
            });
            // emit with timestamp
            socket.emit('sendTraces', {
                files: filteredFiles,
                timestamp: new Date().toISOString()
            });
        })

        // const logsFilePath = path.join('/tmp', 'otelcol', 'file_exporter', 'logs.json');
        // fs.readFile(logsFilePath, (err, data) => {
        //     if (err) {
        //         console.error('Error reading log file:', err);
        //         return;
        //     }
        //
        //     console.log('Received request for logs');
        //     socket.emit('sendLogs', data);
        // })
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
})
