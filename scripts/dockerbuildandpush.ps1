$USER="yey007"
$IMAGE="transcriberbot"
$VERSION=git log -1 --format=%h
$DATE=git log -1 --format=%cd --date=short
$TAG="${VERSION}--${DATE}--${USER}"
$REGISTRY="hub.docker.com"

docker build -t ${USER}/${IMAGE}:${TAG} -t ${USER}/${IMAGE}:latest .
docker push ${USER}/${IMAGE}