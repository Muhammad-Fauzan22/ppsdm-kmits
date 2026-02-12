import { test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

test('renders children', () => {
  render(<Button>Save</Button>);
  const btn = screen.getByRole('button', { name: 'Save' });
  expect(btn).not.toBeNull();
  expect(btn.textContent).toContain('Save');
});

test('calls onClick when clicked', () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Click me</Button>);

  fireEvent.click(screen.getByRole('button', { name: 'Click me' }));
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('is disabled when loading', () => {
  render(<Button isLoading>Loading</Button>);
  const btn = screen.getByRole('button') as any as HTMLButtonElement;
  expect(btn.disabled).toBe(true);
});
