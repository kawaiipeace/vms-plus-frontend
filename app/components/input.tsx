interface InputProps {
  type: string;
  disable?: boolean;
  icon: string;
  value: string;
  placeholder?:string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Add onChange prop
}
export default function Input({ type, disable, value, icon, placeholder, onChange  }: InputProps) {
  return (
    <div className={`input-group ${disable === true ? 'is-readonly' : ''}`}>
      <div className="input-group-prepend">
        <span className="input-group-text">
          <i className="material-symbols-outlined">{icon}</i>
        </span>
      </div>
      <input
        type={type}
        className="form-control"
        placeholder={placeholder}
        onChange={onChange} // Add onChange handler here
        value={value}
        disabled={disable} // Optionally disable the input based on the prop
      />
      {/* <!-- <div className="input-group-append">
        <span className="input-group-text search-ico-trailing">
          <i className="material-symbols-outlined">close</i>
        </span>
      </div> --> */}
    </div>
  );
}
