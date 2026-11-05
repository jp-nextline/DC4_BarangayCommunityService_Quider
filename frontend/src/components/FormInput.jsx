// Controlled input / textarea / select with its error shown under the field.
export default function FormInput({ label, name, error, as = 'input', children, hint, ...props }) {
  const Tag = as;
  const id = `field-${name}`;
  return (
    <div className={`field ${error ? 'field-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <Tag id={id} name={name} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...props}>
        {children}
      </Tag>
      {hint && !error && <small className="hint">{hint}</small>}
      {error && <small id={`${id}-err`} className="error-text">{error}</small>}
    </div>
  );
}
