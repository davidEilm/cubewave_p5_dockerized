FROM node:8

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY ./src /usr/src/app
RUN npm install

EXPOSE 5102
CMD [ "npm", "start" ]