import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, CheckCircle, AlertCircle, ArrowLeft, Users } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const response = await API.get(`/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
      setMessage({ type: 'error', text: 'Failed to load event details.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleRegister = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmRegister = async () => {
    setShowConfirmModal(false);
    setRegistering(true);
    setMessage(null);
    try {
      await API.post(`/events/${id}/register`);
      setMessage({ type: 'success', text: 'Successfully registered for this event!' });
      fetchEventDetails();
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Registration failed.';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && !event) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="detail-container">
        <div className="empty-state">
          <AlertCircle size={48} className="empty-state-icon" style={{ color: 'var(--error)' }} />
          <h3>Event Not Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            The event you are looking for does not exist or has been removed.
          </p>
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <Link to="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back to Events
      </Link>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="detail-card">
        <h1 className="detail-title">{event.title}</h1>
        
        <div className="detail-meta-row">
          <div className="detail-meta-item">
            <Calendar size={16} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="detail-meta-item">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className="detail-meta-item">
            <Users size={16} />
            <span>{event.registered_count} registered</span>
          </div>
        </div>

        <p className="detail-description">{event.description}</p>

        {event.is_registered ? (
          <button className="btn btn-secondary" style={{ width: '100%', cursor: 'default', padding: '0.9rem' }} disabled>
            <CheckCircle size={18} style={{ color: 'var(--success)' }} />
            Already Registered
          </button>
        ) : (
          <button 
            onClick={handleRegister} 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }} 
            disabled={registering}
          >
            {registering ? 'Registering...' : user ? 'Register for this Event' : 'Log In to Register'}
          </button>
        )}
      </div>

      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Register for Event</h3>
            <p className="modal-body">Are you sure you want to register for this event?</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleConfirmRegister}
                disabled={registering}
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
