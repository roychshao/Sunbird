# start mysql_node
docker build -t mysql_node ./mysql
docker run -d -p 3306:3306 --name mysql_node mysql_node

# kubectl apply -f ./cluster-configs/tomcat-configmap.yaml
export DOCKERHUB_USERNAME=roychshao
export IMAGE_NAME=sunbird-ap-amd64
# docker inspect -f '{{.NetworkSettings.IPAddress}}' mysql_node
# export MYSQL_ADDR=$(docker inspect -f '{{.NetworkSettings.IPAddress}}' mysql_node)
export MYSQL_ADDR=192.168.101.128
export EXTERNAL_OTELCOL_ADDR=192.168.101.128

envsubst < ./cluster-configs/mysqlagent.yaml | kubectl apply -f -
envsubst < ./cluster-configs/tomcat.yaml | kubectl apply -f -
# helm install otel-daemonset open-telemetry/opentelemetry-collector --values ./open-telemetry/daemonset.yaml
# helm install otel-deployment open-telemetry/opentelemetry-collector --values ./open-telemetry/deployment.yaml
envsubst < ./cluster-configs/otelcol-deployment.yaml | kubectl apply -f -
envsubst < ./cluster-configs/otelcol-daemonset.yaml | kubectl apply -f -
