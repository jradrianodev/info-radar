import Image from 'next/image';

interface LogoProps {
  /** Variante de exibição da logo */
  variant?: 'dark' | 'light' | 'icon';
  /** Classe CSS adicional para o wrapper */
  className?: string;
  /** Largura em pixels (para variantes horizontal) */
  width?: number;
  /** Altura em pixels */
  height?: number;
}

/**
 * Componente de logo do InfoRadar.
 *
 * - `variant="dark"`  → logo horizontal para fundos escuros (padrão)
 * - `variant="light"` → logo horizontal para fundos claros
 * - `variant="icon"`  → somente o ícone quadrado (app icon)
 */
export default function Logo({
  variant = 'dark',
  className = '',
  width,
  height,
}: LogoProps) {
  if (variant === 'icon') {
    return (
      <Image
        src="/logo-icon.svg"
        alt="InfoRadar"
        width={width ?? 40}
        height={height ?? 40}
        className={className}
        priority
      />
    );
  }

  const src = variant === 'light' ? '/logo-light.svg' : '/logo-dark.svg';

  return (
    <Image
      src={src}
      alt="InfoRadar"
      width={width ?? 200}
      height={height ?? 50}
      className={className}
      priority
    />
  );
}
