#!/bin/bash
set -e

# 带时间的日志输出
log() {
  echo -e "\033[31m [$(date '+%Y-%m-%d %H:%M:%S')] $1 \033[0m"
}

version=$1
tag=$2

log "cur version: $version, cur tag: $tag"

log "code review"
npm run lint

log "build"
npm run build

git add .
git commit -m "chore: $version build packages"

log "build demo"
npm run build:demo

git add .
git commit -m "chore: $version demo packages"

log "write version"
lerna publish $version --yes --force-publish --npm-tag $tag

log "changelog"
npm run changelog
git add .
git commit -m "chore: $version changelog"

log "push"
git push