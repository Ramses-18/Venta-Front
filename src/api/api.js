const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getClientes: () => request('/clientes'),
  getCliente: (id) => request(`/clientes/${id}`),
  crearCliente: (data) => request('/clientes', { method: 'POST', body: JSON.stringify(data) }),
  actualizarCliente: (id, data) => request(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminarCliente: (id) => request(`/clientes/${id}`, { method: 'DELETE' }),

  getVentas: () => request('/ventas'),
  getVenta: (id) => request(`/ventas/${id}`),
  getVentasByCliente: (clienteId) => request(`/ventas/cliente/${clienteId}`),
  getVentasConDeuda: () => request('/ventas/deudas'),
  crearVenta: (data) => request('/ventas', { method: 'POST', body: JSON.stringify(data) }),
  actualizarVenta: (id, data) => request(`/ventas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  eliminarVenta: (id) => request(`/ventas/${id}`, { method: 'DELETE' }),

  getResumen: () => request('/ventas/dashboard/resumen'),
};