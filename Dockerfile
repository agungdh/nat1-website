FROM node:24 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs24-debian13 AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
CMD ["./dist/server/entry.mjs"]
