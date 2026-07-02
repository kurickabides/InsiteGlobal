# this is an answer file for the Assignment
# move it up a directory for it to work
FROM centos8-node as clientapp-build

EXPOSE 3000

#RUN apk add --no-cache tini

WORKDIR /app

COPY package*.json .

RUN npm install && npm cache clean --force

COPY . .
ARG APP_NAME
ENV REACT_APP_NAME=${APP_NAME}}
RUN npm run build


FROM nginx:stable-alpine-perl as nginx

COPY --from=clientapp-build /app/build /usr/share/nginx/html


FROM nginx:stable-alpine-perl as aws-web

COPY --from=clientapp-build /app/build /usr/share/nginx/html

# Copy over the custom default configs.
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Start nginx in the foreground to play nicely with Docker.
#CMD ["nginx", "-g", "daemon off;"]

