
const fotoInicial =
    "../../catalogoPeliculas/public/imagenes/perfiles/FotoPerfil.jpeg";

const datosIniciales = {
    nombre: "Usuario",
    foto: fotoInicial,
    pelicula: "Fantastic Mr. Fox",
    serie: "Avatar The Last Airbender"
};

function Perfil() {

    const [perfil, setPerfil] = React.useState(() => {
        try {
            const guardado = localStorage.getItem("perfilUsuario");

            if (guardado) {
                return {
                    ...datosIniciales,
                    ...JSON.parse(guardado)
                };
            }
        } catch (error) {
            console.log("No se pudieron cargar los datos.");
        }

        return datosIniciales;
    });

    const [editando, setEditando] = React.useState(false);
    const [formulario, setFormulario] = React.useState(perfil);
    const [error, setError] = React.useState("");

    function abrirEditor() {
        setFormulario({ ...perfil });
        setError("");
        setEditando(true);
    }

    function cambiarCampo(campo, valor) {
        setFormulario((anterior) => ({
            ...anterior,
            [campo]: valor
        }));
    }

    function cambiarFoto(evento) {
        const archivo = evento.target.files[0];

        if (!archivo) return;

        if (!archivo.type.startsWith("image/")) {
            setError("Selecciona un archivo de imagen.");
            return;
        }

        if (archivo.size > 2 * 1024 * 1024) {
            setError("La imagen debe pesar menos de 2 MB.");
            return;
        }

        setError("");

        const lector = new FileReader();

        lector.onload = function() {
            cambiarCampo("foto", lector.result);
        };

        lector.onerror = function() {
            setError("No se pudo cargar la imagen.");
        };

        lector.readAsDataURL(archivo);
    }

    function guardarCambios(evento) {
        evento.preventDefault();

        if (!formulario.nombre.trim()) {
            setError("Escribe un nombre de usuario.");
            return;
        }

        const nuevosDatos = {
            nombre: formulario.nombre.trim(),
            foto: formulario.foto,
            pelicula: formulario.pelicula.trim(),
            serie: formulario.serie.trim()
        };

        try {
            localStorage.setItem(
                "perfilUsuario",
                JSON.stringify(nuevosDatos)
            );

            setPerfil(nuevosDatos);
            setEditando(false);
            setError("");

        } catch (error) {
            setError(
                "No se pudieron guardar los cambios. Prueba con una imagen más pequeña."
            );
        }
    }

    function cancelarEdicion() {
        setEditando(false);
        setError("");
    }

    return React.createElement(
        React.Fragment,
        null,

        React.createElement(
            "section",
            { className: "presentacion" },

            React.createElement(
                "img",
                {
                    className: "foto-perfil",
                    src: perfil.foto,
                    alt: "Foto de perfil"
                }
            ),

            React.createElement(
                "div",
                { className: "informacion-usuario" },

                React.createElement(
                    "p",
                    { className: "subtitulo" },
                    "PERFIL DE ESPECTADOR"
                ),

                React.createElement(
                    "h1",
                    null,
                    perfil.nombre
                ),

                React.createElement(
                    "button",
                    {
                        className: "editar",
                        type: "button",
                        onClick: abrirEditor
                    },
                    "EDITAR PERFIL"
                )
            )
        ),

        React.createElement(
            "section",
            { className: "preferencias" },

            React.createElement(
                "h2",
                null,
                "MIS FAVORITOS"
            ),

            React.createElement(
                "div",
                { className: "contenedor-preferencias" },

                React.createElement(
                    "div",
                    { className: "tarjeta-preferencia" },

                    React.createElement(
                        "p",
                        null,
                        "PELÍCULA FAVORITA"
                    ),

                    React.createElement(
                        "h3",
                        null,
                        perfil.pelicula
                    )
                ),

                React.createElement(
                    "div",
                    { className: "tarjeta-preferencia" },

                    React.createElement(
                        "p",
                        null,
                        "SERIE FAVORITA"
                    ),

                    React.createElement(
                        "h3",
                        null,
                        perfil.serie
                    )
                )
            )
        ),

        editando && React.createElement(
            "div",
            { className: "fondo-modal" },

            React.createElement(
                "form",
                {
                    className: "modal-editar",
                    onSubmit: guardarCambios
                },

                React.createElement(
                    "h2",
                    null,
                    "Editar perfil"
                ),

                React.createElement(
                    "div",
                    { className: "vista-previa" },

                    React.createElement(
                        "img",
                        {
                            src: formulario.foto,
                            alt: "Vista previa"
                        }
                    )
                ),

                React.createElement(
                    "div",
                    { className: "campo-formulario" },

                    React.createElement(
                        "label",
                        { htmlFor: "foto" },
                        "Cambiar foto de perfil"
                    ),

                    React.createElement(
                        "input",
                        {
                            id: "foto",
                            type: "file",
                            accept: "image/*",
                            onChange: cambiarFoto
                        }
                    )
                ),

                React.createElement(
                    "div",
                    { className: "campo-formulario" },

                    React.createElement(
                        "label",
                        { htmlFor: "nombre" },
                        "Nombre de usuario"
                    ),

                    React.createElement(
                        "input",
                        {
                            id: "nombre",
                            type: "text",
                            value: formulario.nombre,
                            maxLength: 40,
                            onChange: (evento) =>
                                cambiarCampo(
                                    "nombre",
                                    evento.target.value
                                )
                        }
                    )
                ),

                React.createElement(
                    "div",
                    { className: "campo-formulario" },

                    React.createElement(
                        "label",
                        { htmlFor: "pelicula" },
                        "Película favorita"
                    ),

                    React.createElement(
                        "input",
                        {
                            id: "pelicula",
                            type: "text",
                            value: formulario.pelicula,
                            onChange: (evento) =>
                                cambiarCampo(
                                    "pelicula",
                                    evento.target.value
                                )
                        }
                    )
                ),

                React.createElement(
                    "div",
                    { className: "campo-formulario" },

                    React.createElement(
                        "label",
                        { htmlFor: "serie" },
                        "Serie favorita"
                    ),

                    React.createElement(
                        "input",
                        {
                            id: "serie",
                            type: "text",
                            value: formulario.serie,
                            onChange: (evento) =>
                                cambiarCampo(
                                    "serie",
                                    evento.target.value
                                )
                        }
                    )
                ),

                error && React.createElement(
                    "p",
                    { className: "mensaje-error" },
                    error
                ),

                React.createElement(
                    "div",
                    { className: "botones-formulario" },

                    React.createElement(
                        "button",
                        {
                            className: "boton-guardar",
                            type: "submit"
                        },
                        "Guardar cambios"
                    ),

                    React.createElement(
                        "button",
                        {
                            className: "boton-cancelar",
                            type: "button",
                            onClick: cancelarEdicion
                        },
                        "Cancelar"
                    )
                )
            )
        )
    );
}

const contenedor = document.getElementById("perfil-react");

if (contenedor) {
    ReactDOM.createRoot(contenedor).render(
        React.createElement(Perfil)
    );
}
