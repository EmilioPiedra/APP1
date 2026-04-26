# 1️⃣ Base
FROM node:22-alpine AS base
WORKDIR /app

# 2️⃣ Instalar dependencias
FROM base AS deps
RUN apk add --no-cache libc6-compat
# Cambiamos esto para que busque dentro de la carpeta mi-app
COPY mi-app/package.json mi-app/package-lock.json* ./ 
RUN npm install

# 3️⃣ Build
FROM base AS builder
WORKDIR /app

ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

COPY --from=deps /app/node_modules ./node_modules
# Copiamos todo el contenido de mi-app a la carpeta de trabajo
COPY mi-app/ . 

RUN npm run build

# 4️⃣ Producción
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 8080

CMD ["node", "server.js"]