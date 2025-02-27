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

# Build the app
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]
