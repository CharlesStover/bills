FROM node:alpine
LABEL Author "Charles Stover <docker@charlesstover.com>"
WORKDIR /var/www
COPY src .
EXPOSE 3000
ENTRYPOINT [ "node", "bills-server.js" ]
