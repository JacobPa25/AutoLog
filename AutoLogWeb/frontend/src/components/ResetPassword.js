import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ResetPassword.css';
import './DefaultStyles.css';
import logo from '../images/Group 19.png';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        symbol: false,
        noSpaces: false,
        match: false
    });
    const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
    const [showPasswordMatchRequirement, setShowPasswordMatchRequirement] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { token } = useParams();
    var bp = require('./Path.js');

    useEffect(() => {
        validatePassword();
    }, [newPassword, confirmPassword]);

    const validatePassword = () => {
        const isValidLength = newPassword.length >= 8 && newPassword.length <= 20;
        const hasLowercase = /[a-z]/.test(newPassword);
        const hasUppercase = /[A-Z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const hasSymbol = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\|-]/.test(newPassword);
        const noSpaces = /^\S*$/.test(newPassword);
        const doPasswordsMatch = newPassword === confirmPassword;

        setPasswordValid({
            length: isValidLength,
            lowercase: hasLowercase,
            uppercase: hasUppercase,
            number: hasNumber,
            symbol: hasSymbol,
            noSpaces: noSpaces,
            match: doPasswordsMatch
        });
    };

    const handleResetPassword = async (event) => {
        event.preventDefault();

        // Check if all password requirements are met
        if (!passwordValid.length || !passwordValid.lowercase || !passwordValid.uppercase || !passwordValid.number || !passwordValid.symbol || !passwordValid.noSpaces || !passwordValid.match) {
            setMessage('Password requirements not met');
            return;
        }

        // Proceed with resetting password
        const response = await fetch(bp.buildPath('api/reset-password'), {
            method: 'POST',
            body: JSON.stringify({ token, newPassword }),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();
        if (result.success) {
            alert('Password reset successful');
            navigate('/login');
        } else {
            setMessage(result.error);
        }
    };

    return (
        <div className="container-center">
            <img src={logo} alt="AutoLog Logo" />
            <form className="form-standard" onSubmit={handleResetPassword}>
                <h1 className="title">RESET PASSWORD</h1>
                <p>Enter a new password for your account.</p>

                <div className="vbox">

                    <div className="validator-group">
                        <label>
                            New Password:
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                onFocus={() => setShowPasswordRequirements(true)}
                                onBlur={() => setShowPasswordRequirements(false)}
                                required
                            />
                        </label>

                        {passwordValid.length && passwordValid.lowercase && passwordValid.uppercase && passwordValid.number && passwordValid.symbol && passwordValid.noSpaces ? (
                            <span className="checkmark">✔</span>
                        ) : (
                            <span className="crossmark">✖</span>
                        )}
                    </div>

                    {showPasswordRequirements && (
                        <ul className="password-requirements">
                            <li className={passwordValid.length ? 'valid' : 'invalid'}>8-20 characters</li>
                            <li className={passwordValid.lowercase ? 'valid' : 'invalid'}>At least one lowercase letter</li>
                            <li className={passwordValid.uppercase ? 'valid' : 'invalid'}>At least one uppercase letter</li>
                            <li className={passwordValid.number ? 'valid' : 'invalid'}>At least one number</li>
                            <li className={passwordValid.symbol ? 'valid' : 'invalid'}>At least one symbol (@, $, !, %, *, ?, &)</li>
                            <li className={passwordValid.noSpaces ? 'valid' : 'invalid'}>No spaces</li>
                        </ul>
                    )}

                    <div className="validator-group">
                        <label>
                            Confirm Password:
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                onFocus={() => setShowPasswordMatchRequirement(true)}
                                onBlur={() => setShowPasswordMatchRequirement(false)}
                                required
                            />
                        </label>
                        {passwordValid.match ? (
                            <span className="checkmark">✔</span>
                        ) : (
                            <span className="crossmark">✖</span>
                        )}

                    </div>
                    {showPasswordMatchRequirement && (
                        <p className={passwordValid.match ? 'valid' : 'invalid'}>
                            {passwordValid.match ? '✔ Passwords match' : '✖ Passwords do not match'}
                        </p>
                    )}
                </div>
                <button className="button-standard accent-button" type="submit">
                    RESET PASSWORD
                </button>
            </form>
            <span className="message">{message}</span>
        </div>
    );
}

export default ResetPassword;
