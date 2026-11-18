
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { catalogo } from "../data/catalogo";
import "../styles/favoritos.css";

const CLAVE_RESENAS = "peliculas-resenas";

function leerResenas() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_RESENAS) || "{}"
    );

    return datos &&
      typeof datos === "object" &&
      !Array.isArray(datos)
      ? datos
      : {};
  } catch {
    return {};
  }
}

function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Distancia circular para los carruseles.
function distancia(indice, activo, total) {
  let diferencia = indice - activo;

  if (diferencia > total / 2) {
    diferencia -= total;
  }

  if (diferencia < -total / 2) {
    diferencia += total;
  }

  return diferencia;
}

// COMPONENTE PARA CALIFICAR
function Nota({
  pelicula,
  calificaciones,
  alCalificar,
}) {
  return (
    <label className="rc-nota">
      <span>Mi calificación</span>

      <select
        aria-label={`Calificación de ${pelicula.titulo}`}
        value={calificaciones[pelicula.id] ?? ""}
        onChange={(e) =>
          alCalificar(pelicula.id, e.target.value)
        }
      >
        <option value="">Sin calificar</option>

        {Array.from(
          { length: 10 },
          (_, i) => i + 1
        ).map((n) => (
          <option key={n} value={n}>
            {n}/10
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Favoritos({
  vista = "favoritos",
  favoritos = [],
  miLista = [],
  calificaciones = {},
  alCambiarVista,
  alFavorito,
  alMiLista,
  alCalificar,
  alVerDetalles,
}) {
  // ESTADOS
  const [resenas, setResenas] = useState(leerResenas);
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("Todos");

  const [seleccion, setSeleccion] = useState({
    favoritos: null,
    lista: null,
    calificadas: null,
  });

  const [editorId, setEditorId] = useState(null);
  const [borrador, setBorrador] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [nuevaResenaId, setNuevaResenaId] = useState(
    catalogo[0]?.id ?? ""
  );

  const entradaRef = useRef(null);

  // GUARDAR RESEÑAS
  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_RESENAS,
        JSON.stringify(resenas)
      );
    } catch {
      // Los cambios permanecen durante la sesión.
    }
  }, [resenas]);

  // REINICIAR FILTROS
  useEffect(() => {
    setBusqueda("");
    setTipo("Todos");
    setMensaje("");
  }, [vista]);

  // CERRAR EDITOR CON ESCAPE
  useEffect(() => {
    if (!editorId) return;

    const tecla = (e) => {
      if (e.key === "Escape") {
        setEditorId(null);
      }
    };

    const previo = document.activeElement;

    const frame = requestAnimationFrame(() => {
      entradaRef.current?.focus();
    });

    document.addEventListener("keydown", tecla);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", tecla);
      previo?.focus?.();
    };
  }, [editorId]);

  // PELÍCULAS CALIFICADAS O RESEÑADAS
  const tieneOpinion = (p) =>
    Boolean(resenas[p.id]?.texto) ||
    calificaciones[p.id] !== undefined;

  // CONTENIDO DE CADA PANTALLA
  const base = catalogo.filter((p) => {
    if (vista === "favoritos") {
      return favoritos.includes(p.id);
    }

    if (vista === "lista") {
      return miLista.includes(p.id);
    }

    return tieneOpinion(p);
  });

  // BÚSQUEDA Y FILTROS
  const visibles = base.filter(
    (p) =>
      (tipo === "Todos" || p.tipo === tipo) &&
      normalizar(p.titulo).includes(
        normalizar(busqueda.trim())
      )
  );

  // PELÍCULA ACTIVA EN EL CARRUSEL
  const activo =
    visibles.find(
      (p) => p.id === seleccion[vista]
    ) ?? visibles[0];

  const indiceActivo = activo
    ? visibles.findIndex((p) => p.id === activo.id)
    : 0;

  // CAMBIAR PELÍCULA SELECCIONADA
  function elegir(p, seccion = vista) {
    setSeleccion((prev) => ({
      ...prev,
      [seccion]: p.id,
    }));
  }

  // MOVER CARRUSEL
  function mover(direccion) {
    if (!visibles.length) return;

    const siguiente =
      (indiceActivo + direccion + visibles.length) %
      visibles.length;

    elegir(visibles[siguiente]);
  }

  // ABRIR EDITOR
  function abrirEditor(pelicula) {
    setEditorId(pelicula.id);

    setBorrador(
      resenas[pelicula.id]?.texto ?? ""
    );

    setError("");
    setMensaje("");
  }

  // GUARDAR RESEÑA
  function guardarResena() {
    const texto = borrador.trim();

    if (!editorId) return;

    if (texto.length < 10) {
      setError("Escribe al menos 10 caracteres.");
      return;
    }

    setResenas((prev) => ({
      ...prev,

      [editorId]: {
        texto,
        fecha: new Date().toLocaleDateString("es-MX"),
        fechaOrden: Date.now(),
      },
    }));

    setEditorId(null);
    setMensaje("Reseña guardada.");
  }

  // ELIMINAR RESEÑA
  function eliminarResena(pelicula) {
    if (
      !window.confirm(
        `¿Eliminar tu reseña de ${pelicula.titulo}?`
      )
    ) {
      return;
    }

    setResenas((prev) => {
      const copia = { ...prev };
      delete copia[pelicula.id];
      return copia;
    });

    setMensaje("Reseña eliminada.");
  }

  // ABRIR DETALLES
  function detalles(pelicula, evento) {
    alVerDetalles(
      pelicula,
      evento.currentTarget
    );
  }

  const editorPelicula = catalogo.find(
    (p) => p.id === editorId
  );

  return (
    <section className={`rc-pagina rc-${vista}`}>

      {/* ENCABEZADO DE CADA INTERFAZ */}
      <header className="rc-cabecera">
        <div>
          <span className="rc-indice">
            {vista === "favoritos"
              ? "01"
              : vista === "lista"
                ? "02"
                : "03"}
          </span>

          <h1>
            {vista === "favoritos"
              ? "Favoritos"
              : vista === "lista"
                ? "Mi lista"
                : "Mis reseñas"}
          </h1>

          <p>
            {vista === "favoritos"
              ? "Películas y series favoritas."
              : vista === "lista"
                ? "Películas y series que agregaste a tu lista."
                : "Tus calificaciones y opiniones."}
          </p>
        </div>

        <span className="rc-total">
          {base.length}
          <small>títulos</small>
        </span>
      </header>

      {/* FILTROS */}
      <div className="rc-herramientas">
        <div className="rc-filtros">
          {["Todos", "Película", "Serie"].map((opcion) => (
            <button
              type="button"
              key={opcion}
              aria-pressed={tipo === opcion}
              className={tipo === opcion ? "activo" : ""}
              onClick={() => setTipo(opcion)}
            >
              {opcion === "Todos"
                ? "Todos"
                : opcion === "Película"
                  ? "Películas"
                  : "Series"}
            </button>
          ))}
        </div>

        <input
          type="search"
          aria-label="Buscar películas"
          placeholder="Buscar película o serie"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {mensaje && (
        <p className="rc-mensaje" role="status">
          {mensaje}
        </p>
      )}

      {/* ===================================
          FAVORITOS: CARRUSEL 3D HORIZONTAL
      =================================== */}

      {vista === "favoritos" && (
        visibles.length ? (
          <div className="rc-fav-contenido">

            <div
              className="rc-fav-escenario"
              aria-label="Carrusel de favoritos"
            >

              {/* FONDO DE LA PELÍCULA */}
              <div
                className="rc-fav-fondo"
                aria-hidden="true"
                style={{
                  backgroundImage: `url("${
                    activo.fondo || activo.poster
                  }")`,
                }}
              />

              {/* PÓSTERES EN PERSPECTIVA */}
              <div className="rc-fav-pista">
                {visibles.map((p, i) => {
                  const d = distancia(
                    i,
                    indiceActivo,
                    visibles.length
                  );

                  const a = Math.abs(d);

                  return (
                    <button
                      type="button"
                      key={p.id}
                      className={`rc-fav-cartel ${
                        p.id === activo.id
                          ? "central"
                          : ""
                      }`}
                      style={{
                        "--d": d,
                        "--abs": a,
                        zIndex: 10 - a,
                        pointerEvents:
                          a > 3 ? "none" : "auto",
                      }}
                      tabIndex={a > 3 ? -1 : 0}
                      aria-label={`Seleccionar ${p.titulo}`}
                      aria-pressed={
                        p.id === activo.id
                      }
                      onClick={() => elegir(p)}
                    >
                      <img
                        src={p.poster}
                        alt=""
                        loading="lazy"
                      />

                      <span>{p.titulo}</span>
                    </button>
                  );
                })}
              </div>

              {/* FLECHAS */}
              <button
                type="button"
                className="rc-fav-flecha izquierda"
                onClick={() => mover(-1)}
                aria-label="Película anterior"
              >
                ‹
              </button>

              <button
                type="button"
                className="rc-fav-flecha derecha"
                onClick={() => mover(1)}
                aria-label="Película siguiente"
              >
                ›
              </button>

              <div className="rc-fav-numeracion">
                {String(indiceActivo + 1).padStart(2, "0")}
                {" / "}
                {String(visibles.length).padStart(2, "0")}
              </div>

            </div>

            {/* DATOS DE LA PELÍCULA ACTIVA */}
            <section
              className="rc-fav-detalle"
              aria-label="Película seleccionada"
            >
              <div>
                <span className="rc-meta">
                  {activo.anio} · {activo.tipo} ·{" "}
                  {activo.generos?.join(" / ")}
                </span>

                <h2>{activo.titulo}</h2>

                <p>{activo.sinopsis}</p>
              </div>

              <div className="rc-acciones">
                <button
                  type="button"
                  className="rc-primario"
                  onClick={(e) => detalles(activo, e)}
                >
                  Ver detalles ↗
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alFavorito(activo.id)
                  }
                >
                  ♥ Quitar favorito
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alMiLista(activo.id)
                  }
                >
                  {miLista.includes(activo.id)
                    ? "✓ En Mi lista"
                    : "+ Mi lista"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    abrirEditor(activo)
                  }
                >
                  {resenas[activo.id]?.texto
                    ? "Editar reseña"
                    : "Escribir reseña"}
                </button>

                <Nota
                  pelicula={activo}
                  calificaciones={calificaciones}
                  alCalificar={alCalificar}
                />
              </div>

            </section>

          </div>
        ) : (
          <div className="rc-vacio">
            <h2>No hay favoritos para mostrar.</h2>

            <button
              type="button"
              onClick={() =>
                alCambiarVista("inicio")
              }
            >
              Ver catálogo
            </button>
          </div>
        )
      )}

      {/* ===================================
          MI LISTA: RUEDA VERTICAL
      =================================== */}

      {vista === "lista" && (
        visibles.length ? (
          <div className="rc-lista-layout">

            {/* RUEDA DE PÓSTERES */}
            <div
              className="rc-rueda"
              aria-label="Carrusel de Mi lista"
            >
              <div
                className="rc-rueda-arco"
                aria-hidden="true"
              />

              {visibles.map((p, i) => {
                const d = distancia(
                  i,
                  indiceActivo,
                  visibles.length
                );

                const a = Math.abs(d);

                return (
                  <button
                    type="button"
                    key={p.id}
                    className={`rc-rueda-cartel ${
                      p.id === activo.id
                        ? "central"
                        : ""
                    }`}
                    style={{
                      "--d": d,
                      "--abs": a,
                      zIndex: 10 - a,
                      pointerEvents:
                        a > 3 ? "none" : "auto",
                    }}
                    tabIndex={a > 3 ? -1 : 0}
                    aria-label={`Seleccionar ${p.titulo}`}
                    aria-pressed={
                      p.id === activo.id
                    }
                    onClick={() => elegir(p)}
                  >
                    <img
                      src={p.poster}
                      alt=""
                      loading="lazy"
                    />
                  </button>
                );
              })}

              {/* CONTROLES VERTICALES */}
              <div className="rc-rueda-controles">
                <button
                  type="button"
                  onClick={() => mover(-1)}
                  aria-label="Película anterior"
                >
                  ↑
                </button>

                <span>
                  {indiceActivo + 1} / {visibles.length}
                </span>

                <button
                  type="button"
                  onClick={() => mover(1)}
                  aria-label="Película siguiente"
                >
                  ↓
                </button>
              </div>
            </div>

            {/* INFORMACIÓN A LA DERECHA */}
            <section className="rc-lista-detalle">
              <div
                className="rc-lista-fondo"
                aria-hidden="true"
                style={{
                  backgroundImage: `url("${
                    activo.fondo || activo.poster
                  }")`,
                }}
              />

              <div className="rc-lista-informacion">
                <span className="rc-meta">
                  {activo.anio} · {activo.tipo} ·{" "}
                  {activo.generos?.join(" / ")}
                </span>

                <h2>{activo.titulo}</h2>

                <p>{activo.sinopsis}</p>

                <div className="rc-acciones">
                  <button
                    type="button"
                    className="rc-primario"
                    onClick={(e) =>
                      detalles(activo, e)
                    }
                  >
                    Ver detalles ↗
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      alMiLista(activo.id)
                    }
                  >
                    Quitar de Mi lista
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      alFavorito(activo.id)
                    }
                  >
                    {favoritos.includes(activo.id)
                      ? "♥ En favoritos"
                      : "♡ Favorito"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      abrirEditor(activo)
                    }
                  >
                    Escribir reseña
                  </button>

                  <Nota
                    pelicula={activo}
                    calificaciones={calificaciones}
                    alCalificar={alCalificar}
                  />
                </div>
              </div>
            </section>

          </div>
        ) : (
          <div className="rc-vacio">
            <h2>No hay películas en Mi lista.</h2>

            <button
              type="button"
              onClick={() =>
                alCambiarVista("inicio")
              }
            >
              Ver catálogo
            </button>
          </div>
        )
      )}

      {/* ===================================
          MIS RESEÑAS: PANELES 3D
      =================================== */}

      {vista === "calificadas" && (
        <div className="rc-resenas">

          {/* SELECCIONAR PELÍCULA PARA RESEÑAR */}
          <div className="rc-resenas-nueva">
            <label htmlFor="rc-elegir">
              Película o serie
            </label>

            <select
              id="rc-elegir"
              value={nuevaResenaId}
              onChange={(e) =>
                setNuevaResenaId(e.target.value)
              }
            >
              {catalogo.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titulo}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="rc-primario"
              disabled={!nuevaResenaId}
              onClick={() => {
                const pelicula = catalogo.find(
                  (p) => p.id === nuevaResenaId
                );

                if (pelicula) {
                  abrirEditor(pelicula);
                }
              }}
            >
              + Nueva reseña
            </button>
          </div>

          {visibles.length ? (
            <>

              {/* CARRUSEL DE RESEÑAS */}
              <div
                className="rc-resenas-escenario"
                aria-label="Carrusel de reseñas"
              >
                <div className="rc-resenas-paneles">
                  {visibles.map((p, i) => {
                    const d = distancia(
                      i,
                      indiceActivo,
                      visibles.length
                    );

                    const a = Math.abs(d);

                    return (
                      <button
                        type="button"
                        key={p.id}
                        className={`rc-resena-panel ${
                          p.id === activo.id
                            ? "central"
                            : ""
                        }`}
                        style={{
                          "--d": d,
                          "--abs": a,
                          zIndex: 10 - a,
                          pointerEvents:
                            a > 2 ? "none" : "auto",
                        }}
                        tabIndex={a > 2 ? -1 : 0}
                        aria-label={`Seleccionar reseña de ${p.titulo}`}
                        aria-pressed={
                          p.id === activo.id
                        }
                        onClick={() => elegir(p)}
                      >
                        <img
                          src={p.poster}
                          alt=""
                          loading="lazy"
                        />

                        <span className="rc-panel-texto">
                          <small>
                            {p.anio} · {p.tipo}
                          </small>

                          <strong>{p.titulo}</strong>

                          <em>
                            {resenas[p.id]?.texto ||
                              "Sin reseña escrita"}
                          </em>

                          <span className="rc-panel-nota">
                            {calificaciones[p.id] ?? "—"}
                            <small>/10</small>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="rc-resenas-navegacion">
                  <button
                    type="button"
                    onClick={() => mover(-1)}
                    aria-label="Reseña anterior"
                  >
                    ←
                  </button>

                  <span>
                    {String(indiceActivo + 1).padStart(2, "0")}
                    {" / "}
                    {String(visibles.length).padStart(2, "0")}
                  </span>

                  <button
                    type="button"
                    onClick={() => mover(1)}
                    aria-label="Reseña siguiente"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* TEXTO COMPLETO DE LA RESEÑA */}
              <section
                className="rc-resena-detalle"
                aria-label="Reseña seleccionada"
              >
                <div>
                  <span className="rc-meta">
                    {activo.titulo} ·{" "}
                    {resenas[activo.id]?.fecha || "Sin fecha"}
                  </span>

                  <h2>
                    {resenas[activo.id]?.texto
                      ? "Mi reseña"
                      : "Mi calificación"}
                  </h2>

                  <p>
                    {resenas[activo.id]?.texto ||
                      "Todavía no escribes una reseña para esta película."}
                  </p>
                </div>

                <div className="rc-acciones">
                  <button
                    type="button"
                    className="rc-primario"
                    onClick={() =>
                      abrirEditor(activo)
                    }
                  >
                    {resenas[activo.id]?.texto
                      ? "Editar reseña"
                      : "Escribir reseña"}
                  </button>

                  {resenas[activo.id]?.texto && (
                    <button
                      type="button"
                      onClick={() =>
                        eliminarResena(activo)
                      }
                    >
                      Eliminar reseña
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) =>
                      detalles(activo, e)
                    }
                  >
                    Ver detalles ↗
                  </button>

                  <Nota
                    pelicula={activo}
                    calificaciones={calificaciones}
                    alCalificar={alCalificar}
                  />
                </div>
              </section>

            </>
          ) : (
            <div className="rc-vacio">
              <h2>
                No hay reseñas o calificaciones para mostrar.
              </h2>

              <p>
                Selecciona una película arriba para escribir
                una reseña.
              </p>
            </div>
          )}

        </div>
      )}

      {/* ===================================
          EDITOR DE RESEÑAS
      =================================== */}

      {editorPelicula && createPortal(
        <div
          className="rc-modal-fondo"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setEditorId(null);
            }
          }}
        >
          <section
            className="rc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rc-editor-titulo"
          >
            <button
              type="button"
              className="rc-cerrar"
              onClick={() => setEditorId(null)}
              aria-label="Cerrar"
            >
              ×
            </button>

            <h2 id="rc-editor-titulo">
              {resenas[editorId]?.texto
                ? "Editar reseña"
                : "Nueva reseña"}
            </h2>

            <div className="rc-modal-pelicula">
              <img
                src={editorPelicula.poster}
                alt=""
              />

              <div>
                <strong>
                  {editorPelicula.titulo}
                </strong>

                <span>
                  {editorPelicula.anio} ·{" "}
                  {editorPelicula.tipo}
                </span>
              </div>
            </div>

            <Nota
              pelicula={editorPelicula}
              calificaciones={calificaciones}
              alCalificar={alCalificar}
            />

            <label htmlFor="rc-texto">
              Tu opinión
            </label>

            <textarea
              id="rc-texto"
              ref={entradaRef}
              rows={6}
              maxLength={1000}
              placeholder="Escribe tu opinión sobre esta película o serie."
              value={borrador}
              onChange={(e) => {
                setBorrador(e.target.value);
                setError("");
              }}
            />

            <div className="rc-modal-meta">
              <span role="alert">
                {error}
              </span>

              <span>
                {borrador.length}/1000
              </span>
            </div>

            <div className="rc-modal-acciones">
              <button
                type="button"
                onClick={() => setEditorId(null)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="rc-primario"
                onClick={guardarResena}
              >
                Guardar reseña
              </button>
            </div>

          </section>
        </div>,
        document.body
      )}

    </section>
  );
}
