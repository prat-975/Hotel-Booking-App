import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getAvailableRooms, getHotel } from '../api/api';
import { useAuth } from '../context/AuthContext';

function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function dayAfter(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

export default function HotelDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || tomorrow());
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || dayAfter(tomorrow()));
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const loadHotel = async () => {
      try {
        const { data } = await getHotel(id);
        setHotel(data);
      } catch {
        setError('Hotel not found.');
      } finally {
        setLoading(false);
      }
    };
    loadHotel();
  }, [id]);

  const searchAvailability = async () => {
    setSearching(true);
    setError('');
    try {
      const { data } = await getAvailableRooms(id, checkIn, checkOut);
      setRooms(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check availability.');
      setRooms([]);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (hotel) {
      searchAvailability();
    }
  }, [hotel]);

  const handleBook = (roomId) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: {
            pathname: `/book/${roomId}`,
            search: `?checkIn=${checkIn}&checkOut=${checkOut}`,
          },
        },
      });
      return;
    }
    navigate(`/book/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  if (loading) return <p className="status-message container">Loading hotel...</p>;
  if (!hotel) return <p className="error-message container">{error || 'Hotel not found.'}</p>;

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="back-link">← Back to home</Link>

        <div className="hotel-detail-header">
          <img src={hotel.imageUrl} alt={hotel.name} className="hotel-detail-image" />
          <div className="hotel-detail-info">
            <h1>{hotel.name}</h1>
            <p className="hotel-location">{hotel.address}, {hotel.city}</p>
            <p className="rating">★ {hotel.rating.toFixed(1)} / 5.0</p>
            <p>{hotel.description}</p>
            <div className="amenities">
              {hotel.amenities?.map((a) => (
                <span key={a} className="amenity-tag">{a}</span>
              ))}
            </div>
          </div>
        </div>

        <section className="availability-section">
          <h2>Check Availability</h2>
          <div className="date-picker-row">
            <label>
              Check-in
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  if (e.target.value >= checkOut) {
                    setCheckOut(dayAfter(e.target.value));
                  }
                }}
              />
            </label>
            <label>
              Check-out
              <input
                type="date"
                value={checkOut}
                min={dayAfter(checkIn)}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </label>
            <button onClick={searchAvailability} disabled={searching}>
              {searching ? 'Searching...' : 'Update'}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="room-list">
            {rooms.length === 0 && !searching && (
              <p className="status-message">No rooms available for selected dates.</p>
            )}
            {rooms.map(({ room, availableCount }) => (
              <div key={room.id} className="room-card">
                <img src={room.imageUrl} alt={room.type} />
                <div className="room-info">
                  <h3>{room.type}</h3>
                  <p>{room.description}</p>
                  <p className="room-meta">Up to {room.capacity} guests · {availableCount} left</p>
                  <p className="room-price">₹{room.pricePerNight.toLocaleString('en-IN')} / night</p>
                </div>
                <button className="btn-primary" onClick={() => handleBook(room.id)}>
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
