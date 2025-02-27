FROM node:20-alpine

WORKDIR /src

# Install pnpm globally
# RUN corepack enable && npm install -g pnpm

# Copy package manager files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the app
COPY . .

# Build the project (if necessary)
RUN npm run build

# Expose the correct port
EXPOSE 3002

# Start the application
CMD [ "pnpm", "start" ]