FROM node:18

ENV NODE_OPTIONS="--max-old-space-size=8192"

WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY dist ./dist

CMD ["npm", "run", "start:prod"]
