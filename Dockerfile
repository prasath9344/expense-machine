FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 5173

CMD ["node", "dist/index.js"]
