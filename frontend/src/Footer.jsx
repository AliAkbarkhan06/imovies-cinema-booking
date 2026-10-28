
import "./Footer.css";

function Footer() {
  return (
    <footer className="imovies-footer">
      <div className="footer-line"></div>

      <p className="footer-brand">
        IMovies <span>🎬</span>
      </p>

      <p className="footer-credit">
        Designed & Developed by{" "}
        <span className="developer-name">Ali Akbar Khan</span>
      </p>

      <p className="footer-copyright">
        © {new Date().getFullYear()} IMovies. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
