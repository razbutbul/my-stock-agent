FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .

RUN npx prisma generate

RUN mkdir -p dist/modules/agent/prompts \
  && cp src/modules/agent/prompts/system.prompt.md dist/modules/agent/prompts/system.prompt.md
  
EXPOSE 3000

CMD ["npm", "run", "start:dev"]