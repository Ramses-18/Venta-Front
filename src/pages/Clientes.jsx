import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/api'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '', direccion: '', notas: '' })

  const loadClientes = () => {
    setLoading(true)
    api.getClientes()
      .then(setClientes)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadClientes() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ nombre: '', telefono: '', email: '', direccion: '', notas: '' })
    setShowModal(true)
  }

  const openEdit = (c) => {
    setEditing(c.id)
    setForm({ nombre: c.nombre, telefono: c.telefono || '', email: c.email || '', direccion: c.direccion || '', notas: c.notas || '' })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await api.actualizarCliente(editing, form)
      } else {
        await api.crearCliente(form)
      }
      setShowModal(false)
      loadClientes()
    } catch (err) { alert(err.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este cliente?')) return
    try {
      await api.eliminarCliente(id)
      loadClientes()
    } catch { alert('No se puede eliminar: tiene ventas asociadas') }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div>
      <div className="page-header">
        <h1>Clientes</h1>
      </div>

      {loading ? (
        <div className="card"><p>Cargando...</p></div>
      ) : clientes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">👥</div>
            <p>No hay clientes todavia</p>
          </div>
        </div>
      ) : (
        <div className="card">
          {clientes.map((c) => (
            <div key={c.id} className="cliente-row">
              <Link to={`/historial/${c.id}`} className="cliente-info">
                <div className="cliente-nombre">{c.nombre}</div>
                <div className="cliente-detalle">{c.telefono || c.email || 'Sin contacto'}</div>
              </Link>
              <div className="cliente-actions">
                <button className="btn btn-edit" onClick={() => openEdit(c)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Borrar</button>
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
            <h2>{editing ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre *</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Nombre del cliente" />
              </div>
              <div className="form-group">
                <label>Telefono</label>
                <input name="telefono" type="tel" value={form.telefono} onChange={handleChange} placeholder="+54 11 1234-5678" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@ejemplo.com" />
              </div>
              <div className="form-group">
                <label>Direccion</label>
                <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Direccion" />
              </div>
              <div className="form-group">
                <label>Notas</label>
                <textarea name="notas" value={form.notas} onChange={handleChange} placeholder="Notas opcionales..." rows={2} />
              </div>
              <div className="btn-group">
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Guardar' : 'Crear Cliente'}
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

export default Clientes