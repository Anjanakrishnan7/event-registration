import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { Calendar, MapPin, Ticket, ArrowRight } from 'lucide-react';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await API.get('/my-registrations');
      setRegistrations(response.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.25rem' }}>My Registrations</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here are the events you've signed up to attend</p>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : registrations.length > 0 ? (
        <div className="events-grid">
          {registrations.map((reg) => {
            const event = reg.event;
            return (
              <div key={reg.id} className="event-card">
                <div className="card-header-row">
                  <span className="date-pill">{formatDate(event.date)}</span>
                  <span className="badge-registered">Confirmed</span>
                </div>
                
                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-desc">{event.description}</p>
                
                <div className="event-card-footer" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <div className="footer-meta-item">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Registered on: {formatDate(reg.registered_at)}
                  </div>
                </div>

                <Link to={`/events/${event.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Details
                  <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Ticket size={48} className="empty-state-icon" style={{ strokeWidth: '1.5' }} />
          <h3>No registrations found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            You haven't registered for any events yet.
          </p>
          <Link to="/" className="btn btn-primary">
            Browse Events
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
