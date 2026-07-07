FROM node:20-alpine

WORKDIR /app

COPY server/package.json ./server/
RUN cd server && npm install --omit=dev

COPY server/ ./server/
COPY docs/ ./docs/

ENV NODE_ENV=production
ENV PORT=3000
ENV STORAGE_ROOT=/data

EXPOSE 3000

CMD ["node", "server/index.js"]
