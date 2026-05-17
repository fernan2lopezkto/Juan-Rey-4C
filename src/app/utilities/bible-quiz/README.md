# Migración de Preguntas y Lógica de Módulos para Bible Quiz

Este documento detalla los requerimientos, las acciones realizadas y la propuesta para la estructura de la base de datos de preguntas y la gestión de la progresión de los módulos (Story Mode) en el Bible Quiz.

## 1. Lo que el usuario solicitó
1. **Solución de Error:** Arreglar el error `TypeError: Cannot read properties of undefined (reading 'map')` en `BibleQuizComponent.tsx` (Línea 167) que ocurría al intentar iterar sobre las opciones de respuesta cuando no estaban definidas o `questions` estaba vacío.
2. **Migración a Base de Datos:** Crear la estructura necesaria para migrar todas las preguntas estáticas (json/arreglos en el código) a una base de datos.
    - Las **preguntas** deben tener: `id`, `targetas` (guardadas como arreglo de strings), `pregunta`, `respUno`, `respDos`, `respTres`, `correcta`.
    - Los **módulos** deben tener: `id`, `userId` (para identificar creadores de contenido si es necesario), `type` (ej. "story", "opcional") y cualquier otra información pertinente.
3. **Lógica de Progresión (Index):** Pensar y proponer una solución estructurada para el avance de la historia (Story Mode), controlando qué módulos aparecen y en qué orden (Index), y el manejo de los módulos opcionales.

## 2. Lo que se hizo

- **Fix del Error Frontend:** Se agregó el "optional chaining" (`?.`) en el componente `BibleQuizComponent.tsx` para evitar que intente hacer un `.map()` en variables `undefined` o arreglos nulos durante los tiempos de carga o cuando los arreglos de preguntas llegan vacíos.
- **Creación de Tablas en la Base de Datos:** Se crearon dos nuevas tablas en el archivo de esquema de Drizzle (`schema.ts`) y se subieron a la base de datos de producción (`drizzle-kit push`):
  
  1. `bibleQuizModules`:
     - `id`: Identificador único (serial).
     - `userId`: Referencia al creador (nullable para módulos base del sistema).
     - `name`: Nombre del módulo (ej. "Génesis", "Personajes").
     - `type`: Tipo de módulo (`'story'`, `'optional'`, `'free'`).
     - `index` (`order_index`): Un valor entero para ordenar secuencialmente qué módulo sigue de cuál en el "Story Mode".
     - `requiredModuleId`: Identificador que apunta a otro módulo, indicando que se debe completar primero ese módulo antes de desbloquear este.
     
  2. `bibleQuizQuestions`:
     - `id`: Identificador único (serial).
     - `moduleId`: Llave foránea (`module_id`) que asocia esta pregunta a un módulo específico en `bibleQuizModules` (borrado en cascada si el módulo es eliminado).
     - `pregunta`: El texto de la pregunta.
     - `targetas`: JSON estructurado como `string[]` para la visualización de ayudas.
     - `resp_uno`, `resp_dos`, `resp_tres`: Las tres opciones de respuesta.
     - `correcta`: La respuesta que el jugador debe atinar.

## 3. Sugerencias para la lógica de indexación y progreso

Para manejar la progresión y el despliegue del modo "Story" sugiero el siguiente flujo, basándose en la estructura que ya hemos agregado a la base de datos:

### A. Organización por la columna `order_index`
La tabla `bibleQuizModules` incluye una columna `order_index`. La idea es que los módulos que forman parte de la historia principal (`type = 'story'`) tengan un índice incremental (0, 1, 2, 3...). 
- Cuando el jugador va a la pantalla del modo historia, consultas la base de datos pidiendo los módulos ordenados: `ORDER BY order_index ASC`.
- Si agregas un módulo nuevo en medio, en lugar de alterar los IDs (lo cual es muy riesgoso), simplemente modificas los valores de `order_index` o dejas espacios de antemano (ej: 10, 20, 30...) para tener espacio entre ellos sin pisarlos.

### B. Módulos bloqueados (Condición de Desbloqueo)
Para hacer la lógica que determina **cuándo aparece** o **cuándo se desbloquea** un módulo:
1. Usaremos la tabla que ya existe: `bibleQuizProgress`. Esta tabla registra qué usuario pasó qué módulo (`passed = true`).
2. Además, en la tabla de módulos agregamos la columna `requiredModuleId`.
3. **La Lógica:** Cuando cargas los módulos de un jugador en la pantalla de selección, cruzas (JOIN o validación desde el código) el `bibleQuizModules` con el `bibleQuizProgress` del usuario. Un módulo en pantalla se mostrará como **BLOQUEADO** si el usuario **NO** tiene el progreso exitoso (`passed = true`) del módulo cuyo ID está en `requiredModuleId`.
   - Ej: "El Éxodo" tiene `requiredModuleId = ID_DE_GENESIS`. Si el usuario no pasó Génesis, no puede jugar Éxodo.
   - De esta forma el avance de la historia se construye como un árbol o secuencia.

### C. Los Módulos Opcionales o Misiones Secundarias
Los módulos que sean tipo `optional` pueden configurarse también con un `requiredModuleId`.
Por ejemplo, si completas "Génesis" (`ID=1`), puedes requerir que el módulo principal "Éxodo" exija haber pasado Génesis, pero a la vez habilitas un módulo *Opcional* "Curiosidades del Génesis" que también tiene `requiredModuleId = 1`. 
En la interfaz de usuario, si el jugador superó el módulo 1, le pones a la vista el módulo siguiente de la línea de historia y como una "ramificación", los opcionales que se acaban de habilitar.

### D. Insertar y gestionar en el futuro (Dashboard de Admin)
Te sugiero fuertemente crear dentro del "Pro Dashboard" o el rol de Admin un pequeño panel de gestión (CRUD) donde puedas:
- Ver la lista de módulos.
- Arrastrar y soltar módulos o cambiar un campo numérico manualmente para alterar su `order_index`.
- Seleccionar de un menú desplegable el "Módulo Previo Requerido" (`requiredModuleId`).
De esta manera evitarás estar editando directamente en base de datos cuando la app vaya creciendo y tengas decenas de módulos y niveles.
