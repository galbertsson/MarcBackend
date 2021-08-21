# Build the project
FROM mhart/alpine-node:latest AS ts-server-builder
WORKDIR app
COPY . .
RUN npm install
RUN npm run build

# Create prod image
FROM mhart/alpine-node:latest AS ts-sample-prod
WORKDIR /app
COPY --from=ts-server-builder ./app/dist ./dist
COPY .env .env
COPY package* ./
RUN npm install --production
CMD npm start