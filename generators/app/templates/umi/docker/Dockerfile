# Citybrain nginx Dockerfile
# Version 1.0

# Base images 基础镜像
FROM nginx:1.16.1

ENV RUN_GROUP nginx
ENV DATA_DIR /var/www/dist

#ADD

#RUN 执行以下命令
RUN mkdir -p /var/www

#COPY
COPY ./dist /var/www/
COPY ./docker/conf/nginx.conf /etc/nginx

#EXPOSE 映射端口
EXPOSE 7777

#CMD 运行以下命令
CMD ["nginx", "-g", "daemon off;"]
