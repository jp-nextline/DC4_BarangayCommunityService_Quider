import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from './components/RouteGuards.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RequestList from './pages/RequestList.jsx';
import RequestForm from './pages/RequestForm.jsx';
import RequestDetail from './pages/RequestDetail.jsx';
import Categories from './pages/Categories.jsx';
import Notifications from './pages/Notifications.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Logged-in users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="requests" element={<RequestList />} />
          <Route path="requests/new" element={<RequestForm />} />
          <Route path="requests/:id" element={<RequestDetail />} />
          <Route path="requests/:id/edit" element={<RequestForm />} />
          <Route path="notifications" element={<Notifications />} />

          {/* Admin only */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="categories" element={<Categories />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
