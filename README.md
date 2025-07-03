# Singletone
Este espacio será utilizado para subir nuestro código fuente del aplicativo software. A continuación encontrarás el índice a las partes más importante, un resumen del stack tecnológico, los patrones de arquitectura usado y una guía de cómo usar el software.

## Stack tecnológico
Desarrollo web:  

1. **React**: Framework frontend.
2. **Node.js**: Entorno de ejecución JavaScript para backend.
3. **Express.js**:  Framework minimalista para Node.js.
4. **Swiper.js**: Librería de sliders/carousels.
----
Bases de datos:  

4. **PostgresSQL**: Sistema de base de datos relacional (RDBMS).
5. **MongoDB**: Base de datos NoSQL orientada a documentos.
6. **Redis**: Almacén de estructuras clave-valor en memoria.
---
Otros:  

1. **Docker**: Plataforma de contenedores.
2. **Kubernetes**: Orquestador de contenedores.
3. **Api REST**: Comunicación síncrona.
4. **Auth0(idp)**: Proveedor de identidad (Identity Provider)
5. **Stripe(pasarela de pagos)**: Plataforma de procesamiento de pagos
6. **HuggingFace (Api)**: Proveedor de LLMs para recomendaciones.

## Decisiones a tener en consideración
1. Visualización de perfil descompuesta en sub componentes (uno para datos básicos, otro para stats, albums, etc)
2. Modelo relacional: Usuario (datos básicos), Suscriociones (tipo, id asociado)
3. La página de perfil depende su info de muchos microservicios, por ello tendrá un controlador principal que será el encargado de comunicarse con todos los microservicios y ya traer la data ya procesada (solo para usar).
4. La tabla de datos "usuario" se descompone en una principal llamada "PerfilUsuario" y 3 sub entidades "DatosBásicos", "EstadísticasUsuario" y "BibliotecaMusical"

```
-- Tabla principal: PerfilUsuario
CREATE TABLE PerfilUsuario (
    perfil_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,        -- FK hacia la tabla de usuarios
    fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

-- Submodelo 1: DatosBásicos
CREATE TABLE DatosBasicos (
    datos_id INTEGER PRIMARY KEY AUTOINCREMENT,
    perfil_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    last_name TEXT NOT NULL,
    nickname TEXT UNIQUE NOT NULL,
    mail TEXT UNIQUE NOT NULL,
    photo_url TEXT,
    FOREIGN KEY (perfil_id) REFERENCES PerfilUsuario(perfil_id)
);

-- Submodelo 2: EstadisticasUsuario
CREATE TABLE EstadisticasUsuario (
    estadisticas_id INTEGER PRIMARY KEY AUTOINCREMENT,
    perfil_id INTEGER NOT NULL,
    canciones_escuchadas INTEGER DEFAULT 0,
    horas_escuchadas REAL DEFAULT 0.0,
    artistas_favoritos INTEGER DEFAULT 0,   -- Cantidad de artistas favoritos
    albums_favoritos INTEGER DEFAULT 0,     -- Cantidad de álbumes favoritos
    FOREIGN KEY (perfil_id) REFERENCES PerfilUsuario(perfil_id)
);

-- Submodelo 3: BibliotecaMusical (relación con canciones reales)
CREATE TABLE BibliotecaMusical (
    biblioteca_id INTEGER PRIMARY KEY AUTOINCREMENT,
    perfil_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,               -- FK real hacia Song
    fecha_agregado DATE NOT NULL DEFAULT CURRENT_DATE,
    FOREIGN KEY (perfil_id) REFERENCES PerfilUsuario(perfil_id),
    FOREIGN KEY (song_id) REFERENCES Song(id)
);
```

5. La tabla Artista y album será una sola, con embeditos, tal que así:
```
Collection: artists

{
  "_id": ObjectId("..."),
  "name": "Linkin Park",
  "genre": "Rock",
  "albums": [
    {
      "title": "Hybrid Theory",
      "tracks": [
        { "title": "Papercut", "n_track": 1 },
        { "title": "One Step Closer", "n_track": 2 }
      ]
    },
    {
      "title": "Meteora",
      "tracks": [
        { "title": "Numb", "n_track": 1 },
        { "title": "Faint", "n_track": 2 }
      ]
    }
  ]
}
```

6. x

6. Para las búsquedas de albums y artistas estaremos usando "elastic search" que es una capaa adicional a la principal que almacena, tendra una estructura similar a esta:
```
{
  "song_id": "abc123",
  "title": "Numb",
  "n_track": 1,
  "album_title": "Meteora",
  "artist_name": "Linkin Park",
  "genre": "Alternative Rock",
  "release_year": 2003,
  "artist_country": "USA"
}
```
7. Mongo interactuará con el caché de redis para el autocompletado de albums:
```
// Redis almacena los términos más buscados:
SET autocomplete:artist:me ["Metallica", "Megadeth", "Meek Mill"]
// Cuando el usuario escribe “Me”, consultamos primero Redis:
redis.get("autocomplete:artist:me")
// Si no está, entonces consultas Mongo:
db.artists.find({ name: { $regex: "^Me", $options: "i" } }).limit(5);
```
8. El microservicio de gestión de biblioteca es el encargado de notificar límites de valoración, así que allí debemos de aplicar "Pub sub"

9. Todo guardado en MongoDB en colecciones separadas (user_artists, user_albums, valoraciones). Aquí un resumen del mongo
```
                    +----------------+
                    |   MongoDB      |
                    |----------------|
                    | Artistas       | <==> ElasticSearch (busquedas globales)
                    | Álbumes        |
                    | Canciones      |
                    |----------------|
                    | User_Artists   |   (privado - biblioteca)
                    | User_Albums    |   (privado - biblioteca)
                    | Valoraciones   |   (privado - valoraciones)
                    +----------------+
                             |
                             v
                        Aplicación
                             |
          +-----------------+-------------------+
          |                                     |
   Autocompletado (Redis)              Paginación por cursor (Mongo)
```

10. El servicio de pagos estará usando un enfoque híbrido entre PostgreSQL y Redis.

## Requerimientos funcionales (priorizados)
1. FASE 1: FUNCIONALIDAD BÁSICA ESENCIAL  
RF1 - Registro de usuario  
RF3 - Inicio de sesión  
RF5 - Seguridad en mis datos  
RF15 - Búsqueda general con filtros (enfocado en álbumes)  
RF17 - Vista detallada de álbum  
RF23 - Valoración de canciones  
RF25 - Guardado de valoración completa  
RF7 - Visualización de datos básicos (perfil mínimo)  
RF10 - Biblioteca musical en el perfil (carrusel de álbumes)  
RF12 - Acceso a todos los álbumes  

2. FASE 2: MEJORAS DE EXPERIENCIA  
RF2 - Validación de correo y nickname  
RF16 - Visualización de resultados por pestañas  
RF26 - Guardado como borrador  
RF27 - Reevaluación de canciones  
RF20 - Eliminar artistas y álbumes  

3. FASE 3: FUNCIONALIDADES COMPLEMENTARIAS  
RF22 - Estados de artistas y álbumes  
RF9 - Estadísticas personales  
RF13 - Edición de perfil  
RF18 - Vista detallada de artista  
RF19 - Vista detallada de usuario  

4. FASE 4: CARACTERÍSTICAS PREMIUM  
RF24 - Límite de valoraciones semanales  
RF8 - Indicador de límite de valoraciones  
RF28 - Notificación de valoraciones restantes  
RF6 - Activación de cuenta premium  
RF36-RF40 - Gestión de planes  
RF29 - Valoraciones ilimitadas Premium  
RF31-RF35 - Sistema de recomendaciones  

## Manual de uso
1. 

