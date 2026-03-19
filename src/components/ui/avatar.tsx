import React from 'react';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' };
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name || 'Avatar'} className={`rounded-full object-cover ${sizes[size]} ${className}`} />;
  }

  return (
    <div className={`rounded-full bg-violet-600 flex items-center justify-center font-semibold text-white ${sizes[size]} ${className}`}>
      {initials}
    </div>
  );
}
