#!/bin/bash

kubectl apply -f ./postgres/postgres.deployment.yaml
kubectl apply -f ./postgres/postgres.service.yaml

kubectl apply -f ./redis/redis.deployment.yaml
kubectl apply -f ./redis/redis.service.yaml

kubectl apply -f ./logistician/logistician.config-map.yaml
kubectl apply -f ./logistician/logistician.deployment.yaml
kubectl apply -f ./logistician/logistician.service.yaml
kubectl apply -f ./logistician/logistician.ingress.yaml
