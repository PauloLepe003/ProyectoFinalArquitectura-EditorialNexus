import { useState } from 'react';
import { NavLink, Routes, Route, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Library,
  Users,
  Tags,
  PenLine,
  ShoppingBag,
  Settings,
  FileText,
} from 'lucide-react';
import { api, money, labels } from '../services/api';
import {
  useLoad,
  useApp,
  State,
  Heading,
  Field,
  ActionForm,
  Modal,
  Badge,
} from '../components/shared';
import { OrderCard } from './Account';
export function Admin() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <span className="eyebrow">ESPACIO DE GESTIÓN</span>
        {[
          ['', 'Resumen', LayoutDashboard],
          ['books', 'Libros e inventario', Library],
          ['authors', 'Autores', PenLine],
          ['categories', 'Categorías', Tags],
          ['users', 'Usuarios', Users],
          ['orders', 'Pedidos', ShoppingBag],
          ['settings', 'Parámetros', Settings],
        ].map(([path, label, Icon]: any) => (
          <NavLink key={path} end={path === ''} to={'/admin/' + path}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        <Link to="/requests">
          <FileText size={18} />
          Cotizaciones
        </Link>
      </aside>
      <div className="admin-content">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="authors" element={<Taxonomy kind="authors" key="authors" />} />
          <Route path="categories" element={<Taxonomy kind="categories" key="categories" />} />
          <Route path="users" element={<UsersPanel />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<SettingsPanel />} />
        </Routes>
      </div>
    </div>
  );
}
function Dashboard() {
  const { data, error, loading } = useLoad('/admin/metrics');
  return (
    <>
      <Heading title="Una mirada a tu editorial" eyebrow="PANEL ADMINISTRATIVO" />
      <State loading={loading} error={error}>
        {data && (
          <>
            <div className="metrics">
              {[
                ['Ventas registradas', money(data.sales)],
                ['Pedidos', data.orders],
                ['Libros activos', data.books],
                ['Usuarios', data.users],
                ['Solicitudes pendientes', data.pendingRequests],
                ['Cotizaciones emitidas', data.quotes],
              ].map(([label, value]) => (
                <div className="metric" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <section className="panel">
              <div className="row between">
                <h2>Inventario que necesita atención</h2>
                <Link to="/admin/books">Gestionar →</Link>
              </div>
              <p className="muted">Libros con 10 ejemplares o menos.</p>
              {data.lowStock.map((b: any) => (
                <div className="stock-row" key={b.id}>
                  <span>{b.title}</span>
                  <strong>{b.inventory.stock} unidades</strong>
                </div>
              ))}
              {!data.lowStock.length && <p>El inventario tiene disponibilidad suficiente.</p>}
            </section>
          </>
        )}
      </State>
    </>
  );
}
function Books() {
  const [q, setQ] = useState(''),
    [page, setPage] = useState(1),
    [edit, setEdit] = useState<any>(null),
    [remove, setRemove] = useState<any>(null);
  const list = useLoad('/admin/books?limit=10&page=' + page + '&q=' + encodeURIComponent(q));
  const meta = useLoad('/admin/metadata');
  const { notify } = useApp();
  return (
    <>
      <Heading title="Libros e inventario">
        <button className="button" onClick={() => setEdit({})}>
          Nuevo libro +
        </button>
      </Heading>
      <div className="search">
        <input
          aria-label="Buscar en administración"
          placeholder="Buscar por título, autor, ISBN o editorial"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
      </div>
      <State loading={list.loading} error={list.error}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Libro</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {list.data?.items.map((b: any) => (
                <tr key={b.id}>
                  <td>
                    <strong>{b.title}</strong>
                    <small>{b.isbn}</small>
                  </td>
                  <td>{money(b.price)}</td>
                  <td>{b.inventory.stock}</td>
                  <td>{b.active ? 'Activo' : 'Inactivo'}</td>
                  <td className="actions">
                    <button onClick={() => setEdit(b)}>Editar</button>
                    {b.active && <button onClick={() => setRemove(b)}>Desactivar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>
          <span>
            {page} / {Math.max(1, list.data?.pages ?? 1)}
          </span>
          <button disabled={page >= (list.data?.pages ?? 1)} onClick={() => setPage((p) => p + 1)}>
            Siguiente
          </button>
        </div>
      </State>
      {edit && (
        <Modal title={edit.id ? 'Editar libro' : 'Crear libro'} onClose={() => setEdit(null)}>
          <State loading={meta.loading} error={meta.error}>
            {meta.data && (
              <ActionForm
                onSubmit={async (f) => {
                  const value = {
                    title: f.get('title'),
                    isbn: f.get('isbn'),
                    synopsis: f.get('synopsis'),
                    year: Number(f.get('year')),
                    price: f.get('price'),
                    cover: f.get('cover'),
                    publisherId: f.get('publisherId'),
                    formatId: f.get('formatId'),
                    authorIds: f.getAll('authorIds'),
                    categoryIds: f.getAll('categoryIds'),
                    stock: Number(f.get('stock')),
                    active: f.has('active'),
                    featured: f.has('featured'),
                  };
                  await api(
                    '/admin/books' + (edit.id ? '/' + edit.id : ''),
                    edit.id ? 'PUT' : 'POST',
                    value,
                  );
                  setEdit(null);
                  list.reload();
                  notify('Libro guardado.');
                }}
              >
                <Field label="Título">
                  <input name="title" required defaultValue={edit.title} />
                </Field>
                <div className="two">
                  <Field label="ISBN (13 dígitos)">
                    <input name="isbn" pattern="[0-9]{13}" required defaultValue={edit.isbn} />
                  </Field>
                  <Field label="Año de edición">
                    <input
                      name="year"
                      type="number"
                      min="1400"
                      max="2100"
                      required
                      defaultValue={edit.year ?? new Date().getFullYear()}
                    />
                  </Field>
                </div>
                <Field label="Sinopsis">
                  <textarea name="synopsis" rows={3} required defaultValue={edit.synopsis} />
                </Field>
                <div className="two">
                  <Field label="Precio Q">
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      defaultValue={edit.price}
                    />
                  </Field>
                  <Field label="Stock">
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      max="1000000"
                      required
                      defaultValue={edit.inventory?.stock ?? 0}
                    />
                  </Field>
                  <Field label="Editorial">
                    <select name="publisherId" defaultValue={edit.publisherId} required>
                      {meta.data.publishers.map((p: any) => (
                        <option value={p.id} key={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Formato">
                    <select name="formatId" defaultValue={edit.formatId} required>
                      {meta.data.formats.map((p: any) => (
                        <option value={p.id} key={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Autores (Ctrl o Cmd para varios)">
                  <select
                    name="authorIds"
                    multiple
                    required
                    defaultValue={edit.authors?.map((a: any) => a.id)}
                  >
                    {meta.data.authors
                      .filter((a: any) => a.active)
                      .map((p: any) => (
                        <option value={p.id} key={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </Field>
                <Field label="Categorías (Ctrl o Cmd para varias)">
                  <select
                    name="categoryIds"
                    multiple
                    required
                    defaultValue={edit.categories?.map((a: any) => a.id)}
                  >
                    {meta.data.categories
                      .filter((a: any) => a.active)
                      .map((p: any) => (
                        <option value={p.id} key={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </Field>
                <Field label="Portada (URL HTTPS o /covers/archivo.svg)">
                  <input name="cover" defaultValue={edit.cover ?? ''} />
                </Field>
                <div className="row">
                  <label>
                    <input type="checkbox" name="active" defaultChecked={edit.active ?? true} />{' '}
                    Activo
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="featured"
                      defaultChecked={edit.featured ?? false}
                    />{' '}
                    Destacado
                  </label>
                </div>
              </ActionForm>
            )}
          </State>
        </Modal>
      )}
      {remove && (
        <Modal title="Desactivar libro" onClose={() => setRemove(null)}>
          <p>¿Desactivar «{remove.title}»? Los pedidos históricos se conservarán.</p>
          <ActionForm
            submit="Desactivar"
            onSubmit={async () => {
              await api('/admin/books/' + remove.id, 'DELETE');
              setRemove(null);
              list.reload();
            }}
          >
            {null}
          </ActionForm>
        </Modal>
      )}
    </>
  );
}
function Taxonomy({ kind }: { kind: 'authors' | 'categories' }) {
  const { data, error, loading, reload } = useLoad('/admin/metadata');
  const [edit, setEdit] = useState<any>(null),
    [remove, setRemove] = useState<any>(null);
  const title = kind === 'authors' ? 'Autores' : 'Categorías';
  return (
    <>
      <Heading title={title}>
        <button className="button" onClick={() => setEdit({})}>
          Crear +
        </button>
      </Heading>
      <State loading={loading} error={error}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.[kind].map((r: any) => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.active ? 'Activo' : 'Inactivo'}</td>
                  <td className="actions">
                    <button onClick={() => setEdit(r)}>Editar</button>
                    {r.active && <button onClick={() => setRemove(r)}>Desactivar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </State>
      {edit && (
        <Modal title={'Gestionar ' + title.toLowerCase()} onClose={() => setEdit(null)}>
          <ActionForm
            onSubmit={async (f) => {
              await api(
                '/admin/' + kind + (edit.id ? '/' + edit.id : ''),
                edit.id ? 'PUT' : 'POST',
                { ...Object.fromEntries(f), active: f.has('active') },
              );
              setEdit(null);
              reload();
            }}
          >
            <Field label="Nombre">
              <input name="name" defaultValue={edit.name} required />
            </Field>
            <Field label={kind === 'authors' ? 'Biografía' : 'Descripción'}>
              <textarea
                name={kind === 'authors' ? 'biography' : 'description'}
                defaultValue={edit.biography ?? edit.description ?? ''}
              />
            </Field>
            <label>
              <input type="checkbox" name="active" defaultChecked={edit.active ?? true} /> Activo
            </label>
          </ActionForm>
        </Modal>
      )}
      {remove && (
        <Modal title="Confirmar desactivación" onClose={() => setRemove(null)}>
          <p>¿Desactivar {remove.name}?</p>
          <ActionForm
            submit="Desactivar"
            onSubmit={async () => {
              await api('/admin/' + kind + '/' + remove.id, 'DELETE');
              setRemove(null);
              reload();
            }}
          >
            {null}
          </ActionForm>
        </Modal>
      )}
    </>
  );
}
function UsersPanel() {
  const [q, setQ] = useState(''),
    [edit, setEdit] = useState<any>(null);
  const { data, error, loading, reload } = useLoad('/admin/users?q=' + encodeURIComponent(q));
  const { notify, user } = useApp();
  return (
    <>
      <Heading title="Usuarios e instituciones" />
      <div className="search">
        <input
          aria-label="Buscar usuarios"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o correo"
        />
      </div>
      <State loading={loading} error={error}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Institución</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((u: any) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.name}</strong>
                    <small>{u.email}</small>
                  </td>
                  <td>{labels[u.role]}</td>
                  <td>
                    {u.institution ? (
                      <>
                        {u.institution.name}
                        <br />
                        <Badge value={u.institution.status} />
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{u.active ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <button disabled={u.id === user.id} onClick={() => setEdit(u)}>
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </State>
      {edit && (
        <Modal title={'Gestionar ' + edit.name} onClose={() => setEdit(null)}>
          <ActionForm
            onSubmit={async (f) => {
              await api('/admin/users/' + edit.id, 'PATCH', {
                role: f.get('role'),
                active: f.has('active'),
                ...(edit.institution ? { institutionStatus: f.get('institutionStatus') } : {}),
              });
              setEdit(null);
              reload();
              notify('Usuario actualizado. Sus sesiones anteriores se cerraron.');
            }}
          >
            <Field label="Rol">
              <select name="role" defaultValue={edit.role}>
                {['RETAIL', 'INSTITUTION', 'ADVISOR', 'ADMIN']
                  .filter((r) => r !== 'INSTITUTION' || edit.institution)
                  .map((r) => (
                    <option key={r} value={r}>
                      {labels[r]}
                    </option>
                  ))}
              </select>
            </Field>
            {edit.institution && (
              <>
                <p>NIT: {edit.institution.taxId}</p>
                <Field label="Validación institucional">
                  <select name="institutionStatus" defaultValue={edit.institution.status}>
                    {['PENDING', 'APPROVED', 'REJECTED'].map((r) => (
                      <option key={r} value={r}>
                        {labels[r]}
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            )}
            <label>
              <input type="checkbox" name="active" defaultChecked={edit.active} /> Cuenta activa
            </label>
          </ActionForm>
        </Modal>
      )}
    </>
  );
}
function AdminOrders() {
  const [status, setStatus] = useState(''),
    [change, setChange] = useState<any>(null);
  const { data, error, loading, reload } = useLoad(
    '/admin/orders' + (status ? '?status=' + status : ''),
  );
  return (
    <>
      <Heading title="Control de pedidos" />
      <Field label="Filtrar por estado">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {['PENDING', 'APPROVED', 'SHIPPED', 'CANCELLED'].map((s) => (
            <option key={s} value={s}>
              {labels[s]}
            </option>
          ))}
        </select>
      </Field>
      <State loading={loading} error={error}>
        {data?.map((o: any) => (
          <OrderCard
            key={o.id}
            order={o}
            admin
            onChange={(id, status) => setChange({ id, status })}
          />
        ))}
        {data?.length === 0 && <p>No hay pedidos con este estado.</p>}
      </State>
      {change && (
        <Modal title="Cambiar estado del pedido" onClose={() => setChange(null)}>
          <p>
            Nuevo estado: {labels[change.status]}.
            {change.status === 'CANCELLED' ? ' El inventario será restituido.' : ''}
          </p>
          <ActionForm
            submit="Confirmar cambio"
            onSubmit={async () => {
              await api('/admin/orders/' + change.id, 'PATCH', { status: change.status });
              setChange(null);
              reload();
            }}
          >
            {null}
          </ActionForm>
        </Modal>
      )}
    </>
  );
}
function SettingsPanel() {
  const { data, error, loading, reload } = useLoad('/admin/settings');
  const { notify } = useApp();
  return (
    <>
      <Heading title="Parámetros del sistema" />
      <State loading={loading} error={error}>
        {data && (
          <div className="panel narrow">
            <ActionForm
              onSubmit={async (f) => {
                await api('/admin/settings', 'PUT', { taxRate: f.get('taxRate') });
                reload();
                notify('Parámetros actualizados.');
              }}
            >
              <Field label="Tasa de IVA (0.12 = 12%)">
                <input
                  name="taxRate"
                  type="number"
                  min="0"
                  max="1"
                  step="0.0001"
                  required
                  defaultValue={data.taxRate}
                />
              </Field>
              <p className="muted">
                Se aplica a nuevos pedidos y nuevas versiones de cotizaciones. Los importes
                históricos permanecen sin cambios.
              </p>
            </ActionForm>
          </div>
        )}
      </State>
    </>
  );
}
