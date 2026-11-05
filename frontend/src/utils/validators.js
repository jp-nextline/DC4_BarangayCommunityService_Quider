// Client-side checks. Each returns an object of { field: message }; empty object = valid.
const emailOk = (v) => /^\S+@\S+\.\S+$/.test(v);

export const validateLogin = ({ email, password }) => {
  const e = {};
  if (!email.trim()) e.email = 'Enter your email address.';
  else if (!emailOk(email)) e.email = 'Enter a valid email address.';
  if (!password) e.password = 'Enter your password.';
  return e;
};

export const validateRegister = (f) => {
  const e = validateLogin(f);
  if (!f.name.trim()) e.name = 'Enter your full name.';
  if (f.password && f.password.length < 8) e.password = 'Use at least 8 characters.';
  if (f.password !== f.password_confirmation) e.password_confirmation = 'Passwords do not match.';
  if (f.phone && !/^[0-9+\-\s]{7,20}$/.test(f.phone)) e.phone = 'Enter a valid phone number.';
  return e;
};

export const validateRequest = (f) => {
  const e = {};
  if (!f.service_category_id) e.service_category_id = 'Choose a category.';
  if (f.title.trim().length < 5) e.title = 'Title must be at least 5 characters.';
  if (f.description.trim().length < 10) e.description = 'Describe your request in at least 10 characters.';
  return e;
};
