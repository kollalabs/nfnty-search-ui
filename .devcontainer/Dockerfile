# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.209.6/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version (use -bullseye variants on local arm64/Apple Silicon): 16, 14, 12, 16-bullseye, 14-bullseye, 12-bullseye, 16-buster, 14-buster, 12-buster
ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

RUN ARCH=$(uname -m); \
  if [ $ARCH = 'aarch64' ]; then ARCH='arm64'; fi; \
  curl -curl -L "https://go.dev/dl/go1.17.6.linux-${ARCH}.tar.gz" -o /tmp/go.tar.gz; \
  tar -C /usr/local -xzf /tmp/go.tar.gz; \
  echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile;
