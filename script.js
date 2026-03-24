const URL_API = "https://pokeapi.co/api/v2/pokemon/";
let idPokemonActual = 1;
let offsetActual = 0;
const limitePagina = 12;
let favoritos = JSON.parse(localStorage.getItem("favoritosPokemon")) || [];

// Elementos del DOM
const entradaBusqueda = document.getElementById("entradaBusqueda");
const btnBuscar = document.getElementById("btnBuscar");
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnFavorito = document.getElementById("btnFavorito");
const btnListaAnterior = document.getElementById("btnListaAnterior");
const btnListaSiguiente = document.getElementById("btnListaSiguiente");
const paginaActual = document.getElementById("paginaActual");

const mensajeEstado = document.getElementById("mensajeEstado");
const imagenPokemon = document.getElementById("imagenPokemon");
const numeroPokemon = document.getElementById("numeroPokemon");
const nombrePokemon = document.getElementById("nombrePokemon");
const alturaPokemon = document.getElementById("alturaPokemon");
const pesoPokemon = document.getElementById("pesoPokemon");
const tiposPokemon = document.getElementById("tiposPokemon");
const habilidadesPokemon = document.getElementById("habilidadesPokemon");
const estadisticasPokemon = document.getElementById("estadisticasPokemon");
const listaPokemon = document.getElementById("listaPokemon");
const listaFavoritos = document.getElementById("listaFavoritos");

// Colores asociados a cada tipo para cambiar el fondo dinámicamente
const coloresTipos = {
  normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F8D030",
  grass: "#78C850", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0",
  ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820",
  rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848",
  steel: "#B8B8D0", fairy: "#EE99AC"
};

const mostrarMensaje = (texto, tipo) => mensajeEstado.innerHTML = `<div class="mensaje-${tipo}">${texto}</div>`;
const limpiarMensaje = () => mensajeEstado.innerHTML = "";

async function obtenerPokemon(pokemon) {
  try {
    mostrarMensaje("Cargando Pokémon...", "cargando");
    const respuesta = await fetch(`${URL_API}${pokemon.toString().toLowerCase().trim()}`);
    if (!respuesta.ok) throw new Error("No encontrado");
    renderizarPokemon(await respuesta.json());
    limpiarMensaje();
  } catch (error) {
    mostrarMensaje("No se encontró el Pokémon. Intenta con otro nombre o número.", "error");
  }
}

function renderizarPokemon(datos) {
  idPokemonActual = datos.id;
  
  // Usar sprite animado si existe, sino el oficial
  const animatedSprite = datos.sprites.other?.showdown?.front_default;
  const officialArt = datos.sprites.other["official-artwork"].front_default;
  imagenPokemon.src = animatedSprite || officialArt || datos.sprites.front_default;
  imagenPokemon.alt = datos.name;
  
  numeroPokemon.textContent = `#${String(datos.id).padStart(3, "0")}`;
  nombrePokemon.textContent = traducirNombre(datos.name);
  alturaPokemon.textContent = `${datos.height / 10} m`;
  pesoPokemon.textContent = `${datos.weight / 10} kg`;

  // Tipos
  tiposPokemon.innerHTML = datos.types.map(t => 
    `<span class="tipo-badge" style="background:${coloresTipos[t.type.name] || '#777'}">${traducirTipo(t.type.name)}</span>`
  ).join('');

  // Cambiar color de fondo del app según el tipo primario
  if (datos.types.length > 0) {
    const mainType = datos.types[0].type.name;
    document.documentElement.style.setProperty('--color-bg', coloresTipos[mainType] || '#ef5350');
  }

  // Habilidades
  habilidadesPokemon.innerHTML = datos.abilities.map(h => 
    `<span class="habilidad-badge">${formatearTexto(h.ability.name)}</span>`
  ).join('');

  // Estadísticas (Con animacion)
  estadisticasPokemon.innerHTML = datos.stats.map(e => {
    // Definimos color de la barra internamente dependiendo del valor
    const p = Math.min(e.base_stat, 150) / 1.5;
    let color = "#4facfe, #00f2fe"; // azul
    if(p > 60) color = "#43e97b, #38f9d7"; // verde
    if(p < 30) color = "#ff0844, #ffb199"; // rojo

    return `
      <div class="fila-estadistica">
        <div class="nombre-estadistica">${traducirEstadistica(e.stat.name)}</div>
        <div class="barra">
          <div class="barra-interna" data-width="${p}%" style="width: 0%; background: linear-gradient(90deg, ${color});"></div>
        </div>
        <div class="valor-estadistica">${e.base_stat}</div>
      </div>
    `;
  }).join('');

  // Triggerea la animacion un instante despues para el calculo del DOM
  setTimeout(() => {
    document.querySelectorAll('.barra-interna').forEach(b => {
      b.style.width = b.getAttribute('data-width');
    });
  }, 50);

  actualizarBotonFavorito();
}

function crearTarjetaMini(id, nombre, spriteUrl) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("tarjeta-mini");
  tarjeta.innerHTML = `
    <img src="${spriteUrl}" alt="${nombre}" loading="lazy">
    <h4>${traducirNombre(nombre)}</h4>
    <p>#${String(id).padStart(3, "0")}</p>
  `;
  tarjeta.addEventListener("click", () => {
    obtenerPokemon(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  return tarjeta;
}

// Carga de lista central
async function cargarListaPokemon() {
  listaPokemon.innerHTML = '<div class="mensaje-cargando" style="grid-column: 1/-1;">Cargando mundo Pokémon...</div>';
  try {
    const res = await fetch(`${URL_API}?offset=${offsetActual}&limit=${limitePagina}`);
    const data = await res.json();
    
    listaPokemon.innerHTML = "";
    data.results.forEach(poke => {
      const id = poke.url.split('/').filter(Boolean).pop();
      // Usar art oficial en las miniaturas
      const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
      listaPokemon.appendChild(crearTarjetaMini(id, poke.name, spriteUrl));
    });
    
    paginaActual.textContent = `Página ${Math.floor(offsetActual / limitePagina) + 1}`;
    btnListaAnterior.disabled = offsetActual === 0;
    btnListaAnterior.style.opacity = offsetActual === 0 ? '0.5' : '1';
    btnListaAnterior.style.cursor = offsetActual === 0 ? 'not-allowed' : 'pointer';

  } catch (error) {
    listaPokemon.innerHTML = '<div class="mensaje-error" style="grid-column: 1/-1;">Error al cargar la lista.</div>';
  }
}

// Favoritos
async function renderizarFavoritos() {
  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = `<p class="texto-vacio">Aún no tienes favoritos en tu Pokédex.</p>`;
    return;
  }
  
  listaFavoritos.innerHTML = '<div class="mensaje-cargando" style="grid-column: 1/-1;">Recuperando favoritos...</div>';
  try {
    const promesas = favoritos.map(id => fetch(`${URL_API}${id}`).then(r => r.json()));
    const datosFavoritos = await Promise.all(promesas);
    
    listaFavoritos.innerHTML = "";
    datosFavoritos.forEach(datos => {
      listaFavoritos.appendChild(crearTarjetaMini(datos.id, datos.name, datos.sprites.front_default));
    });
  } catch (error) {
    listaFavoritos.innerHTML = '<div class="mensaje-error" style="grid-column: 1/-1;">Error al cargar favoritos.</div>';
  }
}

function alternarFavorito() {
  const indice = favoritos.indexOf(idPokemonActual);
  if (indice === -1) favoritos.push(idPokemonActual);
  else favoritos.splice(indice, 1);

  localStorage.setItem("favoritosPokemon", JSON.stringify(favoritos));
  actualizarBotonFavorito();
  renderizarFavoritos();
}

function actualizarBotonFavorito() {
  const esFavorito = favoritos.includes(idPokemonActual);
  btnFavorito.textContent = esFavorito ? "★ En favoritos" : "☆ Agregar a favoritos";
  btnFavorito.classList.toggle("activo", esFavorito);
}

// Helpers de traducción
const traduccionesTipos = {
  normal: "Normal", fire: "Fuego", water: "Agua", electric: "Eléctrico", grass: "Planta",
  ice: "Hielo", fighting: "Lucha", poison: "Veneno", ground: "Tierra", flying: "Volador",
  psychic: "Psíquico", bug: "Bicho", rock: "Roca", ghost: "Fantasma", dragon: "Dragón",
  dark: "Siniestro", steel: "Acero", fairy: "Hada"
};
const traducirTipo = tipo => traduccionesTipos[tipo] || tipo;

const traduccionesStats = {
  hp: "Vida", attack: "Ataque", defense: "Defensa", "special-attack": "At. Especial",
  "special-defense": "Def. Especial", speed: "Velocidad"
};
const traducirEstadistica = stat => traduccionesStats[stat] || stat;

const formatearTexto = texto => texto.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
const traducirNombre = nombre => formatearTexto(nombre);

// UI Eventos
const buscarManejador = () => {
  const valor = entradaBusqueda.value.trim();
  if (valor) obtenerPokemon(valor);
};

btnBuscar.addEventListener("click", buscarManejador);
entradaBusqueda.addEventListener("keypress", e => e.key === "Enter" && buscarManejador());
btnAnterior.addEventListener("click", () => idPokemonActual > 1 && obtenerPokemon(idPokemonActual - 1));
btnSiguiente.addEventListener("click", () => obtenerPokemon(idPokemonActual + 1));
btnFavorito.addEventListener("click", alternarFavorito);

btnListaAnterior.addEventListener("click", () => {
  if (offsetActual >= limitePagina) {
    offsetActual -= limitePagina;
    cargarListaPokemon();
  }
});
btnListaSiguiente.addEventListener("click", () => {
  offsetActual += limitePagina;
  cargarListaPokemon();
});

// Init
obtenerPokemon(idPokemonActual);
cargarListaPokemon();
renderizarFavoritos();