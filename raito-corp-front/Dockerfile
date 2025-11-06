# Stage 1: Build da aplicação Angular
FROM node:20-alpine AS build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build -- --configuration production

# Stage 2: Servir com Nginx
FROM nginx:alpine

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar arquivos buildados do stage anterior
COPY --from=build /app/dist/raito-corp-front/browser /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
