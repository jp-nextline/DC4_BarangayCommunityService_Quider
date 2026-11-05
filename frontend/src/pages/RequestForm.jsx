import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../context/ToastContext.jsx';
import { categoryApi, requestApi } from '../services/resources.js';
import { errorMessage, fieldErrors } from '../services/api.js';
import { validateRequest } from '../utils/validators.js';
import FormInput from '../components/FormInput.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import ErrorBox from '../components/ErrorBox.jsx';

const EMPTY = { service_category_id: '', title: '', location: '', description: '' };

// Used for both "New request" and "Edit request" (when :id is in the URL).
export default function RequestForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const jobs = [categoryApi.list()];
    if (isEdit) jobs.push(requestApi.get(id));

    Promise.all(jobs)
      .then(([cats, req]) => {
        if (cancelled) return;
        setCategories(cats.data.data);
        if (req) {
          const r = req.data.data;
          if (!r.permissions.update) {
            toast.error('This request can no longer be edited.');
            navigate(`/requests/${id}`, { replace: true });
            return;
          }
          setForm({ service_category_id: r.category.id, title: r.title, location: r.location ?? '', description: r.description });
        }
      })
      .catch((e) => !cancelled && setLoadError(errorMessage(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validateRequest(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setSubmitting(true);
    try {
      const res = isEdit ? await requestApi.update(id, form) : await requestApi.create(form);
      toast.success(isEdit ? 'Request updated.' : 'Request submitted. We will notify you of any updates.');
      navigate(`/requests/${res.data.data.id}`);
    } catch (err) {
      if (err.response?.status === 422) setErrors(fieldErrors(err));
      else toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (loadError) return <ErrorBox message={loadError} />;

  return (
    <>
      <header className="page-head"><h1>{isEdit ? 'Edit request' : 'New service request'}</h1></header>
      <form className="panel form-panel" onSubmit={onSubmit} noValidate>
        <FormInput as="select" label="Category" name="service_category_id" value={form.service_category_id} onChange={onChange} error={errors.service_category_id}>
          <option value="">Choose a category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </FormInput>
        <FormInput label="Title" name="title" value={form.title} onChange={onChange} error={errors.title} placeholder="e.g. Broken streetlight along the main road" />
        <FormInput label="Location (optional)" name="location" value={form.location} onChange={onChange} error={errors.location} placeholder="Purok, street or landmark" />
        <FormInput as="textarea" rows={6} label="Details" name="description" value={form.description} onChange={onChange} error={errors.description} hint="Tell the office what you need and anything that helps them act on it." />
        <div className="form-actions">
          <Button variant="ghost" type="button" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" loading={submitting}>{isEdit ? 'Save changes' : 'Submit request'}</Button>
        </div>
      </form>
    </>
  );
}
