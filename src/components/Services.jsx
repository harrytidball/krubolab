import { useState, useEffect } from 'react';
import { dashboardService } from '../services/apiService';

function Services() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    category: ''
  });

  // Fetch services on component mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getServices();
      setServices(data);
    } catch (err) {
      setError('Error al cargar servicios');
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        // Update existing service
        const updatedService = {
          ...editingService,
          ...formData,
          price: parseFloat(formData.price)
        };
        await dashboardService.saveService(updatedService);
        setServices(services.map(s => 
          s.id === editingService.id ? updatedService : s
        ));
        setEditingService(null);
      } else {
        // Create new service
        const newService = {
          id: Date.now(),
          ...formData,
          price: parseFloat(formData.price)
        };
        await dashboardService.saveService(newService);
        setServices([...services, newService]);
      }
      setFormData({ name: '', price: '', duration: '', category: '' });
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Error al guardar servicio');
      console.error('Error saving service:', err);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration,
      category: service.category
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await dashboardService.deleteService(id);
      setServices(services.filter(s => s.id !== id));
      setError('');
    } catch (err) {
      setError('Error al eliminar servicio');
      console.error('Error deleting service:', err);
    }
  };

  if (loading) {
    return (
      <div className="services">
        <div className="section-header">
          <h2>Gestión de Servicios</h2>
        </div>
        <div className="loading">Cargando servicios...</div>
      </div>
    );
  }

  return (
    <div className="services">
      <div className="section-header">
        <h2>Gestión de Servicios</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="add-btn"
        >
          Agregar Servicio
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingService ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h3>
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
                <label>Precio:</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duración:</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Categoría:</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingService ? 'Actualizar' : 'Guardar'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingService(null);
                    setFormData({ name: '', price: '', duration: '', category: '' });
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
              <th>Precio</th>
              <th>Duración</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No se encontraron servicios</td>
              </tr>
            ) : (
              services.map(service => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.name}</td>
                  <td>${service.price}</td>
                  <td>{service.duration}</td>
                  <td>{service.category}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(service)}
                      className="edit-btn"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(service.id)}
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

export default Services; 