
import { useEffect, useState } from "react";
import api from "./api";
import "./Booking.css";

const ROWS = ["A", "B", "C", "D", "E", "F"];
const SEATS_PER_ROW = 8;
const TICKET_PRICE = 200;

function Booking({ movie, onBack, onConfirm }) {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadShowtimes = async () => {
      try {
        const response = await api.get(`/movies/${movie._id}`);
        const dates = response.data.showtimes || [];
        const availableDates = dates.filter(
          (date) => new Date(date).getTime() > Date.now()
        );

        setShowtimes(availableDates);

        if (availableDates.length > 0) {
          setSelectedShowtime(availableDates[0]);
        }
      } catch (err) {
        console.error("Could not load showtimes:", err);
        setError("Unable to load showtimes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadShowtimes();
  }, [movie._id]);

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((current) =>
      current.includes(seat)
        ? current.filter((item) => item !== seat)
        : [...current, seat]
    );
  };

  const handleConfirm = () => {
    if (!selectedShowtime) {
      setError("Please select a showtime.");
      return;
    }

    if (selectedSeats.length === 0) {
      setError("Please select at least one seat.");
      return;
    }

    setError("");

    onConfirm({
      movie,
      showtime: selectedShowtime,
      seats: selectedSeats,
      totalAmount: selectedSeats.length * TICKET_PRICE,
    });
  };

  if (loading) {
    return <p className="status-message">Loading showtimes...</p>;
  }

  return (
    <main className="booking-page">
      <button className="back-button" onClick={onBack}>
        ← Back to movies
      </button>

      <section className="booking-header">
        <p className="eyebrow">BOOK YOUR EXPERIENCE</p>
        <h1>{movie.title}</h1>
        <p>
          {movie.duration ? `${movie.duration} minutes` : "Feature film"}
          {" · "}
          ₹{TICKET_PRICE} per seat
        </p>
      </section>

      {error && <p className="error-message">{error}</p>}

      <section className="showtime-section">
        <h2>Choose a showtime</h2>

        {showtimes.length === 0 ? (
          <p className="status-message">
            No future showtimes are available for this movie.
          </p>
        ) : (
          <div className="showtime-list">
            {showtimes.map((time) => (
              <button
                key={time}
                className={`showtime-button ${
                  selectedShowtime === time ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedShowtime(time);
                  setSelectedSeats([]);
                  setBookedSeats([]);
                  setError("");
                }}
              >
                {new Date(time).toLocaleString([], {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="seats-section">
        <h2>Select your seats</h2>
        <div className="screen">SCREEN</div>

        <div className="seat-grid">
          {ROWS.map((row) => (
            <div className="seat-row" key={row}>
              <span className="row-label">{row}</span>

              {Array.from({ length: SEATS_PER_ROW }, (_, index) => {
                const seat = `${row}${index + 1}`;
                const isSelected = selectedSeats.includes(seat);
                const isBooked = bookedSeats.includes(seat);

                return (
                  <button
                    key={seat}
                    className={`seat ${isSelected ? "selected" : ""} ${
                      isBooked ? "booked" : ""
                    }`}
                    disabled={isBooked || showtimes.length === 0}
                    onClick={() => toggleSeat(seat)}
                    aria-label={`Seat ${seat}`}
                    title={`Seat ${seat}`}
                  >
                    {index + 1}
                  </button>
                );
              })}

              <span className="row-label">{row}</span>
            </div>
          ))}
        </div>

        <div className="seat-legend">
          <span><i className="legend-seat available" /> Available</span>
          <span><i className="legend-seat chosen" /> Selected</span>
          <span><i className="legend-seat unavailable" /> Booked</span>
        </div>
      </section>

      <section className="booking-summary">
        <div>
          <p className="summary-label">Selected seats</p>
          <strong>
            {selectedSeats.length ? selectedSeats.join(", ") : "None"}
          </strong>
        </div>

        <div>
          <p className="summary-label">Total amount</p>
          <strong>₹{selectedSeats.length * TICKET_PRICE}</strong>
        </div>

        <button
          className="confirm-booking"
          onClick={handleConfirm}
          disabled={showtimes.length === 0}
        >
          Continue to booking
        </button>
      </section>
    </main>
  );
}

export default Booking;
