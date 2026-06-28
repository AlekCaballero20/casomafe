# Plan completo para volver la casa un Escape Room

## Concepto

**El Caso Mafe: Expediente 24/06/67**

La casa se convierte en una investigación familiar. La app (`index.html`) guía el caso capítulo por capítulo y las pistas físicas están escondidas por la casa. La familia se mueve, habla, recuerda y resuelve códigos hasta encontrar "la última página".

> Guía operativa detallada para quien organiza: [`docs/guia-organizador.html`](docs/guia-organizador.html). Pistas para imprimir: botón **Imprimir pistas** dentro del juego o [`imprimir-pistas.html`](imprimir-pistas.html).

## Roles sugeridos

### Mafe
Detective principal. Lidera la búsqueda, decide cuándo pedir ayuda y valida recuerdos.

### Familia
Equipo investigador. Buscan tarjetas, leen testimonios, descifran códigos y desbloquean cada capítulo.

### Anfitrión/a (Alek, Cata y cómplices)
Prepararon la casa. Conocen las respuestas y cuidan el ritmo. **No leer las respuestas frente a Mafe.**

## Acceso

- Código de acceso al expediente: **`240667`** (fecha de nacimiento abreviada).
- Abre la sección Escape Room en la app.

## Capítulos y pistas físicas

El juego tiene 7 capítulos. Cada respuesta correcta revela DÓNDE está escondida la siguiente pista física.

| Capítulo | Acertijo | Respuesta en la app | Pista física a esconder allí |
|----------|----------|---------------------|------------------------------|
| I | Lógica: las cuatro facetas | `Comedor` | Sobre con el reto de tildes (Cap. II) |
| II | Tildes → primeras letras | `Busca sobre negro` | Un **sobre negro** con el cifrado (Cap. III) |
| III | Cifrado Vigenère (clave LEAL) | `Mira detrás del espejo` | Pista detrás del **espejo** (Cap. IV) |
| IV | Acróstico de los márgenes | `Cojín morado` | Pista bajo el **cojín morado** (Cap. V) |
| V | Puntuación de la sentencia | `Nevera` | Pista en la **nevera** (Cap. VI) |
| VI | Biografía → cifras | `2467` | Abre la caja/sobre final (Cap. VII) |
| VII | Veredicto de los testimonios | `Mafe` / `La Escritora` | Entrega de "La última página" |

> Las respuestas aceptan variantes (con o sin tilde, con o sin artículo). Ver `js/app.js` si quieren añadir más.

## Flujo recomendado

1. Todos entran a la app y escriben `240667`.
2. Van a la sección **Escape Room**.
3. Leen la pista digital del capítulo.
4. Resuelven el acertijo y escriben la respuesta.
5. La app confirma y revela el escondite de la pista física.
6. Buscan la tarjeta, cumplen la misión y pasan al siguiente capítulo.
7. Al resolver el Capítulo VII se abre **Caso resuelto** con el veredicto final.

## Materiales

- 7 sobres (uno debe ser **negro**).
- Una caja final o un sobre elegante.
- Cinta, tijeras y marcadores.
- Una hoja bonita titulada **La última página**.
- Certificado final impreso (incluido en las pistas para imprimir).
- Opcional: fotos de distintas épocas, cuerda roja, notas adhesivas, lupa decorativa, música suave.

## Niveles de ayuda (sin dañar el misterio)

1. **Suave:** "Mira el texto desde otra perspectiva."
2. **Media:** "Revisa primeras letras, tildes o signos de puntuación."
3. **Directa:** "La respuesta es un lugar de la casa."

Cada ayuda se cobra con una broma familiar, no con culpa. Es cumpleaños, no audiencia disciplinaria.

## Después del caso: más juegos

La app incluye una sala **Más juegos** para que la celebración no termine al resolver el caso:

- 🎲 **Ruleta de interrogatorio** — preguntas para compartir recuerdos.
- ✨ **Oráculo de Mafe** — frases sabias y ligeramente peligrosas.
- 🎙️ **Mafe responde** — preguntas para que ella cuente historias.
- 🔍 **Mafe Detecta** — reto de memoria visual.
- 🏆 **Mafe Awards** — premios para leer en voz alta.

## Cierre

Leer el veredicto final y luego abrir los juegos de arriba. Así la experiencia sigue como conversación familiar.

> **El caso queda cerrado. El amor queda abierto.**
