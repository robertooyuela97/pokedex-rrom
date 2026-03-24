# Pokédex Pro 🔴⚪

Una aplicación web moderna, responsiva y dinámica para explorar el mundo Pokémon utilizando la [PokeAPI](https://pokeapi.co/). Diseñada con un enfoque en la experiencia de usuario (UX) e interfaces modernas (UI) implementando técnicas de **Glassmorphism** y animaciones fluidas.

## ✨ Características Principales

- 🔍 **Búsqueda Inteligente:** Encuentra cualquier Pokémon por su nombre o su número oficial en la Pokédex.
- 🎨 **Diseño Dinámico por Tipo:** El fondo de la aplicación reacciona automáticamente cambiando su color y ambiente según el tipo principal del Pokémon seleccionado (Ej: rojizo para tipo fuego, azulado para tipo agua).
- 🎞️ **Sprites Animados:** Integración de los modelos animados clásicos (*Showdown*) para darle vida a la visualización principal.
- 📊 **Estadísticas Animadas:** Barras dinámicas que crecen desde cero para representar los puntos base de Vida, Ataque, Defensa, Ataque Especial, y Defensa Especial.
- ⭐ **Sistema de Favoritos:** Agrega o quita Pokémon de tu lista personal de favoritos. Esta lista se guarda en la memoria de tu navegador (`localStorage`) para que no se pierdan al cerrar la página.
- 📱 **100% Responsivo:** La interfaz y los menús se reorganizan y re-escalan automáticamente para brindar la mejor experiencia tanto en pantallas gigantes como en los celulares más angostos.
- ⚡ **Paginación Optimizada:** Navega fluidamente por el catálogo entero de la API de 12 en 12. La carga de la lista ha sido drásticamente optimizada para un rendimiento instantáneo sin ahogar la red.

## 🛠️ Tecnologías Utilizadas

- **HTML5:** Estructura semántica simple pero eficiente.
- **CSS3 (Vanilla):** Flexbox, CSS Grid, variables para manipulación por JS, y estilos Premium como el vidrio esmerilado (`backdrop-filter: blur`). Total control responsivo vía `media-queries`.
- **JavaScript (ES6+):** Peticiones a red asíncronas (`fetch`, `async/await`, `Promise.all`), manipulación avanzada del DOM en base a plantillas, eventos y lógica funcional limpia.
- **API Pública:** Toda la información proviene de [PokeAPI v2](https://pokeapi.co/).

## 🚀 Cómo utilizar el proyecto

Este proyecto fue desarrollado íntegramente con HTML, CSS y JS puro, por lo que **no necesita instalaciones especiales de Node ni servidores**.

1. Cámbiate a la carpeta del proyecto.
2. Simplemente haz doble clic sobre el archivo `index.html` para abrirlo y disfrutarlo desde cualquier navegador moderno de tu computadora (Chrome, Edge, Firefox, Safari).
*(TIP: También puedes usar plugins como "Live Server" en Visual Studio Code si planeas modificar su código).*

## 📁 Estructura del repositorio

```text
/pokedex
│
├── index.html     # Estructura visual de las tarjetas y menús
├── script.js      # Controlador lógico (API, favoritos, color dinámico)
└── style.css      # Sistema de diseño de estilos y responsividad móvil
```
# pokedex-rrom
