FROM node:24-alpine
WORKDIR /app

# Copy package files first (cache layer)
COPY package*.json ./
RUN npm install

# Copy source (this layer changes frequently)
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]