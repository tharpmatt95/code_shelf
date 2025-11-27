FROM node:22-alpine

WORKDIR /app

# Needed for bcrypt on Alpine
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x start.sh

EXPOSE 4000

CMD ["./start.sh"]
