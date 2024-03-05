kubectl delete deployment tomcat
kubectl delete deployment otelcol-deployment
kubectl delete daemonset otelcol-daemonset
kubectl delete service tomcat-service
kubectl delete service mysqlagent
kubectl delete service otelcol-deployment-service
kubectl delete service otelcol-daemonset-service
# helm delete otel-daemonset
# helm delete otel-deployment

docker stop mysql_node
docker rm mysql_node
