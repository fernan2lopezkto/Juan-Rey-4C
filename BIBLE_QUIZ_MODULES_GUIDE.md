# Guía para Añadir Módulos al Bible Quiz

Esta guía describe el funcionamiento interno del sistema de "Bible Quiz" en esta plataforma y proporciona los pasos exactos a seguir cuando se necesite añadir un nuevo módulo (ya sea un libro lineal del modo historia o un módulo opcional de un personaje).

## Arquitectura del Bible Quiz

El sistema está compuesto por tres partes principales:
1. **Definición de Módulos (`src/data/bible-quiz-modules.ts`)**: Define qué módulos existen, en qué orden se juegan y qué requisitos tienen para ser desbloqueados.
2. **Bancos de Preguntas (`src/data/<nombre>-questions.ts`)**: Archivos independientes que exportan un arreglo de preguntas para cada módulo.
3. **Gestor del Juego (`src/components/bible-quiz/BibleQuizGameContainer.tsx`)**: Componente que recibe la información del módulo activo, carga sus preguntas correspondientes y maneja el guardado del progreso.

---

## Paso 1: Definir el Nuevo Módulo

Abre el archivo `src/data/bible-quiz-modules.ts`. Aquí encontrarás el arreglo `bibleQuizModules`. 

Añade un nuevo objeto al arreglo con la estructura `QuizModule`:

```typescript
{
  id: "mod_8_joshua", // ID único del módulo, prefijo 'mod_'
  title: "8. Josué",
  description: "Preguntas sobre la conquista de Canaán.",
  isAvailable: true,
  requirements: ["mod_7_pentateuch_hard"], // ID del módulo que debe superarse antes
  totalQuestions: 15,
  isOptional: false, // Opcional si es un personaje secundario
}
```

*Nota: Si es un módulo opcional (ej. un personaje), asegúrate de establecer `isOptional: true`. Los módulos opcionales no bloquean el progreso de la historia principal.*

---

## Paso 2: Crear el Banco de Preguntas

Crea un nuevo archivo en la carpeta `src/data/`, por ejemplo `joshua-questions.ts`.
Exporta un arreglo de objetos con la pregunta, las opciones y el índice de la respuesta correcta (basado en cero):

```typescript
export const joshuaQuestions = [
    {
        question: "¿Quién sucedió a Moisés como líder de Israel?",
        options: ["Caleb", "Aarón", "Josué", "Gedeón"],
        correctAnswer: 2
    },
    // Añadir más preguntas hasta alcanzar 'totalQuestions'
];
```

---

## Paso 3: Conectar el Módulo con el Gestor del Juego

Abre el archivo `src/components/bible-quiz/BibleQuizGameContainer.tsx`.
Debes realizar dos acciones en este archivo:

**1. Importar el banco de preguntas en la parte superior:**
```typescript
import { joshuaQuestions } from "@/data/joshua-questions";
```

**2. Asignar las preguntas en el bloque de "Selección dinámica de preguntas":**
Busca la sección donde se evalúa `moduleInfo.id` y añade tu condición:
```typescript
  if (moduleInfo.id === "mod_8_joshua") questionsToUse = joshuaQuestions;
```

---

## Paso 4: Probar y Verificar

Una vez integrados estos 3 pasos, el módulo aparecerá automáticamente en el `BibleQuizProDashboard`.
- Si `isOptional` es falso y tiene un requisito, aparecerá como el siguiente paso bloqueado en el Modo Historia hasta que se supere el nivel anterior.
- Al superar un nivel, el botón "Siguiente Módulo" automáticamente buscará el siguiente módulo lineal disponible.

### Resumen de Funcionamiento del Guardado
Cuando un usuario completa un módulo alcanzando el 60% de puntaje (`score >= 60`), el componente `BibleQuizGameContainer` invoca `saveBibleQuizProgress()`. Al mismo tiempo, llama a `onUpdateProgress()` que actualiza el estado local (`progressData`) en el `BibleQuizProDashboard`. Esto permite que se actualice la interfaz, se desbloqueen los siguientes niveles y se sumen los puntos de inmediato, sin necesidad de recargar la página.
