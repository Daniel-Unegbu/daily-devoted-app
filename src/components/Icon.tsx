interface IconProps {
  name: string;
  fill?: boolean;
  weight?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, fill = false, weight = 300, className = '', style = {} }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}
