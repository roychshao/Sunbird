import socketIOClient from 'socket.io-client';
import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { exec } from 'child_process';


const getServiceIP = function() {
    return new Promise((resolve, reject) => {
        exec('kubectl get svc otelcol-deployment-service -o json', (err, stdout) => {
            if (err) {
                console.error(`exec error: ${err}`);
                reject(err);
            }
            const serviceInfo = JSON.parse(stdout);
            var serviceIP = serviceInfo.spec.clusterIP;
            resolve(serviceIP);
        });
    });
}

getServiceIP().then((serviceIP) => {

    // create socket with serviceIP
    const socket = socketIOClient(`http://${serviceIP}:3000`);

    // create readline interface
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // initialized timestamp with now
    var tracesTimestamp = new Date().toISOString();
    var metricsTimestamp = new Date().toISOString();
    var logsTimestamp = new Date().toISOString();

    // on connected, start receive requests from readline
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

    // on received traces
    socket.on('sendTraces', (data) => {

        console.log(`received ${data.file.name} from ${serviceIP}`);
        tracesTimestamp = data.timestamp;
        var file = data.file;

        const fileContent = file.content;
        const filePath = path.join('/receivedData/', file.name);

        fs.writeFileSync(filePath, fileContent, (err) => {
            if (err) {
                console.error(`Failed to save file ${file.name}:`, err);
            } else {
                console.log(`File ${file.name} saved successfully.`);
            }
        })
    });

    // on received metrics
    socket.on('sendMetrics', (data) => {

        console.log(`received ${data.file.name} from ${serviceIP}`);
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

    // on received logs
    socket.on('sendLogs', (data) => {

        console.log(`received ${data.file.name} from ${serviceIP}`);
        logsTimestamp = data.timestamp;
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
})
