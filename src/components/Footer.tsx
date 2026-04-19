import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <p className="text-center font-serif text-lg italic mb-8 max-w-2xl mx-auto opacity-80">
          "If this has blessed you today, share it with someone who needs it.
          A little light shared goes a long way."
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm opacity-70">
          <Link to="/" className="hover:opacity-100 transition-opacity">Home</Link>
          <Link to="/privacy-policy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
          <Link to="/terms-of-use" className="hover:opacity-100 transition-opacity">Terms of Use</Link>
          <Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link>
          <Link to="/donation" className="hover:opacity-100 transition-opacity">Donate</Link>
        </div>
        <p className="text-center text-xs mt-6 opacity-50">
          © {new Date().getFullYear()} The Daily Beloved. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
