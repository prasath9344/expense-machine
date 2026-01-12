FROM node:20-alpine

WORKDIR /app

COPY package-lock.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
