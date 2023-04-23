FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Just package.json is copied
COPY package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE $PORT
CMD [ "node", "index.js" ]