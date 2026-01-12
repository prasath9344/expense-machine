FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .


CMD ["npm", "start"]

EXPOSE 5173