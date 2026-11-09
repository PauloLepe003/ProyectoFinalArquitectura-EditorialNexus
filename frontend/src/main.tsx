import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { BookOpen, ShoppingBag, ArrowUpRight, LogOut, Menu } from 'lucide-react';
import { api, setCsrf, labels } from './services/api';
import { AppContext, State } from './components/shared';
import { Catalog, BookDetail } from './views/Catalog';
import { Auth, Profile, Cart, Orders } from './views/Account';
import { Requests } from './views/Requests';
import { Admin } from './views/Admin';
import './styles/app.css';
function App() {
  const [user, setUser] = useState<any>(null),
    [ready, setReady] = useState(false),
    [error, setError] = useState(''),
    [notice, setNotice] = useState(''),
    [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  async function refresh() {
    const result = await api('/auth/me');
    setUser(result.user);
    setCsrf(result.csrf ?? '');
    setReady(true);
  }
  useEffect(() => {
    refresh().catch((e) => {
      setError(e.message);
      setReady(true);
    });
  }, []);
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  async function logout() {
    try {
      await api('/auth/logout', 'POST');
      setCsrf('');
      setUser(null);
      navigate('/');
    } catch (e) {
      setNotice((e as Error).message);
    }
  }
  const protect = (node: React.ReactNode, roles?: string[]) =>
    !ready ? (
      <State loading>{null}</State>
    ) : !user ? (
      <Navigate to="/login" />
    ) : roles && !roles.includes(user.role) ? (
      <div className="alert">No tienes acceso a esta sección.</div>
    ) : (
      node
    );
  return (
    <AppContext.Provider value={{ user, refresh, notify: setNotice }}>
      <div className="topbar">
        Un buen libro es solo el comienzo.<span>Guatemala · Catálogo editorial</span>
      </div>
      <header>
        <Link className="brand" to="/">
          <BookOpen size={30} />
          <span>
            NEXUS<small>EDITORIAL</small>
          </span>
        </Link>
        <button
          className="mobile-menu icon-button"
          aria-label="Abrir navegación"
          onClick={() => setMenu(!menu)}
        >
          <Menu />
        </button>
        <nav className={menu ? 'open' : ''} onClick={() => setMenu(false)}>
          <NavLink end to="/">
            Descubrir
          </NavLink>
          <NavLink to="/catalogo">Catálogo</NavLink>
          {user && (
            <>
              <NavLink to="/orders">Mis pedidos</NavLink>
              {['INSTITUTION', 'ADVISOR', 'ADMIN'].includes(user.role) && (
                <NavLink to="/requests">
                  {user.role === 'INSTITUTION' ? 'Cotizaciones' : 'Panel comercial'}
                </NavLink>
              )}
              {user.role === 'ADMIN' && <NavLink to="/admin">Administración</NavLink>}
            </>
          )}
        </nav>
        <div className="header-actions">
          {user ? (
            <>
              <Link to="/profile" className="profile-link">
                {user.name.split(' ')[0]}
                <small>{labels[user.role]}</small>
              </Link>
              {['RETAIL', 'INSTITUTION'].includes(user.role) && (
                <Link to="/cart" className="icon-button" aria-label="Carrito">
                  <ShoppingBag size={21} />
                </Link>
              )}
              <button className="icon-button" onClick={logout} aria-label="Cerrar sesión">
                <LogOut size={19} />
              </button>
            </>
          ) : (
            <Link className="button small" to="/login">
              Ingresar <ArrowUpRight size={16} />
            </Link>
          )}
        </div>
      </header>
      {notice && (
        <div className="toast" role="status">
          {notice}
          <button aria-label="Cerrar notificación" onClick={() => setNotice('')}>
            ×
          </button>
        </div>
      )}
      {error && <div className="alert">{error}</div>}
      <main>
        <Routes>
          <Route path="/" element={<Catalog home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth register />} />
          <Route path="/profile" element={protect(<Profile />)} />
          <Route path="/cart" element={protect(<Cart />, ['RETAIL', 'INSTITUTION'])} />
          <Route path="/orders" element={protect(<Orders />)} />
          <Route
            path="/requests"
            element={protect(<Requests />, ['INSTITUTION', 'ADVISOR', 'ADMIN'])}
          />
          <Route path="/admin/*" element={protect(<Admin />, ['ADMIN'])} />
          <Route
            path="*"
            element={
              <section className="state">
                <h1>Página no encontrada</h1>
                <Link to="/">Volver al inicio</Link>
              </section>
            }
          />
        </Routes>
      </main>
      <footer>
        <Link className="brand" to="/">
          <BookOpen />
          <span>
            NEXUS<small>EDITORIAL</small>
          </span>
        </Link>
        <p>
          Historias para cada lector.
          <br />
          Soluciones para cada institución.
        </p>
        <span>
          © {new Date().getFullYear()} Editorial Nexus
          <br />
          <small>Proyecto académico · Guatemala</small>
        </span>
      </footer>
    </AppContext.Provider>
  );
}
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
