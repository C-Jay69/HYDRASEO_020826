#!/usr/bin/env python3
"""
HYDRASEO Backend API Test Suite
Tests all backend endpoints for functionality and authentication
"""

import asyncio
import aiohttp
import json
import sys
from datetime import datetime
from typing import Dict, Any, Optional

# Backend URL from environment
BACKEND_URL = "https://seocopy-platform.preview.emergentagent.com/api"

class HydraseoAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = None
        self.auth_token = None
        self.test_user_email = "testuser@hydraseo.com"
        self.test_user_password = "TestPassword123!"
        self.test_user_name = "Test User"
        self.results = []
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def log_result(self, test_name: str, success: bool, message: str, response_data: Any = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data,
            "timestamp": datetime.now().isoformat()
        })
    
    async def make_request(self, method: str, endpoint: str, data: Dict = None, headers: Dict = None) -> tuple:
        """Make HTTP request and return (success, response_data, status_code)"""
        url = f"{self.base_url}{endpoint}"
        
        # Add auth header if token exists
        if self.auth_token and headers is None:
            headers = {"Authorization": f"Bearer {self.auth_token}"}
        elif self.auth_token and headers:
            headers["Authorization"] = f"Bearer {self.auth_token}"
        
        try:
            async with self.session.request(method, url, json=data, headers=headers) as response:
                try:
                    response_data = await response.json()
                except:
                    response_data = await response.text()
                
                return response.status < 400, response_data, response.status
        except Exception as e:
            return False, str(e), 0
    
    async def test_health_check(self):
        """Test basic health endpoint"""
        success, data, status = await self.make_request("GET", "/health")
        
        if success and status == 200:
            self.log_result("Health Check", True, f"API is healthy - Status: {status}")
        else:
            self.log_result("Health Check", False, f"Health check failed - Status: {status}, Data: {data}")
    
    async def test_pricing_endpoint(self):
        """Test public pricing endpoint"""
        success, data, status = await self.make_request("GET", "/pricing")
        
        if success and status == 200 and isinstance(data, dict) and "plans" in data:
            plans_count = len(data["plans"])
            self.log_result("Pricing Endpoint", True, f"Retrieved {plans_count} pricing plans")
        else:
            self.log_result("Pricing Endpoint", False, f"Failed to get pricing - Status: {status}, Data: {data}")
    
    async def test_user_registration(self):
        """Test user registration"""
        user_data = {
            "name": self.test_user_name,
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        success, data, status = await self.make_request("POST", "/auth/register", user_data)
        
        if success and status == 200:
            if "access_token" in data and "user" in data:
                self.auth_token = data["access_token"]
                self.log_result("User Registration", True, f"User registered successfully - Token received")
                return True
            else:
                self.log_result("User Registration", False, f"Registration response missing token or user data: {data}")
        else:
            # If user already exists, try login instead
            if status == 400 and "already registered" in str(data):
                self.log_result("User Registration", True, "User already exists (expected for repeated tests)")
                return await self.test_user_login()
            else:
                self.log_result("User Registration", False, f"Registration failed - Status: {status}, Data: {data}")
        
        return False
    
    async def test_user_login(self):
        """Test user login"""
        login_data = {
            "email": self.test_user_email,
            "password": self.test_user_password
        }
        
        success, data, status = await self.make_request("POST", "/auth/login", login_data)
        
        if success and status == 200:
            if "access_token" in data and "user" in data:
                self.auth_token = data["access_token"]
                self.log_result("User Login", True, f"Login successful - Token received")
                return True
            else:
                self.log_result("User Login", False, f"Login response missing token or user data: {data}")
        else:
            self.log_result("User Login", False, f"Login failed - Status: {status}, Data: {data}")
        
        return False
    
    async def test_get_current_user(self):
        """Test getting current user info"""
        if not self.auth_token:
            self.log_result("Get Current User", False, "No auth token available")
            return
        
        success, data, status = await self.make_request("GET", "/auth/me")
        
        if success and status == 200:
            if "id" in data and "email" in data and "name" in data:
                self.log_result("Get Current User", True, f"Retrieved user info for: {data.get('email')}")
            else:
                self.log_result("Get Current User", False, f"User data incomplete: {data}")
        else:
            self.log_result("Get Current User", False, f"Failed to get user info - Status: {status}, Data: {data}")
    
    async def test_get_articles(self):
        """Test getting user articles"""
        if not self.auth_token:
            self.log_result("Get Articles", False, "No auth token available")
            return
        
        success, data, status = await self.make_request("GET", "/articles")
        
        if success and status == 200:
            if isinstance(data, list):
                self.log_result("Get Articles", True, f"Retrieved {len(data)} articles")
            else:
                self.log_result("Get Articles", False, f"Expected list, got: {type(data)}")
        else:
            self.log_result("Get Articles", False, f"Failed to get articles - Status: {status}, Data: {data}")
    
    async def test_create_article(self):
        """Test creating an article with AI generation"""
        if not self.auth_token:
            self.log_result("Create Article", False, "No auth token available")
            return None
        
        article_data = {
            "title": "The Ultimate Guide to SEO Content Writing",
            "keywords": ["SEO content", "content writing", "search optimization"],
            "tone": "professional",
            "language": "en",
            "word_count_target": 1000,
            "fun_mode": False
        }
        
        success, data, status = await self.make_request("POST", "/articles", article_data)
        
        if success and status == 200:
            if "id" in data and "title" in data:
                article_id = data["id"]
                self.log_result("Create Article", True, f"Article created successfully - ID: {article_id}")
                return article_id
            else:
                self.log_result("Create Article", False, f"Article creation response incomplete: {data}")
        else:
            self.log_result("Create Article", False, f"Failed to create article - Status: {status}, Data: {data}")
        
        return None
    
    async def test_get_single_article(self, article_id: str):
        """Test getting a single article"""
        if not self.auth_token or not article_id:
            self.log_result("Get Single Article", False, "No auth token or article ID available")
            return
        
        success, data, status = await self.make_request("GET", f"/articles/{article_id}")
        
        if success and status == 200:
            if "id" in data and "title" in data and "content" in data:
                self.log_result("Get Single Article", True, f"Retrieved article: {data.get('title')}")
            else:
                self.log_result("Get Single Article", False, f"Article data incomplete: {data}")
        else:
            self.log_result("Get Single Article", False, f"Failed to get article - Status: {status}, Data: {data}")
    
    async def test_generate_keywords(self):
        """Test AI keyword generation"""
        if not self.auth_token:
            self.log_result("Generate Keywords", False, "No auth token available")
            return
        
        keyword_data = {
            "seed_keyword": "content marketing",
            "count": 10
        }
        
        success, data, status = await self.make_request("POST", "/ai/keywords", keyword_data)
        
        if success and status == 200:
            if "keywords" in data and isinstance(data["keywords"], list):
                keywords_count = len(data["keywords"])
                self.log_result("Generate Keywords", True, f"Generated {keywords_count} keywords")
            else:
                self.log_result("Generate Keywords", False, f"Keywords response incomplete: {data}")
        else:
            self.log_result("Generate Keywords", False, f"Failed to generate keywords - Status: {status}, Data: {data}")
    
    async def test_analyze_competitors(self):
        """Test competitor analysis"""
        if not self.auth_token:
            self.log_result("Analyze Competitors", False, "No auth token available")
            return
        
        competitor_data = {
            "keyword": "SEO tools",
            "count": 5
        }
        
        success, data, status = await self.make_request("POST", "/ai/competitors", competitor_data)
        
        if success and status == 200:
            if "results" in data and isinstance(data["results"], list):
                results_count = len(data["results"])
                self.log_result("Analyze Competitors", True, f"Analyzed {results_count} competitors")
            else:
                self.log_result("Analyze Competitors", False, f"Competitor analysis response incomplete: {data}")
        else:
            self.log_result("Analyze Competitors", False, f"Failed to analyze competitors - Status: {status}, Data: {data}")
    
    async def test_get_templates(self):
        """Test getting all templates"""
        if not self.auth_token:
            self.log_result("Get Templates", False, "No auth token available")
            return
        
        success, data, status = await self.make_request("GET", "/templates")
        
        if success and status == 200:
            if isinstance(data, list):
                templates_count = len(data)
                self.log_result("Get Templates", True, f"Retrieved {templates_count} templates")
            else:
                self.log_result("Get Templates", False, f"Expected list, got: {type(data)}")
        else:
            self.log_result("Get Templates", False, f"Failed to get templates - Status: {status}, Data: {data}")
    
    async def test_get_template_categories(self):
        """Test getting template categories"""
        if not self.auth_token:
            self.log_result("Get Template Categories", False, "No auth token available")
            return
        
        success, data, status = await self.make_request("GET", "/templates/categories")
        
        if success and status == 200:
            if isinstance(data, list):
                categories_count = len(data)
                self.log_result("Get Template Categories", True, f"Retrieved {categories_count} categories")
            else:
                self.log_result("Get Template Categories", False, f"Expected list, got: {type(data)}")
        else:
            self.log_result("Get Template Categories", False, f"Failed to get categories - Status: {status}, Data: {data}")
    
    async def test_get_analytics(self):
        """Test getting user analytics"""
        if not self.auth_token:
            self.log_result("Get Analytics", False, "No auth token available")
            return
        
        success, data, status = await self.make_request("GET", "/analytics")
        
        if success and status == 200:
            if "total_articles" in data and "credits_used" in data:
                self.log_result("Get Analytics", True, f"Retrieved analytics - Articles: {data.get('total_articles')}, Credits: {data.get('credits_used')}")
            else:
                self.log_result("Get Analytics", False, f"Analytics data incomplete: {data}")
        else:
            self.log_result("Get Analytics", False, f"Failed to get analytics - Status: {status}, Data: {data}")
    
    async def test_unauthorized_access(self):
        """Test that protected endpoints require authentication"""
        # Temporarily remove auth token
        original_token = self.auth_token
        self.auth_token = None
        
        success, data, status = await self.make_request("GET", "/articles")
        
        if not success or status == 401 or status == 403:
            self.log_result("Unauthorized Access Protection", True, "Protected endpoint correctly requires authentication")
        else:
            self.log_result("Unauthorized Access Protection", False, f"Protected endpoint accessible without auth - Status: {status}")
        
        # Restore auth token
        self.auth_token = original_token
    
    def print_summary(self):
        """Print test summary"""
        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"\n{'='*60}")
        print(f"HYDRASEO API TEST SUMMARY")
        print(f"{'='*60}")
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        if failed_tests > 0:
            print(f"\n❌ FAILED TESTS:")
            for result in self.results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        print(f"\n{'='*60}")
        
        return passed_tests, failed_tests
    
    async def run_all_tests(self):
        """Run all API tests in sequence"""
        print(f"Starting HYDRASEO API Tests...")
        print(f"Backend URL: {self.base_url}")
        print(f"{'='*60}")
        
        # Public endpoints (no auth required)
        await self.test_health_check()
        await self.test_pricing_endpoint()
        
        # Authentication tests
        auth_success = await self.test_user_registration()
        if not auth_success:
            auth_success = await self.test_user_login()
        
        if auth_success:
            # Protected endpoints (require auth)
            await self.test_get_current_user()
            await self.test_get_articles()
            
            # Create article and test retrieval
            article_id = await self.test_create_article()
            if article_id:
                await self.test_get_single_article(article_id)
            
            # AI services
            await self.test_generate_keywords()
            await self.test_analyze_competitors()
            
            # Templates
            await self.test_get_templates()
            await self.test_get_template_categories()
            
            # Analytics
            await self.test_get_analytics()
            
            # Security test
            await self.test_unauthorized_access()
        else:
            print("❌ Authentication failed - skipping protected endpoint tests")
        
        return self.print_summary()

async def main():
    """Main test runner"""
    async with HydraseoAPITester() as tester:
        passed, failed = await tester.run_all_tests()
        
        # Exit with error code if tests failed
        if failed > 0:
            sys.exit(1)
        else:
            print("🎉 All tests passed!")
            sys.exit(0)

if __name__ == "__main__":
    asyncio.run(main())