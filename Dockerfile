FROM node:16.17.0-alpine3.16

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json tsconfig.json host.sh ./
RUN npm install

# Copy source files
COPY src/ ./src/
RUN npm run build

# Start the app
CMD ["npm", "run", "host"]
