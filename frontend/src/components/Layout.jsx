import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { notificationApi } from '../services/resources.js';

export default function Layout() {
  const { user, isAdmin, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  // Close the mobile menu on navigation; refresh the unread badge for residents.
  useEffect(() => {
    setMenuOpen(false);
    if (!isAdmin) {
      notificationApi.list().then((res) => setUnread(res.data.unread_count)).catch(() => {});
    }
  }, [pathname, isAdmin]);

  const handleLogout = async () => {
    await logout();
    toast.success('You have been logged out.');
    navigate('/login');
  };

  return (
    <div className="shell">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">B</span>
            <span>Barangay<br />Service Desk</span>
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-label="Toggle menu">
            Menu
          </button>
        </div>

        <nav className="nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/requests" end>{isAdmin ? 'All requests' : 'My requests'}</NavLink>
          {!isAdmin && <NavLink to="/requests/new">New request</NavLink>}
          {isAdmin && <NavLink to="/categories">Categories</NavLink>}
          {!isAdmin && (
            <NavLink to="/notifications">
              Notifications {unread > 0 && <span className="count">{unread}</span>}
            </NavLink>
          )}
        </nav>

        <div className="sidebar-user">
          <strong>{user.name}</strong>
          <small>{isAdmin ? 'Administrator' : 'Resident'}</small>
          <button className="btn btn-ghost-light" onClick={handleLogout}>Log out</button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
