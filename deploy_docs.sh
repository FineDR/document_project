#!/bin/bash

APP_NAME="twendedocs-app"
DOCKER_IMAGE="twendedocs-image"
PROJECT_DIR=$(pwd)

echo "🛠️ Building Docker image..."
docker build -t $DOCKER_IMAGE $PROJECT_DIR

# Stop and remove old container
if [ $(docker ps -a -q -f name=$APP_NAME) ]; then
    echo "🧹 Stopping old container..."
    docker stop $APP_NAME
    docker rm $APP_NAME
fi

echo "🚀 Running new container..."
docker run -d -p 8081:80 --name $APP_NAME $DOCKER_IMAGE

echo "✅ Deployment complete!"
echo "Visit https://twendedocs.twendedigital.tech"
