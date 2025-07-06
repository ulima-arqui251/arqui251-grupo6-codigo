FROM node:20

WORKDIR /app

COPY . .

RUN npm install

RUN npx nx build auth-service

CMD ["node", "dist/apps/auth-service/main.js"]