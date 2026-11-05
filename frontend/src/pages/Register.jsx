import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { fieldErrors, errorMessage } from '../services/api.js';
import { validateRegister } from '../utils/validators.js';
import FormInput from '../components/FormInput.jsx';
import Button from '../components/Button.jsx';

const EMPTY = { name: '', email: '', phone: '', address: '', password: '', password_confirmation: '' };

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validateRegister(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setSubmitting(true);
    try {
      await register(form);
      toast.success('Account created. Welcome!');
      navigate('/', { replace: true });
    } catch (err) {
      if (err.response?.status === 422) setErrors(fieldErrors(err)); // server messages under the fields
      else toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <h1>Create a resident account</h1>
        <FormInput label="Full name" name="name" value={form.name} onChange={onChange} error={errors.name} autoComplete="name" />
        <FormInput label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
        <div className="grid-2">
          <FormInput label="Phone (optional)" name="phone" value={form.phone} onChange={onChange} error={errors.phone} />
          <FormInput label="Address (optional)" name="address" value={form.address} onChange={onChange} error={errors.address} placeholder="Purok, street" />
        </div>
        <div className="grid-2">
          <FormInput label="Password" name="password" type="password" value={form.password} onChange={onChange} error={errors.password} hint="At least 8 characters" autoComplete="new-password" />
          <FormInput label="Confirm password" name="password_confirmation" type="password" value={form.password_confirmation} onChange={onChange} error={errors.password_confirmation} autoComplete="new-password" />
        </div>
        <Button type="submit" loading={submitting}>Create account</Button>
        <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
