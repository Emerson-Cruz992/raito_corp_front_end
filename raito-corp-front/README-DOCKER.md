# Guia Rápido: Docker Setup - Raito Corp

## Como Rodar o Projeto Completo com Docker

### Pré-requisitos

- Docker Desktop instalado
- Docker Compose instalado
- Porta 4200 (front), 8080 (back), 5432 (postgres) livres

### Passo 1: Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar arquivo .env com suas configurações
# IMPORTANTE: Altere as senhas padrão!
```

### Passo 2: Build do Front-end

```bash
# Build da imagem do front-end
docker build -t raito-frontend:latest .
```

### Passo 3: Iniciar Todos os Serviços

```bash
# Subir todos os containers
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f
```

### Passo 4: Verificar Status

```bash
# Ver status dos containers
docker-compose ps

# Deve mostrar:
# - raito-frontend (porta 4200)
# - raito-backend (porta 8080)
# - raito-database (porta 5432)
# - raito-redis (porta 6379)
```

### Passo 5: Acessar a Aplicação

- **Front-end**: http://localhost:4200
- **API Docs (Swagger)**: http://localhost:8080/swagger-ui.html
- **Database**: localhost:5432 (PostgreSQL)

---

## Comandos Úteis

### Gerenciar Containers

```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (APAGA DADOS DO BANCO!)
docker-compose down -v

# Restart de um serviço específico
docker-compose restart frontend

# Ver logs de um serviço
docker-compose logs -f backend

# Executar comando dentro do container
docker-compose exec backend bash
```

### Desenvolvimento

```bash
# Rebuild sem cache
docker-compose build --no-cache

# Rebuild apenas um serviço
docker-compose build frontend

# Subir apenas alguns serviços
docker-compose up -d database redis
```

### Debugging

```bash
# Verificar logs de erro
docker-compose logs --tail=100 backend

# Entrar no container
docker-compose exec frontend sh

# Ver uso de recursos
docker stats

# Inspecionar container
docker inspect raito-frontend
```

---

## Estrutura dos Serviços

### Frontend (Angular)

- **Porta**: 4200
- **Tecnologia**: Angular 19 + Nginx
- **Build**: Multi-stage (Node + Nginx)

### Backend (Java Spring)

- **Porta**: 8080
- **Tecnologia**: Spring Boot 3.x
- **Database**: PostgreSQL
- **Cache**: Redis

### Database (PostgreSQL)

- **Porta**: 5432
- **Usuário**: raito_user
- **Database**: raito_db
- **Volume**: postgres-data

### Cache (Redis)

- **Porta**: 6379
- **Volume**: redis-data

---

## Troubleshooting

### Porta já em uso

```bash
# Windows: Verificar processos na porta
netstat -ano | findstr :4200

# Matar processo
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4200 | xargs kill -9
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs frontend

# Verificar erros de build
docker-compose build --no-cache frontend

# Verificar configuração
docker-compose config
```

### Banco de dados não conecta

```bash
# Verificar se postgres está rodando
docker-compose ps database

# Ver logs do postgres
docker-compose logs database

# Conectar manualmente
docker-compose exec database psql -U raito_user -d raito_db
```

### Front-end não conecta no back-end

1. Verificar se `apiUrl` em `environment.ts` está correto
2. Verificar se back-end está rodando: `curl http://localhost:8080/actuator/health`
3. Verificar CORS no back-end
4. Ver logs do front-end: `docker-compose logs frontend`

---

## Desenvolvimento Local (Sem Docker)

### Front-end

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento
ng serve

# Acessar: http://localhost:4200
```

### Conectar com Back-end Local

Edite `src/environments/environment.development.ts`:

```typescript
apiUrl: 'http://localhost:8080/api'
```

---

## Deploy em Produção

### 1. Build de Produção

```bash
# Build da imagem
docker build -t raito-frontend:1.0.0 .

# Tag para registry
docker tag raito-frontend:1.0.0 registry.example.com/raito-frontend:1.0.0

# Push para registry
docker push registry.example.com/raito-frontend:1.0.0
```

### 2. Deploy com Docker Compose

```bash
# Servidor de produção
docker-compose -f docker-compose.prod.yml up -d
```


## Backup do Banco de Dados

### Criar Backup

```bash
# Backup completo
docker-compose exec database pg_dump -U raito_user raito_db > backup_$(date +%Y%m%d).sql

# Backup compactado
docker-compose exec database pg_dump -U raito_user raito_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restaurar Backup

```bash
# Restaurar
docker-compose exec -T database psql -U raito_user raito_db < backup.sql

# Restaurar compactado
gunzip -c backup.sql.gz | docker-compose exec -T database psql -U raito_user raito_db
```

---

## Monitoramento

### Health Checks

```bash
# Front-end
curl http://localhost:4200

# Back-end
curl http://localhost:8080/actuator/health

# Database
docker-compose exec database pg_isready -U raito_user
```

### Logs

```bash
# Todos os serviços
docker-compose logs -f

# Últimas 100 linhas
docker-compose logs --tail=100

# Logs do back-end apenas
docker-compose logs -f backend
```

---

## Limpeza

```bash
# Parar e remover containers
docker-compose down

# Remover volumes (CUIDADO: apaga dados!)
docker-compose down -v

# Remover imagens órfãs
docker image prune -a

# Limpeza completa do Docker
docker system prune -a --volumes
```

---

## Segurança

### Checklist de Segurança

- [ ] Alterar senhas padrão no `.env`
- [ ] Gerar JWT secret forte
- [ ] Configurar HTTPS em produção
- [ ] Atualizar dependências regularmente
- [ ] Habilitar rate limiting
- [ ] Configurar firewall
- [ ] Backup automático do banco

### Gerar Senhas Seguras

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## Próximos Passos

1. ✅ Ambiente Docker configurado
2. ⏳ Implementar back-end Java Spring
3. ⏳ Integrar autenticação JWT
4. ⏳ Testar endpoints da API
5. ⏳ Deploy em produção

---

## Suporte

- **Documentação Completa**: Ver `INTEGRACAO-BACKEND.md`
- **Issues**: Reportar problemas no repositório
- **Docker Docs**: https://docs.docker.com
