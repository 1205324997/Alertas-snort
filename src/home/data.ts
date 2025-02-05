const alertas = [
  { id: 1, prioridad: 'Alta' },
  { id: 2, prioridad: 'Media' },
  { id: 3, prioridad: 'Baja' },
  { id: 4, prioridad: 'Alta' },
  { id: 5, prioridad: 'Baja' },
];


export const estadisticasSimuladas = [
  { fecha: '2024-07-26', tipo: 'Usuarios activos', valor: 1 },
  { fecha: '2024-07-26', tipo: 'Nuevos registros', valor: 0 },
  { fecha: '2024-07-26', tipo: 'Promedio de uso', valor: '1 horas' },
  // ... más datos
];

// Arreglo con las alertas simuladas, manteniendo los mensajes como están
export const alertasSimuladas = [
  {
    timestamp: '2025-02-01T08:30:00.000Z',
    tipo: 'Tráfico FTP no seguro',
    src: '192.168.1.1',
    dest: '192.168.2.2',
    details: 'Intento de conexión FTP sin cifrado',
    prioridad: 'Alta'
  },
  {
    timestamp: '2025-02-01T09:00:00.000Z',
    tipo: 'Tráfico SSH',
    src: '192.168.3.3',
    dest: '192.168.4.4',
    details: 'Acceso SSH sospechoso detectado',
    prioridad: 'Alta'
  },
  {
    timestamp: '2025-02-01T09:30:00.000Z',
    tipo: 'Tráfico SQL',
    src: '192.168.5.5',
    dest: '192.168.6.6',
    details: 'Acceso a base de datos (MySQL) detectado en el puerto 3306',
    prioridad: 'Alta'
  },
  {
    timestamp: '2025-02-01T10:00:00.000Z',
    tipo: 'Solicitud de Ping',
    src: '192.168.7.7',
    dest: '192.168.8.8',
    details: 'Posible intento de escaneo de red',
    prioridad: 'Media'
  },
  {
    timestamp: '2025-02-01T10:30:00.000Z',
    tipo: 'Tráfico HTTP sospechoso',
    src: '192.168.9.9',
    dest: '192.168.10.10',
    details: 'Posible intento de explotación de vulnerabilidad en HTTP',
    prioridad: 'Alta'
  }
];