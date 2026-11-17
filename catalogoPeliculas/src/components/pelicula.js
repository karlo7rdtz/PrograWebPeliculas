
const CARPETA_IMAGENES =
    "../../catalogoPeliculas/public/imagenes/";

const datosPeliculas = [
    {
        id: "interestelar",
        titulo: "Interestelar",
        tipo: "Película",
        genero: "Ciencia ficción",
        archivo: "generos/Sci-fi.jpeg",
        color: "#435575",
        emoji: "🚀",
        descripcion: "Un viaje espacial para encontrar un nuevo hogar para la humanidad."
    },
    {
        id: "fantastic-mr-fox",
        titulo: "Fantastic Mr. Fox",
        tipo: "Película",
        genero: "Animación",
        archivo: "generos/Animada.jpeg",
        color: "#965d3e",
        emoji: "🦊",
        descripcion: "Un astuto zorro se enfrenta a tres granjeros."
    },
    {
        id: "chihiro",
        titulo: "El viaje de Chihiro",
        tipo: "Película",
        genero: "Fantasía",
        archivo: "generos/Fantasia.jpeg",
        color: "#346d70",
        emoji: "🌌",
        descripcion: "Una niña llega a un misterioso mundo de espíritus."
    },
    {
        id: "stranger-things",
        titulo: "Stranger Things",
        tipo: "Serie",
        genero: "Misterio",
        archivo: "generos/Thriller.jpeg",
        color: "#733a53",
        emoji: "🚲",
        descripcion: "Un grupo de amigos investiga sucesos sobrenaturales."
    },
    {
        id: "the-last-of-us",
        titulo: "The Last of Us",
        tipo: "Serie",
        genero: "Drama",
        archivo: "generos/Drama.jpeg",
        color: "#556447",
        emoji: "🍄",
        descripcion: "Dos sobrevivientes viajan por un mundo devastado."
    },
    {
        id: "avatar",
        titulo: "Avatar: The Last Airbender",
        tipo: "Serie",
        genero: "Aventura",
        archivo: "generos/Aventura.jpeg",
        color: "#456b94",
        emoji: "🌊",
        descripcion: "Un joven debe aprender a dominar los cuatro elementos."
    }
];

const peliculasCatalogo = datosPeliculas.map((pelicula) => ({
    ...pelicula,
    imagen: CARPETA_IMAGENES + pelicula.archivo
}));

const CLAVE_MI_LISTA = "miListaIds";

function obtenerMiLista() {
    try {
        const datos = JSON.parse(
            localStorage.getItem(CLAVE_MI_LISTA) || "[]"
        );

        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        return [];
    }
}

function guardarMiLista(ids) {
    try {
        localStorage.setItem(CLAVE_MI_LISTA, JSON.stringify(ids));
        window.dispatchEvent(new Event("listaActualizada"));
        return true;
    } catch (error) {
        alert("No se pudo guardar la lista.");
        return false;
    }
}

function cambiarEnMiLista(id) {
    const pelicula = peliculasCatalogo.find((p) => p.id === id);

    if (!pelicula) {
        return false;
    }

    const lista = obtenerMiLista();

    const nuevaLista = lista.includes(id)
        ? lista.filter((item) => item !== id)
        : [...lista, id];

    if (guardarMiLista(nuevaLista)) {
        actualizarBotonesLista();
    }

    return nuevaLista.includes(id);
}

function actualizarBotonesLista() {
    const lista = obtenerMiLista();

    document.querySelectorAll("[data-guardar-lista]").forEach((boton) => {
        const id = boton.getAttribute("data-guardar-lista");

        const guardada = lista.includes(id);

        boton.textContent = guardada
            ? "✓ Guardada en mi lista"
            : "+ Agregar a mi lista";

        boton.setAttribute("aria-pressed", String(guardada));
    });
}

document.addEventListener("click", function(evento) {
    const boton = evento.target.closest("[data-guardar-lista]");

    if (!boton) {
        return;
    }

    evento.preventDefault();

    const id = boton.getAttribute("data-guardar-lista");

    cambiarEnMiLista(id);
});

document.addEventListener(
    "DOMContentLoaded",
    actualizarBotonesLista
);

window.addEventListener(
    "listaActualizada",
    actualizarBotonesLista
);

window.CineDatos = {
    peliculas: peliculasCatalogo,
    obtenerMiLista: obtenerMiLista,
    cambiarEnMiLista: cambiarEnMiLista,
    actualizarBotonesLista: actualizarBotonesLista
};
