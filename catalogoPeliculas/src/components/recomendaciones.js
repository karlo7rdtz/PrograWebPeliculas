
(function () {
    const pista = document.getElementById('carrusel-recomendaciones');
    if (!pista) return;

    const peliculas = Array.from(pista.querySelectorAll('.pelicula'));
    const botonAnterior = document.querySelector('.anterior-pelicula');
    const botonSiguiente = document.querySelector('.siguiente-pelicula');
    const contador = document.getElementById('numero-recomendacion');
    let activo = 7; 

    function distanciaCircular(indice, referencia, total) {
        let diferencia = indice - referencia;
        if (diferencia > total / 2) diferencia -= total;
        if (diferencia < -total / 2) diferencia += total;
        return diferencia;
    }

    function actualizar() {
        const cantidad = peliculas.length;
        const maximo = window.innerWidth <= 650 ? 1 : window.innerWidth <= 1050 ? 2 : 3;
        peliculas.forEach((pelicula, indice) => {
            const distancia = distanciaCircular(indice, activo, cantidad);
            const visible = Math.abs(distancia) <= maximo;
            pelicula.style.setProperty('--posicion', distancia);
            pelicula.style.setProperty('--pasos', Math.abs(distancia));
            pelicula.style.opacity = visible ? String(Math.max(0.48, 1 - Math.abs(distancia) * 0.18)) : '0';
            pelicula.dataset.activa = distancia === 0 ? 'true' : 'false';
            pelicula.dataset.visible = visible ? 'true' : 'false';
            pelicula.tabIndex = visible ? 0 : -1;
            pelicula.setAttribute('aria-hidden', visible ? 'false' : 'true');
            pelicula.style.zIndex = String(10 - Math.abs(distancia));
        });
        if (contador) contador.textContent = String(activo + 1).padStart(2, '0');
    }

    peliculas.forEach((pelicula, indice) => {
        pelicula.addEventListener('click', (evento) => {
            if (activo !== indice) {
                evento.preventDefault();
                activo = indice;
                actualizar();
            }
        });
    });

    botonAnterior?.addEventListener('click', () => {
        activo = (activo - 1 + peliculas.length) % peliculas.length;
        actualizar();
    });
    botonSiguiente?.addEventListener('click', () => {
        activo = (activo + 1) % peliculas.length;
        actualizar();
    });
    window.addEventListener('resize', actualizar);
    actualizar();
})();
