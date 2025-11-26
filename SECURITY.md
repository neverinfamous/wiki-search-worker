# Security Policy

## Supported Versions

This project is currently in active development. Security updates are provided for the latest version only.

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by:

1. **Email**: writenotenow@gmail.com
2. **Subject**: [SECURITY] Wiki Search Worker Vulnerability

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: Within 24-48 hours
  - High: Within 1 week
  - Medium: Within 2 weeks
  - Low: Next release cycle

## Security Measures

### Implemented

- ✅ **API Token Scoping**: Uses minimal required permissions
- ✅ **Secrets Management**: All sensitive data stored in GitHub Secrets
- ✅ **CORS Configuration**: Controlled origins for API access
- ✅ **HTTPS Only**: All traffic encrypted via Cloudflare
- ✅ **DDoS Protection**: Cloudflare WAF with rate limiting
- ✅ **Input Validation**: Search queries sanitized
- ✅ **Secret Scanning**: GitHub secret scanning with push protection enabled
- ✅ **CodeQL Analysis**: Automated security vulnerability scanning
- ✅ **Dependabot**: Automated dependency vulnerability scanning

### Best Practices

1. **Never commit secrets** - Use GitHub Secrets or environment variables
2. **Regular updates** - Keep dependencies up to date via Dependabot
3. **Review PRs** - All changes reviewed before merging
4. **Minimal permissions** - API tokens scoped to required operations only
5. **Monitor logs** - Review Cloudflare Worker logs regularly

## Known Security Considerations

### Rate Limiting

Two-tier rate limiting is implemented via Cloudflare WAF:
- **Burst Protection**: 20 requests per 10 seconds
- **Sustained Protection**: 100 requests per minute

### Data Sources

- Wiki content sourced from public GitHub wiki repository
- All data indexed in Cloudflare AI Search (AutoRAG)
- R2 bucket contains markdown files only

### Third-Party Services

- **Cloudflare Workers**: Serverless platform (SOC 2 Type II certified)
- **Cloudflare R2**: Object storage (SOC 2 Type II certified)
- **Cloudflare AI Search**: Managed search service
- **GitHub Actions**: CI/CD platform (SOC 2 Type II certified)

## Disclosure Policy

- Security issues will be disclosed publicly after a fix is available
- Credit will be given to reporters (if desired)
- Severity ratings follow CVSS v3.1 guidelines

## Contact

For general questions about security:
- Email: writenotenow@gmail.com
- GitHub: @neverinfamous

---

**Last Updated**: November 26, 2025

