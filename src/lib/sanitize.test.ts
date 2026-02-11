import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  sanitizeHtml, 
  sanitizeRichText, 
  stripHtml, 
  sanitizeUrl, 
  sanitizeSqlInput,
  validateAndSanitizeInput,
  useSanitizedHtml,
  useSanitizedRichText 
} from './sanitize';

describe('sanitizeHtml', () => {
  it('should allow safe HTML tags', () => {
    const input = '<p>Hello <strong>world</strong></p>';
    const result = sanitizeHtml(input);
    expect(result).toBe('<p>Hello <strong>world</strong></p>');
  });

  it('should remove script tags', () => {
    const input = '<p>Hello</p><script>alert("xss")</script>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('<script>');
    expect(result).toBe('<p>Hello</p>');
  });

  it('should remove onclick attributes', () => {
    const input = '<p onclick="alert(1)">Click me</p>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('onclick');
    expect(result).toBe('<p>Click me</p>');
  });

  it('should remove javascript: URLs', () => {
    const input = '<a href="javascript:alert(1)">Link</a>';
    const result = sanitizeHtml(input);
    expect(result).not.toContain('javascript:');
  });

  it('should handle empty input', () => {
    expect(sanitizeHtml('')).toBe('');
    expect(sanitizeHtml(null as any)).toBe('');
    expect(sanitizeHtml(undefined as any)).toBe('');
  });

  it('should allow allowed tags only', () => {
    const input = '<div><script>bad</script><p>good</p></div>';
    const result = sanitizeHtml(input);
    expect(result).toContain('<p>good</p>');
    expect(result).not.toContain('<script>');
  });
});

describe('sanitizeRichText', () => {
  it('should allow table tags', () => {
    const input = '<table><tr><td>Cell</td></tr></table>';
    const result = sanitizeRichText(input);
    expect(result).toContain('<table>');
    expect(result).toContain('<tr>');
    expect(result).toContain('<td>Cell</td>');
  });

  it('should still remove script tags', () => {
    const input = '<table><script>alert(1)</script><tr><td>Cell</td></tr></table>';
    const result = sanitizeRichText(input);
    expect(result).not.toContain('<script>');
    expect(result).toContain('<td>Cell</td>');
  });

  it('should handle complex HTML', () => {
    const input = `
      <table>
        <thead>
          <tr><th>Header 1</th><th>Header 2</th></tr>
        </thead>
        <tbody>
          <tr><td>Data 1</td><td>Data 2</td></tr>
        </tbody>
      </table>
    `;
    const result = sanitizeRichText(input);
    expect(result).toContain('<table>');
    expect(result).toContain('<thead>');
    expect(result).toContain('<tbody>');
    expect(result).toContain('<th>Header 1</th>');
  });
});

describe('stripHtml', () => {
  it('should remove all HTML tags', () => {
    const input = '<p>Hello <strong>world</strong></p>';
    const result = stripHtml(input);
    expect(result).toBe('Hello world');
  });

  it('should handle nested tags', () => {
    const input = '<div><p>Text <span>more</span> text</p></div>';
    const result = stripHtml(input);
    expect(result).toBe('Text more text');
  });

  it('should handle empty input', () => {
    expect(stripHtml('')).toBe('');
  });
});

describe('sanitizeUrl', () => {
  it('should allow http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com');
  });

  it('should allow https URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com');
  });

  it('should block javascript: URLs', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(sanitizeUrl('javascript:alert(1)')).toBe('');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should block data: URLs', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    consoleSpy.mockRestore();
  });

  it('should block vbscript: URLs', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('');
    consoleSpy.mockRestore();
  });

  it('should trim whitespace', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com');
  });

  it('should handle empty input', () => {
    expect(sanitizeUrl('')).toBe('');
    expect(sanitizeUrl(null as any)).toBe('');
  });
});

describe('sanitizeSqlInput', () => {
  it('should remove SQL keywords', () => {
    const input = "SELECT * FROM users WHERE id = 1";
    const result = sanitizeSqlInput(input);
    expect(result).not.toContain('SELECT');
    expect(result).not.toContain('FROM');
    expect(result).not.toContain('WHERE');
  });

  it('should remove comments', () => {
    const input = "data -- comment";
    const result = sanitizeSqlInput(input);
    expect(result).not.toContain('--');
  });

  it('should remove semicolons', () => {
    const input = "data; DROP TABLE users";
    const result = sanitizeSqlInput(input);
    expect(result).not.toContain(';');
  });

  it('should remove null bytes', () => {
    const input = "data\x00more";
    const result = sanitizeSqlInput(input);
    expect(result).not.toContain('\x00');
  });

  it('should handle normal text', () => {
    const input = "This is normal text without SQL";
    const result = sanitizeSqlInput(input);
    expect(result).toBe("This is normal text without SQL");
  });
});

describe('validateAndSanitizeInput', () => {
  it('should return sanitized string for valid input', () => {
    const result = validateAndSanitizeInput('Hello World');
    expect(result).toBe('Hello World');
  });

  it('should trim whitespace', () => {
    const result = validateAndSanitizeInput('  Hello World  ');
    expect(result).toBe('Hello World');
  });

  it('should remove HTML by default', () => {
    const result = validateAndSanitizeInput('<p>Hello</p>');
    expect(result).toBe('Hello');
  });

  it('should allow HTML when specified', () => {
    const result = validateAndSanitizeInput('<p>Hello</p>', { allowHtml: true });
    expect(result).toBe('<p>Hello</p>');
  });

  it('should truncate long strings', () => {
    const longString = 'a'.repeat(2000);
    const result = validateAndSanitizeInput(longString, { maxLength: 1000 });
    expect(result?.length).toBe(1000);
  });

  it('should return null for empty required fields', () => {
    const result = validateAndSanitizeInput('', { required: true });
    expect(result).toBeNull();
  });

  it('should return empty string for empty optional fields', () => {
    const result = validateAndSanitizeInput('', { required: false });
    expect(result).toBe('');
  });

  it('should handle null input', () => {
    expect(validateAndSanitizeInput(null as any)).toBe('');
    expect(validateAndSanitizeInput(null as any, { required: true })).toBeNull();
  });
});

describe('useSanitizedHtml', () => {
  it('should return object with __html property', () => {
    const input = '<p>Hello</p>';
    const result = useSanitizedHtml(input);
    expect(result).toHaveProperty('__html');
    expect(result.__html).toBe('<p>Hello</p>');
  });

  it('should sanitize the input', () => {
    const input = '<p>Hello</p><script>alert(1)</script>';
    const result = useSanitizedHtml(input);
    expect(result.__html).toBe('<p>Hello</p>');
    expect(result.__html).not.toContain('<script>');
  });
});

describe('useSanitizedRichText', () => {
  it('should allow rich content', () => {
    const input = '<table><tr><td>Cell</td></tr></table>';
    const result = useSanitizedRichText(input);
    expect(result.__html).toContain('<table>');
  });

  it('should still sanitize dangerous content', () => {
    const input = '<table><script>alert(1)</script><tr><td>Cell</td></tr></table>';
    const result = useSanitizedRichText(input);
    expect(result.__html).not.toContain('<script>');
  });
});