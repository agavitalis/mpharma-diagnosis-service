FROM node:16.5.0-alpine

WORKDIR /diagnosis-service

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5001

CMD ["npm", "start"]