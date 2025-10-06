import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, createClient } from '../features/clients/clientsSlice';
import './Clients.css';

const Clients = () => {
  const dispatch = useDispatch();
  const { clients, loading, error, pagination } = useSelector((state) => state.clients);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Lead'
  });

  useEffect(() => {
    dispatch(fetchClients({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleAddClient = (e) => {
    e.preventDefault();
    dispatch(createClient(newClient)).then(() => {
      setShowAddForm(false);
      setNewClient({ name: '', company: '', email: '', phone: '', status: 'Lead' });
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Lead': return 'status-lead';
      case 'Inactive': return 'status-inactive';
      default: return 'status-lead';
    }
  };

  return (
    <div className="clients">
      <div className="clients-header">
        <h1>Clients</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add Client
        </button>
      </div>

      <div className="clients-search">
        <input
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showAddForm && (
        <div className="add-client-form">
          <h3>Add New Client</h3>
          <form onSubmit={handleAddClient}>
            <input
              type="text"
              placeholder="Name"
              value={newClient.name}
              onChange={(e) => setNewClient({...newClient, name: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Company"
              value={newClient.company}
              onChange={(e) => setNewClient({...newClient, company: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newClient.email}
              onChange={(e) => setNewClient({...newClient, email: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Phone"
              value={newClient.phone}
              onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
            />
            <select
              value={newClient.status}
              onChange={(e) => setNewClient({...newClient, status: e.target.value})}
            >
              <option value="Lead">Lead</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="form-actions">
              <button type="submit">Add Client</button>
              <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading clients...</div>
      ) : (
        <div className="clients-grid">
          {clients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-header">
                <div className="client-avatar">
                  {client.name.charAt(0)}
                </div>
                <div className="client-info">
                  <h3>{client.name}</h3>
                  <p>{client.company}</p>
                </div>
              </div>
              <div className="client-details">
                <p>📧 {client.email}</p>
                <p>📞 {client.phone || 'N/A'}</p>
                <p>💼 Projects: {client.projects}</p>
                <p>💰 Revenue: ${client.revenue}</p>
              </div>
              <div className={`client-status ${getStatusColor(client.status)}`}>
                {client.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;