import React from 'react';
import styles from './Button.module.css';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  ariaLabel,
  ...props
}) => {
  const className = `${styles.btn} ${styles[`btn${variant.charAt(0).toUpperCase()}${variant.slice(1)}`]} ${disabled ? styles.btnDisabled : ''}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
