# Modelo relacional

```mermaid
erDiagram
  User ||--o| Institution : valida
  User ||--o{ Session : autentica
  User ||--o{ CartItem : conserva
  Book ||--o{ CartItem : contiene
  Book ||--|| Inventory : dispone
  Author }o--o{ Book : escribe
  Category }o--o{ Book : clasifica
  Publisher ||--o{ Book : publica
  Format ||--o{ Book : presenta
  User ||--o{ Order : realiza
  Order ||--|{ OrderItem : detalla
  Book ||--o{ OrderItem : referencia
  Order ||--|{ OrderHistory : registra
  User ||--o{ SpecialRequest : solicita
  SpecialRequest ||--o| Quote : propone
  SpecialRequest ||--|{ RequestHistory : audita
  User {
    uuid id PK
    string email UK
    string passwordHash
    enum role
    boolean active
  }
  Institution {
    uuid id PK
    uuid userId FK,UK
    string name
    string taxId
    enum status
  }
  Book {
    uuid id PK
    string isbn UK
    string title
    decimal price
    boolean active
  }
  Inventory {
    uuid bookId PK,FK
    int stock
  }
  Order {
    uuid id PK
    int number UK
    uuid userId FK
    enum status
    json breakdown
  }
  Quote {
    uuid id PK
    int number UK
    uuid requestId FK,UK
    decimal unitPrice
    int quantity
    json breakdown
    json clientSnapshot
  }
  Setting {
    string key PK
    string value
  }
```

Prisma crea tablas puente `_AuthorToBook` y `_BookToCategory`. Las PK son UUID excepto claves naturales de parámetros y claves compuestas del carrito. ISBN y correo son únicos. Las FK impiden referencias inexistentes; libros, autores y categorías usan eliminación lógica. Las tablas de sesión y carrito dependen del usuario con eliminación en cascada; no existe endpoint de borrado físico de usuarios.

`Role`, `Validation`, `OrderStatus` y `RequestStatus` son tipos enum cerrados, no texto libre. `actorId` de historial es identificador de auditoría, conservado aunque una identidad cambie; los usuarios se desactivan, nunca se borran desde la aplicación. Los timestamps son generados por la base. Se muestran al usuario en su zona local; los PDF usan fecha ISO para evitar ambigüedad.

Los snapshots JSON de importes, cliente y versiones son una desnormalización deliberada para preservar evidencias históricas. Las relaciones operativas siguen normalizadas. No se usa JSON como sustituto de libros, usuarios, inventario o carritos.

Restricciones CHECK impiden cantidades/precios no positivos y stock negativo. Índices cubren sesión por expiración, solicitudes por propietario/estado, órdenes por usuario/fecha/estado, libro activo/fecha y usuario por rol/actividad. Las búsquedas de subcadenas usan `ILIKE` mediante Prisma; con un catálogo mucho mayor convendría un índice `pg_trgm` y límites de consulta adicionales.

El script SQL completo está en `database/schema.sql`; la misma definición inicial y restricciones están versionadas en `backend/prisma/migrations/202611090001_initial/migration.sql`. `seed.sql` contiene solo datos de demostración y hashes bcrypt, nunca sesiones.
