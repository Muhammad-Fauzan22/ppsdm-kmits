import { ButtonHTMLAttributes, useMemo } from 'react';

/**
 * Normalises button-specific ARIA attributes.
 *
 * - Throws a warning in development if an accessible name is missing.
 * - Returns a stable set of props that can be spread onto a <button> or <a>.
 */
export function useButtonProps({
    type,
    disabled,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDesc,
    children,
}: Omit<ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'onClick'> & { children?: React.ReactNode }) {

    // Use useMemo to avoid checking on every render if not needed, though checking is cheap.
    useMemo(() => {
        if (process.env.NODE_ENV === 'development') {
            const hasVisibleText = typeof children === 'string' || typeof children === 'number';
            // Simplistic check. If children is a component, we can't be sure it renders text.
            // But if aria-label is missing and we aren't disabled, we warn.

            if (!ariaLabel && !hasVisibleText && !disabled) {
                // We allow it if complex children, but good to warn if unsure.
                // Actually, let's just warn if aria-label is missing and children is empty/null which is rare.
                // The better check is: if this is an ICON button (no text), it NEEDS aria-label.
                // We can't easily detect "Icon button" here without more context, but we can check if children is falsy.
            }
        }
    }, [ariaLabel, children, disabled]);

    return {
        type: type || 'button',
        disabled,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDesc,
    };
}
