import crypto from 'crypto';

/**
 * CSP Nonce Generator Utility
 * Generates secure nonces for Content Security Policy
 */

// Generate a cryptographically secure nonce
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

// Generate nonce for scripts
export function generateScriptNonce(): string {
  return `script-${crypto.randomBytes(8).toString('hex')}`;
}

// Generate nonce for styles
export function generateStyleNonce(): string {
  return `style-${crypto.randomBytes(8).toString('hex')}`;
}

// Validate nonce format
export function isValidNonce(nonce: string): boolean {
  // Nonce should be base64 encoded and reasonable length
  const base64Pattern = /^[A-Za-z0-9+/=]+$/;
  return base64Pattern.test(nonce) && nonce.length >= 16 && nonce.length <= 128;
}

// Add nonce to script tag
export function addScriptNonce(html: string, nonce: string): string {
  return html.replace(/<script(?![^>]*\snonce=)/g, `<script nonce="${nonce}"`);
}

// Add nonce to style tag
export function addStyleNonce(html: string, nonce: string): string {
  return html.replace(/<style(?![^>]*\snonce=)/g, `<style nonce="${nonce}"`);
}

// Add nonce to inline styles
export function addInlineStyleNonce(html: string, nonce: string): string {
  return html.replace(/<[^>]*\sstyle="[^"]*"/g, (match) => {
    if (!match.includes('nonce=')) {
      return match.replace(/<([^>]*)/, `<$1 nonce="${nonce}"`);
    }
    return match;
  });
}
