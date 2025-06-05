# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (default 3000, can be overridden by env)
EXPOSE 3000

# Set environment variables (can be overridden by docker-compose or .env)
ENV NODE_ENV=production

# Start both API and worker using concurrently
CMD ["npm", "start"]
