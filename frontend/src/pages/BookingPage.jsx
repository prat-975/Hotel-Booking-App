import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { createBooking, getRoom } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function BookingPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    guestName: user?.name || '',
    guestPhone: user?.phone || '',
    guests: 1,
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        guestName: user.name || prev.guestName,
        guestPhone: user.phone || prev.guestPhone,
      }));
    }
  }, [user]);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const { data } = await getRoom(roomId);
        setRoom(data);
      } catch {
        setError('Room not found.');
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [roomId]);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))
    : 0;

  const totalPrice = room ? nights * room.pricePerNight : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { data } = await createBooking({
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guestName: form.guestName,
        guestPhone: form.guestPhone,
        guests: form.guests,
      });
      setSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="status-message container">Loading...</p>;
  if (!room) return <p className="error-message container">{error || 'Room not found.'}</p>;

  if (success) {
    return (
      <div className="page container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Booking Confirmed!</h2>
          <p>Your reservation at <strong>{success.hotelName}</strong> is confirmed.</p>
          <div className="booking-summary">
            <p><span>Booking ID</span><strong>{success.id}</strong></p>
            <p><span>Room</span><strong>{success.roomType}</strong></p>
            <p><span>Check-in</span><strong>{success.checkInDate}</strong></p>
            <p><span>Check-out</span><strong>{success.checkOutDate}</strong></p>
            <p><span>Total</span><strong>₹{success.totalPrice.toLocaleString('en-IN')}</strong></p>
          </div>
          <div className="success-actions">
            <button onClick={() => navigate('/bookings')}>View My Bookings</button>
            <Link to="/" className="btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <Link to={`/hotels/${room.hotelId}?checkIn=${checkIn}&checkOut=${checkOut}`} className="back-link">
        ← Back to hotel
      </Link>

      <div className="booking-layout">
        <div className="booking-form-section">
          <h1>Complete Your Booking</h1>
          <p className="subtitle">{room.type}</p>

          <form onSubmit={handleSubmit} className="booking-form">
            <label>
              Full Name
              <input
                name="guestName"
                value={form.guestName}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-disabled"
              />
            </label>
            <label>
              Phone
              <input
                type="tel"
                name="guestPhone"
                value={form.guestPhone}
                onChange={handleChange}
                required
                placeholder="+91 9876543210"
              />
            </label>
            <label>
              Guests
              <select name="guests" value={form.guests} onChange={handleChange}>
                {Array.from({ length: room.capacity }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </label>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </form>
        </div>

        <div className="booking-summary-card">
          <h3>Booking Summary</h3>
          <img src={room.imageUrl} alt={room.type} />
          <div className="summary-details">
            <p><span>Check-in</span><strong>{checkIn}</strong></p>
            <p><span>Check-out</span><strong>{checkOut}</strong></p>
            <p><span>Nights</span><strong>{nights}</strong></p>
            <p><span>Price per night</span><strong>₹{room.pricePerNight.toLocaleString('en-IN')}</strong></p>
            <hr />
            <p className="total-row">
              <span>Total</span>
              <strong>₹{totalPrice.toLocaleString('en-IN')}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
