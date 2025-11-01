FROM node:24-bookworm-slim

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=C.UTF-8

USER root

RUN apt update -y && \
    apt install -y curl git sudo zstd make && \
    \
    curl -L https://github.com/openai/codex/releases/download/rust-v0.50.0/codex-x86_64-unknown-linux-musl.zst \
    | zstd -d -o /usr/local/bin/codex && \
    chmod a+x /usr/local/bin/codex


ARG CONTAINER_USERNAME=node
ARG CONTAINER_USERID=1000

RUN install --owner=${CONTAINER_USERNAME} --directory /work && \
    echo "${CONTAINER_USERNAME} ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/container && \
    chmod 440 /etc/sudoers.d/container && \
    \
    apt clean && \
    rm -rf /var/log/* ; \
    rm -rf /tmp/*

USER ${CONTAINER_USERNAME}

WORKDIR /work
