function hslToHex(h, s, l) {
  l = l / 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = function (n) {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // Convert to hex and pad with zeros
  };
  return "#" + f(0) + f(8) + f(4);
}

function crearSwatch(colorHSL, colorHex, nombre) {
    const swatch = document.createElement("article");
    swatch.className = "swatch";

// bloque superior el rectangulo pintado con el color
    const color = document.createElement("div");
    color.className = "swatch__color";
    color.style.backgroundColor = colorHSL;

// zona inferior nombre + codigo
    const info = document.createElement("div");
    info.className = "swatch__info";

    const elNombre = document.createElement("p");
    elNombre.className = "swatch__nombre";
    elNombre.textContent = nombre;

    const elCodigo = document.createElement("p");
    elCodigo.className = "swatch__codigo";
    elCodigo.textContent = colorHex + " . " + colorHSL

    info.appendChild(elNombre, elCodigo)

    swatch.append(color, info)

    return swatch
}

function generarColor() {
const h = Math.round(Math.random() * 360);
const hsl = "hsl("+ h + ", 70%, 60%";
const hex = hslToHex(h, 70, 60 );

return {hsl, hex};
}

const galeria = document.getElementById("galeria");

function renderPaleta(cantidad) {
    galeria.innerHTML = "";

    for (let i = 0; i < cantidad; i++){
        const color = generarColor();
        const swatch = crearSwatch(color.hsl, color.hex, "color" + (i + 1));
        galeria.appendChild(swatch);
    }
}

const boton = document.getElementById("generar");
const selector = document.getElementById("cantidad");

if (boton) {
    boton.addEventListener("click", function (){
        renderPaleta(Number(selector.value));
    });
} else {
    console.log("no encontre el boton 'generar'. Revisa el id en el HTML");
}

renderPaleta(6)