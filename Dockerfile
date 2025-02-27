FROM node:20-alpine

WORKDIR /src

# Enable Corepack (ensures pnpm is available)
RUN corepack enable

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the app
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]