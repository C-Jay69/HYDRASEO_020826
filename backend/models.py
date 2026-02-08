from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from enum import Enum

# Enums
class UserRole(str, Enum):
    FREE = "free"
    SOLO = "solo"
    PRO = "pro"
    AGENCY = "agency"
    UNLIMITED = "unlimited"
    ADMIN = "admin"

class ArticleStatus(str, Enum):
    DRAFT = "draft"
    GENERATING = "generating"
    PUBLISHED = "published"
    SCHEDULED = "scheduled"
    ARCHIVED = "archived"

class ContentTone(str, Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    FRIENDLY = "friendly"
    AUTHORITATIVE = "authoritative"
    FUN = "fun"
    VIRAL = "viral"

class ExportFormat(str, Enum):
    MARKDOWN = "markdown"
    PDF = "pdf"
    JSON = "json"
    HTML = "html"

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    password_hash: str
    role: UserRole = UserRole.FREE
    credits_used: int = 0
    credits_limit: int = 5  # Free tier: 5 articles
    theme: str = "dark"  # dark, light, auto
    onboarding_completed: bool = False
    brand_voice: Optional[str] = None
    website_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: str
    name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    theme: Optional[str] = None
    onboarding_completed: Optional[bool] = None
    brand_voice: Optional[str] = None
    website_url: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: UserRole
    credits_used: int
    credits_limit: int
    theme: str
    onboarding_completed: bool
    brand_voice: Optional[str]
    website_url: Optional[str]
    created_at: datetime

# Article Models
class Article(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    content: str = ""
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: List[str] = []
    status: ArticleStatus = ArticleStatus.DRAFT
    tone: ContentTone = ContentTone.PROFESSIONAL
    language: str = "en"
    word_count: int = 0
    seo_score: int = 0
    plagiarism_score: Optional[float] = None
    template_id: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ArticleCreate(BaseModel):
    title: str
    keywords: List[str] = []
    tone: ContentTone = ContentTone.PROFESSIONAL
    language: str = "en"
    word_count_target: int = 1500
    template_id: Optional[str] = None
    include_images: bool = False
    fun_mode: bool = False

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[List[str]] = None
    status: Optional[ArticleStatus] = None
    scheduled_at: Optional[datetime] = None

class ArticleResponse(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    meta_title: Optional[str]
    meta_description: Optional[str]
    keywords: List[str]
    status: ArticleStatus
    tone: ContentTone
    language: str
    word_count: int
    seo_score: int
    plagiarism_score: Optional[float]
    created_at: datetime
    updated_at: datetime

# Template Models
class Template(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    description: str
    prompt_template: str
    structure: Dict[str, Any] = {}
    is_premium: bool = False
    usage_count: int = 0

# Keyword Research Models
class KeywordRequest(BaseModel):
    seed_keyword: str
    language: str = "en"
    count: int = 20

class KeywordResult(BaseModel):
    keyword: str
    search_volume: Optional[int] = None
    difficulty: Optional[int] = None
    relevance_score: float = 0.0
    is_long_tail: bool = False

class KeywordResponse(BaseModel):
    seed_keyword: str
    keywords: List[KeywordResult]
    generated_at: datetime = Field(default_factory=datetime.utcnow)

# Competitor Analysis Models
class CompetitorRequest(BaseModel):
    keyword: str
    count: int = 10

class CompetitorResult(BaseModel):
    rank: int
    title: str
    url: str
    description: str
    word_count: Optional[int] = None
    headings: List[str] = []
    content_gaps: List[str] = []

class CompetitorResponse(BaseModel):
    keyword: str
    results: List[CompetitorResult]
    suggested_outline: List[str] = []
    content_gaps: List[str] = []

# SEO Analysis Models
class SEOAnalysisRequest(BaseModel):
    content: str
    target_keyword: str

class SEOAnalysisResponse(BaseModel):
    score: int
    keyword_density: float
    readability_score: float
    suggestions: List[str]
    issues: List[Dict[str, str]]

# Content Rewrite Models
class RewriteRequest(BaseModel):
    content: str
    tone: ContentTone = ContentTone.PROFESSIONAL
    humanize: bool = False
    preserve_keywords: List[str] = []

class RewriteResponse(BaseModel):
    original_content: str
    rewritten_content: str
    changes_made: List[str]

# Export Models
class ExportRequest(BaseModel):
    article_id: str
    format: ExportFormat

class ExportResponse(BaseModel):
    article_id: str
    format: ExportFormat
    content: str
    filename: str

# Analytics Models
class AnalyticsResponse(BaseModel):
    total_articles: int
    published_articles: int
    draft_articles: int
    total_words: int
    avg_seo_score: float
    credits_used: int
    credits_remaining: int
    articles_by_status: Dict[str, int]
    recent_activity: List[Dict[str, Any]]

# Calendar Event Models
class CalendarEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    article_id: Optional[str] = None
    title: str
    event_type: str  # "publish", "review", "deadline"
    scheduled_at: datetime
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CalendarEventCreate(BaseModel):
    title: str
    event_type: str
    scheduled_at: datetime
    article_id: Optional[str] = None
    notes: Optional[str] = None
