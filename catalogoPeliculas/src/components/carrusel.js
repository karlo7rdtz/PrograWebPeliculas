const generos = [
    { nombre: "THRILLER", imagen: "/imagenes/fondos/thrillerdif.jpg" },
    { nombre: "ROMANCE", imagen: "/imagenes/fondos/romancedif.jpg" },
    { nombre: "ANIMADA", imagen: "/imagenes/fondos/animadadif.jpg" },
    { nombre: "COMEDIA", imagen: "/imagenes/fondos/comediadif.jpg" },
    { nombre: "TERROR", imagen: "/imagenes/fondos/terrordif.jpg" },
    { nombre: "ACCIÓN", imagen: "/imagenes/fondos/acciondif.jpg" },
    { nombre: "SCI-FI", imagen: "/imagenes/fondos/scifidif.jpg" },
    { nombre: "DRAMA", imagen: "/imagenes/fondos/dramadif.jpg" },
    { nombre: "FANTASÍA", imagen: "/imagenes/fondos/fantasiadif.jpg" },
    { nombre: "AVENTURA", imagen: "/imagenes/fondos/aventuradif.jpg" },
    { nombre: "CRIMEN", imagen: "/imagenes/fondos/crimendif.jpg" }
];

function rutaGenero(nombre) {
    const equivalencias = {
        "ANIMADA": "Animación",
        "SCI-FI": "Ciencia ficción"
    };
    const valor = equivalencias[nombre] ||
        nombre.charAt(0) + nombre.slice(1).toLowerCase();
    return "/?genero=" + encodeURIComponent(valor);
}

function CarruselGeneros() {
    
    const [centro, setCentro] = React.useState(2);
    const total = generos.length;

    function mover(pasos) {
        setCentro(actual => (actual + pasos + total) % total);
    }

    const visibles = [-2, -1, 0, 1, 2].map(desfase => {
        const indice = (centro + desfase + total) % total;
        return { ...generos[indice], desfase, indice };
    });

    return React.createElement(
        "div", { className: "carrusel-generos" },
        React.createElement("button", {
            type: "button", className: "flecha-genero",
            onClick: () => mover(-1), "aria-label": "Género anterior"
        }, "❮"),
        React.createElement(
            "div", { className: "pista-generos", "aria-label": "Géneros cinematográficos" },
            visibles.map(genero =>
                React.createElement(
                    "a", {
                        href: rutaGenero(genero.nombre),
                        className: "genero genero-pos-" + (genero.desfase + 2),
                        key: genero.nombre,
                        "aria-label": "Ver películas de " + genero.nombre
                    },
                    React.createElement("img", {
                        src: genero.imagen, alt: "", loading: "lazy"
                    }),
                    React.createElement("span", null, genero.nombre)
                )
            )
        ),
        React.createElement("button", {
            type: "button", className: "flecha-genero",
            onClick: () => mover(1), "aria-label": "Género siguiente"
        }, "❯")
    );
}

const contenedorGeneros = document.getElementById("carrusel-generos");
if (contenedorGeneros) {
    ReactDOM.createRoot(contenedorGeneros).render(
        React.createElement(CarruselGeneros)
    );
}
