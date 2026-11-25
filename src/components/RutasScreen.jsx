import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { obtenerTodasLasRutas, rutasPredefinidas } from '../data/rutasData';
import '../styles/rutas.css';

export default function RutasScreen() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polylineRef = useRef(null);
  const markersRef = useRef([]);
  const intervalsRef = useRef([]);

  const [favoritos, setFavoritos] = useState(() => {
    const saved = localStorage.getItem('seti_favoritos');
    return saved ? JSON.parse(saved) : [];
  });
  const [mostrandoFavoritos, setMostrandoFavoritos] = useState(false);
  const [rutaSeleccionadaId, setRutaSeleccionadaId] = useState(null);
  const [modalRutasAbierto, setModalRutasAbierto] = useState(false);
  const [rutaPendienteEliminar, setRutaPendienteEliminar] = useState(null);

  useEffect(() => {
    localStorage.setItem('seti_favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const limpiarMapaRuta = () => {
    if (polylineRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }
    markersRef.current.forEach((marker) => {
      if (mapInstanceRef.current) mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];
    intervalsRef.current.forEach((interval) => clearInterval(interval));
    intervalsRef.current = [];
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const armeniaCoords = [4.5338, -75.6811];
    const map = L.map(mapContainerRef.current).setView(armeniaCoords, 13);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri',
    }).addTo(map);

    const userIcon = L.divIcon({
      className: 'user-location-icon',
      html: `<div style="background:#e63946; color:white; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-size:15px; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3);">🏠</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    L.marker([4.542, -75.675], { icon: userIcon })
      .bindPopup('<b>Mi Ubicación Simulada (Casa)</b>')
      .addTo(map);

    mapInstanceRef.current = map;

    return () => {
      limpiarMapaRuta();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const seleccionarRuta = (ruta) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (rutaSeleccionadaId === ruta.id) {
      limpiarMapaRuta();
      setRutaSeleccionadaId(null);
      return;
    }

    limpiarMapaRuta();
    setRutaSeleccionadaId(ruta.id);

    const polyline = L.polyline(ruta.puntos, {
      color: ruta.color || '#00a8cc',
      weight: 5,
      opacity: 0.85,
    }).addTo(map);

    polylineRef.current = polyline;
    map.fitBounds(polyline.getBounds(), { padding: [30, 30] });

    const busIcon = L.divIcon({
      className: 'custom-bus-icon',
      html: `<div style="background:${ruta.color || '#00a8cc'}; color:white; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-size:15px; border:2px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.3);">🚌</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    ruta.buses.forEach((bus) => {
      let puntoIdx = bus.puntoInicioIdx || 0;
      const coordsInicio = ruta.puntos[puntoIdx];

      const marker = L.marker(coordsInicio, { icon: busIcon })
        .bindPopup(`<b>${bus.id}</b><br>${ruta.nombre}`)
        .addTo(map);

      markersRef.current.push(marker);

      let paso = 0;
      let direccion = 1;
      const pasoTotal = 120;

      const interval = setInterval(() => {
        const siguienteIdx = puntoIdx + direccion;

        if (siguienteIdx >= ruta.puntos.length || siguienteIdx < 0) {
          direccion *= -1;
          return;
        }

        const origen = ruta.puntos[puntoIdx];
        const destino = ruta.puntos[siguienteIdx];

        paso++;
        const lat = origen[0] + (destino[0] - origen[0]) * (paso / pasoTotal);
        const lng = origen[1] + (destino[1] - origen[1]) * (paso / pasoTotal);

        marker.setLatLng([lat, lng]);

        if (paso >= pasoTotal) {
          paso = 0;
          puntoIdx = siguienteIdx;
        }
      }, 120);

      intervalsRef.current.push(interval);
    });
  };

  const toggleFavorito = (idRuta, e) => {
    e.stopPropagation();
    setFavoritos((prev) =>
      prev.includes(idRuta) ? prev.filter((id) => id !== idRuta) : [...prev, idRuta]
    );
  };

  const agregarPredefinidaAFavoritos = (idRuta) => {
    setFavoritos((prev) => (prev.includes(idRuta) ? prev : [...prev, idRuta]));
  };

  const confirmarEliminarFavorito = () => {
    if (!rutaPendienteEliminar) return;

    const idAEliminar = rutaPendienteEliminar.id;
    setFavoritos((prev) => prev.filter((id) => id !== idAEliminar));

    if (rutaSeleccionadaId === idAEliminar) {
      limpiarMapaRuta();
      setRutaSeleccionadaId(null);
    }

    setRutaPendienteEliminar(null);
  };

  const todasLasRutas = obtenerTodasLasRutas();
  const rutasVisibles = mostrandoFavoritos
    ? todasLasRutas.filter((r) => favoritos.includes(r.id))
    : todasLasRutas.filter((r) => !r.id.startsWith('pref-') || favoritos.includes(r.id));

  return (
    <div className="screen-content">
      <div className="titulo-rutas">
        <h2>🚌 Rutas Activas</h2>
        <p>Consulta los recorridos y ubicación de los buses de Armenia.</p>
      </div>

      <div className="mapa-contenedor">
        <div className="mapa-header">
          <h3>📍 Mapa de Armenia</h3>
          <span className="estado-mapa">● Mapa disponible</span>
        </div>

        <div ref={mapContainerRef} id="mapa" />

        <div className="mapa-acciones">
          <button
            type="button"
            className={`btn-favoritas-pill ${mostrandoFavoritos ? 'active' : ''}`}
            onClick={() => setMostrandoFavoritos((prev) => !prev)}
          >
            {mostrandoFavoritos ? '📋 Ver Todas' : '⭐ Favoritas'}
          </button>

          <button
            type="button"
            className="btn-anadir-pill"
            onClick={() => setModalRutasAbierto(true)}
          >
            + Añadir
          </button>
        </div>
      </div>

      <div className="rutas-seccion">
        <h3>Rutas disponibles</h3>
        <p className="descripcion">Selecciona una ruta para visualizar su recorrido.</p>

        <div id="lista-rutas">
          {rutasVisibles.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#777', fontSize: '0.78rem', padding: '14px' }}>
              No hay rutas guardadas en favoritos.
            </p>
          ) : (
            rutasVisibles.map((ruta) => {
              const esFav = favoritos.includes(ruta.id);
              const seleccionada = rutaSeleccionadaId === ruta.id;

              return (
                <div
                  key={ruta.id}
                  className={`ruta-card ${seleccionada ? 'seleccionada' : ''}`}
                  onClick={() => seleccionarRuta(ruta)}
                >
                  <div className="ruta-card-top">
                    <h4>{ruta.nombre}</h4>

                    {mostrandoFavoritos ? (
                      <button
                        type="button"
                        className="btn-quitar-fav"
                        title="Quitar de favoritas"
                        onClick={(e) => {
                          e.stopPropagation();
                          setRutaPendienteEliminar(ruta);
                        }}
                      >
                        ✕
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn-fav-star"
                        title="Marcar favorita"
                        onClick={(e) => toggleFavorito(ruta.id, e)}
                      >
                        {esFav ? '⭐' : '☆'}
                      </button>
                    )}
                  </div>

                  <p>{ruta.descripcion}</p>
                  <span className="ruta-estado">● {ruta.estado}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className={`modal-overlay ${modalRutasAbierto ? '' : 'hidden'}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Agregar Ruta Rápida</h3>
            <button
              type="button"
              className="btn-cerrar"
              onClick={() => setModalRutasAbierto(false)}
            >
              &times;
            </button>
          </div>

          <p className="modal-subtitle">Selecciona una ruta predefinida para guardarla en tus favoritas.</p>

          <div className="modal-opciones">
            {rutasPredefinidas.map((ruta) => {
              const esFav = favoritos.includes(ruta.id);

              return (
                <div
                  key={ruta.id}
                  className="opcion-ruta-card"
                  onClick={() => agregarPredefinidaAFavoritos(ruta.id)}
                >
                  <div className="opcion-ruta-info">
                    <h5>{ruta.nombre}</h5>
                    <p>{ruta.descripcion}</p>
                  </div>
                  <button
                    type="button"
                    className="btn-add-fav"
                    style={esFav ? { backgroundColor: '#718093' } : undefined}
                  >
                    {esFav ? 'Añadida ✓' : 'Guardar ⭐'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={`modal-overlay ${rutaPendienteEliminar ? '' : 'hidden'}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Confirmar Eliminación</h3>
            <button
              type="button"
              className="btn-cerrar"
              onClick={() => setRutaPendienteEliminar(null)}
            >
              &times;
            </button>
          </div>

          <p className="modal-subtitle">
            ¿Estás seguro que quieres quitar la ruta &ldquo;{rutaPendienteEliminar?.nombre}&rdquo; de favoritas?
          </p>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-primary"
              style={{ backgroundColor: '#718093' }}
              onClick={() => setRutaPendienteEliminar(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ backgroundColor: '#d9534f' }}
              onClick={confirmarEliminarFavorito}
            >
              Quitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}