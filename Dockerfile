# Build stage for Next.js frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage for Next.js frontend
FROM node:18-alpine AS frontend
WORKDIR /app
ENV NODE_ENV production

# Copy necessary files from build stage
COPY --from=frontend-builder /app/next.config.js ./
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/package.json ./package.json

# Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]

# Backend API server
FROM node:18-alpine AS backend
WORKDIR /app
ENV NODE_ENV production

# Copy backend files
COPY server.js ./
COPY routes/ ./routes/
COPY controllers/ ./controllers/
COPY models/ ./models/
COPY middleware/ ./middleware/
COPY utils/ ./utils/
COPY config/ ./config/
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Expose port and start application
EXPOSE 5000
CMD ["node", "server.js"]
