# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite bakes these in at BUILD time. CapRover passes app env vars as build args.
ARG VITE_FLAVOR=rworld
ARG VITE_API_BASE_URL=
ARG VITE_LISTINGS_FROM_API=true
ARG VITE_ANALYTICS=
ENV VITE_FLAVOR=$VITE_FLAVOR \
    VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_LISTINGS_FROM_API=$VITE_LISTINGS_FROM_API \
    VITE_ANALYTICS=$VITE_ANALYTICS

# Real env vars take precedence over .env.<mode> files in Vite
RUN npx vite build --mode $VITE_FLAVOR

# ---- serve stage ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
