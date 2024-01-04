# kubectl apply -f ./cluster-configs/tomcat-configmap.yaml
kubectl apply -f ./cluster-configs/mysqlagent.yaml
kubectl apply -f ./cluster-configs/tomcat.yaml
helm install otel-daemonset open-telemetry/opentelemetry-collector --values ./open-telemetry/daemonset.yaml
helm install otel-deployment open-telemetry/opentelemetry-collector --values ./open-telemetry/deployment.yaml
