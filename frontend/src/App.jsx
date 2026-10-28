import { useEffect, useState } from "react";
import api from "./api";
import Auth from "./Auth";
import Booking from "./Booking";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("imoviesUser")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get("/movies");
        setMovies(response.data);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError("Unable to load movies. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleLogin = (data) => {
    if (!data.token) {
      setError("Login response did not include a token.");
      return;
    }

    localStorage.setItem("imoviesToken", data.token);

    const loggedInUser = data.user || {
      name: data.name,
      email: data.email,
      role: data.role,
    };

    localStorage.setItem("imoviesUser", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setShowAuth(false);
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("imoviesToken");
    localStorage.removeItem("imoviesUser");
    setUser(null);
    setSelectedMovie(null);
    setConfirmation(null);
    setError("");
  };

  const handleConfirmBooking = async (details) => {
    if (!localStorage.getItem("imoviesToken")) {
      setSelectedMovie(null);
      setShowAuth(true);
      setError("Please sign in to book tickets.");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");

      const response = await api.post("/bookings", {
        movieId: details.movie._id,
        showtime: details.showtime,
        seats: details.seats,
      });

      const data = response.data;
      const savedBooking = data.booking || data.data || data;

      setConfirmation({
        bookingId: savedBooking._id || savedBooking.id || "",
        movieTitle: details.movie.title,
        showtime: details.showtime,
        seats: details.seats,
        totalAmount:
          savedBooking.totalAmount ?? details.seats.length * 200,
        status: savedBooking.status || "confirmed",
      });

      setSelectedMovie(null);
    } catch (err) {
      console.error("Booking failed:", err);
      setError(
        err.response?.data?.message ||
          "Booking failed. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (showAuth) {
    return <Auth onLogin={handleLogin} />;
  }

  if (confirmation) {
    return (
      <>
        <main className="booking-page">
          <section className="booking-summary">
            <div>
              <p className="eyebrow">IMOVIES</p>
              <h1>Booking confirmed!</h1>
              <p>Your movie tickets have been booked successfully.</p>
            </div>
          </section>

          <section className="booking-summary">
            <div>
              <p className="summary-label">Movie</p>
              <h2>{confirmation.movieTitle}</h2>
            </div>

            <div>
              <p className="summary-label">Showtime</p>
              <strong>
                {new Date(confirmation.showtime).toLocaleString([], {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </strong>
            </div>

            <div>
              <p className="summary-label">Seats</p>
              <strong>{confirmation.seats.join(", ")}</strong>
            </div>

            <div>
              <p className="summary-label">Total payable</p>
              <strong>₹{confirmation.totalAmount}</strong>
            </div>

            <div>
              <p className="summary-label">Booking status</p>
              <strong>{confirmation.status}</strong>
            </div>

            {confirmation.bookingId && (
              <div>
                <p className="summary-label">Booking ID</p>
                <strong>{confirmation.bookingId}</strong>
              </div>
            )}
          </section>

          <button
            className="confirm-booking"
            onClick={() => {
              setConfirmation(null);
              setError("");
            }}
          >
            Back to Movies
          </button>
        </main>

        <footer className="site-footer" id="about">
          <a className="logo" href="#home">
            I<span>MOVIES</span>
          </a>
          <p>Your seat. Your story. Your cinema.</p>
          <p className="developer-credit">
            Designed &amp; Developed by{" "}
            <span>Ali Akbar Khan</span>
          </p>
          <p>© {new Date().getFullYear()} IMovies. All rights reserved.</p>
        </footer>
      </>
    );
  }

  if (selectedMovie) {
    return (
      <>
        <main>
          {error && <p className="error-message">{error}</p>}

          {bookingLoading && (
            <p className="status-message">
              Confirming your booking...
            </p>
          )}

          <Booking
            movie={selectedMovie}
            onBack={() => {
              setSelectedMovie(null);
              setError("");
            }}
            onConfirm={handleConfirmBooking}
          />
        </main>

        <footer className="site-footer" id="about">
          <a className="logo" href="#home">
            I<span>MOVIES</span>
          </a>
          <p>Your seat. Your story. Your cinema.</p>
          <p className="developer-credit">
            Designed &amp; Developed by{" "}
            <span>Ali Akbar Khan</span>
          </p>
          <p>© {new Date().getFullYear()} IMovies. All rights reserved.</p>
        </footer>
      </>
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#home">
          I<span>MOVIES</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#movies">Movies</a>
          <a href="#about">About</a>
        </nav>

        {user ? (
          <div className="user-actions">
            <span className="welcome-user">
              Hi, {user.name || user.email}
            </span>
            <button className="login-button" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="login-button"
            onClick={() => setShowAuth(true)}
          >
            Sign In
          </button>
        )}
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">
              YOUR NEXT MOVIE NIGHT STARTS HERE
            </p>
            <h1>
              Every story.
              <br />
              <span>One destination.</span>
            </h1>
            <p className="hero-description">
              Discover incredible movies, explore showtimes, and get ready
              for the big screen.
            </p>
            <a className="primary-button" href="#movies">
              Explore Movies →
            </a>
          </div>
          <div className="hero-decoration">IM</div>
        </section>

        <section className="movies-section" id="movies">
          <div className="section-heading">
            <div>
              <p className="eyebrow">NOW SHOWING</p>
              <h2>Find your next favourite</h2>
            </div>
            <span className="movie-count">
              {movies.length} {movies.length === 1 ? "movie" : "movies"}
            </span>
          </div>

          {error && <p className="error-message">{error}</p>}

          {loading && (
            <p className="status-message">Loading movies...</p>
          )}

          {!loading && !error && movies.length === 0 && (
            <p className="status-message">
              No movies are available right now.
            </p>
          )}

          {!loading && movies.length > 0 && (
            <div className="movie-grid">
              {movies.map((movie) => (
                <article className="movie-card" key={movie._id}>
                  <div className="poster-container">
                    <img
                      className="movie-poster"
                      src={movie.posterUrl}
                      alt={`${movie.title} poster`}
                    />
                    <span className="rating">
                      ★ {movie.rating ?? "N/A"}
                    </span>
                  </div>

                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p className="movie-meta">
                      {movie.genre?.join(" • ") || "Movie"}
                      {movie.duration ? ` • ${movie.duration} min` : ""}
                    </p>
                    <p className="movie-description">
                      {movie.description ||
                        "Discover this movie on IMovies."}
                    </p>
                    <button
                      className="book-button"
                      onClick={() => {
                        if (!user) {
                          setShowAuth(true);
                          return;
                        }

                        setError("");
                        setSelectedMovie(movie);
                      }}
                    >
                      Book Tickets
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="site-footer" id="about">
          <a className="logo" href="#home">
            I<span>MOVIES</span>
          </a>
          <p>Your seat. Your story. Your cinema.</p>
          <p className="developer-credit">
            Designed &amp; Developed by{" "}
            <span>Ali Akbar Khan</span>
          </p>
          <p>© {new Date().getFullYear()} IMovies. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
