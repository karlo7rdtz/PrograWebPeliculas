import { useEffect, useRef, useState } from "react";
import { catalogo } from "../data/catalogo";
import "../styles/inicio.css";

const generos = [
  ["Todos", "Todos", "general"],
  ["Thriller", "Thriller", "thriller"],
  ["Romance", "Romance", "romance"],
  ["Animación", "Animada", "animada"],
  ["Comedia", "Comedia", "comedia"],
  ["Terror", "Terror", "terror"],
  ["Acción", "Acción", "accion"],
  ["Ciencia ficción", "Sci-fi", "scifi"],
  ["Drama", "Drama", "general"],
  ["Fantasía", "Fantasía", "general"],
  ["Aventura", "Aventura", "general"],
  ["Crimen", "Crimen", "general"],
];

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function leerDatoGuardado(clave, valorInicial) {
  try {
    return JSON.parse(localStorage.getItem(clave)) ?? valorInicial;
  } catch {
    return valorInicial;
  }
}

function leerListaGuardada(clave) {
  const datos = leerDatoGuardado(clave, []);

  return Array.isArray(datos)
    ? datos.filter((dato) => typeof dato === "string")
    : [];
}

function leerCalificaciones() {
  const datos = leerDatoGuardado("peliculas-calificaciones", {});

  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(datos).filter(
      ([, valor]) =>
        Number.isInteger(valor) &&
        valor >= 1 &&
        valor <= 10
    )
  );
}

function Icono({ nombre }) {
  const dibujos = {
    inicio: (
      <>
        <path d="m3 10 9-7 9 7v11H3Z" />
        <path d="M9 21v-8h6v8" />
      </>
    ),

    buscar: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),

    lista: (
      <>
        <path d="M9 6h12M9 12h12M9 18h12" />
        <path d="M3 6h1M3 12h1M3 18h1" />
      </>
    ),

    corazon: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    ),

    flecha: <path d="m9 5 7 7-7 7" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dibujos[nombre]}
    </svg>
  );
}

function Imagen({ src, alt, className = "" }) {
  const [fallo, setFallo] = useState(false);

  useEffect(() => {
    setFallo(false);
  }, [src]);

 if (fallo || !src) {
  return (
    <span
      className={`imagen-pendiente ${className}`}
      role="img"
      aria-label={alt}
    />
  );
}

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFallo(true)}
    />
  );
}

function centrarTarjeta(carrusel, tarjeta, suave = true) {
  if (!carrusel || !tarjeta) return;

  const reducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  carrusel.scrollTo({
    left:
      tarjeta.offsetLeft +
      tarjeta.offsetWidth / 2 -
      carrusel.clientWidth / 2,
    behavior: suave && !reducirMovimiento ? "smooth" : "auto",
  });
}

export default function Inicio() {
  // Filtros y navegación.
  const [genero, setGenero] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [vista, setVista] = useState("inicio");
  const [seleccionado, setSeleccionado] = useState("shrek2");

  // Colecciones personales.
  const [favoritos, setFavoritos] = useState(() =>
    leerListaGuardada("peliculas-favoritas")
  );

  const [miLista, setMiLista] = useState(() =>
    leerListaGuardada("peliculas-mi-lista")
  );

  const [calificaciones, setCalificaciones] = useState(
    leerCalificaciones
  );

  // Detalles y animación.
  const [detalle, setDetalle] = useState(null);
  const [animando, setAnimando] = useState(false);

  // Referencias.
  const carruselRef = useRef(null);
  const buscadorRef = useRef(null);
  const dialogoRef = useRef(null);
  const temporizadorRef = useRef(null);
  const cuadroRef = useRef(null);
  const botonAnteriorRef = useRef(null);
  const seleccionRef = useRef("shrek2");
  const bloqueoAperturaRef = useRef(false);

  // Aplicar filtros.
  const visibles = catalogo.filter((contenido) => {
    const coincideGenero =
      genero === "Todos" || contenido.generos.includes(genero);

    const coincideTipo =
      tipo === "Todos" || contenido.tipo === tipo;

    const coincideBusqueda = normalizar(
      contenido.titulo
    ).includes(normalizar(busqueda.trim()));

    const coincideVista =
      vista === "favoritos"
        ? favoritos.includes(contenido.id)
        : vista === "lista"
          ? miLista.includes(contenido.id)
          : vista === "calificadas"
            ? calificaciones[contenido.id] !== undefined
            : true;

    return (
      coincideGenero &&
      coincideTipo &&
      coincideBusqueda &&
      coincideVista
    );
  });

  const firmaVisibles = visibles
    .map((contenido) => contenido.id)
    .join("|");

  const activa =
    visibles.find((contenido) => contenido.id === seleccionado) ??
    visibles[0];

  const indiceActivo = visibles.findIndex(
    (contenido) => contenido.id === activa?.id
  );

  // Guardar favoritos.
  useEffect(() => {
    try {
      localStorage.setItem(
        "peliculas-favoritas",
        JSON.stringify(favoritos)
      );
    } catch {
      // Si el almacenamiento está bloqueado,
      // los cambios funcionan durante la sesión.
    }
  }, [favoritos]);

  // Guardar Mi lista.
  useEffect(() => {
    try {
      localStorage.setItem(
        "peliculas-mi-lista",
        JSON.stringify(miLista)
      );
    } catch {
      // Los cambios funcionan durante la sesión.
    }
  }, [miLista]);

  // Guardar calificaciones personales.
  useEffect(() => {
    try {
      localStorage.setItem(
        "peliculas-calificaciones",
        JSON.stringify(calificaciones)
      );
    } catch {
      // Los cambios funcionan durante la sesión.
    }
  }, [calificaciones]);

  // Centrar al cargar o al cambiar los resultados.
  // No se ejecuta cada vez que cambia el cartel central.
  useEffect(() => {
    const carrusel = carruselRef.current;
    if (!carrusel) return;

    const tarjetas = Array.from(
      carrusel.querySelectorAll("[data-contenido]")
    );

    const objetivo =
      tarjetas.find(
        (tarjeta) =>
          tarjeta.dataset.contenido === seleccionRef.current
      ) ?? tarjetas[0];

    if (!objetivo) return;

    seleccionRef.current = objetivo.dataset.contenido;
    setSeleccionado(objetivo.dataset.contenido);

    const frame = requestAnimationFrame(() => {
      centrarTarjeta(carrusel, objetivo, false);
    });

    const observador = new ResizeObserver(() => {
      const actual = tarjetas.find(
        (tarjeta) =>
          tarjeta.dataset.contenido === seleccionRef.current
      );

      centrarTarjeta(carrusel, actual, false);
    });

    observador.observe(carrusel);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(cuadroRef.current);
      observador.disconnect();
    };
  }, [firmaVisibles]);

  // Abrir la ventana de detalles.
  useEffect(() => {
    if (detalle && !dialogoRef.current?.open) {
      dialogoRef.current?.showModal();
    }
  }, [detalle]);

  // Limpiar tareas pendientes al desmontar.
  useEffect(() => {
    return () => {
      clearTimeout(temporizadorRef.current);
      cancelAnimationFrame(cuadroRef.current);
    };
  }, []);

  function registrarSeleccion(id) {
    seleccionRef.current = id;
    setSeleccionado(id);
  }

  // Detectar qué cartel está más cerca del centro.
  function detectarCentro() {
    cancelAnimationFrame(cuadroRef.current);

    cuadroRef.current = requestAnimationFrame(() => {
      const carrusel = carruselRef.current;
      if (!carrusel) return;

      const centro =
        carrusel.scrollLeft + carrusel.clientWidth / 2;

      let tarjetaCercana = null;
      let distanciaMenor = Infinity;

      carrusel
        .querySelectorAll("[data-contenido]")
        .forEach((tarjeta) => {
          const centroTarjeta =
            tarjeta.offsetLeft + tarjeta.offsetWidth / 2;

          const distancia = Math.abs(centroTarjeta - centro);

          if (distancia < distanciaMenor) {
            distanciaMenor = distancia;
            tarjetaCercana = tarjeta;
          }
        });

      if (
        tarjetaCercana &&
        tarjetaCercana.dataset.contenido !== seleccionRef.current
      ) {
        registrarSeleccion(tarjetaCercana.dataset.contenido);
      }
    });
  }

  function irAIndice(indice) {
    const carrusel = carruselRef.current;
    const tarjetas = carrusel?.querySelectorAll("[data-contenido]");

    if (tarjetas?.[indice]) {
      centrarTarjeta(carrusel, tarjetas[indice]);
    }
  }

  function manejarTeclado(evento) {
    let destino;

    if (evento.key === "ArrowRight") {
      destino = indiceActivo + 1;
    }

    if (evento.key === "ArrowLeft") {
      destino = indiceActivo - 1;
    }

    if (evento.key === "Home") {
      destino = 0;
    }

    if (evento.key === "End") {
      destino = visibles.length - 1;
    }

    if (destino === undefined || visibles.length === 0) return;

    evento.preventDefault();

    const indice = Math.max(
      0,
      Math.min(visibles.length - 1, destino)
    );

    irAIndice(indice);

    const tarjetas =
      carruselRef.current?.querySelectorAll("[data-contenido]");

    tarjetas?.[indice]?.focus({ preventScroll: true });
  }

  function cambiarVista(nuevaVista) {
    setVista(nuevaVista);
    setGenero("Todos");
    setTipo("Todos");
    setBusqueda("");
  }

  function alternarFavorito(id) {
    setFavoritos((actuales) =>
      actuales.includes(id)
        ? actuales.filter((actual) => actual !== id)
        : [...actuales, id]
    );
  }

  function alternarMiLista(id) {
    setMiLista((actuales) =>
      actuales.includes(id)
        ? actuales.filter((actual) => actual !== id)
        : [...actuales, id]
    );
  }

  function calificarContenido(id, valor) {
    setCalificaciones((actuales) => {
      const siguientes = { ...actuales };

      if (valor === "") {
        delete siguientes[id];
      } else {
        const puntuacion = Number(valor);

        if (
          !Number.isInteger(puntuacion) ||
          puntuacion < 1 ||
          puntuacion > 10
        ) {
          return actuales;
        }

        siguientes[id] = puntuacion;
      }

      return siguientes;
    });
  }

  function abrirDetalle(contenido, boton) {
    if (bloqueoAperturaRef.current) return;

    botonAnteriorRef.current = boton;

    const reducirMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducirMovimiento) {
      setDetalle(contenido);
      return;
    }

    bloqueoAperturaRef.current = true;
    setAnimando(true);

    temporizadorRef.current = window.setTimeout(() => {
      setAnimando(false);
      bloqueoAperturaRef.current = false;
      setDetalle(contenido);
    }, 650);
  }

  function cerrarDetalle() {
    dialogoRef.current?.close();
  }

  function alCerrarDetalle() {
    setDetalle(null);

    if (botonAnteriorRef.current?.isConnected) {
      botonAnteriorRef.current.focus({ preventScroll: true });
    } else {
      buscadorRef.current?.focus({ preventScroll: true });
    }
  }

  return (
    <div className="cine-app">
      {/* MENÚ LATERAL */}
      <aside className="cine-menu">
        <div className="cine-usuario">
          <Imagen
            src="/imagenes/perfiles/avatar.png"
            alt="Usuario"
            className="cine-avatar"
          />
          <span>Usuario</span>
        </div>

        <nav aria-label="Navegación principal">
          <button
            type="button"
            className={vista === "inicio" ? "menu-activo" : ""}
            onClick={() => cambiarVista("inicio")}
          >
            <span className="cine-icono">
              <Icono nombre="inicio" />
            </span>
            Inicio
          </button>

          <button
            type="button"
            onClick={() => buscadorRef.current?.focus()}
          >
            <span className="cine-icono">
              <Icono nombre="buscar" />
            </span>
            Buscar
          </button>

          <button
            type="button"
            className={vista === "favoritos" ? "menu-activo" : ""}
            onClick={() => cambiarVista("favoritos")}
          >
            <span className="cine-icono">
              <Icono nombre="corazon" />
            </span>
            Favoritos
          </button>

          <button
            type="button"
            className={vista === "lista" ? "menu-activo" : ""}
            onClick={() => cambiarVista("lista")}
          >
            <span className="cine-icono">
              <Icono nombre="lista" />
            </span>
            Mi lista
          </button>

          <button
            type="button"
            className={vista === "calificadas" ? "menu-activo" : ""}
            onClick={() => cambiarVista("calificadas")}
          >
            <span
              className="cine-icono estrella-menu"
              aria-hidden="true"
            >
              ☆
            </span>
            Calificadas
          </button>
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="cine-principal">
        <div className="fondo-escena" aria-hidden="true">
          {activa && (
            <img
              key={activa.id}
              src={activa.fondo}
              alt=""
              onError={(evento) => {
                evento.currentTarget.style.visibility = "hidden";
              }}
            />
          )}
        </div>

        <div className="claqueta-fondo" aria-hidden="true">
          <div className="claqueta-brazo" />
          <div className="claqueta-base" />
          <span className="claqueta-tornillo" />
        </div>

        <div className="contenido-frontal">
          <h1 className="solo-lectores">
            Catálogo de películas y series
          </h1>

          {/* TIPOS Y BÚSQUEDA */}
          <div className="cine-herramientas">
            <div
              className="cine-tipos"
              aria-label="Tipo de contenido"
            >
              {["Todos", "Película", "Serie"].map((opcion) => (
                <button
                  type="button"
                  key={opcion}
                  aria-pressed={tipo === opcion}
                  className={tipo === opcion ? "tipo-activo" : ""}
                  onClick={() => setTipo(opcion)}
                >
                  {opcion === "Todos"
                    ? "Todo"
                    : opcion === "Película"
                      ? "Películas"
                      : "Series"}
                </button>
              ))}
            </div>

            <label className="cine-buscador">
              <Icono nombre="buscar" />

              <span className="solo-lectores">
                Buscar por título
              </span>

              <input
                ref={buscadorRef}
                type="search"
                placeholder="Buscar una historia..."
                value={busqueda}
                onChange={(evento) =>
                  setBusqueda(evento.target.value)
                }
              />
            </label>
          </div>

          {/* GÉNEROS */}
          <div className="cinta-generos" aria-label="Géneros">
            <div className="cinta-opciones">
              {generos.map(([valor, etiqueta, fuente]) => (
                <button
                  key={valor}
                  type="button"
                  aria-pressed={genero === valor}
                  className={`fuente-${fuente} ${
                    genero === valor ? "genero-activo" : ""
                  }`}
                  onClick={() => setGenero(valor)}
                >
                  {etiqueta}
                </button>
              ))}
            </div>
          </div>

          {vista !== "inicio" && (
            <h2 className="titulo-coleccion">
              {vista === "favoritos"
                ? "Tus favoritos"
                : vista === "lista"
                  ? "Mi lista"
                  : "Tus calificaciones"}
            </h2>
          )}

          {activa ? (
            <>
              {/* CARRUSEL */}
              <section
                className="escenario"
                aria-label="Carrusel del catálogo"
              >
                <button
                  type="button"
                  className="flecha-carrusel flecha-izquierda"
                  aria-label="Título anterior"
                  disabled={indiceActivo <= 0}
                  onClick={() => irAIndice(indiceActivo - 1)}
                >
                  <Icono nombre="flecha" />
                </button>

                <div
                  className="carrusel-cine"
                  ref={carruselRef}
                  onScroll={detectarCentro}
                  onKeyDown={manejarTeclado}
                >
                  {visibles.map((contenido, indice) => {
                    const esActiva = activa.id === contenido.id;

                    return (
                      <button
                        type="button"
                        key={contenido.id}
                        data-contenido={contenido.id}
                        className={`posicion-cartel ${
                          esActiva ? "posicion-activa" : ""
                        }`}
                        aria-pressed={esActiva}
                        aria-label={
                          esActiva
                            ? `Ver detalles de ${contenido.titulo}`
                            : `Centrar ${contenido.titulo}`
                        }
                        onClick={(evento) => {
                          if (esActiva) {
                            abrirDetalle(
                              contenido,
                              evento.currentTarget
                            );
                          } else {
                            irAIndice(indice);
                          }
                        }}
                      >
                        <span className="cartel-visual">
                          <Imagen
                            src={contenido.poster}
                            alt={contenido.titulo}
                            className="cartel-imagen"
                          />

                          <span className="cartel-sombra" />

                          <span className="cartel-textos">
                            <strong>{contenido.titulo}</strong>
                            <small>{contenido.generos[0]}</small>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="flecha-carrusel flecha-derecha"
                  aria-label="Siguiente título"
                  disabled={indiceActivo >= visibles.length - 1}
                  onClick={() => irAIndice(indiceActivo + 1)}
                >
                  <Icono nombre="flecha" />
                </button>
              </section>

              <div className="contador-cine">
                <span>
                  {String(indiceActivo + 1).padStart(2, "0")}
                </span>
                <span className="contador-linea" />
                <span>{visibles.length}</span>
              </div>

              {/* SINOPSIS DEL CARTEL CENTRAL */}
              <section
                className="sinopsis-cine"
                aria-live="polite"
              >
                <div
                  className="separador-cine"
                  aria-hidden="true"
                >
                  <span>▽</span>
                </div>

                <div className="sinopsis-encabezado">
                  <div>
                    <p className="datos-cine">
                      {activa.anio} / {activa.tipo}
                    </p>

                    <h2>{activa.titulo}</h2>
                  </div>

                  <button
                    type="button"
                    className={`boton-corazon ${
                      favoritos.includes(activa.id)
                        ? "es-favorito"
                        : ""
                    }`}
                    aria-label={
                      favoritos.includes(activa.id)
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"
                    }
                    aria-pressed={favoritos.includes(activa.id)}
                    onClick={() => alternarFavorito(activa.id)}
                  >
                    <Icono nombre="corazon" />
                  </button>
                </div>

                <p className="sinopsis-texto">
                  {activa.sinopsis}
                </p>

                <button
                  type="button"
                  className="boton-detalles"
                  onClick={(evento) =>
                    abrirDetalle(activa, evento.currentTarget)
                  }
                >
                  Ver detalles
                  <span aria-hidden="true">↗</span>
                </button>
              </section>
            </>
          ) : (
            <section className="cine-vacio" role="status">
              <h2>No hay títulos para mostrar</h2>

              <p>
                {vista === "favoritos"
                  ? "Agrega favoritos o cambia los filtros."
                  : vista === "lista"
                    ? "Añade películas o series a Mi lista desde sus detalles, o cambia los filtros."
                    : vista === "calificadas"
                      ? "Califica una película o serie para encontrarla aquí, o cambia los filtros."
                      : "Prueba con otra búsqueda o cambia los filtros."}
              </p>
            </section>
          )}
        </div>
      </main>

      {/* CLAQUETA ANIMADA */}
      {animando && (
        <div className="transicion-cine" role="status">
          <span className="solo-lectores">
            Abriendo detalles
          </span>

          <div className="mini-claqueta" aria-hidden="true">
            <div className="mini-brazo" />

            <div className="mini-cuerpo">
              <span>UNA NUEVA HISTORIA</span>
              <strong>ACCIÓN</strong>
            </div>
          </div>
        </div>
      )}

      {/* VENTANA DE DETALLES */}
      <dialog
        className="detalle-dialogo"
        ref={dialogoRef}
        onClose={alCerrarDetalle}
        aria-labelledby="detalle-titulo"
      >
        {detalle && (
          <article
            className="detalle-contenido"
            style={{
              backgroundImage:
                `linear-gradient(90deg, #140e20eb, #140e2080), ` +
                `url("${detalle.fondo}")`,
            }}
          >
            <button
              type="button"
              className="cerrar-detalle"
              aria-label="Cerrar detalles"
              onClick={cerrarDetalle}
              autoFocus
            >
              ×
            </button>

            <div className="detalle-informacion">
              <p className="datos-cine">
                {detalle.anio} / {detalle.tipo}
              </p>

              <h2 id="detalle-titulo">{detalle.titulo}</h2>

              <div className="detalle-generos">
                {detalle.generos.map((nombre) => (
                  <span key={nombre}>{nombre}</span>
                ))}
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="acciones-detalle">
                <button
                  type="button"
                  className="accion-detalle"
                  disabled
                  aria-label="Reproducir, no disponible"
                  title="Reproducción no disponible en este catálogo"
                >
                  <span
                    className="accion-circulo"
                    aria-hidden="true"
                  >
                    ▶
                  </span>

                  <span>Reproducir</span>
                </button>

                <button
                  type="button"
                  className="accion-detalle"
                  disabled
                  aria-label="Ver desde el inicio, no disponible"
                  title="Reproducción no disponible en este catálogo"
                >
                  <span
                    className="accion-circulo"
                    aria-hidden="true"
                  >
                    ↺
                  </span>

                  <span>Desde el inicio</span>
                </button>

                <button
                  type="button"
                  className={`accion-detalle ${
                    favoritos.includes(detalle.id)
                      ? "accion-marcada"
                      : ""
                  }`}
                  aria-pressed={favoritos.includes(detalle.id)}
                  aria-label={
                    favoritos.includes(detalle.id)
                      ? "Quitar de favoritos"
                      : "Añadir a favoritos"
                  }
                  onClick={() => alternarFavorito(detalle.id)}
                >
                  <span className="accion-circulo">
                    <Icono nombre="corazon" />
                  </span>

                  <span>
                    {favoritos.includes(detalle.id)
                      ? "En favoritos"
                      : "Favoritos"}
                  </span>
                </button>

                <button
                  type="button"
                  className={`accion-detalle ${
                    miLista.includes(detalle.id)
                      ? "accion-marcada"
                      : ""
                  }`}
                  aria-pressed={miLista.includes(detalle.id)}
                  aria-label={
                    miLista.includes(detalle.id)
                      ? "Quitar de Mi lista"
                      : "Añadir a Mi lista"
                  }
                  onClick={() => alternarMiLista(detalle.id)}
                >
                  <span
                    className="accion-circulo"
                    aria-hidden="true"
                  >
                    {miLista.includes(detalle.id) ? "✓" : "+"}
                  </span>

                  <span>
                    {miLista.includes(detalle.id)
                      ? "En Mi lista"
                      : "Añadir a lista"}
                  </span>
                </button>
              </div>

              <p className="detalle-sinopsis">
                {detalle.sinopsis}
              </p>

              {/* CALIFICACIÓN PERSONAL */}
              <div className="panel-calificar">
                <label htmlFor="puntuacion-personal">
                  Calificar esta{" "}
                  {detalle.tipo === "Serie" ? "serie" : "película"}
                </label>

                <div className="fila-calificar">
                  <select
                    id="puntuacion-personal"
                    value={calificaciones[detalle.id] ?? ""}
                    onChange={(evento) =>
                      calificarContenido(
                        detalle.id,
                        evento.target.value
                      )
                    }
                  >
                    <option value="">Sin calificar</option>

                    {Array.from(
                      { length: 10 },
                      (_, indice) => indice + 1
                    ).map((puntuacion) => (
                      <option
                        key={puntuacion}
                        value={puntuacion}
                      >
                        {puntuacion} de 10
                      </option>
                    ))}
                  </select>

                  <span
                    className="estado-calificacion"
                    role="status"
                  >
                    {calificaciones[detalle.id] !== undefined
                      ? `Tu calificación: ${calificaciones[detalle.id]}/10`
                      : "Elige tu puntuación"}
                  </span>
                </div>

                <small>
                  Se guarda automáticamente en este navegador.
                </small>
              </div>
            </div>

            {/* CALIFICACIÓN GENERAL Y CARTEL */}
            <aside className="detalle-columna">
              <div className="calificacion-general">
                <h3>Calificación general</h3>

                <div className="circulo-calificacion">
                  {Number.isFinite(
                    detalle.calificacionGeneral
                  ) ? (
                    <>
                      <strong>
                        {detalle.calificacionGeneral.toFixed(1)}
                      </strong>

                      <span>DE 10</span>
                    </>
                  ) : (
                    <span className="calificacion-pendiente">
                      Sin datos
                    </span>
                  )}
                </div>

                {detalle.fuenteCalificacion && (
                  <small>{detalle.fuenteCalificacion}</small>
                )}
              </div>

              <Imagen
                src={detalle.poster}
                alt={`Cartel de ${detalle.titulo}`}
                className="detalle-poster"
              />
            </aside>
          </article>
        )}
      </dialog>
    </div>
  );
}