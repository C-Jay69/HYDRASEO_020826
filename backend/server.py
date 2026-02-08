from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta
import json

# Local imports
from models import (
    User, UserCreate, UserLogin, UserUpdate, UserResponse, UserRole,
    Article, ArticleCreate, ArticleUpdate, ArticleResponse, ArticleStatus, ContentTone,
    Template, KeywordRequest, KeywordResponse, CompetitorRequest, CompetitorResponse,
    SEOAnalysisRequest, SEOAnalysisResponse, RewriteRequest, RewriteResponse,
    ExportRequest, ExportResponse, ExportFormat, AnalyticsResponse,
    CalendarEvent, CalendarEventCreate
)
from auth import hash_password, verify_password, create_access_token, get_current_user
from ai_service import ai_service
from templates_data import get_all_templates, get_template_by_id, get_templates_by_category, get_template_categories

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'hydraseo')]

# Create the main app
app = FastAPI(title="HYDRASEO API", version="1.0.0")

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/api/auth", tags=["Authentication"])
articles_router = APIRouter(prefix="/api/articles", tags=["Articles"])
ai_router = APIRouter(prefix="/api/ai", tags=["AI Services"])
templates_router = APIRouter(prefix="/api/templates", tags=["Templates"])
analytics_router = APIRouter(prefix="/api/analytics", tags=["Analytics"])
calendar_router = APIRouter(prefix="/api/calendar", tags=["Calendar"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== AUTH ROUTES ====================

@auth_router.post("/register")
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if email exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password),
        role=UserRole.FREE,
        credits_limit=5  # Free tier
    )
    
    await db.users.insert_one(user.dict())
    
    # Generate token
    token = create_access_token({"sub": user.id, "email": user.email})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse(**user.dict())
    }

@auth_router.post("/login")
async def login(credentials: UserLogin):
    """Login user"""
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, user_doc["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user_doc["id"], "email": user_doc["email"]})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse(**user_doc)
    }

@auth_router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    user_doc = await db.users.find_one({"id": current_user["sub"]})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**user_doc)

@auth_router.put("/me")
async def update_me(update_data: UserUpdate, current_user: dict = Depends(get_current_user)):
    """Update current user"""
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.utcnow()
    
    await db.users.update_one(
        {"id": current_user["sub"]},
        {"$set": update_dict}
    )
    
    user_doc = await db.users.find_one({"id": current_user["sub"]})
    return UserResponse(**user_doc)

# ==================== ARTICLES ROUTES ====================

@articles_router.get("", response_model=List[ArticleResponse])
async def get_articles(
    status: Optional[ArticleStatus] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
):
    """Get user's articles with optional filtering"""
    query = {"user_id": current_user["sub"]}
    
    if status:
        query["status"] = status.value
    
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}}
        ]
    
    cursor = db.articles.find(query).sort("created_at", -1).skip(skip).limit(limit)
    articles = await cursor.to_list(length=limit)
    return [ArticleResponse(**a) for a in articles]

@articles_router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: str, current_user: dict = Depends(get_current_user)):
    """Get single article"""
    article = await db.articles.find_one({"id": article_id, "user_id": current_user["sub"]})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return ArticleResponse(**article)

@articles_router.post("", response_model=ArticleResponse)
async def create_article(
    article_data: ArticleCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create and generate a new article using AI"""
    # Check credits
    user = await db.users.find_one({"id": current_user["sub"]})
    if user["credits_used"] >= user["credits_limit"]:
        raise HTTPException(status_code=403, detail="Credits exhausted. Please upgrade your plan.")
    
    # Create article record
    article = Article(
        user_id=current_user["sub"],
        title=article_data.title,
        keywords=article_data.keywords,
        tone=article_data.tone,
        language=article_data.language,
        template_id=article_data.template_id,
        status=ArticleStatus.GENERATING
    )
    
    await db.articles.insert_one(article.dict())
    
    try:
        # Generate content with AI
        result = await ai_service.generate_article(
            title=article_data.title,
            keywords=article_data.keywords,
            tone=article_data.tone,
            word_count=article_data.word_count_target,
            fun_mode=article_data.fun_mode
        )
        
        # Analyze SEO
        seo_result = await ai_service.analyze_seo(
            content=result["content"],
            target_keyword=article_data.keywords[0] if article_data.keywords else article_data.title
        )
        
        # Update article with generated content
        update_data = {
            "content": result["content"],
            "meta_title": result["meta_title"],
            "meta_description": result["meta_description"],
            "word_count": result["word_count"],
            "seo_score": seo_result["score"],
            "status": ArticleStatus.DRAFT.value,
            "updated_at": datetime.utcnow()
        }
        
        await db.articles.update_one({"id": article.id}, {"$set": update_data})
        
        # Update user credits
        await db.users.update_one(
            {"id": current_user["sub"]},
            {"$inc": {"credits_used": 1}}
        )
        
        # Get updated article
        updated_article = await db.articles.find_one({"id": article.id})
        return ArticleResponse(**updated_article)
        
    except Exception as e:
        logger.error(f"Article generation failed: {e}")
        await db.articles.update_one(
            {"id": article.id},
            {"$set": {"status": ArticleStatus.DRAFT.value, "content": f"Generation failed: {str(e)}"}}
        )
        raise HTTPException(status_code=500, detail=f"Article generation failed: {str(e)}")

@articles_router.put("/{article_id}", response_model=ArticleResponse)
async def update_article(
    article_id: str,
    update_data: ArticleUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update an article"""
    article = await db.articles.find_one({"id": article_id, "user_id": current_user["sub"]})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    if "status" in update_dict:
        update_dict["status"] = update_dict["status"].value
    update_dict["updated_at"] = datetime.utcnow()
    
    # Recalculate word count if content changed
    if "content" in update_dict:
        update_dict["word_count"] = len(update_dict["content"].split())
    
    await db.articles.update_one({"id": article_id}, {"$set": update_dict})
    
    updated = await db.articles.find_one({"id": article_id})
    return ArticleResponse(**updated)

@articles_router.delete("/{article_id}")
async def delete_article(article_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an article"""
    result = await db.articles.delete_one({"id": article_id, "user_id": current_user["sub"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted"}

@articles_router.post("/{article_id}/export")
async def export_article(
    article_id: str,
    export_format: ExportFormat,
    current_user: dict = Depends(get_current_user)
):
    """Export article in different formats"""
    article = await db.articles.find_one({"id": article_id, "user_id": current_user["sub"]})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    content = article["content"]
    title = article["title"]
    
    if export_format == ExportFormat.MARKDOWN:
        export_content = f"# {title}\n\n{content}"
        filename = f"{title.lower().replace(' ', '-')}.md"
    elif export_format == ExportFormat.HTML:
        # Simple markdown to HTML conversion
        html_content = content.replace("\n\n", "</p><p>").replace("\n", "<br>")
        export_content = f"<!DOCTYPE html><html><head><title>{title}</title></head><body><h1>{title}</h1><p>{html_content}</p></body></html>"
        filename = f"{title.lower().replace(' ', '-')}.html"
    elif export_format == ExportFormat.JSON:
        export_content = json.dumps({
            "title": title,
            "content": content,
            "meta_title": article.get("meta_title"),
            "meta_description": article.get("meta_description"),
            "keywords": article.get("keywords", []),
            "word_count": article.get("word_count", 0)
        }, indent=2)
        filename = f"{title.lower().replace(' ', '-')}.json"
    else:  # PDF - return markdown for now
        export_content = f"# {title}\n\n{content}"
        filename = f"{title.lower().replace(' ', '-')}.md"
    
    return ExportResponse(
        article_id=article_id,
        format=export_format,
        content=export_content,
        filename=filename
    )

# ==================== AI SERVICES ROUTES ====================

@ai_router.post("/keywords", response_model=KeywordResponse)
async def generate_keywords(
    request: KeywordRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate related keywords"""
    keywords = await ai_service.generate_keywords(
        seed_keyword=request.seed_keyword,
        count=request.count
    )
    return KeywordResponse(
        seed_keyword=request.seed_keyword,
        keywords=keywords
    )

@ai_router.post("/competitors", response_model=CompetitorResponse)
async def analyze_competitors(
    request: CompetitorRequest,
    current_user: dict = Depends(get_current_user)
):
    """Analyze SERP competitors"""
    result = await ai_service.analyze_competitors(
        keyword=request.keyword,
        count=request.count
    )
    return CompetitorResponse(
        keyword=request.keyword,
        results=result["results"],
        suggested_outline=result["suggested_outline"],
        content_gaps=result["content_gaps"]
    )

@ai_router.post("/seo-analysis", response_model=SEOAnalysisResponse)
async def analyze_seo(
    request: SEOAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """Analyze content for SEO"""
    result = await ai_service.analyze_seo(
        content=request.content,
        target_keyword=request.target_keyword
    )
    return SEOAnalysisResponse(
        score=result["score"],
        keyword_density=result["keyword_density"],
        readability_score=result["readability_score"],
        suggestions=result["suggestions"],
        issues=result["issues"]
    )

@ai_router.post("/rewrite", response_model=RewriteResponse)
async def rewrite_content(
    request: RewriteRequest,
    current_user: dict = Depends(get_current_user)
):
    """Rewrite and humanize content"""
    result = await ai_service.rewrite_content(
        content=request.content,
        tone=request.tone,
        humanize=request.humanize,
        preserve_keywords=request.preserve_keywords
    )
    return RewriteResponse(**result)

@ai_router.post("/plagiarism-check")
async def check_plagiarism(
    content: str,
    current_user: dict = Depends(get_current_user)
):
    """Check content for AI detection risk"""
    result = await ai_service.check_plagiarism(content)
    return result

# ==================== TEMPLATES ROUTES ====================

@templates_router.get("")
async def list_templates(
    category: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all templates"""
    if category:
        return get_templates_by_category(category)
    return get_all_templates()

@templates_router.get("/categories")
async def list_template_categories(current_user: dict = Depends(get_current_user)):
    """Get template categories"""
    return get_template_categories()

@templates_router.get("/{template_id}")
async def get_template(template_id: str, current_user: dict = Depends(get_current_user)):
    """Get single template"""
    template = get_template_by_id(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

# ==================== ANALYTICS ROUTES ====================

@analytics_router.get("", response_model=AnalyticsResponse)
async def get_analytics(current_user: dict = Depends(get_current_user)):
    """Get user analytics"""
    user_id = current_user["sub"]
    user = await db.users.find_one({"id": user_id})
    
    # Get article stats
    articles = await db.articles.find({"user_id": user_id}).to_list(1000)
    
    total_articles = len(articles)
    published = len([a for a in articles if a.get("status") == "published"])
    drafts = len([a for a in articles if a.get("status") == "draft"])
    total_words = sum(a.get("word_count", 0) for a in articles)
    avg_seo = sum(a.get("seo_score", 0) for a in articles) / total_articles if total_articles > 0 else 0
    
    # Status breakdown
    status_counts = {}
    for a in articles:
        status = a.get("status", "draft")
        status_counts[status] = status_counts.get(status, 0) + 1
    
    # Recent activity
    recent = sorted(articles, key=lambda x: x.get("updated_at", datetime.min), reverse=True)[:5]
    recent_activity = [
        {"type": "article", "title": a.get("title", ""), "date": a.get("updated_at")}
        for a in recent
    ]
    
    return AnalyticsResponse(
        total_articles=total_articles,
        published_articles=published,
        draft_articles=drafts,
        total_words=total_words,
        avg_seo_score=round(avg_seo, 1),
        credits_used=user.get("credits_used", 0),
        credits_remaining=user.get("credits_limit", 5) - user.get("credits_used", 0),
        articles_by_status=status_counts,
        recent_activity=recent_activity
    )

# ==================== CALENDAR ROUTES ====================

@calendar_router.get("")
async def get_calendar_events(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get calendar events"""
    query = {"user_id": current_user["sub"]}
    
    if start_date and end_date:
        query["scheduled_at"] = {"$gte": start_date, "$lte": end_date}
    
    events = await db.calendar_events.find(query).sort("scheduled_at", 1).to_list(100)
    return events

@calendar_router.post("")
async def create_calendar_event(
    event_data: CalendarEventCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create calendar event"""
    event = CalendarEvent(
        user_id=current_user["sub"],
        **event_data.dict()
    )
    await db.calendar_events.insert_one(event.dict())
    return event

@calendar_router.delete("/{event_id}")
async def delete_calendar_event(event_id: str, current_user: dict = Depends(get_current_user)):
    """Delete calendar event"""
    result = await db.calendar_events.delete_one({"id": event_id, "user_id": current_user["sub"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted"}

# ==================== ROOT ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "HYDRASEO API v1.0", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

# ==================== PRICING ROUTES ====================

@api_router.get("/pricing")
async def get_pricing():
    """Get pricing plans"""
    return {
        "plans": [
            {
                "name": "Free",
                "price": 0,
                "period": "month",
                "articles": 5,
                "features": ["5 articles/month", "Basic SEO optimization", "Email support", "Basic analytics"]
            },
            {
                "name": "Solo",
                "price": 9,
                "period": "month",
                "articles": 40,
                "features": ["40 articles/month", "All SEO features", "AI Image generation", "WordPress integration", "Priority support"]
            },
            {
                "name": "Pro",
                "price": 49,
                "period": "month",
                "articles": 300,
                "features": ["300 articles/month", "All features", "Bulk generation", "Amazon integration", "API access", "Advanced analytics"]
            },
            {
                "name": "Agency",
                "price": 99,
                "period": "month",
                "articles": 800,
                "features": ["800 articles/month", "Everything in Pro", "Team collaboration", "White-label options", "Dedicated support"]
            },
            {
                "name": "Unlimited",
                "price": 199,
                "period": "month",
                "articles": -1,
                "features": ["Unlimited articles", "All features", "Priority AI processing", "Custom API limits", "Account manager"]
            }
        ]
    }

# Include all routers
app.include_router(api_router)
app.include_router(auth_router)
app.include_router(articles_router)
app.include_router(ai_router)
app.include_router(templates_router)
app.include_router(analytics_router)
app.include_router(calendar_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
