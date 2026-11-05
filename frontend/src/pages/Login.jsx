import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { fieldErrors, errorMessage } from '../services/api.js';
import { validateLogin } from '../utils/validators.js';
import FormInput from '../components/FormInput.jsx';
import Button from '../components/Button.jsx';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const clientErrors = validateLogin(form);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) return;

    setSubmitting(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      if (err.response?.status === 422) setErrors(fieldErrors(err));
      else toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={onSubmit} noValidate>
        <h1>Log in</h1>
        <p className="muted">Track your barangay requests or manage incoming ones.</p>
        <FormInput label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} autoComplete="email" />
        <FormInput label="Password" name="password" type="password" value={form.password} onChange={onChange} error={errors.password} autoComplete="current-password" />
        <Button type="submit" loading={submitting}>Log in</Button>
        <p className="muted">No account yet? <Link to="/register">Register as a resident</Link></p>
        <p className="demo-hint">Demo: admin@barangay.test or resident@barangay.test (password: <code>password</code>)</p>
      </form>
    </div>
  );
}
