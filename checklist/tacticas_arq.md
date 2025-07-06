# 5. Tácticas
En esta página se resumen las tácticas tomadas para la arquitectura del aplicativo "Singletone".

## Módulo 01: Gestión de usuarios (objetico cumplido) — (6/13)
| ID              | Atributo de calidad         | Táctica elegida                                                     | Alternativas    | Decisión         |
|-----------------|--------------------------|------------------------------------------------------------|------------------------------------------|-----------------------------------|
| ESC-GU-01 | Disponibilidad | Redundancia Activa (Hot Spare) | 1. Heartbeat + Reintentos, 2. Redundancia Activa (Hot Spare) | 2. Redundancia Activa (Hot Spare) |
| ESC-GU-03 | Mantenibilidad | División en submódulos (Node.js) | 1. Código Monolítico, 2. Microservicios Especializados | 2. Microservicios Especializados | 
| ESC-GU-04 | Mantenibilidad | Wrapper JWT (TypeScript) | 1. Uso Directo, 2. Wrapper Abstracto | 2. Wrapper JWT |
| ESC-GU-05 | Interoperabilidad | Orquestar | 1. Orquestación Centralizada con Controlador de Usuario, 2. Comunicación Directa entre Microservicios | 1. Orquestación Centralizada con Controlador de Usuario |
| ESC-GU-06 | Rendimiento | Pool de conexiones optimizado en Sequelize | 1. Pool de conexiones optimizado en Sequelize, 2. Implementación de cola asincrónica con BullMQ | 1. Pool de conexiones optimizado en Sequelize | 
| ESC-GU-07 | Rendimiento | Caching con Redis y TTL de 1 hora | 1. Caching con Redis y TTL de 1 hora, 2. Replicación local diaria de la lista de géneros | 1. Caching con Redis y TTL de 1 hora |


## Módulo 02: Visualización de perfil
| ID      | Atributo de calidad         | Táctica elegida                                                     | Alternativas    | Decisión         |
|---------|--------------------------|------------------------------------------------------------|------------------------------------------|-----------------------------------|
| ESC-VP-01 | Disponibilidad | Redis Cluster con replicación | 1. Cache Local en Memoria, 2. Redis Cluster | 2. Redis Cluster |
| ESC-VP-02 | Disponibilidad | Fallback con datos recientes | 1. Mensaje de Error, 2. Fallback con Datos Recientes | 2. Fallback con datos recientes |
| ESC-VP-03 | Mantenibilidad | Componentes separados con Atomic Design | 1. Componente Monolítico, 2. Atomic Design | 2. Atomic Design |
| ESC-VP-04 | Mantenibilidad | Patrón Adapter | 1. Consumo Directo de API, 2. Capa BFF (Backend For Frontend) | 1. Capa BFF (Backend For Frontend) |
| ESC-VP-05  | Interoperabilidad   | API Gateway con REST | 1. Llamadas directas al microservicio de recomendaciones, 2. Capa intermedia de API Gateway REST | 2. API Gateway REST |
| ESC-VP-06 | Interoperabilidad | Circuit Breaker + Redis Cache | 1. Consumo directo de API externa, 2. Capa de abstracción con cache local | 2. Capa de abstracción con cache local |
| ESC-VP-07 | Rendimiento | REST API Tradicional Optimizada | 1. REST API tradicional con joins en backend optimizados, 2. GraphQL con batching y caching | 1. REST API Tradicional Optimizada |
| ESC-VP-08 | Rendimiento | React Window + Lazy Loading | 1. Renderizado completo, 2. Virtualización con lazy loading | 2. Virtualización con lazy loading |
| ESC-VP-09 | Seguridad | RBAC con decoradores TypeScript | 1. Filtrado manual en controlador, 2. Sistema declarativo | 2. Sistema declarativo |
| ESC-VP-10 | Seguridad | Sanitización con DOMPurify + CSP estricta | 1. Escape manual, 2. Sanitización automatizada | 2. Sanitización automatizada |
| ESC-VP-11 | Rendimiento | Lazy loading con skeleton screens | 1. Carga completa, 2. Lazy loading | 2. Lazy Loading |
| ESC-VP-12 | Usabilidad | Filtros persistentes con preview visual | 1. Menú desplegable, 2. Filtros persistentes | 2. Filtros persistentes |
| ESC-VP-13 | Capacidad de ser probado | Pruebas automatizadas con Storybook + Jest | 1. Pruebas Manuales, 2. Pruebas Automatizadas | 2. Pruebas automatizadas |

## Módulo 03: Exploración musical
| ID      | Atributo de calidad         | Táctica elegida                                                     | Alternativas    | Decisión         |
|---------|--------------------------|------------------------------------------------------------|------------------------------------------|-----------------------------------|
| ESC-EM-01 | Disponibilidad | ESC-GU-01 — Re usada |
| ESC-EM-02 | Disponibilidad | Reintentos Automáticos (Retry) | 1. Reintentos automáticos, 2. Mensaje error | 1. Reintentos automáticos |
| ESC-EM-03 | Mantenibilidad | Cohesión Semántica | 1. Componente monolítico, 2. Componentización modular | 2. Componentización modular |
| ESC-EM-04 | Mantenibilidad | ESC-VP-04 - Re usada | 
| ESC-EM-05 | Interoperabilidad | ESC-VP-05 - Re usada | 
| ESC-EM-06 | Interoperabilidad | Eventos y Webhooks con reintentos | 1. API REST, 2. Webhooks | 2. Eventos asíncronos |
| ESC-EM-07 | Rendimiento | ESC-GU-06 — Re usada |
| ESC-EM-08 | Rendimiento | ESC-VP-08 — Re usada |
| ESC-EM-09 | Seguridad | Autenticación multifactor (MFA) y bloqueo temporal | 1. Bloqueo simple, 2. MFA con bloqueo temporal | 2. MFA con bloqueo temporal |
| ESC-EM-10 | Seguridad | ESC-VP-10 — Re usada |
| ESC-EM-11 | Usabilidad | ESC-GU-10 - Re usada |
| ESC-EM-12 | Usabilidad | Filtros persistentes con vista previa visual | 1. Menu desplegable, 2. Barra flotante | 2. Barra flotante |
| ESC-EM-13 | Variabilidad / Flexibilidad | Arquitectura basada en componentes desacoplados y diseño orientado a plugins | 1. Refactorización completa, 2. Diseño modular y plugins | 2. Diseño modular y plugins |

## Módulo 04: Gestión de biblioteca
| ID      | Atributo de calidad         | Táctica elegida                                                     | Alternativas    | Decisión         |
|---------|--------------------------|------------------------------------------------------------|------------------------------------------|-----------------------------------|
| ESC-GB-01 | Disponibilidad | Degradación elegante | 1. Balanceador de carga con autoescalado, 2. Degradación controlada de servicios | 2. Degradación controlada de servicios |
| ESC-GB-02 | Disponibilidad | Rélica de lectura | 1. Rélica en MongoDB, 2. Almacenamiento temporal | 1. Réplica en MongoDB |
| ESC-GB-03 | Mantenibilidad | División de Módulo | 1. Lista de referencias en documento usuario, 2. Colecciones separadas MongoDB, 3. Tablas relaciones en PostgreSQL | 2. Colecciones separadas |
| ESC-GB-04 | Mantenibilidad | Encapsulamiento mediante interfaz estable | 1. Modificación directa del esquema, 2. Capa de abstracción | 2. Capa de abstracción |
| ESC-GB-05 | Interoperabilidad | WebSockets para comunicación en tiempo real | 1. WebSockets, 2. Server-Sent Events (SSE), 3. Pooling | 1. WebSockets |
| ESC-GB-06 | Interoperabilidad | ESC-EM-06 - Re usada |
| ESC-GB-07 | Rendimiento | ESC-GU-06- Re usada |
| ESC-GB-08 | Rendimiento | ESC-VP-08 — Re usada |
| ESC-GB-09 | Seguridad | Encriptación nativa de MongoDB | 1. Encriptación a nivel aplicación, 2. Encriptación nativa de MongoDB | 2. Encriptación nativa de MongoDB |
| ESC-GB-10 | Usabilidad (Iniciativa del usuario) | Cálculo incremental con operadores atómicos de MongoDB | 1. Recálculo completo del promedio, 2. Triggers en PostgreSQL, 3. Operadores atómicos de MongoDB (inc,avg) | 3. Operadores atómicos de MongoDB |
| ESC-GB-11 | Escalabilidad | Escalado horizontal automático | 1. Escalamiento vertical, 2. Escalamiento horizontal manual, 3. Escalamiento horizontal automático | 3. Escalamiento horizontal automático |

## Módulo 05: Gestión de recomendaciones
| ID      | Atributo de calidad         | Táctica elegida                                                     | Alternativas    | Decisión         |
|---------|--------------------------|------------------------------------------------------------|------------------------------------------|-----------------------------------|
| ESC-GR-01 | Disponibilidad |  ESC-GU-01 — Re usada |
| ESC-GR-02 | Disponibilidad | Despliegue azul-verde (Blue-Green Deployment) | 1. Despliegue azul-verde (Blue-Green Deployment), 2. Ventanas de mantenimiento con interrupción | 1. Despliegue azul-verde (Blue-Green Deployment) |
| ESC-GR-03 | Mantenibilidad | Modularidad y diseño desacoplado | 1. Arquitectura modular con APIs bien definidas, 2. Monolito con código integrado | 1. Arquitectura modular |
| ESC-GR-04 | Mantenibilidad | Integración continua y despliegue continuo (CI/CD) | 1. Pipeline CI/CD completo, 2. Despliegue manual | 1. Pipeline CI/CD completo |
| ESC-GR-05 | Interoperabilidad | Uso de APIs estándar y formatos de datos comunes | 1. RESTful API con JSON, 2. Formato propietario | 1. RESTful API con JSON |
| ESC-GR-06 | Interoperabilidad | Implementación de estándares de comunicación seguros (OAuth + HTTPS) | 1. OAuth 2.0 con HTTPS, 2. Autenticación básica sin cifrado | 1. OAuth 2.0 con HTTPS |
| ESC-GR-07 | Rendimiento | Consumo de API externa LLM con caché inteligente | 1. Modelo propio de ML en Python, 2. Consumo de API LLM (Hugging Face) | 2. Consumo de API LLM (Hugging Face) |
| ESC-GR-08 | Seguridad | ESC-EM-09 — Re usada |
| ESC-GR-09 | Seguridad | Monitoreo de integridad con alertas y auditoría continua | 1. Checksums y hashing con alertas, 2. Sin control de integridad | 1. Checksums y hashing con alertas |
| ESC-GR-10 | Usabilidad | Simplificación del flujo y mensajes claros | 1. Tutorial interactivo inicial, 2. Interfaz minimalista sin tutorial | 1. Tutorial interactivo inicial |
| ESC-GR-11 | Usabilidad | Atajos y configuraciones personalizadas | 1. Atajos de teclado y presets de configuración, 2. Interfaz estándar sin personalización | 1. Atajos de teclado y presets de configuración | 
| ESC-GB-12 | Flexibilidad | Arquitectura basada en componentes desacoplados | 1. Refacotrización incremental, 2. Reescritura completa del módulo | 1. Refactorización incremental |
 
## Módulo 06: Gestión de planes
| ID      | Atributo de calidad         | Táctica elegida                                                     | Alternativas    | Decisión         |
|---------|--------------------------|------------------------------------------------------------|------------------------------------------|-----------------------------------|
| ESC-GPM-01 | Disponibilidad | Detectar fallas y Recuperarse de fallas | 1. Sistema de Reintentos Exponenciales con Circuit Breaker, 2. Rollback Automático con Cola de Reintentos | 1. Sistema de Reintentos Exponenciales con Circuit Breaker |
| ESC-GPM-02 | Disponibilidad | Detectar fallas y Degradación | 1. Fallback Automático a PostgreSQL con Sincronización, 2. Replicación Activa de Contadores en Ambos Sistemas | 1. Fallback Automático a PostgreSQL con Sincronización |
| ESC-GPM-03 | Mantenibilidad | Patrón Strategy para Procesadores de Pago con Factory Pattern | 1. Patrón Strategy con Interface Común y Factory, 2. Patrón Adapter con Wrapper Unificado | 1. Patrón Strategy con Factory |
| ESC-GPM-04 | Mantenibilidad | Motor de Reglas con Archivos JSON de Configuración | 1. Motor de Reglas con Archivos JSON de configuración, 2. Base de Datos de Configuración con Interface | 1. Motor de Reglas con JSON de configuración|
| ESC-GPM-05 | Interoperabilidad | Gestionar interfaces mediante personalización de interfaz | 1. Gateway con Adaptadores Específicos por Microservicio, 2. Interface Unificada con Parámetros de Consulta Flexible | 1. API Gateway con Adaptadores Específicos por Microservicio |
| ESC-GPM-06 | Rendimiento | Gestionar recursos mediante mantener múltiples copias de los datos | 1. Cache Multi-Nivel con Estrategia de Invalidación Inteligente, 2. Réplicas de Lectura con Particionamiento por Tipo de Consulta | 1. Cache Multi-Nivel con Estrategia de Invalidación Inteligente |
| ESC-GPM-07 | Rendimiento | Gestionar recursos mediante introducir concurrencia | 1. Pool de Workers Asíncronos con Cola de Transacciones, 2. Procesamiento Reactivo con Streams de Transacciones | 1. Pool de Workers Asíncronos con Cola de Transacciones |
| ESC-GPM-08 | Seguridad | Resistir ataques mediante autorizar actores y limitar el acceso | 1. Validación Multi-Nivel con JWT enriquecido y Verificación por Endpoint, 2. Sistema de Permisos Basado en Roles con Verificación de Base de Datos | 1. Validación Multi-Nivel con JWT enriquecido y Verificación por Endpoint |
| ESC-GPM-09 | Usabilidad | Notificaciones proactivas del sistema y Guía contextual hacia premium | 1. Notificaciones Básicas de Límite, 2. Sistema de Notificaciones Inteligentes con Guía Contextual | 2. Sistema de Notificaciones Inteligentes con Guía Contextual |
| ESC-GPM-10 | Escalabilidad | Auto-escalado horizontal y Optimización de carga de trabajo | 1. Escalado Manual Reactivo, 2. Auto-escalado Inteligente con Optimización de Transacciones | 2. Auto-escalado Inteligente con Optimización de Transacciones |