# Plan de Reorganización: Bible Quiz - Modo Historia y Multijuegos

Este documento detalla la propuesta para transformar el Bible Quiz actual en una plataforma de juegos bíblicos más robusta, con diferentes secciones, tipos de juegos y un "Modo Historia".

## 1. Concepto General: "El Camino del Conocimiento"

La idea es estructurar el Bible Quiz no solo como una serie de preguntas aleatorias, sino como un mapa de aprendizaje dividido en regiones y desafíos específicos.

### Estructura de Secciones
*   **Modo Historia (Campaña):** Un progreso lineal a través de la Biblia.
*   **Desafíos Rápidos (Arcade):** Juegos temáticos individuales de corta duración.
*   **Entrenamiento:** Práctica libre por categorías sin penalización de puntos.

---

## 2. Modo Historia: Progresión por Etapas

El Modo Historia se dividirá en "Capítulos" que siguen la cronología bíblica. Cada capítulo debe completarse para desbloquear el siguiente.

| Capítulo | Título | Temas / Libros | Tipo de Juego Final |
| :--- | :--- | :--- | :--- |
| **1** | Los Orígenes | Génesis y Éxodo | Quiz de personajes |
| **2** | La Ley y el Desierto | Levítico a Deuteronomio | Ordenar los 10 Mandamientos |
| **3** | Tierra Prometida | Josué, Jueces, Rut | Mapa interactivo (opcional) |
| **4** | El Reino Unido | Samuel, Reyes, Crónicas | Quiz de Reyes (Saúl, David, Salomón) |
| **...** | ... | ... | ... |
| **10** | La Gran Comisión | Hechos y Epístolas | Ordenar viajes de Pablo |

---

## 3. Sugerencias de Juegos Nuevos

### A. Ordenar los Libros de la Biblia
*   **Mecánica:** Se muestran 5-7 libros desordenados y el usuario debe arrastrarlos (o clickear en orden) para posicionarlos correctamente según su aparición en la Biblia.
*   **Variantes:** Solo Pentateuco, Profetas Mayores, Evangelios, etc.

### B. ¿Quién soy? (Personajes Bíblicos)
*   **Mecánica:** Se dan 3 pistas de un personaje (ej: "Fui un pastor", "Vencí a un gigante", "Toqué el arpa").
*   **Puntuación:** Más puntos si adivinas con menos pistas.

### C. Citas Perdidas
*   **Mecánica:** Un versículo famoso con una palabra faltante. El usuario debe elegir la palabra correcta entre 4 opciones.

### D. Geografía Bíblica
*   **Mecánica:** Identificar ciudades o eventos en un mapa simplificado (ej: "¿Dónde nació Jesús?").

---

## 4. Plan de Implementación Progresivo

### Fase 1: Refactorización de la Base (Semana 1)
*   [ ] **Migración a Rutas Dinámicas:** Cambiar `bible-quiz/page.tsx` para que acepte parámetros como `bible-quiz/[gameMode]`.
*   [ ] **Separación de Datos:** Dividir `bibleQuestions.ts` en archivos más específicos (`personajes.ts`, `libros.ts`, `historia.ts`).
*   [ ] **Mejora del Estado:** Implementar un sistema de "Desbloqueos" en `localStorage` o base de datos.

### Fase 2: Implementación de Menú y Secciones (Semana 2)
*   [ ] Crear una pantalla de selección con tarjetas para: "Modo Historia", "Desfío de Libros" y "Quiz de Personajes".
*   [ ] Implementar el "Modo Historia" simple (solo niveles de preguntas encadenados).

### Fase 3: Nuevas Mecánicas de Juego (Semana 3)
*   [ ] Desarrollar el componente `BookOrderComponent` (Drag & Drop o selección secuencial).
*   [ ] Crear el sistema de "Pistas" para el juego de personajes.

### Fase 4: Persistencia y Feedback Visual (Semana 4)
*   [ ] Guardar el progreso del Modo Historia en la base de datos (Postgres/Drizzle).
*   [ ] Añadir animaciones de "Nivel Completado" y "Nueva Medalla".

---

## 5. Implementación Técnica Sugerida

Para manejar los diferentes tipos de juegos en un mismo módulo, se sugiere una estructura de componentes basada en un `GameEngine`:

```tsx
// Ejemplo de estructura lógica
const GameEngine = ({ mode, subType }) => {
  switch(mode) {
    case 'quiz': return <BibleQuizComponent category={subType} />;
    case 'order': return <OrderBooksComponent range={subType} />;
    case 'who-is': return <CharacterIdentityComponent level={subType} />;
    default: return <GameMenu />;
  }
}
```

Esto permitirá escalar el Bible Quiz agregando simplemente nuevas categorías y componentes de juego sin romper la lógica existente.
