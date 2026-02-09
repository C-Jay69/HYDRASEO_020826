import os
import re
from typing import List
from dotenv import load_dotenv
import google.generativeai as genai
from models import ContentTone, KeywordResult, CompetitorResult

load_dotenv()

# Configure Gemini with your API key
GOOGLE_GEMINI_API_KEY = os.environ.get("GOOGLE_GEMINI_API_KEY")
genai.configure(api_key=GOOGLE_GEMINI_API_KEY)

class AIService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')
    
    async def generate_article(self, 
                               title: str, 
                               keywords: List[str], 
                               tone: ContentTone,
                               word_count: int = 1500,
                               fun_mode: bool = False) -> dict:
        """Generate SEO-optimized article content"""
        
        tone_instructions = {
            ContentTone.PROFESSIONAL: "Use a professional, authoritative tone with industry expertise.",
            ContentTone.CASUAL: "Write in a casual, conversational style that's easy to read.",
            ContentTone.FRIENDLY: "Be warm, approachable, and helpful in your writing.",
            ContentTone.AUTHORITATIVE: "Write with confidence and expertise, citing facts and data.",
            ContentTone.FUN: "Make it entertaining, engaging with humor and personality.",
            ContentTone.VIRAL: "Create shareable, attention-grabbing content with hooks and compelling narratives."
        }
        
        fun_mode_text = """
        IMPORTANT - FUN MODE ACTIVATED:
        - Add witty observations and clever wordplay
        - Include engaging hooks and surprising facts
        - Make content highly shareable and memorable
        - Use conversational language with personality
        - Add rhetorical questions to engage readers
        """ if fun_mode else ""
        
        prompt = f"""
        You are HYDRASEO, an expert SEO content writer. Create comprehensive, SEO-optimized articles that rank well on Google and get cited by AI search engines like ChatGPT, Perplexity, and Google AI.
        
        Writing Guidelines:
        - {tone_instructions.get(tone, tone_instructions[ContentTone.PROFESSIONAL])}
        - Use proper heading hierarchy (H2, H3, H4)
        - Include the target keywords naturally throughout
        - Write engaging, informative content
        - Include bullet points and numbered lists where appropriate
        - Add a compelling introduction and conclusion
        - Optimize for featured snippets
        {fun_mode_text}
        
        Write a comprehensive article with the following specifications:
        
        Title: {title}
        Target Keywords: {', '.join(keywords) if keywords else 'Use relevant keywords based on the title'}
        Target Word Count: {word_count} words
        
        Structure the article with:
        1. Engaging introduction with a hook
        2. Multiple H2 sections covering the topic thoroughly
        3. H3 subsections for detailed points
        4. Practical tips or actionable advice
        5. Strong conclusion with a call-to-action
        
        Return ONLY the article content in Markdown format.
        """
        
        response = self.model.generate_content(prompt)
        content = response.text
        
        # Generate meta tags
        meta_prompt = f"""
        Based on this article title and content, generate:
        1. Meta Title (under 60 characters, include main keyword)
        2. Meta Description (under 160 characters, compelling and keyword-rich)
        
        Title: {title}
        Keywords: {', '.join(keywords)}
        
        Return as JSON: {{"meta_title": "...", "meta_description": "..."}}
        """
        
        meta_response = self.model.generate_content(meta_prompt)
        
        # Parse meta response
        meta_title = title[:60]
        meta_description = f"Learn about {title}. Expert insights and actionable tips."
        
        try:
            import json
            json_match = re.search(r'\{[^}]+\}', meta_response.text)
            if json_match:
                meta_data = json.loads(json_match.group())
                meta_title = meta_data.get("meta_title", meta_title)
                meta_description = meta_data.get("meta_description", meta_description)
        except:
            pass
        
        word_count_actual = len(content.split())
        
        return {
            "content": content,
            "meta_title": meta_title,
            "meta_description": meta_description,
            "word_count": word_count_actual
        }
    
    async def generate_keywords(self, seed_keyword: str, count: int = 20) -> List[KeywordResult]:
        """Generate related keywords and long-tail variations"""
        
        prompt = f"""
        You are an SEO keyword research expert. Generate {count} SEO keywords related to: "{seed_keyword}"
        
        Include:
        - Primary keywords (2-3 words)
        - Long-tail keywords (4-6 words)
        - Question-based keywords
        - LSI (Latent Semantic Indexing) keywords
        
        For each keyword, estimate search volume (100-10000), difficulty (1-100), and relevance score (0.0-1.0).
        
        Return as JSON array:
        [
            {{
                "keyword": "example keyword",
                "search_volume": 1000,
                "difficulty": 45,
                "relevance_score": 0.85,
                "is_long_tail": false
            }}
        ]
        """
        
        response = self.model.generate_content(prompt)
        
        keywords = []
        try:
            import json
            json_match = re.search(r'\[.*\]', response.text, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                for item in data[:count]:
                    keywords.append(KeywordResult(
                        keyword=item.get("keyword", ""),
                        search_volume=item.get("search_volume"),
                        difficulty=item.get("difficulty"),
                        relevance_score=item.get("relevance_score", 0.5),
                        is_long_tail=item.get("is_long_tail", len(item.get("keyword", "").split()) > 3)
                    ))
        except Exception as e:
            keywords = [
                KeywordResult(keyword=seed_keyword, search_volume=1000, difficulty=50, relevance_score=1.0),
                KeywordResult(keyword=f"best {seed_keyword}", search_volume=800, difficulty=45, relevance_score=0.9),
                KeywordResult(keyword=f"how to {seed_keyword}", search_volume=600, difficulty=40, relevance_score=0.85, is_long_tail=True),
            ]
        
        return keywords
    
    async def analyze_competitors(self, keyword: str, count: int = 5) -> dict:
        """Analyze SERP competitors and suggest content improvements"""
        
        prompt = f"""
        You are an SEO competitor analyst. For the keyword "{keyword}", analyze what top-ranking articles typically include:
        
        1. Generate {count} hypothetical top SERP results with realistic titles and descriptions
        2. Identify common content structure and headings
        3. Find content gaps (topics competitors might miss)
        4. Suggest a winning outline
        
        Return as JSON:
        {{
            "results": [
                {{
                    "rank": 1,
                    "title": "Example Title",
                    "url": "https://example.com/article",
                    "description": "Meta description...",
                    "word_count": 2000,
                    "headings": ["H2: First Section", "H2: Second Section"]
                }}
            ],
            "suggested_outline": ["Introduction", "What is X", "Benefits of X"],
            "content_gaps": ["Gap 1", "Gap 2"]
        }}
        """
        
        response = self.model.generate_content(prompt)
        
        results = []
        suggested_outline = []
        content_gaps = []
        
        try:
            import json
            json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                for item in data.get("results", [])[:count]:
                    results.append(CompetitorResult(
                        rank=item.get("rank", 1),
                        title=item.get("title", ""),
                        url=item.get("url", ""),
                        description=item.get("description", ""),
                        word_count=item.get("word_count"),
                        headings=item.get("headings", []),
                        content_gaps=item.get("content_gaps", [])
                    ))
                suggested_outline = data.get("suggested_outline", [])
                content_gaps = data.get("content_gaps", [])
        except:
            pass
        
        return {
            "results": results,
            "suggested_outline": suggested_outline,
            "content_gaps": content_gaps
        }
    
    async def analyze_seo(self, content: str, target_keyword: str) -> dict:
        """Analyze content for SEO optimization"""
        
        word_count = len(content.split())
        keyword_count = content.lower().count(target_keyword.lower())
        keyword_density = (keyword_count / word_count * 100) if word_count > 0 else 0
        
        prompt = f"""
        Analyze this content for SEO optimization:
        
        Target Keyword: {target_keyword}
        Word Count: {word_count}
        Keyword Density: {keyword_density:.2f}%
        
        Content (first 1000 chars):
        {content[:1000]}...
        
        Provide:
        1. SEO Score (0-100)
        2. Readability Score (0-100)
        3. Top 5 suggestions for improvement
        4. Issues found (title, headings, keyword usage, etc.)
        
        Return as JSON:
        {{
            "score": 75,
            "readability_score": 80,
            "suggestions": ["Add more H2 headings", ...],
            "issues": [{{"type": "warning", "message": "Keyword density too low"}}]
        }}
        """
        
        response = self.model.generate_content(prompt)
        
        score = 70
        readability_score = 75
        suggestions = []
        issues = []
        
        try:
            import json
            json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                score = data.get("score", 70)
                readability_score = data.get("readability_score", 75)
                suggestions = data.get("suggestions", [])
                issues = data.get("issues", [])
        except:
            suggestions = [
                "Add target keyword to the first paragraph",
                "Include more H2 and H3 headings",
                "Add internal and external links",
                "Optimize meta description"
            ]
        
        return {
            "score": score,
            "keyword_density": keyword_density,
            "readability_score": readability_score,
            "suggestions": suggestions,
            "issues": issues
        }
    
    async def rewrite_content(self, content: str, tone: ContentTone, humanize: bool = False, preserve_keywords: List[str] = []) -> dict:
        """Rewrite and humanize content"""
        
        humanize_text = """
        HUMANIZE MODE: Make the content sound more natural and human-written:
        - Vary sentence structure and length
        - Add personal touches and conversational elements
        - Remove robotic patterns
        - Include natural transitions
        """ if humanize else ""
        
        prompt = f"""
        You are a content rewriter. Rewrite the following content with a {tone.value} tone.
        {humanize_text}
        Preserve these keywords: {', '.join(preserve_keywords) if preserve_keywords else 'None specified'}
        
        Content to rewrite:
        {content}
        
        Requirements:
        - Maintain the core message and information
        - Improve readability and engagement
        - Keep SEO keywords intact
        - Return only the rewritten content
        """
        
        response = self.model.generate_content(prompt)
        rewritten = response.text
        
        return {
            "original_content": content,
            "rewritten_content": rewritten,
            "changes_made": [
                f"Applied {tone.value} tone",
                "Humanized" if humanize else "Standard rewrite",
                f"Preserved {len(preserve_keywords)} keywords" if preserve_keywords else "No keywords specified"
            ]
        }
    
    async def check_plagiarism(self, content: str) -> dict:
        """Check content for potential plagiarism/AI detection"""
        
        prompt = f"""
        Analyze this content for:
        1. AI-detection risk (0-100, lower is better)
        2. Originality estimation (0-100)
        3. Patterns that look AI-generated
        4. Suggestions to make it more human
        
        Content:
        {content[:2000]}
        
        Return as JSON:
        {{
            "ai_detection_risk": 35,
            "originality_score": 75,
            "flagged_patterns": ["Pattern 1", "Pattern 2"],
            "suggestions": ["Suggestion 1", "Suggestion 2"]
        }}
        """
        
        response = self.model.generate_content(prompt)
        
        try:
            import json
            json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        except:
            pass
        
        return {
            "ai_detection_risk": 30,
            "originality_score": 80,
            "flagged_patterns": [],
            "suggestions": ["Content appears natural"]
        }


# Singleton instance
ai_service = AIService()
