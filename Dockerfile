# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose  API port 
EXPOSE 3000

# Command to run the application from the dist folder
CMD ["node", "dist/src/app.js"]