# Citybrain nginx Dockerfile
# Version 1.0

# Base images 基础镜像
FROM reg.docker.alibaba-inc.com/police-brain/nginx:1.16.1

ENV DOLLAR $
ENV machine_host 172.17.0.1
ENV listen_port 7777
ENV be_port 7021

#RUN 执行以下命令
RUN mkdir -p /var/www

#COPY
COPY ./dist /var/www/
COPY ./docker/conf/nginx.template.conf /etc/nginx/nginx.template.conf

#EXPOSE 映射端口
EXPOSE 7777

#CMD 运行以下命令
# CMD ["nginx", "-g", "daemon off;"]
CMD /bin/bash -c "envsubst < /etc/nginx/nginx.template.conf > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"
