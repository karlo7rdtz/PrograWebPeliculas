
const generos = [
    {
        nombre: "THRILLER",
        imagen: "../../catalogoPeliculas/public/imagenes/fondos/thrillerdif.jpg"
    },
    {
        nombre: "ROMANCE",
        imagen: "../../catalogoPeliculas/public/imagenes/fondos/romancedif.jpg"
    },
    {
        nombre: "ANIMADA",
        imagen: "../../catalogoPeliculas/public/imagenes/fondos/animadadif.jpg"
    },
    {
        nombre: "COMEDIA",
        imagen: "../../catalogoPeliculas/public/imagenes/fondos/comediadif.jpg"
    },
    {
        nombre: "TERROR",
        imagen: "../../catalogoPeliculas/public/imagenes/fondos/terrordif.jpg"
    },
    {
        nombre: "ACCIÓN",
        imagen: "../../catalogoPeliculas/public/imagenes/fondos/acciondif.jpg"
    },
    {
        nombre: "SCI-FI",
        imagen: "../../catalogoPeliculas/public/imagenes/fondos/scifidif.jpg"
    },
    {
        nombre: "DRAMA",
        imagen: "../../catalogoPeliculas/public/imagenes/fondos/dramadif.jpg"
    },
    {
        nombre: "FANTASÍA",
        imagen: "../../catalogoPeliculas/public/imagenes/fondos/fantasiadif.jpg"
    },
    {
        nombre: "AVENTURA",
        imagen: "../../catalogoPeliculas/public/imagenes/fondos/aventuradif.jpg"
    },
    {
        nombre: "CRIMEN",
        imagen: "../../catalogoPeliculas/public/imagenes/fondos/crimendif.jpg"
    }
];

function CarruselGeneros() {

    const [inicio, setInicio] = React.useState(0);

    const cantidadVisible = 5;

    const maximo = Math.max(
        0,
        generos.length - cantidadVisible
    );

    function anterior() {
        if (inicio > 0) {
            setInicio(inicio - 1);
        }
    }

    function siguiente() {
        if (inicio < maximo) {
            setInicio(inicio + 1);
        }
    }

    const desplazamiento =
        `translateX(calc(-${inicio} * ((100% - 4 * var(--espacio-generos)) / 5 + var(--espacio-generos))))`;

    return React.createElement(
        "div",
        { className: "carrusel-generos" },

        React.createElement(
            "button",
            {
                className: "flecha-genero",
                type: "button",
                onClick: anterior,
                disabled: inicio === 0,
                "aria-label": "Géneros anteriores"
            },
            "❮"
        ),

        React.createElement(
            "div",
            {
                className: "ventana-generos"
            },

            React.createElement(
                "div",
                {
                    className: "pista-generos",
                    style: {
                        transform: desplazamiento
                    }
                },

                generos.map((genero) =>
                    React.createElement(
                        "a",
                        {
                            href: "#",
                            className: "genero",
                            key: genero.nombre
                        },

                        React.createElement(
                            "img",
                            {
                                src: genero.imagen,
                                alt: ""
                            }
                        ),

                        React.createElement(
                            "span",
                            null,
                            genero.nombre
                        )
                    )
                )
            )
        ),


        React.createElement(
            "button",
            {
                className: "flecha-genero",
                type: "button",
                onClick: siguiente,
                disabled: inicio === maximo,
                "aria-label": "Siguientes géneros"
            },
            "❯"
        )
    );
}

const contenedor = document.getElementById("carrusel-generos");

if (contenedor) {
    ReactDOM.createRoot(contenedor).render(
        React.createElement(CarruselGeneros)
    );
}
