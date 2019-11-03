FROM node:alpine
MAINTAINER Andre Lima <aferlim@gmail.com>

# This is the release of Consul to pull in.
ENV CONSUL_VERSION=1.6.1

RUN apk update && \
    apk add \
    bash curl nano net-tools zip unzip \
    jq iputils
# jq iputils-ping dnsutils

# Setup Consul and Goreman
RUN mkdir -p var/data /etc/consul.d

ADD https://releases.hashicorp.com/consul/${CONSUL_VERSION}/consul_${CONSUL_VERSION}_linux_amd64.zip /tmp/consul.zip
RUN cd /bin && unzip /tmp/consul.zip && chmod +x /bin/consul && rm /tmp/consul.zip

#ADD https://github.com/mattn/goreman/releases/download/v0.0.10/goreman_linux_amd64.zip /tmp/goreman.zip
#RUN cd /bin && unzip /tmp/goreman.zip && chmod +x /bin/goreman && rm /tmp/goreman.zip

ADD ./consul/config /etc/consul.d
#ADD Procfile /root/Procfile

# Setting workdir
ADD ./consul/consul.sh /opt
ADD run.sh /opt

ADD ./src rating/src/
ADD package*.json rating/

WORKDIR /rating

RUN npm i

EXPOSE 3000

# Migrates the database, uploads staticfiles, run API server and background tasks
# ENTRYPOINT [ "goreman" ]
CMD [ "sh", "/opt/run.sh"]

# CMD npm start