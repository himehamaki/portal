import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AnnouncementListPage } from './pages/AnnouncementListPage';
import { AnnouncementDetailPage } from './pages/AnnouncementDetailPage';
import { AdminAnnouncementPage } from './pages/AdminAnnouncementPage';
import { AdminAnnouncementListPage } from './pages/AdminAnnouncementListPage';
import { AdminCategoryPage } from './pages/AdminCategoryPage';
import { FAQListPage } from './pages/FAQListPage';
import { AdminFAQPage } from './pages/AdminFAQPage';
import { AdminFAQListPage } from './pages/AdminFAQListPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          {/* ========== お知らせ ========== */}
          <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <AnnouncementListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements/:id"
            element={
              <ProtectedRoute>
                <AnnouncementDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute>
                <AdminAnnouncementListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements/create"
            element={
              <ProtectedRoute>
                <AdminAnnouncementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements/:id/edit"
            element={
              <ProtectedRoute>
                <AdminAnnouncementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminCategoryPage />
              </ProtectedRoute>
            }
          />
          {/* ========== FAQ ========== */}
          <Route
            path="/faqs"
            element={
              <ProtectedRoute>
                <FAQListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faqs"
            element={
              <ProtectedRoute>
                <AdminFAQListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faqs/create"
            element={
              <ProtectedRoute>
                <AdminFAQPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faqs/:id/edit"
            element={
              <ProtectedRoute>
                <AdminFAQPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
