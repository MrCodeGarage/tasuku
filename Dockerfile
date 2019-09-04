FROM node:10
RUN apt-get update -y
RUN apt-get install nginx -y
RUN  apt-get install -y gettext
COPY docker/default.conf.template /etc/nginx/conf.d/default.conf.template
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/www /usr/share/nginx/html/www
RUN mkdir /usr/src/app
COPY ./docker /usr/src/app/
RUN npm install pm2 -g
RUN cd /usr/src/app/server && npm install
CMD /bin/bash -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf"   && pm2 start "/usr/src/app/ecosystem.config.js" && nginx -g 'daemon off;'

