#!/bin/bash

minikube start --driver=docker --force

minikube addons enable ingress
minikube addons enable ingress-dns

kubectl config set-context minikube --namespace=logistician-app

kubectl get --all-namespaces pod

eval $(minikube docker-env)