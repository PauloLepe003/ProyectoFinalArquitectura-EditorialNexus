FROM node:24-bookworm-slim
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run db:generate && npm run build
EXPOSE 3000
CMD ["npm","start"]
