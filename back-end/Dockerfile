# Use a Node.js slim image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["npm", "run", "start:prod"]
