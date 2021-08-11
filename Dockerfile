FROM node:14.17-alpine

# update packages
# RUN apk update

# create root application folder
WORKDIR /app

# copy configs to /app folder
ADD . .

RUN ls -a

RUN npm install
RUN npm run build

EXPOSE 9000

CMD [ "node", "./dist/local.js" ]