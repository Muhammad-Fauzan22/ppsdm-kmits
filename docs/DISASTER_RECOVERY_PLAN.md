# Disaster Recovery Plan - PPSDM KMITS

## Overview

This document outlines the disaster recovery procedures for the PPSDM KMITS platform to ensure business continuity in case of system failures, data loss, or security incidents.

## Recovery Objectives

- **RTO (Recovery Time Objective)**: 4 hours for critical services
- **RPO (Recovery Point Objective)**: 1 hour maximum data loss
- **Availability Target**: 99.9% uptime (8.76 hours downtime/year)

## Disaster Scenarios & Response

### Scenario 1: Database Corruption or Loss

#### Detection
- Automated alerts from Supabase monitoring
- User reports of data inconsistencies
- Failed database health checks

#### Response Steps

1. **Immediate (0-15 minutes)**
   ```bash
   # Stop all write operations
   # Switch to read-only mode via feature flag
   ```

2. **Assessment (15-30 minutes)**
   - Identify corruption scope
   - Check backup availability
   - Determine last known good state

3. **Recovery (30-120 minutes)**
   ```bash
   # Option A: Point-in-time recovery
   supabase db restore --target-time "2024-02-08T10:00:00Z"
   
   # Option B: From backup
   supabase db restore --backup-id <backup-id>
   ```

4. **Verification (120-180 minutes)**
   - Run data integrity checks
   - Verify user data consistency
   - Test critical user flows

5. **Restoration (180-240 minutes)**
   - Resume normal operations
   - Monitor for anomalies
   - Communicate to users

### Scenario 2: Application Deployment Failure

#### Detection
- Failed health checks post-deployment
- Increased error rates
- User complaints

#### Response Steps

1. **Immediate Rollback (0-5 minutes)**
   ```bash
   # Vercel instant rollback
   vercel --version <previous-stable-version>
   
   # Or via GitHub
   git revert HEAD
   git push origin main
   ```

2. **Assessment (5-30 minutes)**
   - Review deployment logs
   - Identify root cause
   - Check database migration status

3. **Hotfix or Roll-forward (30-120 minutes)**
   - Fix identified issues
   - Test in staging
   - Deploy corrected version

### Scenario 3: Security Breach

#### Detection
- Unauthorized access alerts
- Unusual data access patterns
- Security scan failures

#### Response Steps

1. **Immediate Containment (0-15 minutes)**
   ```bash
   # Revoke all active sessions
   # Enable maintenance mode
   # Block suspicious IP addresses
   ```

2. **Investigation (15-60 minutes)**
   - Review access logs
   - Identify compromised data
   - Assess breach scope

3. **Remediation (60-180 minutes)**
   - Patch security vulnerabilities
   - Reset compromised credentials
   - Implement additional security measures

4. **Recovery (180-240 minutes)**
   - Restore from clean backup if needed
   - Verify system integrity
   - Resume operations

5. **Post-Incident (24-72 hours)**
   - Security audit
   - User notification (if required by UU PDP)
   - Process improvement

### Scenario 4: Third-Party Service Outage (Supabase/Vercel)

#### Response Steps

1. **Detection**
   - Monitor status pages
   - Automated health checks
   - User reports

2. **Mitigation**
   - Enable offline mode if applicable
   - Display maintenance page
   - Queue user actions for later processing

3. **Communication**
   - Update status page
   - Notify users via email/SMS
   - Post on social media

4. **Recovery**
   - Monitor third-party status
   - Gradually restore services
   - Verify all systems operational

## Backup Strategy

### Database Backups

```sql
-- Automated daily backups (managed by Supabase)
-- Manual backup before major deployments
-- Point-in-time recovery enabled
```

**Backup Schedule:**
- **Daily**: Automated full backup (00:00 WIB)
- **Weekly**: Retain 4 weekly backups
- **Monthly**: Retain 12 monthly backups
- **Point-in-time**: 7 days recovery window

### Code Backups

- **Primary**: GitHub repository
- **Secondary**: Local clones on team machines
- **Release tags**: All production deployments tagged

### Asset Backups

- **Images/Files**: Supabase Storage with replication
- **Static assets**: Vercel Edge Network (global CDN)

## Recovery Procedures

### Database Recovery

```bash
# 1. List available backups
supabase backups list

# 2. Restore to specific point in time
supabase db restore --target-time "2024-02-08T10:00:00Z"

# 3. Verify restoration
supabase db dump --data-only > verification.sql

# 4. Resume operations
# Update DNS/load balancer to point to recovered instance
```

### Application Recovery

```bash
# 1. Identify last stable version
git log --oneline --tags | head -20

# 2. Rollback to stable version
git checkout <stable-tag>
vercel --prod

# 3. Verify deployment
curl -f https://ppsdm.its.ac.id/api/health
```

## Communication Plan

### Internal Communication

| Role | Responsibility | Contact |
|------|---------------|---------|
| Tech Lead | Overall coordination | tech-lead@ppsdm.its.ac.id |
| Backend Lead | Database recovery | backend@ppsdm.its.ac.id |
| Frontend Lead | Application recovery | frontend@ppsdm.its.ac.id |
| DevOps | Infrastructure | devops@ppsdm.its.ac.id |

### External Communication

**User Notification Templates:**

1. **Maintenance Mode**
   ```
   PPSDM KMITS sedang dalam pemeliharaan.
   Estimasi waktu: 2 jam
   Mohon maaf atas ketidaknyamanannya.
   ```

2. **Data Incident (UU PDP Compliance)**
   ```
   Kami menginformasikan adanya insiden keamanan data.
   Data yang terdampak: [scope]
   Langkah yang kami ambil: [actions]
   Hubungi kami di: privacy@ppsdm.its.ac.id
   ```

## Testing & Validation

### Quarterly DR Drills

1. **Tabletop Exercise**
   - Walk through scenarios
   - Validate procedures
   - Update documentation

2. **Technical Drill**
   - Test backup restoration
   - Verify rollback procedures
   - Measure actual RTO/RPO

3. **Post-Drill Review**
   - Document lessons learned
   - Update procedures
   - Train team members

## Monitoring & Alerting

### Critical Alerts

```yaml
Database:
  - Connection failures > 5 minutes
  - Replication lag > 30 seconds
  - Storage capacity > 85%

Application:
  - Error rate > 1%
  - Response time > 2 seconds
  - 5xx errors > 10/minute

Security:
  - Failed login attempts > 100/hour
  - Unusual data access patterns
  - SSL certificate expiration < 7 days
```

### Alert Channels

1. **Slack**: #ppsdm-alerts (immediate)
2. **Email**: on-call@ppsdm.its.ac.id (immediate)
3. **SMS**: On-call engineer (critical only)
4. **PagerDuty**: For 24/7 escalation

## Documentation & Resources

### Runbooks

1. [Database Recovery Runbook](./runbooks/database-recovery.md)
2. [Application Rollback Runbook](./runbooks/application-rollback.md)
3. [Security Incident Response](./runbooks/security-incident.md)

### Contact Information

- **Supabase Support**: support@supabase.io
- **Vercel Support**: support@vercel.com
- **ITS IT Helpdesk**: helpdesk@its.ac.id

## Review & Updates

- **Monthly**: Review backup integrity
- **Quarterly**: DR drill and plan update
- **Annually**: Full plan review and approval

---

**Last Updated**: 2024-02-08  
**Next Review**: 2024-05-08  
**Document Owner**: Tech Lead PPSDM KMITS
