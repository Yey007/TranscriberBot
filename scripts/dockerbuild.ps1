$USER="Yey007"
$IMAGE="transcriberbot"
$VERSION=git log -1 --format=%h
$DATE=git log -1 --format=%cd --date=short
$TAG="${IMAGE}:${VERSION}--${DATE}--${USER}"

docker build ./ -t $TAG