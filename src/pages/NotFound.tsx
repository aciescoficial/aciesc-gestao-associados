
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "Referrer:",
      document.referrer
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Página não encontrada</p>
        <p className="text-gray-500 mb-6">
          A página <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> não existe.
        </p>
        <div className="space-y-3">
          <div>
            <Link to="/dashboard" className="text-blue-500 hover:text-blue-700 underline block bg-blue-50 py-2 px-4 rounded-md transition-colors">
              Ir para o Dashboard
            </Link>
          </div>
          <div>
            <Link to="/" className="text-blue-500 hover:text-blue-700 underline block">
              Voltar para Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
