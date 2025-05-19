import * as React from 'react';
import { cn } from '@/lib/utils'; 

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline';
}

function Badge({ className, variant, ...props }: BadgeProps) {
  const variantClasses = {
    default: 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'text-foreground',
  };

  const classes = cn(
    variantClasses.default,
    variant ? variantClasses[variant] : variantClasses.default,
    className
  );

  return (
    <span className={classes} {...props}>
      {props.children}
    </span>
  );
}

export { Badge };
