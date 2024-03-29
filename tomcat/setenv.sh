#
#    Copyright 2010-2023 the original author or authors.
#
#    Licensed under the Apache License, Version 2.0 (the "License");
#    you may not use this file except in compliance with the License.
#    You may obtain a copy of the License at
#
#       https://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS,
#    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#    See the License for the specific language governing permissions and
#    limitations under the License.
#

export CATALINA_OPTS="$CATALINA_OPTS -javaagent:/usr/local/tomcat/bin/opentelemetry-javaagent.jar"
export OTEL_RESOURCE_ATTRIBUTES=service.name=jpetsotre-tomcat-amd64

# export OTEL_INSTRUMENTATION_grpc_ENABLED=false
# export OTEL_INSTRUMENTATION_okhttp_ENABLED=false
# export OTEL_INSTRUMENTATION_servlet_ENABLED=false
# export OTEL_INSTRUMENTATION_spring_boot_ENABLED=false
export OTEL_METRIC_EXPORT_INTERVAL=1000
export OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=http://otelcol-deployment-service:4317
export OTEL_EXPORTER_OTLP_METRICS_ENDPOINT=http://otelcol-deployment-service:4317
export OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=http://otelcol-deployment-service:4317
export OTEL_TRACES_EXPORTER=otlp
export OTEL_METRICS_EXPORTER=otlp
export OTEL_LOGS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_PROTOCOL=grpc
# use otelcol to be the backend, default is the one I want
# export OTEL_TRACES_EXPORTER=jaeger
# export OTEL_EXPORTER_JAEGER_ENDPOINT=http://localhost:14250/api/traces
# export OTEL_EXPORTER_JAEGER_SERVICE_NAME=jpetstore-tomcat
