import { ReactElement, type PropsWithChildren } from 'react';
type style = 'default' | 'soft' | 'outline' | 'gradient';
type color =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'accent'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'transparent';
type state = 'default' | 'active' | 'disabled';
type size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type modifier =
  | 'default'
  | 'glass'
  | 'wide'
  | 'text'
  | 'block'
  | 'circle'
  | 'square'
  | 'rounded'
  | "rounded_block"

interface ButtonProps {
  style?: style;
  color?: color;
  state?: state;
  size?: size;
  modifier?: modifier;
  onClick: () => void;
  label?: string;
  icon?: ReactElement;
}

export default function Button({
  style = 'default',
  color = 'primary',
  state = 'default',
  size = 'md',
  modifier = 'default',
  onClick,
  label,
  icon,
  ...props
}: PropsWithChildren<ButtonProps>): React.ReactElement {
  const styles: Record<style, string> = {
    default: '',
    soft: 'btn-soft',
    outline: 'btn-outline',
    gradient: 'btn-gradient',
  };
  const colors: Record<color, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    tertiary: 'btn-tertiary',
    accent: 'btn-accent',
    info: 'bnt-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
    transparent:
      'bg-transparent text-base-content/40 hover:text-base-content/70 active:text-base-content/60 active:bg-base-content/5',
  };
  const states: Record<state, string> = {
    default: '',
    active: 'btn-active',
    disabled: 'btn-disabled',
  };
  const sizes: Record<size, string> = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl',
  };
  const modifiers: Record<modifier, string> = {
    default: '',
    glass: 'glass',
    wide: 'btn-wide',
    text: 'btn-text',
    block: 'btn-block',
    circle: 'btn-circle',
    square: 'btn-square',
    rounded: 'rounded-full',
    rounded_block: 'rounded-full btn-block',
  };
  const BtnClasses =
    `btn ${styles[style]} ${colors[color]} ${states[state]} ${sizes[size]} ${modifiers[modifier]}`.trim();
  return (
    <>
      <button type="button" {...props} className={BtnClasses} onClick={onClick}>
        {' '}
        {label ? (
          <>
            {label} {icon}
          </>
        ) : (
          icon
        )}
      </button>
    </>
  );
}
