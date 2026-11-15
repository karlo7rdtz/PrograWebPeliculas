
import { useEffect, useRef, useState } from "react";
import { catalogo } from "../data/catalogo";
import "../styles/favoritos.css";

const CLAVE_RESENAS = "peliculas-resenas";

function cargarResenas() {
  try {
    const guardadas = JSON.parse(
      localStorage.getItem(CLAVE_RESENAS) || "{}"
    );

    return guardadas &&
      typeof guardadas === "object" &&
      !Array.isArray(guardadas)
      ? guardadas
      : {};
  } catch {
    return {};
  }
}

function normalizar(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function Favoritos({
  vista,
  favoritos = [],
  miLista = [],
  calificaciones = {},
  alCambiarVista,
  alFavorito,
  alMiLista,
  alCalificar,
  alVerDetalles,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState("Todos");
  const [resenas, setResenas] = useState(cargarResenas);
  const [editando, setEditando] = useState(null);
  const [borrador, setBorrador] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const carruselRef = useRef(null);

  // Guardar reseñas.
  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_RESENAS,
        JSON.stringify(resenas)
      );
    } catch {
      // Funciona durante la sesión si falla localStorage.
    }
  }, [resenas]);

  // Limpiar filtros al cambiar de sección.
  useEffect(() => {
    setBusqueda("");
    setTipo("Todos");
    setEditando(null);
    setError("");
    setMensaje("");
  }, [vista]);

  const tieneResenaONota = (pelicula) =>
    Boolean(resenas[pelicula.id]?.texto) ||
    calificaciones[pelicula.id] !== undefined;

  const totalResenas = catalogo.filter(
    tieneResenaONota
  ).length;

  // Seleccionar películas según la sección.
  const peliculasVisibles = catalogo.filter((pelicula) => {
    const pertenece =
      vista === "favoritos"
        ? favoritos.includes(pelicula.id)
        : vista === "lista"
          ? miLista.includes(pelicula.id)
          : tieneResenaONota(pelicula);

    const coincideTipo =
      tipo === "Todos" || pelicula.tipo === tipo;

    const coincideBusqueda = normalizar(
      pelicula.titulo
    ).includes(normalizar(busqueda.trim()));

    return pertenece && coincideTipo && coincideBusqueda;
  });

  // Mostrar las últimas tres reseñas escritas.
  const resenasRecientes = catalogo
    .filter((pelicula) =>
      Boolean(resenas[pelicula.id]?.texto)
    )
    .sort(
      (a, b) =>
        (resenas[b.id]?.fechaOrden ?? 0) -
        (resenas[a.id]?.fechaOrden ?? 0)
    )
    .slice(0, 3);

  const titulo =
    vista === "favoritos"
      ? "Mis Favoritos"
      : vista === "lista"
        ? "Mi Lista"
        : "Mis Reseñas";

  const descripcion =
    vista === "favoritos"
      ? "Las historias que merecen un lugar especial."
      : vista === "lista"
        ? "Películas y series que quieres tener a la mano."
        : "Tus opiniones y calificaciones, reunidas en un solo lugar.";

  // Preparar formulario de reseña.
  function abrirEditor(pelicula) {
    setEditando(pelicula.id);
    setBorrador(resenas[pelicula.id]?.texto ?? "");
    setError("");
    setMensaje("");
  }

  // Guardar una reseña.
  function guardarResena(pelicula) {
    const texto = borrador.trim();

    if (texto.length < 10) {
      setError(
        "Escribe por lo menos 10 caracteres para guardar tu reseña."
      );
      return;
    }

    setResenas((actuales) => ({
      ...actuales,
      [pelicula.id]: {
        texto,
        fecha: new Date().toLocaleDateString("es-MX"),
        fechaOrden: Date.now(),
      },
    }));

    setEditando(null);
    setError("");
    setMensaje(
      `Reseña de ${pelicula.titulo} guardada.`
    );
  }

  // Eliminar una reseña.
  function eliminarResena(pelicula) {
    setResenas((actuales) => {
      const copia = { ...actuales };
      delete copia[pelicula.id];
      return copia;
    });

    setEditando(null);
    setMensaje(
      `Se eliminó la reseña de ${pelicula.titulo}.`
    );
  }

  // Desplazamiento del carrusel.
  function moverCarrusel(direccion) {
    carruselRef.current?.scrollBy({
      left: direccion * 265,
      behavior: "smooth",
    });
  }

  function cambiarSeccion(nuevaVista) {
    alCambiarVista(nuevaVista);
  }

  // Tarjetas de películas.
  function tarjeta(pelicula) {
    const guardada = favoritos.includes(pelicula.id);
    const enLista = miLista.includes(pelicula.id);
    const resena = resenas[pelicula.id];
    const nota = calificaciones[pelicula.id];

    return (
      <article className="fav-tarjeta" key={pelicula.id}>

        <div className="fav-imagen-contenedor">
          <img
            src={pelicula.poster}
            alt={pelicula.titulo}
            loading="lazy"
          />

          <button
            type="button"
            className={`fav-corazon ${
              guardada ? "marcado" : ""
            }`}
            aria-label={
              guardada
                ? `Quitar ${pelicula.titulo} de favoritos`
                : `Agregar ${pelicula.titulo} a favoritos`
            }
            aria-pressed={guardada}
            onClick={() => alFavorito(pelicula.id)}
          >
            {guardada ? "♥" : "♡"}
          </button>

          <div className="fav-acciones">
            <button
              type="button"
              onClick={(evento) =>
                alVerDetalles(
                  pelicula,
                  evento.currentTarget
                )
              }
            >
              Ver información
            </button>

            <button
              type="button"
              onClick={() => abrirEditor(pelicula)}
            >
              {resena
                ? "Editar reseña"
                : "Escribir reseña"}
            </button>
          </div>
        </div>

        <div className="fav-datos">
          <p className="fav-meta">
            {pelicula.anio} · {pelicula.tipo}
          </p>

          <h3>{pelicula.titulo}</h3>

          <p className="fav-genero">
            {pelicula.generos?.join(" · ")}
          </p>

          <div className="fav-fila-opciones">
            <button
              type="button"
              onClick={() => alMiLista(pelicula.id)}
              aria-pressed={enLista}
            >
              {enLista ? "✓ En Mi lista" : "+ Mi lista"}
            </button>

            <label>
              <span>Nota</span>
              <select
                value={nota ?? ""}
                aria-label={`Tu calificación para ${pelicula.titulo}`}
                onChange={(evento) =>
                  alCalificar(
                    pelicula.id,
                    evento.target.value
                  )
                }
              >
                <option value="">—</option>

                {Array.from(
                  { length: 10 },
                  (_, indice) => indice + 1
                ).map((numero) => (
                  <option key={numero} value={numero}>
                    {numero}/10
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* RESEÑA GUARDADA */}
          {resena?.texto && (
            <div className="fav-resena-guardada">
              <span>
                Mi reseña · {resena.fecha}
              </span>

              <p>{resena.texto}</p>

              <button
                type="button"
                onClick={() => eliminarResena(pelicula)}
              >
                Eliminar reseña
              </button>
            </div>
          )}

          {/* FORMULARIO PARA ESCRIBIR */}
          {editando === pelicula.id && (
            <div className="fav-editor">
              <label htmlFor={`resena-${pelicula.id}`}>
                Tu reseña
              </label>

              <textarea
                id={`resena-${pelicula.id}`}
                value={borrador}
                onChange={(evento) => {
                  setBorrador(evento.target.value);
                  setError("");
                }}
                placeholder="¿Qué te pareció esta historia?"
                rows={4}
                maxLength={800}
              />

              {error && (
                <p className="fav-error" role="alert">
                  {error}
                </p>
              )}

              <div className="fav-editor-acciones">
                <button
                  type="button"
                  onClick={() => guardarResena(pelicula)}
                >
                  Guardar
                </button>

                <button
                  type="button"
                  onClick={() => setEditando(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

      </article>
    );
  }

  return (
    <section className="fav-pagina">

      {/* ENCABEZADO */}
      <header className="fav-encabezado">
        <div>
          <p className="fav-sobre">
            ✦ TU RINCÓN DE CINE ✦
          </p>

          <h1>
            {titulo} <span>♥</span>
          </h1>

          <p>{descripcion}</p>
        </div>

        <div className="fav-contador">
          <strong>
            {vista === "favoritos"
              ? favoritos.length
              : vista === "lista"
                ? miLista.length
                : totalResenas}
          </strong>

          <span>
            {vista === "calificadas"
              ? "Opiniones y notas"
              : "Guardadas"}
          </span>
        </div>
      </header>

      {/* NAVEGACIÓN DE COLECCIONES */}
      <nav
        className="fav-pestanas"
        aria-label="Mi colección personal"
      >
        <button
          type="button"
          className={
            vista === "favoritos" ? "seleccionada" : ""
          }
          onClick={() => cambiarSeccion("favoritos")}
        >
          ♥ Favoritos <span>{favoritos.length}</span>
        </button>

        <button
          type="button"
          className={
            vista === "lista" ? "seleccionada" : ""
          }
          onClick={() => cambiarSeccion("lista")}
        >
          ☷ Mi lista <span>{miLista.length}</span>
        </button>

        <button
          type="button"
          className={
            vista === "calificadas" ? "seleccionada" : ""
          }
          onClick={() => cambiarSeccion("calificadas")}
        >
          ☆ Mis reseñas <span>{totalResenas}</span>
        </button>
      </nav>

      {/* FILTROS */}
      <div className="fav-herramientas">
        <div
          className="fav-filtros"
          aria-label="Filtrar por tipo"
        >
          {["Todos", "Película", "Serie"].map((opcion) => (
            <button
              type="button"
              key={opcion}
              className={
                tipo === opcion ? "activo" : ""
              }
              aria-pressed={tipo === opcion}
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
          placeholder="Buscar en mi colección..."
          aria-label="Buscar en mi colección"
          value={busqueda}
          onChange={(evento) =>
            setBusqueda(evento.target.value)
          }
        />
      </div>

      {mensaje && (
        <p className="fav-mensaje" role="status">
          {mensaje}
        </p>
      )}

      {/* TÍTULO DE SECCIÓN */}
      <div className="fav-seccion-titulo">
        <div>
          <p>SELECCIÓN PERSONAL</p>

          <h2>
            {vista === "favoritos"
              ? "Historias que me encantan"
              : vista === "lista"
                ? "Para volver a ver o descubrir"
                : "Lo que pienso de cada historia"}
          </h2>
        </div>

        <span>{peliculasVisibles.length} títulos</span>
      </div>

      {/* PELÍCULAS Y CARRUSEL */}
      {peliculasVisibles.length === 0 ? (
        <div className="fav-vacio">
          <span>♡</span>

          <h3>Por aquí todavía no hay películas</h3>

          <p>
            {busqueda || tipo !== "Todos"
              ? "Prueba con otros filtros o con otra búsqueda."
              : "Vuelve al catálogo y guarda, califica o reseña una película."}
          </p>

          <button
            type="button"
            onClick={() => alCambiarVista("inicio")}
          >
            Ir al catálogo
          </button>
        </div>
      ) : vista === "calificadas" ? (
        <div className="fav-resenas-lista">
          {peliculasVisibles.map(tarjeta)}
        </div>
      ) : (
        <div className="fav-carrusel-bloque">
          <button
            type="button"
            className="fav-flecha"
            aria-label="Anterior"
            onClick={() => moverCarrusel(-1)}
          >
            ❮
          </button>

          <div
            className="fav-carrusel"
            ref={carruselRef}
          >
            {peliculasVisibles.map(tarjeta)}
          </div>

          <button
            type="button"
            className="fav-flecha"
            aria-label="Siguiente"
            onClick={() => moverCarrusel(1)}
          >
            ❯
          </button>
        </div>
      )}

      {/* APARTADO DE RESEÑAS RECIENTES */}
      {vista !== "calificadas" && (
        <section className="fav-ultimas">
          <div className="fav-ultimas-cabecera">
            <div>
              <p>DIARIO DE CINE</p>
              <h2>Mis reseñas</h2>
            </div>

            <button
              type="button"
              onClick={() =>
                cambiarSeccion("calificadas")
              }
            >
              Ver todas ↗
            </button>
          </div>

          {resenasRecientes.length === 0 ? (
            <p className="fav-sin-resenas">
              Todavía no escribes una reseña.
              Selecciona "Escribir reseña" en una
              tarjeta para comenzar.
            </p>
          ) : (
            <div className="fav-ultimas-grid">
              {resenasRecientes.map((pelicula) => (
                <article key={pelicula.id}>
                  <strong>{pelicula.titulo}</strong>

                  <span>
                    {calificaciones[pelicula.id]
                      ? `${calificaciones[pelicula.id]}/10`
                      : "Sin nota"}
                  </span>

                  <p>
                    {resenas[pelicula.id].texto}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

    </section>
  );
}
