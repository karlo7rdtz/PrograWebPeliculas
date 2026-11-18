
const e = React.createElement;

const datosIniciales = {
    nombre: "Usuario",
    foto: "/imagenes/perfiles/FotoPerfil.jpeg",
    pelicula: "Fantastic Mr. Fox",
    serie: "Avatar The Last Airbender",

    imagenFavoritos: "/imagenes/perfiles/Favoritos.jpeg",
    imagenLista: "/imagenes/perfiles/Lista.jpeg",
    imagenResenas: "/imagenes/perfiles/Reseñas.jpeg"
};

const accesosActividad = [
    {
        campo: "imagenFavoritos",
        nombre: "FAVORITOS",
        descripcion: "Tus historias preferidas",
        enlace: "/?vista=favoritos",
        numero: "01"
    },
    {
        campo: "imagenLista",
        nombre: "MI LISTA",
        descripcion: "Historias que quieres descubrir",
        enlace: "/?vista=lista",
        numero: "02"
    },
    {
        campo: "imagenResenas",
        nombre: "RESEÑAS",
        descripcion: "Tus películas calificadas",
        enlace: "/?vista=calificadas",
        numero: "03"
    }
];

function Perfil() {

    const [perfil, setPerfil] = React.useState(() => {
        try {
            const datos = localStorage.getItem("perfilUsuario");

            if (datos) {
                return {
                    ...datosIniciales,
                    ...JSON.parse(datos)
                };
            }
        } catch (error) {
            console.log("Error al cargar el perfil.");
        }

        return datosIniciales;
    });

    const [editando, setEditando] = React.useState(false);
    const [formulario, setFormulario] = React.useState(perfil);
    const [error, setError] = React.useState("");
    const [procesando, setProcesando] = React.useState(false);
    const [indiceActivo, setIndiceActivo] = React.useState(1);

    function girarRueda(direccion) {
        setIndiceActivo(anterior => {
            const total = accesosActividad.length;

            return (anterior + direccion + total) % total;
        });
    }

    function seleccionarTarjeta(indice) {
        setIndiceActivo(indice);
    }

    function posicionTarjeta(indice) {
        const diferencia =
            (indice - indiceActivo + accesosActividad.length)
            % accesosActividad.length;

        if (diferencia === 0) return "centro";
        if (diferencia === 1) return "derecha";

        return "izquierda";
    }

    function abrirEditor() {
        setFormulario({ ...perfil });
        setError("");
        setEditando(true);
    }

    function cancelarEdicion() {
        if (procesando) return;

        setEditando(false);
        setError("");
    }

    function cambiarCampo(campo, valor) {
        setFormulario(anterior => ({
            ...anterior,
            [campo]: valor
        }));
    }

    function cambiarImagen(campo, evento) {
        const archivo = evento.target.files[0];

        if (!archivo) return;

        if (!archivo.type.startsWith("image/")) {
            setError("Selecciona un archivo de imagen válido.");
            return;
        }

        if (archivo.size > 6 * 1024 * 1024) {
            setError("La imagen debe pesar menos de 6 MB.");
            return;
        }

        setError("");
        setProcesando(true);

        const lector = new FileReader();

        lector.onload = function() {
            const imagen = new Image();

            imagen.onload = function() {
                try {
                    const maximo = 800;

                    const escala = Math.min(
                        1,
                        maximo / Math.max(
                            imagen.width,
                            imagen.height
                        )
                    );

                    const ancho = Math.max(
                        1,
                        Math.round(imagen.width * escala)
                    );

                    const alto = Math.max(
                        1,
                        Math.round(imagen.height * escala)
                    );

                    const canvas =
                        document.createElement("canvas");

                    canvas.width = ancho;
                    canvas.height = alto;

                    const contexto = canvas.getContext("2d");

                    if (!contexto) {
                        throw new Error("No se pudo procesar.");
                    }

                    contexto.fillStyle = "#ffffff";
                    contexto.fillRect(0, 0, ancho, alto);

                    contexto.drawImage(
                        imagen,
                        0,
                        0,
                        ancho,
                        alto
                    );

                    const resultado = canvas.toDataURL(
                        "image/jpeg",
                        0.7
                    );

                    cambiarCampo(campo, resultado);
                    setError("");

                } catch (error) {
                    setError("No se pudo procesar la imagen.");
                }

                setProcesando(false);
            };

            imagen.onerror = function() {
                setError("No se pudo abrir la imagen.");
                setProcesando(false);
            };

            imagen.src = lector.result;
        };

        lector.onerror = function() {
            setError("No se pudo leer el archivo.");
            setProcesando(false);
        };

        lector.readAsDataURL(archivo);
    }

    function guardarCambios(evento) {
        evento.preventDefault();

        if (procesando) return;

        if (!formulario.nombre.trim()) {
            setError("Escribe un nombre de usuario.");
            return;
        }

        const nuevosDatos = {
            ...formulario,
            nombre: formulario.nombre.trim(),
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
                "No se pudieron guardar los cambios. " +
                "Utiliza imágenes más pequeñas."
            );
        }
    }

    function campoTexto(campo, etiqueta) {
        return e(
            "div",
            {
                className: "campo-formulario",
                key: campo
            },

            e(
                "label",
                { htmlFor: campo },
                etiqueta
            ),

            e("input", {
                id: campo,
                type: "text",
                value: formulario[campo] || "",
                maxLength: campo === "nombre" ? 40 : 100,

                onChange: evento =>
                    cambiarCampo(campo, evento.target.value)
            })
        );
    }

    function campoImagen(campo, etiqueta) {
        return e(
            "div",
            {
                className: "campo-imagen-actividad",
                key: campo
            },

            e("img", {
                src: formulario[campo],
                alt: "Vista previa de " + etiqueta,
                className: "vista-actividad"
            }),

            e(
                "div",
                { className: "campo-formulario" },

                e(
                    "label",
                    { htmlFor: campo },
                    etiqueta
                ),

                e("input", {
                    id: campo,
                    type: "file",
                    accept: "image/*",
                    disabled: procesando,

                    onChange: evento =>
                        cambiarImagen(campo, evento)
                })
            )
        );
    }

    return e(
        React.Fragment,
        null,

        e(
            "section",
            { className: "portada-perfil" },

            e(
                "div",
                { className: "portada-contenido" },

                e(
                    "p",
                    { className: "portada-superior" },
                    "UNA HISTORIA PROTAGONIZADA POR"
                ),

                e(
                    "h1",
                    { className: "nombre-perfil" },
                    perfil.nombre
                ),

                e(
                    "div",
                    { className: "portada-acciones" },

                    e(
                        "button",
                        {
                            type: "button",
                            className: "editar",
                            onClick: abrirEditor
                        },
                        "✎ EDITAR PERFIL"
                    ),

                )
            ),

            e(
                "div",
                { className: "portada-imagen" },

                e("img", {
                    src: perfil.foto,
                    alt: "Foto de perfil",
                    className: "foto-perfil"
                }),

                e(
                    "span",
                    { className: "placa-foto" },
                    "ESPECTADOR PRINCIPAL"
                )
            ),

            e("div", {
                className: "linea-escena",
                "aria-hidden": true
            })
        ),

        e(
            "section",
            { className: "seccion-reparto" },

            e(
                "h2",
                { className: "titulo-seccion" },
                "MIS HISTORIAS FAVORITAS"
            ),

            e(
                "div",
                { className: "reparto-contenedor" },

                e(
                    "article",
                    { className: "tarjeta-reparto" },

                    e(
                        "div",
                        null,

                        e(
                            "p",
                            { className: "reparto-tipo" },
                            "PELÍCULA FAVORITA"
                        ),

                        e(
                            "h3",
                            null,
                            perfil.pelicula || "Sin seleccionar"
                        )
                    )
                ),

                e(
                    "article",
                    { className: "tarjeta-reparto" },

                    e(
                        "div",
                        null,

                        e(
                            "p",
                            { className: "reparto-tipo" },
                            "SERIE FAVORITA"
                        ),

                        e(
                            "h3",
                            null,
                            perfil.serie || "Sin seleccionar"
                        )
                    )
                )
            )
        ),

        e(
            "section",
            { className: "seccion-actividad" },

            e(
                "h2",
                { className: "titulo-seccion" },
                "MI ACTIVIDAD"
            ),

            e(
                "div",
                { className: "rueda-cine" },

                e(
                    "div",
                    { className: "rueda-encabezado" },

                    e(
                        "div",
                        { className: "rueda-controles" },

                        e(
                            "button",
                            {
                                type: "button",
                                className: "flecha-rueda",
                                "aria-label": "Girar a la izquierda",
                                onClick: () => girarRueda(-1)
                            },
                            "❮"
                        ),

                        e(
                            "button",
                            {
                                type: "button",
                                className: "flecha-rueda",
                                "aria-label": "Girar a la derecha",
                                onClick: () => girarRueda(1)
                            },
                            "❯"
                        )
                    )
                ),

                e(
                    "div",
                    { className: "escenario-rueda" },

                    e("div", {
                        className: "cinta-cine",
                        "aria-hidden": true
                    }),

                    e("div", {
                        className: "rueda-fondo",
                        "aria-hidden": true
                    }),

                    e("div", {
                        className: "rueda-fondo-interior",
                        "aria-hidden": true
                    }),

                    accesosActividad.map((acceso, indice) => {

                        const posicion = posicionTarjeta(indice);
                        const activa = posicion === "centro";

                        return e(
                            "div",
                            {
                                key: acceso.campo,

                                className:
                                    "rueda-tarjeta posicion-" + posicion,

                                onClick: activa
                                    ? undefined
                                    : () => seleccionarTarjeta(indice),

                                onKeyDown: activa
                                    ? undefined
                                    : evento => {
                                        if (
                                            evento.key === "Enter" ||
                                            evento.key === " "
                                        ) {
                                            evento.preventDefault();
                                            seleccionarTarjeta(indice);
                                        }
                                    },

                                role: activa ? undefined : "button",
                                tabIndex: activa ? undefined : 0,

                                "aria-label": activa
                                    ? undefined
                                    : "Seleccionar " + acceso.nombre
                            },

                            e(
                                "span",
                                { className: "numero-tarjeta" },
                                acceso.numero
                            ),

                            e("img", {
                                src: perfil[acceso.campo],
                                alt: acceso.nombre,
                                className: "rueda-imagen"
                            }),

                            e(
                                "h3",
                                null,
                                acceso.nombre
                            ),

                            e(
                                "p",
                                { className: "rueda-descripcion" },
                                acceso.descripcion
                            ),

                            activa
                                ? e(
                                    "a",
                                    {
                                        href: acceso.enlace,
                                        className: "boton-explorar"
                                    },
                                    "EXPLORAR ↗"
                                )
                                : e(
                                    "span",
                                    {
                                        className: "rueda-seleccionar"
                                    },
                                    "SELECCIONAR"
                                )
                        );
                    })
                ),

                e(
                    "div",
                    { className: "indicadores-rueda" },

                    accesosActividad.map((acceso, indice) =>
                        e(
                            "button",
                            {
                                key: acceso.campo,
                                type: "button",

                                className:
                                    "punto-rueda " +
                                    (indice === indiceActivo
                                        ? "punto-activo"
                                        : ""),

                                "aria-label":
                                    "Seleccionar " + acceso.nombre,

                                "aria-pressed":
                                    indice === indiceActivo,

                                onClick: () =>
                                    seleccionarTarjeta(indice)
                            }
                        )
                    )
                )
            )
        ),

        editando && e(
            "div",
            {
                className: "fondo-modal",

                onMouseDown: evento => {
                    if (evento.target === evento.currentTarget) {
                        cancelarEdicion();
                    }
                }
            },

            e(
                "form",
                {
                    className: "modal-editar",
                    onSubmit: guardarCambios
                },

                e(
                    "div",
                    { className: "modal-encabezado" },

                    e(
                        "h2",
                        null,
                        "EDITAR PERFIL"
                    ),

                    e(
                        "button",
                        {
                            type: "button",
                            className: "cerrar-modal",
                            disabled: procesando,
                            onClick: cancelarEdicion
                        },
                        "×"
                    )
                ),

                e(
                    "h3",
                    { className: "subtitulo-editor" },
                    "FOTO DE PERFIL"
                ),

                campoImagen(
                    "foto",
                    "Cambiar foto de perfil"
                ),

                e(
                    "h3",
                    { className: "subtitulo-editor" },
                    "DATOS DEL ESPECTADOR"
                ),

                campoTexto("nombre", "Nombre de usuario"),
                campoTexto("pelicula", "Película favorita"),
                campoTexto("serie", "Serie favorita"),

                e(
                    "h3",
                    { className: "subtitulo-editor" },
                    "IMÁGENES DE MI ACTIVIDAD"
                ),

                campoImagen(
                    "imagenFavoritos",
                    "Imagen de Favoritos"
                ),

                campoImagen(
                    "imagenLista",
                    "Imagen de Mi lista"
                ),

                campoImagen(
                    "imagenResenas",
                    "Imagen de Reseñas"
                ),

                procesando && e(
                    "p",
                    { className: "mensaje-cargando" },
                    "Procesando imagen..."
                ),

                error && e(
                    "p",
                    {
                        className: "mensaje-error",
                        role: "alert"
                    },
                    error
                ),

                e(
                    "div",
                    { className: "botones-formulario" },

                    e(
                        "button",
                        {
                            type: "submit",
                            className: "boton-guardar",
                            disabled: procesando
                        },
                        "GUARDAR CAMBIOS"
                    ),

                    e(
                        "button",
                        {
                            type: "button",
                            className: "boton-cancelar",
                            disabled: procesando,
                            onClick: cancelarEdicion
                        },
                        "CANCELAR"
                    )
                )
            )
        )
    );
}

const contenedor = document.getElementById("perfil-react");

if (contenedor) {
    ReactDOM.createRoot(contenedor).render(
        e(Perfil)
    );
}
