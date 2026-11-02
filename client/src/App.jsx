import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDeskPage from './pages/AdminDeskPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminDeskPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}
