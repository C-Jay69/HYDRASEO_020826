# HYDRASEO API Contracts

## Authentication APIs

### POST /api/auth/register
Request:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
Response: `{ access_token, token_type, user }`

### POST /api/auth/login
Request:
```json
{
  "email": "string",
  "password": "string"
}
```
Response: `{ access_token, token_type, user }`

### GET /api/auth/me
Headers: `Authorization: Bearer {token}`
Response: User object

## Articles APIs

### GET /api/articles
Query params: `status`, `search`, `skip`, `limit`
Response: List of articles

### POST /api/articles
Request:
```json
{
  "title": "string",
  "keywords": ["string"],
  "tone": "professional|casual|friendly|fun|viral",
  "language": "en",
  "word_count_target": 1500,
  "fun_mode": false
}
```
Response: Generated article with AI content

### GET /api/articles/{id}
Response: Article object

### PUT /api/articles/{id}
Request: Partial article update
Response: Updated article

### DELETE /api/articles/{id}
Response: Success message

### POST /api/articles/{id}/export
Query: `export_format=markdown|html|json|pdf`
Response: Export data with filename

## AI Services APIs

### POST /api/ai/keywords
Request:
```json
{
  "seed_keyword": "string",
  "count": 20
}
```
Response: List of keywords with volume, difficulty, relevance

### POST /api/ai/competitors
Request:
```json
{
  "keyword": "string",
  "count": 5
}
```
Response: SERP results, suggested outline, content gaps

### POST /api/ai/seo-analysis
Request:
```json
{
  "content": "string",
  "target_keyword": "string"
}
```
Response: SEO score, keyword density, suggestions

### POST /api/ai/rewrite
Request:
```json
{
  "content": "string",
  "tone": "string",
  "humanize": false
}
```
Response: Rewritten content

## Templates APIs

### GET /api/templates
Query: `category` (optional)
Response: List of 20+ templates

### GET /api/templates/categories
Response: List of categories

### GET /api/templates/{id}
Response: Template details

## Analytics API

### GET /api/analytics
Response: User dashboard analytics

## Pricing API (Public)

### GET /api/pricing
Response: 5 pricing plans

## Mock Data in Frontend

Mock data is stored in `/app/frontend/src/data/mock.js`:
- `navLinks` - Navigation items
- `trustBadges` - Rating badges
- `features` - Feature cards
- `howItWorks` - Step-by-step guide
- `benefits` - Statistics
- `productShowcase` - Product sections
- `testimonials` - User testimonials
- `faqData` - FAQ items
- `pricingPlans` - Pricing tiers
- `footerLinks` - Footer navigation

## Frontend Integration

- Auth Context: `/app/frontend/src/context/AuthContext.jsx`
- Theme Context: `/app/frontend/src/context/ThemeContext.jsx`
- API Services: `/app/frontend/src/services/api.js`

All API calls use the BACKEND_URL from environment variable and include Bearer token for authenticated routes.
