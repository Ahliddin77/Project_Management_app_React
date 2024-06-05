function FormInput({ label, type, name }) {
  return (
    <label className="form-control w-full mb-3">
      <div className="label">
        <span className="label-text">{label}:</span>
      </div>
      <input
        type={type}
        name={name}
        placeholder="Type here"
        className="input input-bordered w-full"
      />
    </label>
  );
}

export default FormInput;
