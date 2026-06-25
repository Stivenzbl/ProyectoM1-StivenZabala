# Documentación del uso de IA — Colorfly Studio

Proyecto Integrador · Módulo 1 · Henry Full Stack 3.0 + IA  
**Herramienta utilizada:** Claude (Anthropic) — claude.ai

---

## ¿Cómo se utilizó la IA en este proyecto?

La IA fue utilizada como herramienta de revisión, depuración y apoyo técnico durante el desarrollo. El código base fue desarrollado de forma independiente; la IA intervino para identificar bugs, proponer mejoras y orientar la implementación de funcionalidades adicionales.

---

## Prompts utilizados y sus resultados

---

### Prompt 1 — Diagnóstico inicial del código

**Prompt:**
> "vamos a terminar mi proyecto integrador [...] te voy a ir dando la documentación por partes"  
> *(seguido del HTML, CSS y JS base ya desarrollados)*

**Objetivo:** Obtener un diagnóstico honesto del estado del código antes de agregar funcionalidades.

**Resultado:**
La IA identificó 6 bugs concretos:
- `.body` en vez de `body` en CSS → los estilos del body nunca se aplicaban
- Typo `--color-superfice` → variable rota en múltiples lugares
- String HSL sin cerrar paréntesis en JS → colores no se aplicaban correctamente
- `appendChild` con dos argumentos → el código HEX nunca se renderizaba
- `box-shadow` malformado en `.swatch:hover`
- Transiciones CSS sin comas en `.boton` y `.select`

**Decisión tomada:** Corregir todos los bugs antes de agregar cualquier funcionalidad extra, siguiendo el principio de MVP primero.

---

### Prompt 2 — Implementación del toast de microfeedback

**Prompt:**
> "corrijamos en css y el html [para el toast]"

**Objetivo:** Cumplir el requisito obligatorio de microfeedback visible.

**Resultado:**
La IA propuso una función `mostrarToast()` que crea un `div` dinámicamente, lo agrega al DOM, aplica una clase CSS para la animación de entrada y lo elimina tras 2 segundos con `setTimeout`.

**Problema encontrado durante la prueba:**
> "veo que el mensaje paleta generada no se elimina sino que queda y se van sumando uno detrás de otro"

**Causa identificada:** El evento `transitionend` no se disparaba porque el toast aún no tenía estilos CSS de transición definidos, por lo que `toast.remove()` nunca se ejecutaba.

**Solución aplicada:** Eliminar el toast directamente en el `setTimeout` sin depender del evento `transitionend`.

**Aprendizaje:** Identificar la dependencia entre JS y CSS al usar eventos de transición.

---

### Prompt 3 — Copiar HEX al portapapeles

**Prompt:**
> "seguimos" *(tras confirmar que el obligatorio estaba completo)*

**Objetivo:** Implementar el extra credit de copiar el código HEX al hacer clic sobre el color.

**Resultado:**
La IA propuso usar `navigator.clipboard.writeText()` — la API moderna del navegador — dentro del evento `click` del bloque de color. También se agregó un tooltip "Copiar HEX" que aparece en hover, implementado con CSS puro (`opacity: 0` → `opacity: 1`).

**Decisión tomada:** Mantener la lógica dentro de `crearSwatch()` para no crear funciones separadas innecesarias.

---

### Prompt 4 — Bloqueo de colores individuales

**Prompt:**
> "seguimos"

**Objetivo:** Implementar el extra credit de bloqueo de colores para que no cambien al regenerar la paleta.

**Resultado:**
La IA propuso un array de estado `paleta[]` donde cada posición guarda `{ hsl, hex, bloqueado }`. Al regenerar, `renderPaleta()` verifica el flag `bloqueado` antes de generar un nuevo color. El botón candado usa emojis 🔓/🔒 y `e.stopPropagation()` para evitar conflicto con el evento de copiar.

**Decisión tomada:** Usar un array en memoria en vez de atributos `data-*` en el DOM, para mantener la lógica separada de la vista.

---

### Prompt 5 — Guardar paletas en localStorage

**Prompt:**
> "seguimos"

**Objetivo:** Implementar persistencia de paletas entre sesiones.

**Resultado:**
La IA propuso serializar las paletas como JSON en `localStorage` bajo la clave `"paletas"`, con `id: Date.now()` para identificación única. Se implementaron tres funciones: `guardarPaleta()`, `eliminarPaleta(id)` y `renderGuardadas()`.

**Problema encontrado durante la prueba:**
> "el botón cargar solo genera nuevas paletas más no la que tiene guardada"

**Causa identificada:** `cargarPaleta()` asignaba los colores al array `paleta[]` pero luego llamaba a `renderPaleta()`, que regeneraba los colores no bloqueados, pisando los cargados.

**Solución aplicada:** Marcar todos los colores como `bloqueado: true` antes de renderizar y desbloquearlos inmediatamente después, para que `renderPaleta()` los respete.

**Aprendizaje:** Importancia de entender el flujo completo de datos antes de implementar funciones que dependen del estado compartido.

---

## Reflexión sobre el uso de la IA

La IA fue útil principalmente como herramienta de depuración y como segunda opinión técnica. En ningún caso reemplazó la comprensión del código — cada cambio propuesto fue revisado, probado en el navegador y aplicado de forma consciente.

Los casos más valiosos fueron:
- Identificar bugs que visualmente no eran evidentes (typos en variables CSS, string HSL sin cerrar)
- Explicar el porqué de cada corrección, no solo el qué
- Detectar errores de lógica durante las pruebas (toast que no se eliminaba, cargar paleta que regeneraba colores)

El flujo de trabajo fue siempre: **desarrollar → probar → identificar problema → consultar IA → entender la solución → aplicar**.
