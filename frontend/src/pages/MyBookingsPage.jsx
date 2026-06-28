import { useEffect, useState } from 'react';
import { cancelBooking, getBookings } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data } = await getBookings();
        setBookings(data);
      } catch {
        setError('Unable to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    }
  };

  return (
    <div className="page container">
      <h1>My Bookings</h1>
      <p className="subtitle">Reservations for {user?.email}</p>

      {loading && <p className="status-message">Loading bookings...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p className="status-message">You have no bookings yet. Browse hotels to get started!</p>
      )}

      <div className="bookings-list">
        {bookings.map((booking) => (
          <div key={booking.id} className={`booking-card ${booking.status === 'CANCELLED' ? 'cancelled' : ''}`}>
            <div className="booking-card-header">
              <h3>{booking.hotelName}</h3>
              <span className={`status-badge ${booking.status.toLowerCase()}`}>
                {booking.status}
              </span>
            </div>
            <div className="booking-card-body">
              <p><span>Room</span>{booking.roomType}</p>
              <p><span>Check-in</span>{booking.checkInDate}</p>
              <p><span>Check-out</span>{booking.checkOutDate}</p>
              <p><span>Guests</span>{booking.guests}</p>
              <p><span>Total</span>₹{booking.totalPrice.toLocaleString('en-IN')}</p>
              <p><span>Booking ID</span>{booking.id}</p>
            </div>
            {booking.status === 'CONFIRMED' && (
              <button className="btn-cancel" onClick={() => handleCancel(booking.id)}>
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
