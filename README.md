# Sunbird-OpenTelemetry (resilient)

## Objective
> The resilient telemetry delivery solution for Sunbird-OpenTelemetry

- take <a href="https://github.com/mybatis/jpetstore-6">jpetstore</a> as application
- Minikube to simulate a kubernetes cluster

## Architechture
![architechture](./record/Sunbird-OpenTelemetry-resilient.png)

## Directory
```
.
+-- cluster-configs (Cluster configuration Yaml files) 
+-- custom-otelcol (custom collectors which deployed inside the cluster)
+-- grafanaloki (Grafana docker compose file)
+-- jpetstore-6
+-- mysql (dockerfile for mysql)
+-- otelcol (Opentelemetry Collector)
+-- prometheus-2.47.0 (Prometheus)
+-- record
+-- delete.sh
+-- deploy.sh
+-- README.md
```

## Run
* same with master branch
If you want to see how resilient telemetry delivery solution works, please reference https://youtu.be/SLh5qw-7hXs
