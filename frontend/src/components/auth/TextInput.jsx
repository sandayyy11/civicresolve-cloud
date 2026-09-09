function TextInput({
  label,
  type,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div>
      <label className="label">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input"
      />
    </div>
  );
}

export default TextInput;