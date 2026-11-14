
const h = React.createElement;

const peliculasEjemplo = [
    {
        id: 1,
        titulo: "Interestelar",
        tipo: "Película",
        genero: "Ciencia ficción",
        emoji: "🚀",
        color: "#455c77",
        imagen: "",
        descripcion: "Un viaje espacial en busca de un nuevo hogar para la humanidad."
    },
    {
        id: 2,
        titulo: "Fantastic Mr. Fox",
        tipo: "Película",
        genero: "Animación",
        emoji: "🦊",
        color: "#a46b43",
        imagen: "",
        descripcion: "Un astuto zorro pone en peligro la tranquilidad de su familia."
    },
    {
        id: 3,
        titulo: "El viaje de Chihiro",
        tipo: "Película",
        genero: "Fantasía",
        emoji: "🌌",
        color: "#347b77",
        imagen: "",
        descripcion: "Una niña descubre un misterioso mundo lleno de espíritus."
    },
    {
        id: 4,
        titulo: "Stranger Things",
        tipo: "Serie",
        genero: "Misterio",
        emoji: "🚲",
        color: "#733a53",
        imagen: "",
        descripcion: "Un grupo de amigos descubre sucesos sobrenaturales."
    },
    {
        id: 5,
        titulo: "The Last of Us",
        tipo: "Serie",
        genero: "Drama",
        emoji: "🍄",
        color: "#566448",
        imagen: "",
        descripcion: "Dos sobrevivientes atraviesan un mundo devastado."
    },
    {
        id: 6,
        titulo: "Avatar",
        tipo: "Serie",
        genero: "Aventura",
        emoji: "🌊",
        color: "#486a91",
        imagen: "",
        descripcion: "Un joven debe dominar los cuatro elementos."
    }
];

function leerDatos(clave, valorInicial) {
    try {
        const datos = localStorage.getItem(clave);
        return datos ? JSON.parse(datos) : valorInicial;
    } catch (error) {
        return valorInicial;
    }
}

function MiLista() {
const carpetaImagenes =
    "../../catalogoPeliculas/public/imagenes/posters/";
    const [peliculas] = React.useState(() =>
        leerDatos("miListaPeliculas", peliculasEjemplo)
    );

    const [filtro, setFiltro] = React.useState("Todas");

    const [favoritos, setFavoritos] = React.useState(() =>
        leerDatos("peliculasFavoritas", [])
    );

    const [resenas, setResenas] = React.useState(() =>
        leerDatos("resenasPeliculas", [])
    );

    const [seleccionada, setSeleccionada] = React.useState(null);
    const [modal, setModal] = React.useState("");
    const [calificacion, setCalificacion] = React.useState("5");
    const [comentario, setComentario] = React.useState("");

    const carrusel = React.useRef(null);

    const visibles = peliculas.filter((pelicula) =>
        filtro === "Todas" || pelicula.tipo === filtro
    );

    function moverCarrusel(direccion) {
        if (carrusel.current) {
            const tarjeta = carrusel.current.querySelector(".tarjeta-pelicula");

            if (tarjeta) {
                const distancia = tarjeta.getBoundingClientRect().width + 22;

                carrusel.current.scrollBy({
                    left: distancia * direccion,
                    behavior: "smooth"
                });
            }
        }
    }

    function cambiarFiltro(nuevoFiltro) {
        setFiltro(nuevoFiltro);

        if (carrusel.current) {
            carrusel.current.scrollTo({
                left: 0,
                behavior: "smooth"
            });
        }
    }

    function cambiarFavorito(pelicula) {
        const existe = favoritos.includes(pelicula.id);

        const nuevos = existe
            ? favoritos.filter((id) => id !== pelicula.id)
            : [...favoritos, pelicula.id];

        setFavoritos(nuevos);
        localStorage.setItem("peliculasFavoritas", JSON.stringify(nuevos));
    }

    function abrirResena(pelicula) {
        setSeleccionada(pelicula);

        const anterior = resenas.find((r) => r.id === pelicula.id);

        setCalificacion(anterior ? String(anterior.calificacion) : "5");
        setComentario(anterior ? anterior.comentario : "");
        setModal("resena");
    }

    function guardarResena(evento) {
        evento.preventDefault();

        const nuevaResena = {
            id: seleccionada.id,
            titulo: seleccionada.titulo,
            calificacion: Number(calificacion),
            comentario: comentario.trim()
        };

        const nuevas = resenas.filter((r) =>
            r.id !== seleccionada.id
        );

        nuevas.push(nuevaResena);

        setResenas(nuevas);
        localStorage.setItem("resenasPeliculas", JSON.stringify(nuevas));

        setModal("");
        setSeleccionada(null);
    }

    function abrirInformacion(pelicula) {
        setSeleccionada(pelicula);
        setModal("informacion");
    }

    function cerrarModal() {
        setModal("");
        setSeleccionada(null);
    }

    function crearTarjeta(pelicula) {
        const esFavorita = favoritos.includes(pelicula.id);
        const tieneResena = resenas.some((r) => r.id === pelicula.id);

        return h(
            "article",
            {
                className: "tarjeta-pelicula",
                key: pelicula.id
            },

            h(
                "div",
                {
                    className: "fondo-pelicula",
                    style: { "--color-poster": pelicula.color }
                },

                pelicula.imagen && h("img", {
                    src: pelicula.imagen,
                    alt: pelicula.titulo
                }),

                h("span", { className: "genero-pelicula" }, pelicula.genero),

                !pelicula.imagen && h(
                    "span",
                    { className: "ilustracion-pelicula" },
                    pelicula.emoji
                ),

                h(
                    "h3",
                    { className: "titulo-portada" },
                    pelicula.titulo
                )
            ),

            h(
                "div",
                { className: "capa-pelicula" },

                h("h3", null, pelicula.titulo),

                h("p", null, pelicula.tipo + " · " + pelicula.genero),

                h(
                    "div",
                    { className: "acciones-pelicula" },

                    h(
                        "button",
                        {
                            type: "button",
                            className: "accion",
                            onClick: () => cambiarFavorito(pelicula)
                        },
                        esFavorita ? "♥ Quitar favorito" : "♡ Guardar favorito"
                    ),

                    h(
                        "button",
                        {
                            type: "button",
                            className: "accion",
                            onClick: () => abrirResena(pelicula)
                        },
                        tieneResena ? "★ Editar reseña" : "☆ Calificar / Reseña"
                    ),

                    h(
                        "button",
                        {
                            type: "button",
                            className: "accion principal",
                            onClick: () => abrirInformacion(pelicula)
                        },
                        "ⓘ Ver información"
                    )
                )
            )
        );
    }

    return h(
        React.Fragment,
        null,

        h(
            "section",
            { className: "portada-lista" },

            h(
                "p",
                { className: "etiqueta-lista" },
                "TU ESPACIO CINEMATOGRÁFICO"
            ),

            h("h1", null, "MI LISTA"),

            h(
                "p",
                { className: "descripcion-lista" },
                "Todas las historias que quieres descubrir, en un solo lugar."
            )
        ),

        h(
            "section",
            { className: "contenido-lista" },

            h(
                "div",
                { className: "barra-lista" },

                h(
                    "div",
                    null,

                    h("h2", null, "Mis películas y series"),

                    h(
                        "p",
                        { className: "contador-lista" },
                        visibles.length + " títulos en tu colección"
                    )
                ),

                h(
                    "div",
                    { className: "filtros-lista" },

                    ["Todas", "Película", "Serie"].map((tipo) =>
                        h(
                            "button",
                            {
                                key: tipo,
                                type: "button",
                                className:
                                    "filtro" + (filtro === tipo ? " activo" : ""),
                                onClick: () => cambiarFiltro(tipo)
                            },
                            tipo === "Película" ? "Películas" :
                            tipo === "Serie" ? "Series" : "Todas"
                        )
                    )
                )
            ),

            visibles.length > 0
                ? h(
                    "div",
                    { className: "area-carrusel" },

                    h(
                        "button",
                        {
                            className: "flecha-carrusel",
                            type: "button",
                            "aria-label": "Anterior",
                            onClick: () => moverCarrusel(-1)
                        },
                        "‹"
                    ),

                    h(
                        "div",
                        {
                            className: "carrusel-lista",
                            ref: carrusel
                        },
                        visibles.map(crearTarjeta)
                    ),

                    h(
                        "button",
                        {
                            className: "flecha-carrusel",
                            type: "button",
                            "aria-label": "Siguiente",
                            onClick: () => moverCarrusel(1)
                        },
                        "›"
                    )
                )
                : h(
                    "div",
                    { className: "lista-vacia" },
                    h("h3", null, "No hay títulos en esta categoría"),
                    h("p", null, "Prueba seleccionando otro filtro.")
                )
        ),

        modal === "resena" && seleccionada && h(
            "div",
            { className: "fondo-modal" },

            h(
                "form",
                {
                    className: "modal-lista",
                    onSubmit: guardarResena
                },

                h("h2", null, "Calificar y reseñar"),

                h("p", null, seleccionada.titulo),

                h(
                    "div",
                    { className: "campo-resena" },

                    h("label", { htmlFor: "calificacion" }, "Calificación"),

                    h(
                        "select",
                        {
                            id: "calificacion",
                            value: calificacion,
                            onChange: (e) => setCalificacion(e.target.value)
                        },

                        [1, 2, 3, 4, 5].map((numero) =>
                            h(
                                "option",
                                {
                                    key: numero,
                                    value: String(numero)
                                },
                                "★".repeat(numero) + " (" + numero + "/5)"
                            )
                        )
                    )
                ),

                h(
                    "div",
                    { className: "campo-resena" },

                    h("label", { htmlFor: "comentario" }, "Tu reseña"),

                    h("textarea", {
                        id: "comentario",
                        value: comentario,
                        placeholder: "¿Qué te pareció esta historia?",
                        onChange: (e) => setComentario(e.target.value)
                    })
                ),

                h(
                    "div",
                    { className: "botones-modal" },

                    h(
                        "button",
                        { type: "submit" },
                        "Guardar reseña"
                    ),

                    h(
                        "button",
                        {
                            type: "button",
                            className: "cancelar",
                            onClick: cerrarModal
                        },
                        "Cancelar"
                    )
                )
            )
        ),

        modal === "informacion" && seleccionada && h(
            "div",
            { className: "fondo-modal" },

            h(
                "div",
                { className: "modal-lista" },

                h("h2", null, seleccionada.titulo),

                h(
                    "p",
                    null,
                    seleccionada.tipo + " · " + seleccionada.genero
                ),

                h("p", null, seleccionada.descripcion),

                h(
                    "div",
                    { className: "botones-modal" },

                    h(
                        "button",
                        {
                            type: "button",
                            onClick: cerrarModal
                        },
                        "Cerrar"
                    )
                )
            )
        )
    );
}

const contenedor = document.getElementById("mi-lista-react");

if (contenedor) {
    ReactDOM.createRoot(contenedor).render(
        h(MiLista)
    );
}
