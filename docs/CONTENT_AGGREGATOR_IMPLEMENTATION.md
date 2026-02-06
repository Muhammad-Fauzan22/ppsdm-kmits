# Netflix-Style Content Aggregator Implementation Guide

## 📋 Overview

This document provides a comprehensive guide to the Netflix-style Content Aggregator system built for PPSDM KMITS. The system automatically scrapes, categorizes, and recommends educational content across 9 development dimensions for ITS students.

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTENT AGGREGATOR SYSTEM                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │   SCRAPERS   │───▶│  AI PROCESSOR │───▶│   DATABASE   │     │
│  │  (Python)    │    │  (BERT/NLP)   │    │  (Supabase)  │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│         │                    │                    │             │
│         ▼                    ▼                    ▼             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │  GitHub      │    │  Quality     │    │  Next.js     │     │
│  │  Actions     │    │  Scoring     │    │  Frontend    │     │
│  │  (Cron)      │    │  (0-100)     │    │  (Netflix UI)│     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

### Database Schema
- `supabase/migrations/004_content_aggregator_schema.sql` - Complete database schema

### Python Scrapers
- `scrapers/content_orchestrator.py` - Main orchestrator with priority queues
- `scrapers/job_portal_scraper.py` - Kalibrr & Glints job scraper
- `scrapers/ai_content_processor.py` - BERT-based AI categorization
- `scrapers/its_comprehensive_scraper.py` - ITS website scraper
- `scrapers/youtube_aggregator.py` - YouTube educational content
- `scrapers/github_trending.py` - GitHub trending repositories

### Frontend Components
- `src/components/content/ContentCard.tsx` - Netflix-style content cards
- `src/components/content/ContentGrid.tsx` - Masonry/carousel layouts
- `src/app/(dashboard)/content-discovery/page.tsx` - Main discovery page

### API Routes
- `src/app/api/content/route.ts` - Content listing with filters
- `src/app/api/content/recommendations/route.ts` - Personalized recommendations

### GitHub Actions
- `.github/workflows/scraper.yml` - Automated scraping schedule

## 🗄 Database Schema

### Core Tables

#### 1. `content_sources`
Registry of all content sources with configuration and health status.

```sql
CREATE TABLE content_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  base_url VARCHAR(500) NOT NULL,
  source_type VARCHAR(50),
  scrape_frequency VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  last_scraped TIMESTAMP,
  success_rate FLOAT DEFAULT 0.0,
  config JSONB DEFAULT '{}'
);
```

#### 2. `scraped_content`
Main content table with AI-generated scores.

```sql
CREATE TABLE scraped_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url VARCHAR(500) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT,
  content_type VARCHAR(50),
  dimensions VARCHAR(50)[],
  tags JSONB DEFAULT '[]',
  author VARCHAR(200),
  publish_date TIMESTAMP,
  scrape_date TIMESTAMP DEFAULT NOW(),
  images JSONB DEFAULT '[]',
  videos JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  quality_score FLOAT DEFAULT 0.0,
  relevance_score FLOAT DEFAULT 0.0,
  engagement_score FLOAT DEFAULT 0.0,
  is_verified BOOLEAN DEFAULT FALSE
);
```

#### 3. `content_dimension_mapping`
AI categorization confidence scores.

```sql
CREATE TABLE content_dimension_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES scraped_content(id),
  dimension VARCHAR(50),
  confidence FLOAT DEFAULT 0.0,
  mapped_by VARCHAR(50) DEFAULT 'ai'
);
```

#### 4. `user_content_interactions`
User interaction tracking for recommendations.

```sql
CREATE TABLE user_content_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  content_id UUID REFERENCES scraped_content(id),
  interaction_type VARCHAR(20),
  interaction_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🤖 AI Content Processing

### BERT-Based Categorization

The system uses `facebook/bart-large-mnli` for zero-shot classification into 9 dimensions:

```python
dimensions = [
    "cognitive intellectual learning education",
    "emotional social relationships empathy",
    "spiritual values purpose mindfulness",
    "physical health fitness wellness",
    "creative innovation artistic design",
    "professional career work skills",
    "leadership influence management",
    "financial money budgeting investment",
    "environmental sustainability ecology"
]
```

### Quality Scoring Algorithm

```python
quality_score = (
    content_length_score * 0.2 +
    readability_score * 0.2 +
    source_credibility * 0.3 +
    engagement_potential * 0.3
)
```

### Duplicate Detection

Uses Sentence-BERT embeddings with cosine similarity threshold of 0.85.

## 🎨 Netflix-Style UI Components

### ContentCard Component

Features:
- Hover expansion with preview
- Dimension badges with colors
- Match percentage indicator
- Save/Share/Like actions
- Duration badge for videos
- "New" and "Trending" indicators

### ContentGrid Component

Features:
- Masonry layout for mixed content types
- Horizontal carousel for recommendations
- Infinite scroll with virtualization
- Responsive breakpoints
- Loading skeletons

### Recommendation Rows

1. **"Continue Learning"** - In-progress content
2. **"Recommended For You"** - AI-personalized
3. **"Trending at ITS"** - Popular among peers
4. **"New This Week"** - Fresh content
5. **"Because You Watched X"** - Content-based filtering

## 🔄 GitHub Actions Workflow

### Schedule
- **Daily at 2:00 AM UTC** (9:00 AM WIB)
- Manual trigger available

### Jobs
1. **ITS News Scraper** - Campus news and announcements
2. **YouTube Aggregator** - Educational videos
3. **GitHub Trending** - Tech repositories
4. **Job Portal Scraper** - Internships and jobs
5. **AI Processing** - Categorization and scoring

### Environment Variables Required
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
YOUTUBE_API_KEY=your_youtube_api_key
GITHUB_TOKEN=your_github_token
```

## 📊 Content Sources

### Academic & Research
- ITS Repository (repository.its.ac.id)
- SINTA (sinta.kemdikbud.go.id)
- Google Scholar Indonesia
- ArXiv Indonesia Papers

### Career & Industry
- LinkedIn Indonesia Jobs
- Glints (glints.com/id)
- Kalibrr (kalibrr.com)
- Tech in Asia Jobs

### Learning Resources
- Khan Academy Indonesia
- Coursera Free Courses
- YouTube EDU Channels
- Medium Indonesia Tech

### Campus & Student Life
- ITS Official Website
- BEM ITS Updates
- Himpunan Updates
- ITS Event Calendar

### Personal Development
- Psychology Today Indonesia
- Financial Literacy Blogs
- Health & Fitness ID

## 🚀 Deployment Guide

### 1. Database Setup
```bash
# Run migration
psql $SUPABASE_URL -f supabase/migrations/004_content_aggregator_schema.sql
```

### 2. Python Dependencies
```bash
pip install aiohttp supabase-py transformers torch scikit-learn beautifulsoup4
```

### 3. Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_KEY=your_service_key
YOUTUBE_API_KEY=your_youtube_key
```

### 4. GitHub Actions Setup
1. Add secrets to GitHub repository
2. Enable Actions in repository settings
3. Workflow will run automatically on schedule

### 5. Vercel Deployment
```bash
vercel --prod
```

## 📈 Performance Metrics

### Target Metrics
- **Scrape Rate**: 1000+ new content items daily
- **Categorization Accuracy**: 90%+ into correct dimensions
- **API Response Time**: < 200ms for recommendations
- **Page Load Time**: < 1 second for content discovery
- **Uptime**: 99%+ for scraper system

### Monitoring
- Scraper health dashboard at `/admin/scraper-dashboard`
- Discord webhook alerts for failures
- Supabase logs for database performance

## 🔒 Security & Ethics

### Rate Limiting
- ITS Website: 0.5 requests/second
- YouTube API: Within free quota (10,000/day)
- Job Portals: 2 seconds between requests

### Data Privacy
- User interactions anonymized for recommendations
- No personal data stored in content database
- RLS policies protect user data

### Content Filtering
- Quality threshold: 60+ score required
- Manual verification for high-engagement content
- Automatic spam/clickbait detection

## 🛠 Troubleshooting

### Common Issues

**Scraper failing**
- Check rate limits
- Verify source website hasn't changed structure
- Review scraper logs in GitHub Actions

**AI categorization inaccurate**
- Retrain with more Indonesian content samples
- Adjust confidence thresholds
- Manual review and correction

**Recommendations not personalized**
- Check user interaction tracking
- Verify dimension scores are populated
- Review recommendation algorithm weights

## 📚 API Reference

### GET /api/content
Query parameters:
- `dimension` - Filter by dimension (cognitive, emotional, etc.)
- `type` - Content type (video, article, course, job, event)
- `search` - Text search in title/description
- `sort_by` - Sorting (relevance, quality, date, trending)
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset

### GET /api/content/recommendations
Query parameters:
- `user_id` - Required user UUID
- `context` - Recommendation type (home, continue, trending, discover)
- `limit` - Number of recommendations (default: 10)

### POST /api/content
Track user interaction:
```json
{
  "content_id": "uuid",
  "interaction_type": "view|save|like|share|complete",
  "user_id": "uuid",
  "metadata": { "progress": 75 }
}
```

## 🎯 Future Enhancements

1. **Real-time Notifications** - New content alerts
2. **Mobile App** - React Native implementation
3. **Advanced Analytics** - Content performance dashboard
4. **User-generated Content** - Student submissions
5. **AI Chat Assistant** - Content recommendations via chat
6. **Offline Mode** - Service worker caching

## 📞 Support

For issues or questions:
1. Check the TODO_CONTENT_AGGREGATOR.md for known issues
2. Review scraper logs in GitHub Actions
3. Contact the PPSDM KMITS development team

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Maintained by**: PPSDM KMITS Development Team
