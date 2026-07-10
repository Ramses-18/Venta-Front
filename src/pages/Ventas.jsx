import { useState, useEffect } from 'react'
import { api } from '../api/api'

function formatMoney(value) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value)
}

function Ventas() {
  const [ventas, setVentas] = useState([])
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filtro, setFiltro] = useState('TODAS')
  const [form, setForm] = useState({
    clienteId: '', descripcion: '', montoTotal: '', montoPagado: '0', estadoPago: 'PAGADO', fechaVenta: '', notas: '',
  })

  const loadData = () => {
    setLoading(true)
    Promise.all([api.getVentas(), api.getClientes()])
      .then(([v, c]) => { setVentas(v); setClientes(c) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const ventasFiltradas = filtro === 'TODAS' ? ventas : ventas.filter((v) => v.estadoPago === filtro)

  const openCreate = () => {
    setEditing(null)
    setForm({
      clienteId: clientes.length > 0 ? clientes[0].id : '',
      descripcion: '', montoTotal: '', montoPagado: '0', estadoPago: 'PAGADO',
      fechaVenta: new Date().toISOString().slice(0, 16), notas: '',
    })
    setShowModal(true)
  }

  const openEdit = (v) => {
    setEditing(v.id)
    setForm({
      clienteId: v.cliente.id, descripcion: v.descripcion,
      montoTotal: v.montoTotal.toString(), montoPagado: v.montoPagado.toString(),
      estadoPago: v.estadoPago, fechaVenta: v.fechaVenta.slice(0, 16), notas: v.notas || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      ...form,
      montoTotal: parseFloat(form.montoTotal),
      montoPagado: parseFloat(form.montoPagado) || 0,
      cliente: { id: parseInt(form.clienteId) },
    }
    try {
      if (editing) await api.actualizarVenta(editing, data)
      else await api.crearVenta(data)
      setShowModal(false)
      loadData()
    } catch (err) { alert(err.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta venta?')) return
    try { await api.eliminarVenta(id); loadData() }
    catch { alert('Error al eliminar') }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...form, [name]: value }
    if (name === 'montoTotal' || name === 'montoPagado') {
      const total = parseFloat(updated.montoTotal) || 0
      const pagado = parseFloat(updated.montoPagado) || 0
      if (pagado >= total && total > 0) updated.estadoPago = 'PAGADO'
      else if (pagado > 0) updated.estadoPago = 'PARCIAL'
      else updated.estadoPago = 'ADEUDADO'
    }
    setForm(updated)
  }

  const badgeClass = (e) => `badge badge-${e.toLowerCase()}`

  return (
    <div>
      <div className="page-header">
        <h1>Ventas</h1>
      </div>

      <div className="filter-pills hide-scrollbar">
        {['TODAS', 'PAGADO', 'ADEUDADO', 'PARCIAL'].map((f) => (
          <button
            key={f}
            className={`filter-pill ${filtro === f ? 'active' : ''}`}
            onClick={() => setFiltro(f)}
          >
            {f === 'TODAS' ? 'Todas' : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card"><p>Cargando...</p></div>
      ) : ventasFiltradas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">💰</div>
            <p>Sin ventas {filtro !== 'TODAS' ? `con estado "${filtro}"` : ''}</p>
          </div>
        </div>
      ) : (
        <div className="card">
          {ventasFiltradas.map((v) => (
            <div key={v.id} className="venta-card">
              <div className="venta-card-top">
                <div>
                  <div className="venta-cliente">{v.cliente.nombre}</div>
                  <div className="venta-desc">{v.descripcion}</div>
                </div>
                <span className={badgeClass(v.estadoPago)}>{v.estadoPago}</span>
              </div>
              <div className="venta-montos">
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
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn btn-edit" onClick={() => openEdit(v)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(v.id)}>Borrar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="fab" onClick={openCreate}>+</button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2>{editing ? 'Editar Venta' : 'Nueva Venta'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Cliente *</label>
                <select name="clienteId" value={form.clienteId} onChange={handleChange} required>
                  <option value="">Seleccionar...</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Descripcion *</label>
                <input name="descripcion" value={form.descripcion} onChange={handleChange} required placeholder="Ej: 2 remeras XL" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Total *</label>
                  <input type="number" step="0.01" min="0" name="montoTotal" value={form.montoTotal} onChange={handleChange} required placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Pagado</label>
                  <input type="number" step="0.01" min="0" name="montoPagado" value={form.montoPagado} onChange={handleChange} placeholder="0.00" />
                </div>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select name="estadoPago" value={form.estadoPago} onChange={handleChange}>
                  <option value="PAGADO">Pagado</option>
                  <option value="ADEUDADO">Adeudado</option>
                  <option value="PARCIAL">Parcial</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fecha</label>
                <input type="datetime-local" name="fechaVenta" value={form.fechaVenta} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Notas</label>
                <textarea name="notas" value={form.notas} onChange={handleChange} placeholder="Notas..." rows={2} />
              </div>
              <div className="btn-group">
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Guardar' : 'Registrar Venta'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Ventas