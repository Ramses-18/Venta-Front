import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/api'

function formatMoney(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}

function Dashboard() {
  const [resumen, setResumen] = useState(null)
  const [deudas, setDeudas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getResumen(), api.getVentasConDeuda()])
      .then(([res, deb]) => { setResumen(res); setDeudas(deb) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="card"><p>Cargando...</p></div>
  if (!resumen) return <div className="card"><p>Error al cargar datos</p></div>

  const totalVentas = resumen.cantidadPagado + resumen.cantidadAdeudado + resumen.cantidadParcial

  return (
    <div>
      <div className="page-header">
        <h1>Lulu</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Vendido</div>
          <div className="stat-value">{formatMoney(resumen.totalVentas)}</div>
          <div className="stat-sub">{totalVentas} ventas</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Cobrado</div>
          <div className="stat-value">{formatMoney(resumen.totalPagado)}</div>
          <div className="stat-sub">{resumen.cantidadPagado} pagadas</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Adeudado</div>
          <div className="stat-value">{formatMoney(resumen.totalAdeudado)}</div>
          <div className="stat-sub">{resumen.cantidadAdeudado} + {resumen.cantidadParcial} parcial</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Parciales</div>
          <div className="stat-value">{resumen.cantidadParcial}</div>
          <div className="stat-sub">con abono</div>
        </div>
      </div>

      <div className="card">
        <h2>Deudas Pendientes</h2>
        {deudas.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🎉</div>
            <p>Sin deudas pendientes</p>
          </div>
        ) : (
          deudas.map((v) => {
            const saldo = v.montoTotal - v.montoPagado
            return (
              <Link to={`/historial/${v.cliente.id}`} key={v.id} style={{ textDecoration: 'none' }}>
                <div className="deuda-item">
                  <div className="deuda-info">
                    <div className="deuda-cliente">{v.cliente.nombre}</div>
                    <div className="deuda-desc">{v.descripcion}</div>
                  </div>
                  <div className="deuda-right">
                    <div className="deuda-monto">{formatMoney(saldo)}</div>
                    <div className="deuda-fecha">{new Date(v.fechaVenta).toLocaleDateString('es-AR')}</div>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Dashboard