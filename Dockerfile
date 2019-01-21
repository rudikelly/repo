FROM node:alpine

RUN apk add git

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production

COPY . .

CMD ["npm", "start"]
