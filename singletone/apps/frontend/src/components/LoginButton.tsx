import React from 'react';

interface LoginButtonProps {
    text: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ text }) => {
    return (
        <button type="submit" className="login-button">
        {text}
        </button>
    );
};

export default LoginButton;