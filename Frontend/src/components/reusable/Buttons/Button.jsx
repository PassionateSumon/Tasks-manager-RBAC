import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * A reusable Button component with RBAC (Role-Based Access Control) support and Tailwind CSS styling.
 *
 * @param {string} type - The type of button ('button', 'submit', 'reset').
 * @param {string} variant - The visual style of the button ('primary', 'secondary', 'danger', 'outline', etc.).
 * @param {boolean} disabled - Whether the button is disabled.
 * @param {Array<string>} allowedRoles - Array of roles allowed to interact with this button.
 * @param {string} userRole - The current user's role.
 * @param {function} onClick - The click handler function.
 * @param {string} className - Additional classes for custom styling.
 * @param {React.ReactNode} children - The button's content.
 * @param {object} ...props - Any additional props.
 */
const Button = ({
  type = 'button',
  variant = 'primary',
  disabled = false,
  allowedRoles = [],
  userRole,
  onClick,
  className,
  children,
  ...props
}) => {
  // Check if the user's role is allowed
  const isAllowed = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  // Define default styles based on variants
  const baseStyles = 'px-4 py-2 font-semibold rounded-md focus:outline-none focus:ring-2';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  // Combine class names
  const combinedStyles = classNames(
    baseStyles,
    variants[variant] || variants.primary,
    { [disabledStyles]: disabled || !isAllowed },
    className
  );

  return (
    <button
      type={type}
      className={combinedStyles}
      onClick={isAllowed && !disabled ? onClick : undefined}
      disabled={disabled || !isAllowed}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'outline', 'success', 'warning']),
  disabled: PropTypes.bool,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  userRole: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  type: 'button',
  variant: 'primary',
  disabled: false,
  allowedRoles: [],
  userRole: '',
  onClick: () => {},
  className: '',
};

export default Button;
