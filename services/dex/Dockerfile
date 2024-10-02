FROM node:18

WORKDIR /usr/src/app

ENV NODE_OPTIONS="--max-old-space-size=8192"

COPY package.json .

RUN npm install

COPY dist ./dist

CMD ["npm", "run", "start:prod"]
