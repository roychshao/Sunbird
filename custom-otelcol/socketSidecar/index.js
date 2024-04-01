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

                var fileTimestamp = match[1];
                let count = 0;
                fileTimestamp = fileTimestamp.replace(/-/g, function(match) {
                    count++;
                    return (count > 2) ? ":" : match;
                });
                return fileTimestamp > timestamp;
            });
            
            // read file
            filteredFiles.forEach(file => {
                const fileContent = fs.readFileSync(path.join(directoryPath, file), 'utf8');
                socket.emit('sendTraces', {
                    file: {
                        name: file,
                        content: fileContent,
                    },
                    timestamp: new Date().toISOString(),
                })
            })
        })
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

                var fileTimestamp = match[1];
                let count = 0;
                fileTimestamp = fileTimestamp.replace(/-/g, function(match) {
                    count++;
                    return (count > 2) ? ":" : match;
                });
                return fileTimestamp > timestamp;
            });

            console.log("filteredFiles are: ", filteredFiles);
            // read file
            filteredFiles.forEach(file => {
                const fileContent = fs.readFileSync(path.join(directoryPath, file), 'utf8');
                console.log("start emitting: ", file);
                console.log("content: ", fileContent);
                socket.emit('sendMetrics', {
                    file: {
                        name: file,
                        content: fileContent,
                    },
                    timestamp: new Date().toISOString(),
                })
            })
        })
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

                var fileTimestamp = match[1];
                let count = 0;
                fileTimestamp = fileTimestamp.replace(/-/g, function(match) {
                    count++;
                    return (count > 2) ? ":" : match;
                });
                return fileTimestamp > timestamp;
            });

            // read file
            filteredFiles.forEach(file => {
                const fileContent = fs.readFileSync(path.join(directoryPath, file), 'utf8');
                socket.emit('sendLogs', {
                    file: {
                        name: file,
                        content: fileContent,
                    },
                    timestamp: new Date().toISOString(),
                })
            })
        })
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
})
