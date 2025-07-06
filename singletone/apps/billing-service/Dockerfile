FROM node:20

WORKDIR /app

COPY . .

RUN npm install

CMD ["npx", "nx", "serve", "billing-service"]