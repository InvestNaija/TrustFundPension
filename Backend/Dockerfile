FROM node:20-alpine3.20

ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . . 

RUN npm run build
ENV TZ=Africa/Lagos
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
