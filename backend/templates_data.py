# Pre-defined templates for various content types

TEMPLATES = [
    # Blog & Content Marketing
    {
        "id": "template-blog-how-to",
        "name": "How-To Guide",
        "category": "Blog Posts",
        "description": "Step-by-step tutorial format perfect for instructional content",
        "prompt_template": "Create a comprehensive how-to guide about {topic}. Include numbered steps, tips, common mistakes to avoid, and a FAQ section.",
        "structure": {
            "sections": ["Introduction", "What You'll Need", "Step-by-Step Guide", "Pro Tips", "Common Mistakes", "FAQ", "Conclusion"]
        },
        "is_premium": False
    },
    {
        "id": "template-blog-listicle",
        "name": "Listicle (Top 10)",
        "category": "Blog Posts",
        "description": "Numbered list format great for engagement and shareability",
        "prompt_template": "Create a compelling listicle about {topic}. Include detailed descriptions for each item with pros, cons, and use cases.",
        "structure": {
            "sections": ["Introduction", "Items 1-10", "Honorable Mentions", "Conclusion"]
        },
        "is_premium": False
    },
    {
        "id": "template-blog-ultimate-guide",
        "name": "Ultimate Guide",
        "category": "Blog Posts",
        "description": "Comprehensive pillar content covering a topic in-depth",
        "prompt_template": "Create the ultimate guide to {topic}. Cover everything a beginner to advanced user needs to know.",
        "structure": {
            "sections": ["Introduction", "What is X", "Why It Matters", "How It Works", "Best Practices", "Tools & Resources", "Case Studies", "Conclusion"]
        },
        "is_premium": False
    },
    
    # Product & Reviews
    {
        "id": "template-product-review",
        "name": "Product Review",
        "category": "Reviews",
        "description": "In-depth product review with pros, cons, and verdict",
        "prompt_template": "Write a detailed review of {product}. Include features, pros, cons, pricing, and who it's best for.",
        "structure": {
            "sections": ["Overview", "Key Features", "Pros", "Cons", "Pricing", "Who Should Buy", "Verdict"]
        },
        "is_premium": False
    },
    {
        "id": "template-product-comparison",
        "name": "Product Comparison",
        "category": "Reviews",
        "description": "Side-by-side comparison of multiple products",
        "prompt_template": "Compare {product1} vs {product2}. Include features, pricing, pros/cons, and recommendations.",
        "structure": {
            "sections": ["Introduction", "Quick Comparison", "Product A Review", "Product B Review", "Feature Comparison", "Pricing", "Verdict"]
        },
        "is_premium": False
    },
    {
        "id": "template-product-roundup",
        "name": "Product Roundup",
        "category": "Reviews",
        "description": "Best X products for Y - perfect for affiliate content",
        "prompt_template": "Create a roundup of the best {products} for {audience}. Include detailed mini-reviews for each.",
        "structure": {
            "sections": ["Introduction", "How We Tested", "Top Picks", "Budget Option", "Premium Choice", "Buying Guide", "FAQ"]
        },
        "is_premium": True
    },
    
    # E-commerce
    {
        "id": "template-ecom-product-description",
        "name": "Product Description",
        "category": "E-commerce",
        "description": "Compelling product description that converts",
        "prompt_template": "Write a conversion-focused product description for {product}. Highlight benefits, features, and use cases.",
        "structure": {
            "sections": ["Headline", "Key Benefits", "Features", "Specifications", "Use Cases", "CTA"]
        },
        "is_premium": False
    },
    {
        "id": "template-ecom-category-page",
        "name": "Category Page Content",
        "category": "E-commerce",
        "description": "SEO-optimized category page content",
        "prompt_template": "Write category page content for {category}. Include introduction, buying guide, and FAQ.",
        "structure": {
            "sections": ["Category Introduction", "What to Look For", "Popular Brands", "FAQ"]
        },
        "is_premium": True
    },
    
    # SaaS & Tech
    {
        "id": "template-saas-landing",
        "name": "SaaS Landing Page",
        "category": "SaaS",
        "description": "High-converting landing page copy for software",
        "prompt_template": "Write landing page copy for {software}. Include headline, benefits, features, social proof, and CTA.",
        "structure": {
            "sections": ["Hero Section", "Problem Statement", "Solution", "Features", "Benefits", "Testimonials", "Pricing", "CTA"]
        },
        "is_premium": True
    },
    {
        "id": "template-saas-feature",
        "name": "Feature Announcement",
        "category": "SaaS",
        "description": "Announce new features to your users",
        "prompt_template": "Write a feature announcement for {feature}. Explain what it does, why it matters, and how to use it.",
        "structure": {
            "sections": ["Introduction", "What's New", "How It Works", "Use Cases", "Getting Started"]
        },
        "is_premium": False
    },
    
    # News & Updates
    {
        "id": "template-news-article",
        "name": "News Article",
        "category": "News",
        "description": "Journalistic news format with inverted pyramid",
        "prompt_template": "Write a news article about {topic}. Use journalistic style with who, what, when, where, why.",
        "structure": {
            "sections": ["Headline", "Lead Paragraph", "Key Details", "Background", "Quotes", "Future Outlook"]
        },
        "is_premium": False
    },
    {
        "id": "template-press-release",
        "name": "Press Release",
        "category": "News",
        "description": "Professional press release format",
        "prompt_template": "Write a press release announcing {announcement}. Include quotes, boilerplate, and contact info.",
        "structure": {
            "sections": ["Headline", "Subheadline", "Dateline", "Lead", "Body", "Quote", "Boilerplate", "Contact"]
        },
        "is_premium": True
    },
    
    # Email & Newsletter
    {
        "id": "template-newsletter",
        "name": "Newsletter",
        "category": "Email",
        "description": "Engaging newsletter format with multiple sections",
        "prompt_template": "Write a newsletter about {topic}. Include headline, intro, main content, tips, and CTA.",
        "structure": {
            "sections": ["Subject Line", "Preview Text", "Intro", "Main Story", "Quick Tips", "Resource of the Week", "CTA"]
        },
        "is_premium": False
    },
    {
        "id": "template-email-sequence",
        "name": "Email Sequence",
        "category": "Email",
        "description": "Multi-email nurture sequence",
        "prompt_template": "Create a 5-email sequence for {goal}. Include welcome, value, case study, offer, and follow-up.",
        "structure": {
            "sections": ["Email 1: Welcome", "Email 2: Value", "Email 3: Case Study", "Email 4: Offer", "Email 5: Follow-up"]
        },
        "is_premium": True
    },
    
    # Social Media
    {
        "id": "template-social-thread",
        "name": "Twitter/X Thread",
        "category": "Social Media",
        "description": "Viral thread format for Twitter/X",
        "prompt_template": "Create a viral thread about {topic}. Start with a hook, provide value, end with CTA.",
        "structure": {
            "sections": ["Hook Tweet", "Setup", "Main Points (5-10)", "Summary", "CTA"]
        },
        "is_premium": False
    },
    {
        "id": "template-linkedin-post",
        "name": "LinkedIn Post",
        "category": "Social Media",
        "description": "Professional LinkedIn post format",
        "prompt_template": "Write a LinkedIn post about {topic}. Use storytelling, insights, and engagement hooks.",
        "structure": {
            "sections": ["Hook", "Story/Context", "Insight", "Takeaway", "Engagement Question"]
        },
        "is_premium": False
    },
    
    # Technical
    {
        "id": "template-technical-docs",
        "name": "Technical Documentation",
        "category": "Technical",
        "description": "Clear technical documentation format",
        "prompt_template": "Write technical documentation for {feature}. Include overview, setup, usage, and troubleshooting.",
        "structure": {
            "sections": ["Overview", "Prerequisites", "Installation", "Configuration", "Usage", "Examples", "Troubleshooting", "FAQ"]
        },
        "is_premium": True
    },
    {
        "id": "template-api-docs",
        "name": "API Documentation",
        "category": "Technical",
        "description": "API endpoint documentation",
        "prompt_template": "Document the API for {endpoint}. Include request/response examples, parameters, and errors.",
        "structure": {
            "sections": ["Endpoint Overview", "Authentication", "Parameters", "Request Example", "Response Example", "Error Codes"]
        },
        "is_premium": True
    },
    
    # SEO Specific
    {
        "id": "template-seo-pillar",
        "name": "SEO Pillar Page",
        "category": "SEO",
        "description": "Comprehensive pillar page for topic clusters",
        "prompt_template": "Create a pillar page about {topic}. Cover all aspects comprehensively with links to subtopics.",
        "structure": {
            "sections": ["Introduction", "Definition", "Importance", "How It Works", "Types/Categories", "Best Practices", "Tools", "Case Studies", "Future Trends", "Conclusion"]
        },
        "is_premium": True
    },
    {
        "id": "template-local-seo",
        "name": "Local SEO Page",
        "category": "SEO",
        "description": "Location-based service page",
        "prompt_template": "Write a local SEO page for {service} in {location}. Include local keywords and area-specific content.",
        "structure": {
            "sections": ["Introduction", "Services Offered", "Why Choose Us", "Service Areas", "Testimonials", "Contact/CTA"]
        },
        "is_premium": False
    }
]

def get_all_templates():
    return TEMPLATES

def get_template_by_id(template_id: str):
    for template in TEMPLATES:
        if template["id"] == template_id:
            return template
    return None

def get_templates_by_category(category: str):
    return [t for t in TEMPLATES if t["category"] == category]

def get_template_categories():
    categories = set(t["category"] for t in TEMPLATES)
    return list(categories)
