# Security Policy

## Incident Response: API Key Exposure (RESOLVED)

**Date**: 2024
**Severity**: CRITICAL
**Status**: ✅ RESOLVED

### Summary
Multiple API keys were exposed in the repository through `.env.local` and backup files.

### Exposed Keys (REVOKED)
The following API keys were exposed and have been revoked:
- OpenAI API Key
- Supabase Anon Key & Service Role Key
- Google AI (Gemini) API Key
- GROQ API Key
- Replicate API Token
- HuggingFace API Token
- OpenRouter API Key
- SerpAPI Key
- Upstash QStash Token
- NVIDIA API Key

### Actions Taken
1. ✅ Removed `.env.local` from git tracking
2. ✅ Deleted backup files containing API keys
3. ✅ Added `.env.local` to `.gitignore`
4. ✅ Cleaned git history of sensitive files
5. ⚠️ **MANUAL ACTION REQUIRED**: Rotate all API keys immediately

### Required Actions (Do This Now!)
1. **Rotate ALL API keys** at their respective providers
2. **Review Supabase database** for unauthorized access
3. **Check API usage logs** for suspicious activity
4. **Update Vercel environment variables** with new keys
5. **Never commit `.env.local`** to git again

### Prevention Measures Implemented
- ESLint configured to warn on `console.log`
- Security-focused linting rules added
- Logger utility created for proper logging
- Backup files cleaned from repository
- CSP headers strengthened

### Contact
For security concerns, contact the development team immediately.

---

## Security Best Practices

### Environment Variables
- Never commit `.env.local` or `.env.production`
- Use strong, unique secrets for production
- Rotate keys every 90 days
- Use different keys for dev/staging/production

### Code Security
- Always sanitize user input
- Use parameterized queries (prevent SQL injection)
- Validate all API inputs with Zod schemas
- Never use `dangerouslySetInnerHTML` without sanitization
- Enable CSP headers

### Dependencies
- Run `npm audit` regularly
- Keep dependencies updated
- Use `override` in package.json for security patches
- Review new dependencies before adding

## Reporting Vulnerabilities
If you discover a security vulnerability, please report it immediately. Do not open public issues for security problems.
