import { useEffect, useRef, useState } from "react";
import { catalogo } from "../data/catalogo";
import "../styles/inicio.css";

const generos = [
  { valor: "Todos", etiqueta: "Todos" },
  { valor: "Thriller", etiqueta: "Thriller" },
  { valor: "Romance", etiqueta: "Romance" },
  { valor: "Animación", etiqueta: "Animada" },
  { valor: "Comedia", etiqueta: "Comedia" },
  { valor: "Terror", etiqueta: "Terror" },
  { valor: "Acción", etiqueta: "Acción" },
  { valor: "Ciencia ficción", etiqueta: "Sci-fi" },
];

function Icono({ nombre }) {
  const dibujos = {
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
    inicio: (
      <>
        <path d="m3 10 9-7 9 7v11H3Z" />
        <path d="M9 21v-8h6v8" />
      </>
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

  if (!src || fallo) {
    return (
      <span className={`imagen-pendiente ${className}`}>
        <span>{alt}</span>
        <small>Agrega su imagen</small>
      </span>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => setFallo(true)}
    />
  );
}

function leerFavoritos() {
  try {
    const datos = JSON.parse(
      localStorage.getItem("peliculas-favoritas") || "[]"
    );

    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

export default function Inicio() {
  const [genero, setGenero] = useState("Todos");
  const [tipo, setTipo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [vista, setVista] = useState("inicio");
  const [seleccionado, setSeleccionado] = useState("shrek2");
  const [favoritos, setFavoritos] = useState(leerFavoritos);
  const [detalle, setDetalle] = useState(null);
  const [animando, setAnimando] = useState(false);

  const carruselRef = useRef(null);
  const buscadorRef = useRef(null);
  const dialogoRef = useRef(null);
  const temporizadorRef = useRef(null);
  const ultimoBotonRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        "peliculas-favoritas",
        JSON.stringify(favoritos)
      );
    } catch {
      // Si el almacenamiento está bloqueado, funcionan durante la sesión.
    }
  }, [favoritos]);

  useEffect(() => {
    return () => window.clearTimeout(temporizadorRef.current);
  }, []);

  const visibles = catalogo.filter((pelicula) => {
    const coincideGenero =
      genero === "Todos" || pelicula.generos.includes(genero);

    const coincideTipo =
      tipo === "Todos" || pelicula.tipo === tipo;

    const coincideTitulo = pelicula.titulo
      .toLocaleLowerCase("es")
      .includes(busqueda.trim().toLocaleLowerCase("es"));

    const coincideVista =
      vista !== "favoritos" || favoritos.includes(pelicula.id);

    return (
      coincideGenero &&
      coincideTipo &&
      coincideTitulo &&
      coincideVista
    );
  });

  const activa =
    visibles.find((pelicula) => pelicula.id === seleccionado) ??
    visibles[0];

  const indiceActivo = visibles.findIndex(
    (pelicula) => pelicula.id === activa?.id
  );

  const firmaVisibles = visibles.map((pelicula) => pelicula.id).join(",");

  useEffect(() => {
    const carrusel = carruselRef.current;
    const tarjeta = carrusel?.querySelector(
      '[data-activa="true"]'
    );

    if (!carrusel || !tarjeta) return;

    const movimientoReducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    carrusel.scrollTo({
      left:
        tarjeta.offsetLeft -
        (carrusel.clientWidth - tarjeta.offsetWidth) / 2,
      behavior: movimientoReducido ? "auto" : "smooth",
    });
  }, [activa?.id, firmaVisibles]);

  useEffect(() => {
    if (detalle && !dialogoRef.current?.open) {
      dialogoRef.current?.showModal();
    }
  }, [detalle]);

  function cambiarVista(nuevaVista) {
    setVista(nuevaVista);
    setGenero("Todos");
    setTipo("Todos");
    setBusqueda("");
  }

  function abrirBuscador() {
    cambiarVista("inicio");
    buscadorRef.current?.focus();
  }

  function mover(direccion) {
    const siguiente = visibles[indiceActivo + direccion];

    if (siguiente) setSeleccionado(siguiente.id);
  }

  function alternarFavorito(id) {
    setFavoritos((actuales) =>
      actuales.includes(id)
        ? actuales.filter((favorito) => favorito !== id)
        : [...actuales, id]
    );
  }

  function abrirDetalle(pelicula, boton) {
    if (animando) return;

    ultimoBotonRef.current = boton;

    const movimientoReducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (movimientoReducido) {
      setDetalle(pelicula);
      return;
    }

    setAnimando(true);

    temporizadorRef.current = window.setTimeout(() => {
      setAnimando(false);
      setDetalle(pelicula);
    }, 650);
  }

  function cerrarDetalle() {
    dialogoRef.current?.close();
  }

  function despuesDeCerrar() {
    setDetalle(null);
    ultimoBotonRef.current?.focus();
  }

  return (
    <div className="cine-app">
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

          <button type="button" onClick={abrirBuscador}>
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
            disabled
            title="Esta pantalla se conectará después"
          >
            <span className="cine-icono">
              <Icono nombre="lista" />
            </span>
            Mi lista
            <small>Próximamente</small>
          </button>
        </nav>
      </aside>

      <main className="cine-principal">
        <h1 className="solo-lectores">
          Catálogo de películas y series
        </h1>

        <div className="claqueta-fondo" aria-hidden="true">
          <div className="claqueta-brazo" />
          <div className="claqueta-base" />
          <span className="claqueta-tornillo" />
        </div>

        <div className="cine-herramientas">
          <div className="cine-tipos" aria-label="Tipo de contenido">
            {["Todos", "Película", "Serie"].map((opcion) => (
              <button
                key={opcion}
                type="button"
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
            <span className="solo-lectores">Buscar por título</span>
            <input
              ref={buscadorRef}
              type="search"
              placeholder="Buscar una historia..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>
        </div>

        <div className="cinta-generos" aria-label="Géneros">
          <div className="cinta-opciones">
            {generos.map((item) => (
              <button
                type="button"
                key={item.valor}
                aria-pressed={genero === item.valor}
                className={genero === item.valor ? "genero-activo" : ""}
                onClick={() => setGenero(item.valor)}
              >
                {item.etiqueta}
              </button>
            ))}
          </div>
        </div>

        {vista === "favoritos" && (
          <h2 className="titulo-coleccion">Tus favoritos</h2>
        )}

        {activa ? (
          <>
            <section className="escenario" aria-label="Películas y series">
              <button
                type="button"
                className="flecha-carrusel flecha-izquierda"
                aria-label="Seleccionar título anterior"
                disabled={indiceActivo === 0}
                onClick={() => mover(-1)}
              >
                <Icono nombre="flecha" />
              </button>

              <div className="carrusel-cine" ref={carruselRef}>
                {visibles.map((pelicula, indice) => {
                  const distancia = indice - indiceActivo;
                  const esActiva = pelicula.id === activa.id;

                  return (
                    <button
                      key={pelicula.id}
                      type="button"
                      className={`cartel-cine ${esActiva ? "cartel-activo" : ""}`}
                      data-activa={esActiva}
                      aria-pressed={esActiva}
                      aria-label={
                        esActiva
                          ? `Abrir detalles de ${pelicula.titulo}`
                          : `Seleccionar ${pelicula.titulo}`
                      }
                      style={{
                        "--giro": `${esActiva ? -7 : distancia < 0 ? 7 : -7}deg`,
                      }}
                      onClick={(evento) => {
                        if (esActiva) {
                          abrirDetalle(pelicula, evento.currentTarget);
                        } else {
                          setSeleccionado(pelicula.id);
                        }
                      }}
                    >
                      <Imagen
                        src={pelicula.poster}
                        alt={pelicula.titulo}
                        className="cartel-imagen"
                      />

                      <span className="cartel-sombra" />

                      <span className="cartel-textos">
                        <strong>{pelicula.titulo}</strong>
                        <small>{pelicula.generos[0]}</small>
                      </span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="flecha-carrusel flecha-derecha"
                aria-label="Seleccionar siguiente título"
                disabled={indiceActivo === visibles.length - 1}
                onClick={() => mover(1)}
              >
                <Icono nombre="flecha" />
              </button>
            </section>

            <div className="indicadores-cine" aria-label="Elegir título">
              {visibles.map((pelicula) => (
                <button
                  key={pelicula.id}
                  type="button"
                  aria-label={`Seleccionar ${pelicula.titulo}`}
                  aria-pressed={pelicula.id === activa.id}
                  className={pelicula.id === activa.id ? "punto-activo" : ""}
                  onClick={() => setSeleccionado(pelicula.id)}
                />
              ))}
            </div>

            <section className="sinopsis-cine" aria-live="polite">
              <div className="separador-cine" aria-hidden="true">
                <span>▽</span>
              </div>

              <div className="sinopsis-encabezado">
                <div>
                  <p className="datos-cine">
                    {activa.anio} / {activa.tipo} / {activa.informacion}
                  </p>
                  <h2>{activa.titulo}</h2>
                </div>

                <button
                  type="button"
                  className={`boton-corazon ${
                    favoritos.includes(activa.id) ? "es-favorito" : ""
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

              <p className="sinopsis-texto">{activa.sinopsis}</p>

              <button
                type="button"
                className="boton-detalles"
                onClick={(evento) =>
                  abrirDetalle(activa, evento.currentTarget)
                }
              >
                Ver detalles <span aria-hidden="true">↗</span>
              </button>
            </section>
          </>
        ) : (
          <div className="cine-vacio" role="status">
            <h2>
              {vista === "favoritos" && favoritos.length === 0
                ? "Tu colección empieza con un corazón"
                : "No encontramos coincidencias"}
            </h2>
            <p>
              {vista === "favoritos" && favoritos.length === 0
                ? "Marca una película o serie como favorita para verla aquí."
                : "Prueba con otro título, género o tipo de contenido."}
            </p>
          </div>
        )}
      </main>

      {animando && (
        <div className="transicion-cine" role="status">
          <span className="solo-lectores">Abriendo detalles</span>
          <div className="mini-claqueta" aria-hidden="true">
            <div className="mini-brazo" />
            <div className="mini-cuerpo">
              <span>UNA NUEVA HISTORIA</span>
              <strong>ACCIÓN</strong>
              <div />
            </div>
          </div>
        </div>
      )}

      <dialog
        className="detalle-dialogo"
        ref={dialogoRef}
        onClose={despuesDeCerrar}
      >
        {detalle && (
          <article
            className="detalle-contenido"
            aria-labelledby="detalle-titulo"
            style={{
              backgroundImage: detalle.fondo
                ? `linear-gradient(90deg, rgba(17, 12, 26, .96), rgba(17, 12, 26, .65)), url("${detalle.fondo}")`
                : undefined,
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
                {detalle.anio} / {detalle.tipo} / {detalle.informacion}
              </p>

              <h2 id="detalle-titulo">{detalle.titulo}</h2>

              <div className="detalle-generos">
                {detalle.generos.map((nombre) => (
                  <span key={nombre}>{nombre}</span>
                ))}
              </div>

              <p className="detalle-sinopsis">{detalle.sinopsis}</p>

              <button
                type="button"
                className="boton-detalles"
                aria-pressed={favoritos.includes(detalle.id)}
                onClick={() => alternarFavorito(detalle.id)}
              >
                {favoritos.includes(detalle.id)
                  ? "Quitar de favoritos"
                  : "Agregar a favoritos"}
              </button>
            </div>

            <Imagen
              src={detalle.poster}
              alt={`Cartel de ${detalle.titulo}`}
              className="detalle-poster"
            />
          </article>
        )}
      </dialog>
    </div>
  );
}