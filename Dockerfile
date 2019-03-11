FROM node:carbon

# Create app directory
WORKDIR /app

# Install nodemon for hot reload
RUN npm install -g nodemon

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY app.js /app
COPY graphql /app
COPY helpers /app
COPY middleware /app
COPY models /app

EXPOSE 8000
CMD [ "nodemon", "server.js" ]