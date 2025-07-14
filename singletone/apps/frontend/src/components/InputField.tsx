import React from 'react';

interface InputFieldProps {
    id: string;
    type: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    }

    const InputField: React.FC<InputFieldProps> = ({
    id,
    type,
    label,
    placeholder,
    value,
    onChange,
    }) => {
    return (
        <div className="input-group">
        <label htmlFor={id}>{label}</label>
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
        </div>
    );
};

export default InputField;