from app.agents.base_agent import BaseAgent
import json
import re

class ReviewMonkAgent(BaseAgent):
    def __init__(self):
        super().__init__("review_monk")
        self.system_prompt = """You are 'Review Monk', a senior code review AI agent optimized for Indian developers.
        
        Your Goal: Review code diffs for bugs, security issues, performance, and best practices.
        
        Tone: Professional, constructive, and encouraging (Namaste! 🙏).
        
        Specific Capabilities:
        1. Identify logic errors and potential runtime exceptions.
        2. Detect security vulnerabilities (OWASP Top 10).
        3. Check for timezone handling issues (specifically IST vs UTC).
        4. Suggest AWS code optimizations (e.g., using boto3 correctly, region checks).
        5. Provide explanations in English, but you can use simple Hinglish terms if helpful for clarity or friendliness.
        
        Output Format: Return valid JSON with the following structure:
        {
            "summary": "Brief summary of changes",
            "findings": [
                {
                    "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
                    "file": "filename",
                    "line": line_number,
                    "issue": "Description of the issue",
                    "suggestion": "How to fix it",
                    "code_fix": "Proposed code change"
                }
            ],
            "quality_score": 1-10,
            "security_risk": "None" | "Low" | "High"
        }
        """

    async def process(self, input_data: dict, session_id: str) -> dict:
        diff = input_data.get("diff", "")
        pr_title = input_data.get("pr_title", "Unknown PR")
        
        # 1. Save to memory BEFORE AI call
        await self.save_to_memory(session_id, "user", f"PR Review: {pr_title}")
        
        if not diff:
            return {"error": "No diff provided"}

        prompt = f"""
        Please review the following Pull Request:
        Title: {pr_title}
        
        Code Diff:
        ```
        {diff[:20000]}  # Truncate if too long to avoid token limits mostly for demo
        ```
        
        Analyze this diff and provide a structured JSON review as specified in your system prompt.
        """
        
        response_text = await self.call_claude(
            prompt=prompt,
            system_prompt=self.system_prompt,
            temperature=0.2,
            provider="groq"
        )
        
        try:
            clean = re.sub(r"```json\s*", "", response_text)
            clean = re.sub(r"```\s*", "", clean).strip()
            try:
                review_data = json.loads(clean)
            except json.JSONDecodeError:
                match = re.search(r"\{[\s\S]*\}", clean)
                if match:
                    review_data = json.loads(match.group())
                else:
                    review_data = {
                        "summary": clean[:300],
                        "findings": [],
                        "quality_score": 5,
                        "security_risk": "Unknown"
                    }
        except Exception:
            review_data = {
                "error": "Failed to parse AI response",
                "raw_response": response_text[:500]
            }
            
        if "error" not in review_data:
            # 2. Save to memory AFTER AI call
            await self.save_to_memory(session_id, "assistant", json.dumps(review_data))
            
            # 3. Keep existing redis save_context for last_review
            await self.save_context(session_id, "last_review", review_data)
            
            # 4. Add aws_services_used dict to response
            review_data["aws_services_used"] = {"dynamodb": self.aws.dynamodb.enabled}
            
        return review_data

    async def analyze_github_pr(self, repo_url: str, pr_number: int, github_service):
        pass
