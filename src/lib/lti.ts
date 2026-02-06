/**
 * LTI 1.3 Integration
 */

interface LTILaunchData { sub: string; name: string; email?: string; 'https://purl.imsglobal.org/spec/lti/claim/roles': string[]; }

export function parseLTIToken(token: string): LTILaunchData | null {
  try { return JSON.parse(atob(token.split('.')[1])); } catch { return null; }
}

export function mapLTIRole(roles: string[]): string {
  if (roles.some(r => r.includes('Administrator'))) return 'admin';
  if (roles.some(r => r.includes('Instructor'))) return 'instructor';
  return 'student';
}
