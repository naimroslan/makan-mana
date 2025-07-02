FROM node:20-alpine

WORKDIR /src

# Install pnpm manually
RUN npm install -g pnpm@latest

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Explicitly copy the production env
COPY .env.production .env

# Build the app
RUN pnpm run build

EXPOSE 3002

CMD ["pnpm", "run", "start"]
