import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/api'

function formatMoney(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}

function HistorialVentas() {
  const { clienteId } = useParams()
  const [cliente, setCliente] = useState(null)
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([api.getCliente(clienteId), api.getVentasByCliente(clienteId)])
      .then(([c, v]) => { setCliente(c); setVentas(v) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [clienteId])

  if (loading) return <div className="card"><p>Cargando...</p></div>

  const totalVentas = ventas.reduce((s, v) => s + v.montoTotal, 0)
  const totalPagado = ventas.reduce((s, v) => s + v.montoPagado, 0)
  const saldo = totalVentas - totalPagado

  return (
    <div>
      <Link to="/clientes" className="back-link">← Clientes</Link>
      <div className="page-header">
        <h1>{cliente?.nombre || 'Cliente'}</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Compras</div>
          <div className="stat-value">{ventas.length}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Facturado</div>
          <div className="stat-value">{formatMoney(totalVentas)}</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Pagado</div>
          <div className="stat-value">{formatMoney(totalPagado)}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Saldo</div>
          <div className="stat-value">{formatMoney(saldo)}</div>
        </div>
      </div>

      {ventas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">📋</div>
            <p>Sin ventas registradas</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <h2>Historial</h2>
          {ventas.map((v) => (
            <div key={v.id} className="venta-card">
              <div className="venta-card-top">
                <div className="venta-desc" style={{ marginBottom: 0 }}>{v.descripcion}</div>
                <span className={`badge badge-${v.estadoPago.toLowerCase()}`}>{v.estadoPago}</span>
              </div>
              <div className="venta-montos" style={{ marginTop: 8 }}>
                <div className="venta-monto-item">
                  <span className="venta-monto-label">Total</span>
                  <span className="venta-monto-value dark">{formatMoney(v.montoTotal)}</span>
                </div>
                <div className="venta-monto-item">
                  <span className="venta-monto-label">Pagado</span>
                  <span className="venta-monto-value green">{formatMoney(v.montoPagado)}</span>
                </div>
                <div className="venta-monto-item">
                  <span className="venta-monto-label">Saldo</span>
                  <span className={`venta-monto-value ${v.montoTotal - v.montoPagado > 0 ? 'red' : 'green'}`}>
                    {formatMoney(v.montoTotal - v.montoPagado)}
                  </span>
                </div>
              </div>
              <div className="venta-card-bottom">
                <span className="venta-fecha">{new Date(v.fechaVenta).toLocaleDateString('es-AR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {cliente && (
        <div className="card">
          <h2>Datos</h2>
          <div className="info-row">
            <span className="info-label">Telefono</span>
            <span className="info-value">{cliente.telefono || '-'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{cliente.email || '-'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Direccion</span>
            <span className="info-value">{cliente.direccion || '-'}</span>
          </div>
          {cliente.notas && (
            <div className="info-row">
              <span className="info-label">Notas</span>
              <span className="info-value">{cliente.notas}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default HistorialVentas