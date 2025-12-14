import { useState, useEffect } from 'react';
import { dashboardService } from '../services/apiService';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: ''
  });

  // Fetch contacts on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getContacts();
      setContacts(data);
    } catch (err) {
      setError('Error al cargar contactos');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingContact) {
        // Update existing contact
        const updatedContact = {
          ...editingContact,
          ...formData
        };
        await dashboardService.saveContact(updatedContact);
        setContacts(contacts.map(c => 
          c.id === editingContact.id ? updatedContact : c
        ));
        setEditingContact(null);
      } else {
        // Create new contact
        const newContact = {
          id: Date.now(),
          ...formData
        };
        await dashboardService.saveContact(newContact);
        setContacts([...contacts, newContact]);
      }
      setFormData({ name: '', email: '', phone: '', company: '', status: '' });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Error al guardar contacto');
      console.error('Error saving contact:', err);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      status: contact.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await dashboardService.deleteContact(id);
      setContacts(contacts.filter(c => c.id !== id));
      setError('');
    } catch (err) {
      setError('Error al eliminar contacto');
      console.error('Error deleting contact:', err);
    }
  };

  if (loading) {
    return (
      <div className="contacts">
        <div className="section-header">
          <h2>Gestión de Contactos</h2>
        </div>
        <div className="loading">Cargando contactos...</div>
      </div>
    );
  }

  return (
    <div className="contacts">
      <div className="section-header">
        <h2>Gestión de Contactos</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="add-btn"
        >
          Agregar Contacto
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingContact ? 'Editar Contacto' : 'Agregar Nuevo Contacto'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Correo Electrónico:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Empresa:</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Estado:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="">Seleccionar Estado</option>
                  <option value="Active">Activo</option>
                  <option value="Lead">Lead</option>
                  <option value="Inactive">Inactivo</option>
                  <option value="Prospect">Prospecto</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingContact ? 'Actualizar' : 'Guardar'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingContact(null);
                    setFormData({ name: '', email: '', phone: '', company: '', status: '' });
                    setError('');
                  }}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No se encontraron contactos</td>
              </tr>
            ) : (
              contacts.map(contact => (
                <tr key={contact.id}>
                  <td>{contact.id}</td>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.company}</td>
                  <td>
                    <span className={`status-badge status-${contact.status.toLowerCase()}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleEdit(contact)}
                      className="edit-btn"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(contact.id)}
                      className="delete-btn"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Contacts; 