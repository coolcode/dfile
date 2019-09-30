FROM nginx:1.15.8

RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/

RUN rm /etc/nginx/conf.d/default.conf
COPY dfile.conf /etc/nginx/conf.d/

COPY static ./static

RUN apt-get update
RUN apt-get install python-certbot-nginx -y
# RUN certbot --nginx -d dfile.app -d www.dfile.app