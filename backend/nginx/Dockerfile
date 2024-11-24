FROM ubuntu:latest

# Mise à jour du système
RUN apt update && apt -y upgrade

# Installer les dépendances nécessaires
RUN apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring

# Ajouter la clé de signature de NGINX
RUN curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor | tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
RUN gpg --dry-run --quiet --no-keyring --import --import-options import-show /usr/share/keyrings/nginx-archive-keyring.gpg

# Ajouter le dépôt officiel NGINX (stable ou mainline)
RUN echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | tee /etc/apt/sources.list.d/nginx.list
RUN echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
http://nginx.org/packages/mainline/ubuntu `lsb_release -cs` nginx" \
    | tee /etc/apt/sources.list.d/nginx.list

# Mise à jour du dépôt et installation de NGINX
RUN apt update
RUN apt install -y nginx

# Installer les outils nécessaires pour compiler ModSecurity et NGINX
RUN apt-get install -y make apt-utils autoconf automake build-essential git \
libcurl4-openssl-dev libgeoip-dev liblmdb-dev libpcre3-dev libtool libxml2-dev \
libyajl-dev pkgconf wget zlib1g-dev

# Télécharger et installer ModSecurity
RUN git clone --depth 1 -b v3/master https://github.com/SpiderLabs/ModSecurity /opt/ModSecurity
WORKDIR /opt/ModSecurity
RUN git submodule init && git submodule update
RUN ./build.sh && ./configure && make && make install

# Télécharger et compiler NGINX avec le module ModSecurity
RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git
RUN wget http://nginx.org/download/nginx-1.27.2.tar.gz
RUN tar zxvf nginx-1.27.2.tar.gz
WORKDIR nginx-1.27.2
RUN ./configure --with-compat --add-dynamic-module=../ModSecurity-nginx
RUN make modules
RUN mkdir -p /etc/nginx/modules
RUN cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules

# Copier les fichiers de configuration
COPY config/default.conf /etc/nginx/conf.d
COPY config/nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /etc/nginx/modsec
COPY config/main.conf /etc/nginx/modsec/

# Télécharger la configuration par défaut de ModSecurity et les règles CRS
RUN wget -P /etc/nginx/modsec/ https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended
RUN mv /etc/nginx/modsec/modsecurity.conf-recommended /etc/nginx/modsec/modsecurity.conf
RUN cp /opt/ModSecurity/unicode.mapping /etc/nginx/modsec
RUN git clone https://github.com/coreruleset/coreruleset.git /etc/nginx/modsec/modsecurity-crs
RUN cp /etc/nginx/modsec/modsecurity-crs/crs-setup.conf.example /etc/nginx/modsec/modsecurity-crs/crs-setup.conf

# Lancer NGINX
ENTRYPOINT ["nginx", "-g", "daemon off;"]
