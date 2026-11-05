import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { categoryApi } from '../services/resources.js';
import { errorMessage, fieldErrors } from '../services/api.js';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import FormInput from '../components/FormInput.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

const EMPTY = { name: '', description: '' };

// Admin-only: full CRUD for service categories.
export default function Categories() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {id,...} = edit
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const load = useCallback(() => {
    setError('');
    categoryApi.list().then((res) => setRows(res.data.data)).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  const openForm = (cat = null) => {
    setEditing(cat ?? {});
    setForm(cat ? { name: cat.name, description: cat.description ?? '' } : EMPTY);
    setErrors({});
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setErrors({ name: 'Enter a category name.' });
    setSaving(true);
    try {
      if (editing.id) await categoryApi.update(editing.id, form);
      else await categoryApi.create(form);
      toast.success(editing.id ? 'Category updated.' : 'Category added.');
      setEditing(null);
      load();
    } catch (err) {
      if (err.response?.status === 422) setErrors(fieldErrors(err));
      else toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    setSaving(true);
    try {
      await categoryApi.remove(toDelete.id);
      toast.success('Category deleted.');
      load();
    } catch (err) {
      toast.error(errorMessage(err)); // e.g. 409: category is in use
    } finally {
      setSaving(false);
      setToDelete(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <header className="page-head">
        <div><h1>Categories</h1><p className="muted">Groups residents can choose when filing a request.</p></div>
        <Button onClick={() => openForm()}>Add category</Button>
      </header>

      {error && <ErrorBox message={error} onRetry={load} />}
      <DataTable
        rows={rows}
        emptyMessage="No categories yet. Add the first one."
        columns={[
          { header: 'Name', render: (c) => <strong>{c.name}</strong> },
          { header: 'Description', render: (c) => c.description || '-' },
          { header: 'Requests', render: (c) => c.requests_count },
          {
            header: 'Actions', className: 'actions',
            render: (c) => (
              <>
                <Button variant="ghost" className="btn-sm" onClick={() => openForm(c)}>Edit</Button>
                <Button variant="danger-ghost" className="btn-sm" onClick={() => setToDelete(c)}>Delete</Button>
              </>
            ),
          },
        ]}
      />

      {editing && (
        <Modal title={editing.id ? 'Edit category' : 'Add category'} onClose={() => setEditing(null)}>
          <form onSubmit={save} noValidate>
            <FormInput label="Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <FormInput as="textarea" rows={3} label="Description (optional)" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={errors.description} />
            <div className="modal-actions">
              <Button variant="ghost" type="button" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit" loading={saving}>Save category</Button>
            </div>
          </form>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog title="Delete this category?" message={`“${toDelete.name}” will be removed. Categories used by requests cannot be deleted.`} loading={saving} onConfirm={remove} onCancel={() => setToDelete(null)} />
      )}
    </>
  );
}
