FROM node:18-alpine

# Install build tools (needed for sqlite3 and other native addons)
RUN apk add --no-cache python3 make g++ 

WORKDIR /usr/src/app

# Copy package files first (better caching)
COPY package.json ./

# Install production dependencies
RUN npm install --only=production

# Copy the rest of the app
COPY . .

EXPOSE 3000
CMD ["node", "app.js"]
