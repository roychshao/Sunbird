kubectl apply -f tomcat-configmap.yaml
kubectl apply -f mysqlagent.yaml
kubectl apply -f tomcat.yaml
helm install otel-daemonset open-telemetry/opentelemetry-collector --values ./open-telemetry/daemonset.yaml
helm install otel-deployment open-telemetry/opentelemetry-collector --values ./open-telemetry/deployment.yaml
