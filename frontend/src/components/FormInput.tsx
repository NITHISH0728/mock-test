import React from 'react';

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const FormInput = ({ label, type, name, placeholder, value, onChange, required }: FormInputProps) => {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default FormInput;
