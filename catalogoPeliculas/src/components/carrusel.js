
const generos = [
    {
        nombre: "THRILLER",
        imagen: "../../public/imagenes/fondos/thrillerdif.jpg"
    },
    {
        nombre: "ROMANCE",
        imagen: "../../public/imagenes/fondos/romancedif.jpg"
    },
    {
        nombre: "ANIMADA",
        imagen: "../../public/imagenes/fondos/animadadif.jpg"
    },
    {
        nombre: "COMEDIA",
        imagen: "../../public/imagenes/fondos/comediadif.jpg"
    },
    {
        nombre: "TERROR",
        imagen: "../../public/imagenes/fondos/terrordif.jpg"
    },
    {
        nombre: "ACCIÓN",
        imagen: "../../public/imagenes/fondos/acciondif.jpg"
    },
    {
        nombre: "SCI-FI",
        imagen: "../../public/imagenes/fondos/scifidif.jpg"
    },
    {
        nombre: "DRAMA",
        imagen: "../../public/imagenes/fondos/dramadif.jpg"
    },
    {
        nombre: "FANTASÍA",
        imagen: "../../public/imagenes/fondos/fantasiadif.jpg"
    },
    {
        nombre: "AVENTURA",
        imagen: "../../public/imagenes/fondos/aventuradif.jpg"
    },
    {
        nombre: "CRIMEN",
        imagen: "../../public/imagenes/fondos/crimendif.jpg"
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
        href: "/?genero=" + encodeURIComponent(
            genero.nombre === "ANIMADA" ? "Animación" :
            genero.nombre === "SCI-FI" ? "Ciencia ficción" :
            genero.nombre.charAt(0) +
            genero.nombre.slice(1).toLowerCase()
        ),
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
