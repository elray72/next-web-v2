/**
 * Button Component
 *
 * Built with Base UI for accessibility and flexibility.
 * Styled with CSS variables from tenant themes.
 */

'use client';

import { Button as BaseButton } from '@base-ui/react';
import { clsx } from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './button.module.scss';

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    /**
     * Button visual style variant
     */
    variant?:
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'positive'
    | 'warning'
    | 'info'
    | 'outline'
    | 'ghost';
    /**
     * Button size
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Show button in loading state
     */
    loading?: boolean;
}

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <BaseButton
            {...props}
            disabled={disabled || loading}
            className={clsx(
                styles.button,
                styles[variant],
                styles[size],
                loading && styles.loading,
                className
            )}
        >
            {loading && <span className={styles.spinner} aria-hidden="true" />}
            <span className={clsx(loading && styles.content)}>{children}</span>
        </BaseButton>
    );
}
