
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./components/auth/LoginPage";
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
