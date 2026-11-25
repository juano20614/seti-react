export const rutasArmenia = [
  {
    id: 'ruta-1',
    nombre: 'Ruta 1: Puerto Espejo - Centro - Regavit',
    descripcion: 'Conecta el sur con el centro y el norte de la ciudad.',
    estado: 'En servicio (4 buses activos)',
    color: '#00a8cc',
    puntos: [
      [4.5201, -75.7005],
      [4.5300, -75.6880],
      [4.5338, -75.6811],
      [4.5450, -75.6690],
      [4.5580, -75.6580],
    ],
    buses: [
      { id: 'BUS-101', puntoInicioIdx: 0, velocidad: 0.8 },
      { id: 'BUS-102', puntoInicioIdx: 2, velocidad: 0.5 },
      { id: 'BUS-103', puntoInicioIdx: 3, velocidad: 0.6 },
    ],
  },
  {
    id: 'ruta-2',
    nombre: 'Ruta 2: Terminal - Universidad del Quindío',
    descripcion: 'Recorrido directo hacia el campus universitario.',
    estado: 'En servicio (3 buses activos)',
    color: '#e63946',
    puntos: [
      [4.5262, -75.6883],
      [4.5320, -75.6800],
      [4.5420, -75.6720],
      [4.5540, -75.6605],
    ],
    buses: [
      { id: 'BUS-201', puntoInicioIdx: 0, velocidad: 0.7 },
      { id: 'BUS-202', puntoInicioIdx: 2, velocidad: 0.4 },
    ],
  },
];

export const rutasPredefinidas = [
  {
    id: 'pref-trabajo',
    nombre: '🏠 Casa ➔ 🏢 Trabajo (EPA / Centro)',
    descripcion: 'Recorrido desde Montenegro / Sur hacia el Centro de Armenia.',
    estado: 'Frecuencia: Cada 8 min',
    color: '#27ae60',
    puntos: [
      [4.5200, -75.7020],
      [4.5280, -75.6900],
      [4.5338, -75.6811],
    ],
    buses: [{ id: 'BUS-TRABAJO', puntoInicioIdx: 0, velocidad: 0.5 }],
  },
  {
    id: 'pref-uquindio',
    nombre: '🏠 Casa ➔ 🎓 Universidad del Quindío',
    descripcion: 'Ruta directa hacia la sede universitaria (Norte).',
    estado: 'Frecuencia: Cada 10 min',
    color: '#8e44ad',
    puntos: [
      [4.5338, -75.6811],
      [4.5450, -75.6690],
      [4.5540, -75.6605],
    ],
    buses: [{ id: 'BUS-UNI', puntoInicioIdx: 1, velocidad: 0.6 }],
  },
  {
    id: 'pref-unicentro',
    nombre: '🏠 Casa ➔ 🛍️ Unicentro / Bolivar',
    descripcion: 'Conexión con la zona comercial de la Av. Bolívar.',
    estado: 'Frecuencia: Cada 5 min',
    color: '#f39c12',
    puntos: [
      [4.5300, -75.6880],
      [4.5380, -75.6760],
      [4.5430, -75.6680],
    ],
    buses: [{ id: 'BUS-SHOP', puntoInicioIdx: 0, velocidad: 0.7 }],
  },
];

export function obtenerTodasLasRutas() {
  return [...rutasArmenia, ...rutasPredefinidas];
}