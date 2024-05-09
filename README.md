# Sunbird-OpenTelemetry

## Objective
> Obtain observability of an application running in kubernetes environment while accessing an externel MySQL with OpenTelemetry and some observability backend.

- take <a href="https://github.com/mybatis/jpetstore-6">jpetstore</a> as application
- Minikube to simulate a kubernetes cluster

## Architechture
* Push style
![Push style architechture](./record/Sunbird-OpenTelemetry-push.png)
* Pull style
![Pull style architechture](./record/Sunbird-Opentelemetry-pull.png)

## Directory
```
.
+-- cluster-configs (Cluster configuration Yaml files)
+-- custom-otelcol
+-- grafanaloki (Grafana docker compose file)
+-- jpetstore-6
+-- mysql
+-- otelcol (Opentelemetry Collector)
+-- prometheus-2.47.0 (Prometheus)
+-- record
+-- socketClient
+-- tomcat
+-- delete.sh
+-- deploy.sh
+-- README.md
```

## Requirements
- Minikube
- Docker (with user in the group 'docker', it is the requirement to run minikube with docker engine)
- Prometheus (Download from https://prometheus.io/download/)
- go (for build gateway otelcol)

## How to run

- ### Clone
```
git clone https://github.com/roychshao/Sunbird.git
```

- ### Modify ./deploy.sh in the root of this directory
> we use environment variable to replace the cluster configs.

in my dockerhub: roychshao, there are two docker images built on amd-64 and arm-64 systems, if your system is the same architechture with these two, just modify image name, else, you have two rebuild docker image in /tomcat directory and modify DOCKERHUB_USERNAME to yours.
```
export DOCKERHUB_USERNAME=roychshao // if your system architechture is amd-64 or arm-64
export IMAGE_NAME=sunbird-ap-amd64 (sunbird-ap-arm64 or yours)
export MYSQL_ADDR=<your ip address>
```

- ### Run Gateway OTelCol
```
cd ./otelcol
(download ocb 0.95.0 from OpenTelemetry doc to here)
./ocb --config=builder-config.yaml
cd otelcol
./otelcol --config=./../config.yaml
```

- ### Running observability backends
in this step, you may need to open several terminals for each backend

- Prometheus:  
> use ./prometheus-2.47.0/prometheus.yml to executes downloaded prometheus binary file
```
./prometheus --config.file=prometheus.yml
```

- Grafana loki
```
cd ./grafanaloki
docker compose up -d
```
don't forget to add loki datasource in grafana and set endpoint to http://loki:3100

- Jaeger
```
docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 4317:6000 \
  -p 4318:6001 \
  -p 14250:14250 \
  -p 14268:14268 \
  -p 14269:14269 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.48
```
- File
```
cd otelcol
```
and you can see the telemetry files under localTelemtry

- ### Start Minikube
```
minikube start
./deploy.sh
minikube service tomcat-service
```

Now the cluster is finished and you can visit them with browser.  
Jpetstore: by minikube service  
Jaeger: http://localhost:16686  
Prometheus: http://localhost:9090  
Grafana: http://localhost:3000  

Finally, close the cluster by
```
./delete.sh
minikube stop
```
