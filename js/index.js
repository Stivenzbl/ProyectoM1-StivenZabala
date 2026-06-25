// ─── Utilidad: convierte HSL → HEX ───────────────────────────────────────────
function hslToHex(h, s, l) {
  l = l / 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = function (n) {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return "#" + f(0) + f(8) + f(4);
}

// ─── Toast de microfeedback ───────────────────────────────────────────────────
function mostrarToast(mensaje) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = mensaje;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast--visible"));

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// ─── Estado de la paleta ──────────────────────────────────────────────────────
let paleta = [];

// ─── Crea un swatch individual ────────────────────────────────────────────────
function crearSwatch(colorHSL, colorHex, nombre, index) {
  const swatch = document.createElement("article");
  swatch.className = "swatch";

  const color = document.createElement("div");
  color.className = "swatch__color";
  color.style.backgroundColor = colorHSL;

  const tooltip = document.createElement("span");
  tooltip.className = "swatch__tooltip";
  tooltip.textContent = "Copiar HEX";

  color.addEventListener("click", function () {
    navigator.clipboard.writeText(colorHex).then(function () {
      mostrarToast("¡" + colorHex + " copiado!");
    });
  });

  const candado = document.createElement("button");
  candado.className = "swatch__candado";
  candado.setAttribute("aria-label", "Bloquear color " + nombre);
  candado.textContent = paleta[index] && paleta[index].bloqueado ? "🔒" : "🔓";

  candado.addEventListener("click", function (e) {
    e.stopPropagation();
    paleta[index].bloqueado = !paleta[index].bloqueado;
    candado.textContent = paleta[index].bloqueado ? "🔒" : "🔓";
    swatch.classList.toggle("swatch--bloqueado", paleta[index].bloqueado);
  });

  color.append(tooltip, candado);

  const info = document.createElement("div");
  info.className = "swatch__info";

  const elNombre = document.createElement("p");
  elNombre.className = "swatch__nombre";
  elNombre.textContent = nombre;

  const elCodigo = document.createElement("p");
  elCodigo.className = "swatch__codigo";
  elCodigo.textContent = colorHex + " · " + colorHSL;

  info.append(elNombre, elCodigo);
  swatch.append(color, info);

  return swatch;
}

// ─── Genera un color aleatorio en HSL y su equivalente HEX ───────────────────
function generarColor() {
  const h = Math.round(Math.random() * 360);
  const hsl = "hsl(" + h + ", 70%, 60%)";
  const hex = hslToHex(h, 70, 60);
  return { hsl, hex };
}

// ─── Renderiza la paleta completa en la galería ───────────────────────────────
const galeria = document.getElementById("galeria");

function renderPaleta(cantidad) {
  galeria.innerHTML = "";

  while (paleta.length < cantidad) paleta.push({ hsl: "", hex: "", bloqueado: false });
  while (paleta.length > cantidad) paleta.pop();

  for (let i = 0; i < cantidad; i++) {
    if (!paleta[i].bloqueado) {
      const color = generarColor();
      paleta[i].hsl = color.hsl;
      paleta[i].hex = color.hex;
    }
    const swatch = crearSwatch(paleta[i].hsl, paleta[i].hex, "Color " + (i + 1), i);
    galeria.appendChild(swatch);
  }
}

// ─── localStorage: guardar, cargar y renderizar paletas guardadas ─────────────
function obtenerGuardadas() {
  return JSON.parse(localStorage.getItem("paletas") || "[]");
}

function guardarPaleta() {
  if (paleta.length === 0) return;

  const guardadas = obtenerGuardadas();
  guardadas.push({
    id: Date.now(),
    colores: paleta.map(function (c) { return { hsl: c.hsl, hex: c.hex }; })
  });

  localStorage.setItem("paletas", JSON.stringify(guardadas));
  mostrarToast("¡Paleta guardada!");
  renderGuardadas();
}

function eliminarPaleta(id) {
  const guardadas = obtenerGuardadas().filter(function (p) { return p.id !== id; });
  localStorage.setItem("paletas", JSON.stringify(guardadas));
  renderGuardadas();
  mostrarToast("Paleta eliminada");
}

function cargarPaleta(colores) {
  // Cargamos los colores y los bloqueamos para que renderPaleta no los pise
  paleta = colores.map(function (c) {
    return { hsl: c.hsl, hex: c.hex, bloqueado: true };
  });

  renderPaleta(paleta.length);

  // Desbloqueamos todos después de renderizar
  paleta.forEach(function (c) { c.bloqueado = false; });

  mostrarToast("¡Paleta cargada!");
  document.getElementById("Generador").scrollIntoView({ behavior: "smooth" });
}

function renderGuardadas() {
  const lista = document.getElementById("guardadas-lista");
  const guardadas = obtenerGuardadas();

  lista.innerHTML = "";

  if (guardadas.length === 0) {
    lista.innerHTML = "<p style='color: var(--color-texto--suave); font-size: 0.9rem;'>No hay paletas guardadas todavía.</p>";
    return;
  }

  guardadas.forEach(function (p) {
    const fila = document.createElement("div");
    fila.className = "guardada";

    // chips de colores
    const chips = document.createElement("div");
    chips.className = "guardada__colores";

    p.colores.forEach(function (c) {
      const chip = document.createElement("div");
      chip.className = "guardada__chip";
      chip.style.backgroundColor = c.hsl;
      chip.setAttribute("title", c.hex);
      chips.appendChild(chip);
    });

    // acciones
    const acciones = document.createElement("div");
    acciones.className = "guardada__acciones";

    const btnCargar = document.createElement("button");
    btnCargar.className = "guardada__btn guardada__btn--cargar";
    btnCargar.textContent = "Cargar";
    btnCargar.addEventListener("click", function () { cargarPaleta(p.colores); });

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "guardada__btn guardada__btn--eliminar";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", function () { eliminarPaleta(p.id); });

    acciones.append(btnCargar, btnEliminar);
    fila.append(chips, acciones);
    lista.appendChild(fila);
  });
}

// ─── Eventos ──────────────────────────────────────────────────────────────────
const boton = document.getElementById("generar");
const selector = document.getElementById("cantidad");
const btnGuardar = document.getElementById("guardar");

if (boton) {
  boton.addEventListener("click", function () {
    renderPaleta(Number(selector.value));
    mostrarToast("¡Paleta generada!");
  });
} else {
  console.log("No encontré el botón 'generar'. Revisa el id en el HTML.");
}

btnGuardar.addEventListener("click", guardarPaleta);

// Paleta inicial y paletas guardadas al cargar la página
renderPaleta(6);
renderGuardadas();