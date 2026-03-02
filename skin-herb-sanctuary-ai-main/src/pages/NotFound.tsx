
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111]">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-herb mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="herb-button">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
