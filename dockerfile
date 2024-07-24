FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080
EXPOSE 8080

CMD [ "sh", "-c", "npx prisma migrate dev && npm start" ]
