

const h = React.createElement;

function leerDatos(clave, valorInicial) {
    try {
        const datos = localStorage.getItem(clave);
        return datos ? JSON.parse(datos) : valorInicial;
    } catch (error) {
        return valorInicial;
    }
}

function MiLista() {
    const [ids, setIds] = React.useState(
        () => window.CineDatos.obtenerMiLista()
    );

    const [filtro, setFiltro] = React.useState("Todas");

    const [favoritos, setFavoritos] = React.useState(
        () => leerDatos("peliculasFavoritas", [])
    );

    const [resenas, setResenas] = React.useState(
        () => leerDatos("resenasPeliculas", [])
    );

    const [peliculaSeleccionada, setPeliculaSeleccionada] =
        React.useState(null);

    const [modal, setModal] = React.useState("");
    const [calificacion, setCalificacion] = React.useState("5");
    const [comentario, setComentario] = React.useState("");

    const carrusel = React.useRef(null);

    React.useEffect(() => {
        function actualizar() {
            setIds(window.CineDatos.obtenerMiLista());
        }

        window.addEventListener("listaActualizada", actualizar);
        window.addEventListener("storage", actualizar);

        return () => {
            window.removeEventListener("listaActualizada", actualizar);
            window.removeEventListener("storage", actualizar);
        };
    }, []);

    const guardadas = ids
        .map((id) => window.CineDatos.peliculas.find((p) => p.id === id))
        .filter(Boolean);

    const visibles = guardadas.filter((pelicula) =>
        filtro === "Todas" || pelicula.tipo === filtro
    );

    function cambiarFiltro(tipo) {
        setFiltro(tipo);

        if (carrusel.current) {
            carrusel.current.scrollTo({
                left: 0,
                behavior: "smooth"
            });
        }
    }

    function moverCarrusel(direccion) {
        if (!carrusel.current) return;

        const tarjeta = carrusel.current.querySelector(".tarjeta-pelicula");

        if (!tarjeta) return;

        const ancho = tarjeta.getBoundingClientRect().width;
        const espacio = parseFloat(
            window.getComputedStyle(carrusel.current).gap
        ) || 0;

        carrusel.current.scrollBy({
            left: direccion * (ancho + espacio),
            behavior: "smooth"
        });
    }

    function quitarDeLista(id) {
        window.CineDatos.cambiarEnMiLista(id);
    }

    function cambiarFavorito(id) {
        const nuevos = favoritos.includes(id)
            ? favoritos.filter((item) => item !== id)
            : [...favoritos, id];

        try {
            localStorage.setItem(
                "peliculasFavoritas",
                JSON.stringify(nuevos)
            );

            setFavoritos(nuevos);
        } catch (error) {
            alert("No se pudo actualizar favoritos.");
        }
    }

    function abrirResena(pelicula) {
        const anterior = resenas.find((r) => r.id === pelicula.id);

        setPeliculaSeleccionada(pelicula);
        setCalificacion(
            anterior ? String(anterior.calificacion) : "5"
        );
        setComentario(anterior ? anterior.comentario : "");
        setModal("resena");
    }

    function guardarResena(evento) {
        evento.preventDefault();

        if (!peliculaSeleccionada) return;

        const nueva = {
            id: peliculaSeleccionada.id,
            titulo: peliculaSeleccionada.titulo,
            calificacion: Number(calificacion),
            comentario: comentario.trim()
        };

        const nuevas = resenas.filter(
            (r) => r.id !== peliculaSeleccionada.id
        );

        nuevas.push(nueva);

        try {
            localStorage.setItem(
                "resenasPeliculas",
                JSON.stringify(nuevas)
            );

            setResenas(nuevas);
            cerrarModal();
        } catch (error) {
            alert("No se pudo guardar la reseña.");
        }
    }

    function abrirInformacion(pelicula) {
        setPeliculaSeleccionada(pelicula);
        setModal("informacion");
    }

    function cerrarModal() {
        setModal("");
        setPeliculaSeleccionada(null);
    }

    React.useEffect(() => {
        function cerrarConEscape(evento) {
            if (evento.key === "Escape") {
                cerrarModal();
            }
        }

        window.addEventListener("keydown", cerrarConEscape);

        return () => {
            window.removeEventListener("keydown", cerrarConEscape);
        };
    }, []);

    function crearTarjeta(pelicula) {
        const favorita = favoritos.includes(pelicula.id);
        const tieneResena = resenas.some(
            (r) => r.id === pelicula.id
        );

        return h(
            "article",
            {
                key: pelicula.id,
                className: "tarjeta-pelicula"
            },

            h(
                "div",
                {
                    className: "portada-pelicula",
                    style: {
                        "--color-poster": pelicula.color
                    }
                },

                h(
                    "span",
                    { className: "emoji-pelicula" },
                    pelicula.emoji
                ),

                h("img", {
                    className: "imagen-pelicula",
                    src: pelicula.imagen,
                    alt: pelicula.titulo,
                    onError: (evento) => {
                        evento.currentTarget.style.display = "none";
                    }
                }),

                h(
                    "span",
                    { className: "tipo-pelicula" },
                    pelicula.tipo
                ),

                h(
                    "h3",
                    { className: "nombre-pelicula" },
                    pelicula.titulo
                )
            ),

            h(
                "div",
                { className: "capa-pelicula" },

                h("h3", null, pelicula.titulo),

                h(
                    "p",
                    null,
                    pelicula.tipo + " · " + pelicula.genero
                ),

                h(
                    "div",
                    { className: "acciones-pelicula" },

                    h(
                        "button",
                        {
                            className: "accion",
                            type: "button",
                            onClick: () => cambiarFavorito(pelicula.id)
                        },
                        favorita
                            ? "♥ Quitar de favoritos"
                            : "♡ Agregar a favoritos"
                    ),

                    h(
                        "button",
                        {
                            className: "accion",
                            type: "button",
                            onClick: () => abrirResena(pelicula)
                        },
                        tieneResena
                            ? "★ Editar reseña"
                            : "☆ Calificar / Reseña"
                    ),

                    h(
                        "button",
                        {
                            className: "accion principal",
                            type: "button",
                            onClick: () => abrirInformacion(pelicula)
                        },
                        "ⓘ Ver información"
                    ),

                    h(
                        "button",
                        {
                            className: "accion",
                            type: "button",
                            onClick: () => quitarDeLista(pelicula.id)
                        },
                        "Quitar de mi lista"
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
                "Guarda las historias que quieres descubrir y organízalas en un solo lugar."
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
                        guardadas.length + " títulos guardados"
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
                                    "filtro" +
                                    (filtro === tipo ? " activo" : ""),
                                onClick: () => cambiarFiltro(tipo)
                            },

                            tipo === "Película"
                                ? "Películas"
                                : tipo === "Serie"
                                    ? "Series"
                                    : "Todas"
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
                            type: "button",
                            className: "flecha-carrusel",
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
                            type: "button",
                            className: "flecha-carrusel",
                            "aria-label": "Siguiente",
                            onClick: () => moverCarrusel(1)
                        },
                        "›"
                    )
                )
                : h(
                    "div",
                    { className: "lista-vacia" },

                    h(
                        "h3",
                        null,
                        "Todavía no hay títulos aquí"
                    ),

                    h(
                        "p",
                        null,
                        "Agrega películas o series desde el catálogo para verlas en tu lista."
                    ),

                    h(
                        "a",
                        {
                            href: "buscador.html",
                            className: "ir-catalogo"
                        },
                        "Explorar catálogo"
                    )
                )
        ),

        modal === "resena" &&
        peliculaSeleccionada &&
        h(
            "div",
            { className: "fondo-modal" },

            h(
                "form",
                {
                    className: "modal-lista",
                    role: "dialog",
                    "aria-modal": "true",
                    onSubmit: guardarResena
                },

                h("h2", null, "Calificar y reseñar"),

                h(
                    "p",
                    null,
                    peliculaSeleccionada.titulo
                ),

                h(
                    "div",
                    { className: "campo-resena" },

                    h(
                        "label",
                        { htmlFor: "calificacion" },
                        "Calificación"
                    ),

                    h(
                        "select",
                        {
                            id: "calificacion",
                            value: calificacion,
                            onChange: (evento) =>
                                setCalificacion(evento.target.value)
                        },

                        [1, 2, 3, 4, 5].map((numero) =>
                            h(
                                "option",
                                {
                                    key: numero,
                                    value: String(numero)
                                },
                                "★".repeat(numero) +
                                " (" + numero + "/5)"
                            )
                        )
                    )
                ),

                h(
                    "div",
                    { className: "campo-resena" },

                    h(
                        "label",
                        { htmlFor: "comentario" },
                        "Tu reseña"
                    ),

                    h("textarea", {
                        id: "comentario",
                        value: comentario,
                        placeholder: "Escribe tu opinión...",
                        onChange: (evento) =>
                            setComentario(evento.target.value)
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
                            className: "cancelar",
                            type: "button",
                            onClick: cerrarModal
                        },
                        "Cancelar"
                    )
                )
            )
        ),

        modal === "informacion" &&
        peliculaSeleccionada &&
        h(
            "div",
            { className: "fondo-modal" },

            h(
                "div",
                {
                    className: "modal-lista",
                    role: "dialog",
                    "aria-modal": "true"
                },

                h(
                    "h2",
                    null,
                    peliculaSeleccionada.titulo
                ),

                h(
                    "p",
                    null,
                    peliculaSeleccionada.tipo +
                    " · " +
                    peliculaSeleccionada.genero
                ),

                h(
                    "p",
                    null,
                    peliculaSeleccionada.descripcion
                ),

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

const contenedorLista =
    document.getElementById("mi-lista-react");

if (contenedorLista) {
    ReactDOM.createRoot(contenedorLista).render(
        h(MiLista)
    );
}
