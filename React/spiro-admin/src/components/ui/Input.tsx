import { useId, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { Icon, type IconName } from './Icon';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string | null;
  icon?: IconName;
  round?: boolean;
  onClear?: () => void;
}

export function Input({
  label,
  error,
  icon,
  round = false,
  onClear,
  className,
  id,
  value,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="input-wrap">
        {icon && (
          <span className="input-wrap__icon">
            <Icon name={icon} size={16} />
          </span>
        )}

        <input
          id={inputId}
          className={cn('input', icon && 'input--with-icon', round && 'input--round', className)}
          value={value}
          aria-invalid={error ? true : undefined}
          // Points screen readers at the message, instead of leaving the
          // field "invalid" with no explanation.
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />

        {onClear && value ? (
          <button type="button" className="input-wrap__clear" onClick={onClear} aria-label="Clear">
            <Icon name="close" size={14} />
          </button>
        ) : null}
      </div>

      {error && (
        <span className="field__error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
