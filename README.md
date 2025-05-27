# arqui251-grupo6-codigo

---------
## Instalación:


#### Crear el workspace
npx create-nx-workspace@latest singletone-demo --preset=empty --packageManager=npm

### Instalación de Plugins Necesarios
- Plugin para React  
npm install -D @nx/react

- Plugin para Node/Express  
npm install -D @nx/node @nx/express

- Plugin para Docker  
npm install -D @nx/docker

#### Generación de la Aplicación React (Frontend)

- Generar la app React  
npx nx g @nx/react:app frontend --routing=true --style=css --bundler=vite

- Instalar dependencias  
npm install react-router-dom axios @stripe/stripe-js
npm install -D @types/react @types/react-dom

#### Probando microservicios
- Correr:  
 npx nx serve profile-service
npx nx serve music-service
npx nx serve library-service
npx nx serve recommendation-service
npx nx serve plans-service

- Probar:  
curl http://localhost:3001/health
curl http://localhost:3001/api/users

- Probar todos los health checks:  
curl http://localhost:3001/health  # User Service
curl http://localhost:3002/health  # Profile Service
curl http://localhost:3003/health  # Music Service
curl http://localhost:3004/health  # Library Service
curl http://localhost:3005/health  # Recommendation Service
curl http://localhost:3006/health  # Plans Service

- Probar algunos endpoints principales:  
curl http://localhost:3003/api/music/search?q=queen
curl http://localhost:3002/api/profile/demo-user-123
curl http://localhost:3005/api/recommendations/demo-user-123

#### Probando bases de datos
- levantar:  
docker-compose up -d
docker-compose ps

- logs:  
docker-compose logs postgres
docker-compose logs mongodb
docker-compose logs redis

- conexiones:  
docker-compose exec postgres psql -U admin -d singletone_db -c "\dt users.*"
docker-compose exec mongodb mongosh -u admin -p password --authenticationDatabase admin singletone_music --eval "db.artists.find().limit(2)"
docker-compose exec redis redis-cli ping