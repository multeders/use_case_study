# Stage 1: Build the Next.js app
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . ./

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the Next.js app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the build output from the first stage
COPY --from=build /app ./

# Expose the port Next.js runs on
EXPOSE 3000

# Command to start the Next.js server
CMD ["npm", "run", "start"]
