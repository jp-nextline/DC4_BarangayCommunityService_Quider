export default function Button({ variant = 'primary', loading = false, children, className = '', ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}
