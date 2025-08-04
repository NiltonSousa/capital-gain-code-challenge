# Building a Docker image for a Node.js application with TypeScript
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Compile TypeScript to JavaScript (adjust if your build is different)
RUN npm run build

# Final stage: only runtime
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install

CMD ["node", "dist/cli/cli.js"]
