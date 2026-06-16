import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { Search, MapPin, Calendar, ArrowRight, Info, AlertTriangle } from 'lucide-react';

const Events = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await API.get('/events');
      setAllEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    
    if (!search.trim()) {
      setFilteredEvents(allEvents);
      return;
    }

    const query = search.toLowerCase();
    const filtered = allEvents.filter(event => 
      (event.title && event.title.toLowerCase().includes(query)) ||
      (event.location && event.location.toLowerCase().includes(query)) ||
      (event.description && event.description.toLowerCase().includes(query))
    );
    setFilteredEvents(filtered);
  }, [search, allEvents]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearch('');
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="events-header">
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.25rem' }}>Find Your Next Event</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Register, secure tickets, and network with professionals</p>
        </div>
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="input-control search-input"
            placeholder="Search by title, location, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {search.trim() && (
        <div className="search-results-info">
          <Info size={16} />
          <span>
            Found {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} matching "{search}"
          </span>
          <button onClick={clearSearch} className="clear-search-btn">
            Clear
          </button>
        </div>
      )}

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : currentItems.length > 0 ? (
        <>
          <div className="events-grid">
            {currentItems.map((event) => (
              <div key={event.id} className="event-card">
                <div className="card-header-row">
                  <span className="date-pill">{formatDate(event.date)}</span>
                  {event.is_registered && (
                    <span className="badge-registered">Registered</span>
                  )}
                </div>
                
                <h3 className="event-card-title">{event.title}</h3>
                <p className="event-card-desc">{event.description}</p>
                
                <div className="event-card-footer">
                  <div className="footer-meta-item">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                  <div>
                    <span>{event.registered_count} registered</span>
                  </div>
                </div>

                <Link to={`/events/${event.id}`} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Details
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="page-btn"
                title="Previous Page"
              >
                &laquo;
              </button>
              
              {pageNumbers.map(number => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`page-btn ${currentPage === number ? 'active' : ''}`}
                >
                  {number}
                </button>
              ))}

              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="page-btn"
                title="Next Page"
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <AlertTriangle size={48} className="empty-state-icon" style={{ strokeWidth: '1.5' }} />
          <h3>No events match your search</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            We couldn't find any events matching "{search}". Try searching for other keywords.
          </p>
          <button onClick={clearSearch} className="btn btn-primary">
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;
