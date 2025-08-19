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
      setError('Failed to load contacts');
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
      setError('Failed to save contact');
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
      setError('Failed to delete contact');
      console.error('Error deleting contact:', err);
    }
  };

  if (loading) {
    return (
      <div className="contacts">
        <div className="section-header">
          <h2>Contacts Management</h2>
        </div>
        <div className="loading">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="contacts">
      <div className="section-header">
        <h2>Contacts Management</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="add-btn"
        >
          Add Contact
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3>{editingContact ? 'Edit Contact' : 'Add New Contact'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Company:</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Lead">Lead</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Prospect">Prospect</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  {editingContact ? 'Update' : 'Save'}
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
                  Cancel
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
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No contacts found</td>
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
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(contact.id)}
                      className="delete-btn"
                    >
                      Delete
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