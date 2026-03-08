import boto3
import json
from botocore.exceptions import ClientError, BotoCoreError
from app.core.config import settings
import logging
import asyncio
import google.generativeai as genai
import anthropic
import openai

logger = logging.getLogger(__name__)

AVAILABLE_MODELS = {
    "groq": "Groq Llama 3 70B",
    "deepseek": "DeepSeek Chat",
    "openai": "OpenAI GPT-4o",
    "aws_claude": "Claude 3.5 Sonnet (Bedrock)",
    "anthropic_direct": "Claude 3.5 (Anthropic API)",
    "gemini": "Gemini 1.5 Pro",
    "aws_titan": "Amazon Titan Premier (Bedrock)",
    "mock": "Demo Mode"
}

PRIORITY_LIST = ["groq", "deepseek", "openai", "aws_claude", "anthropic_direct", "gemini", "aws_titan", "mock"]

class BedrockService:
    def __init__(self):
        self.current_provider = "aws_claude"
        self.bedrock_client = None
        self.anthropic_client = None
        self.openai_client = None
        self.deepseek_client = None
        self.groq_client = None
        
        self.mock_mode = False
        self._init_bedrock()
        self._init_gemini()
        self._init_anthropic()
        self._init_openai()
        self._init_deepseek()
        self._init_groq()
        
    def _init_bedrock(self):
        if settings.AWS_ACCESS_KEY_ID == "your_access_key" or not settings.AWS_ACCESS_KEY_ID:
            logger.warning("AWS Credentials not found. Bedrock disabled.")
            self.mock_mode = True
        else:
            try:
                self.bedrock_client = boto3.client(
                    service_name='bedrock-runtime',
                    region_name=settings.AWS_REGION,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
                )
            except Exception as e:
                logger.error(f"Failed to init Bedrock client: {e}")
                self.mock_mode = True

    def _init_gemini(self):
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key":
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel('gemini-2.0-flash')
            self.gemini_fallback_model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.gemini_model = None
            
    def _init_anthropic(self):
        if settings.ANTHROPIC_API_KEY and settings.ANTHROPIC_API_KEY != "your_anthropic_api_key":
            self.anthropic_client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)

    def _init_openai(self):
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY != "your_openai_api_key":
            self.openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

    def _init_deepseek(self):
        if settings.DEEPSEEK_API_KEY and settings.DEEPSEEK_API_KEY != "your_deepseek_api_key":
            self.deepseek_client = openai.AsyncOpenAI(
                api_key=settings.DEEPSEEK_API_KEY,
                base_url="https://api.deepseek.com"
            )
            logger.info("✅ DeepSeek Chat initialized")

    def _init_groq(self):
        if settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your_groq_api_key":
            self.groq_client = openai.AsyncOpenAI(
                api_key=settings.GROQ_API_KEY,
                base_url="https://api.groq.com/openai/v1"
            )
            logger.info("✅ Groq Llama 3 initialized")
            
    def update_api_key(self, provider: str, key: str):
        if provider == "gemini":
            settings.GEMINI_API_KEY = key
            self._init_gemini()
        elif provider == "anthropic_direct":
            settings.ANTHROPIC_API_KEY = key
            self._init_anthropic()
        elif provider == "openai":
            settings.OPENAI_API_KEY = key
            self._init_openai()
        elif provider == "deepseek":
            settings.DEEPSEEK_API_KEY = key
            self._init_deepseek()
        elif provider == "groq":
            settings.GROQ_API_KEY = key
            self._init_groq()
        return True
    def set_provider(self, provider: str):
        if provider in AVAILABLE_MODELS:
            self.current_provider = provider
            return True
        return False
        
    def get_available_models(self):
        return AVAILABLE_MODELS
        
    def switch_model(self, provider: str):
        return self.set_provider(provider)
        
    def get_status(self):
        return {
            "current_provider": self.current_provider,
            "available_models": AVAILABLE_MODELS,
            "aws_configured": self.bedrock_client is not None,
            "gemini_configured": self.gemini_model is not None,
            "anthropic_configured": self.anthropic_client is not None,
            "openai_configured": self.openai_client is not None,
            "deepseek_configured": self.deepseek_client is not None,
            "groq_configured": self.groq_client is not None
        }

    async def _try_invoke(self, provider, prompt, system_prompt, max_tokens, temperature):
        if provider == "mock" or (provider.startswith("aws") and self.mock_mode):
            logger.info("Using MOCK response")
            await asyncio.sleep(1)
            return self._get_mock_response(prompt)
            
        if provider == "groq":
            return await self._invoke_groq(prompt, system_prompt, max_tokens, temperature)
        elif provider == "deepseek":
            return await self._invoke_deepseek(prompt, system_prompt, max_tokens, temperature)
        elif provider == "openai":
            return await self._invoke_openai(prompt, system_prompt, max_tokens, temperature)
        elif provider == "aws_claude":
            return await self._invoke_aws_claude(prompt, system_prompt, max_tokens, temperature)
        elif provider == "aws_titan":
            return await self._invoke_aws_titan(prompt, system_prompt, max_tokens, temperature)
        elif provider == "anthropic_direct":
            return await self._invoke_anthropic(prompt, system_prompt, max_tokens, temperature)
        elif provider == "gemini":
            return await self._invoke_gemini(prompt, system_prompt, max_tokens, temperature)
        else:
            raise Exception("Invalid provider")

    async def invoke_claude(self, prompt: str, system_prompt: str = None, max_tokens: int = 4096, temperature: float = 0.5, provider: str = None):
        """
        Invokes the AI model with fallback priority.
        """
        start_provider = provider if provider else self.current_provider
        
        # Start from the requested provider and fallback through the priority list
        if start_provider in PRIORITY_LIST:
            start_index = PRIORITY_LIST.index(start_provider)
            providers_to_try = PRIORITY_LIST[start_index:]
        else:
            providers_to_try = PRIORITY_LIST
            
        for current in providers_to_try:
            try:
                logger.info(f"Attempting to invoke with provider: {current}")
                result = await self._try_invoke(current, prompt, system_prompt, max_tokens, temperature)
                if result:
                    self.current_provider = current  # update active provider to the one that worked
                    return result
            except Exception as e:
                logger.error(f"Error invoking {current}: {e}")
                logger.info(f"Falling back to next provider...")
                
        # If all fail, return mock anyway
        logger.info("All providers failed. Falling back to mock response.")
        self.current_provider = "mock"
        return self._get_mock_response(prompt)

    async def _invoke_aws_claude(self, prompt, system_prompt, max_tokens, temperature):
        if not self.bedrock_client:
            raise Exception("Bedrock unconfigured")
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [{"role": "user", "content": [{"type": "text", "text": prompt}]}]
        }
        if system_prompt:
            body["system"] = [{"text": system_prompt}]

        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: self.bedrock_client.invoke_model(
                modelId="anthropic.claude-3-5-sonnet-20240620-v1:0",
                body=json.dumps(body)
            )
        )
        response_body = json.loads(response.get('body').read())
        return response_body['content'][0]['text']

    async def _invoke_aws_titan(self, prompt, system_prompt, max_tokens, temperature):
        if not self.bedrock_client:
            raise Exception("Bedrock unconfigured")
        formatted_prompt = f"{system_prompt}\n\nUser: {prompt}\nBot:" if system_prompt else f"User: {prompt}\nBot:"
        body = {
            "inputText": formatted_prompt,
            "textGenerationConfig": {
                "maxTokenCount": max_tokens,
                "temperature": temperature,
            }
        }
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: self.bedrock_client.invoke_model(
                modelId="amazon.titan-text-express-v1",
                body=json.dumps(body)
            )
        )
        response_body = json.loads(response.get('body').read())
        return response_body['results'][0]['outputText']
        
    async def _invoke_anthropic(self, prompt, system_prompt, max_tokens, temperature):
        if not self.anthropic_client:
            raise Exception("Anthropic unconfigured")
        response = await self.anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_prompt if system_prompt else "",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
        
    async def _invoke_gemini(self, prompt, system_prompt, max_tokens, temperature):
        if not self.gemini_model:
            raise Exception("Gemini unconfigured")
        full_prompt = f"System Instruction: {system_prompt}\n\nUser: {prompt}" if system_prompt else prompt
        
        loop = asyncio.get_event_loop()
        try:
            response = await loop.run_in_executor(
                None,
                lambda: self.gemini_model.generate_content(
                    full_prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=temperature,
                        max_output_tokens=max_tokens,
                    )
                )
            )
            return response.text
        except Exception as e:
            if "404" in str(e) or "429" in str(e):
                logger.warning("Gemini 2.0 Flash failed, falling back to 2.5 Flash")
                response = await loop.run_in_executor(
                    None,
                    lambda: self.gemini_fallback_model.generate_content(
                        full_prompt,
                        generation_config=genai.types.GenerationConfig(
                            temperature=temperature,
                            max_output_tokens=max_tokens,
                        )
                    )
                )
                return response.text
            raise e

    async def _invoke_openai(self, prompt, system_prompt, max_tokens, temperature):
        if not self.openai_client:
            raise Exception("OpenAI unconfigured")
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = await self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        return response.choices[0].message.content

    async def _invoke_deepseek(self, prompt, system_prompt, max_tokens, temperature):
        if not self.deepseek_client:
            raise Exception("DeepSeek unconfigured")
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = await self.deepseek_client.chat.completions.create(
            model="deepseek-chat",
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature
        )
        return response.choices[0].message.content

    async def _invoke_groq(self, prompt, system_prompt, max_tokens, temperature):
        if not self.groq_client:
            raise Exception("Groq unconfigured")
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        response = await self.groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=min(max_tokens, 4096),
            temperature=temperature
        )
        return response.choices[0].message.content

    def _get_mock_response(self, prompt: str) -> str:
        prompt_lower = prompt.lower()
        if "classify the intent" in prompt_lower:
            if "review" in prompt_lower or "pr" in prompt_lower or "diff" in prompt_lower:
                target = "review_monk"
            elif "explain" in prompt_lower or "learn" in prompt_lower or "concept" in prompt_lower:
                target = "codebase_sherpa"
            else:
                target = "general_chat"
            return json.dumps({"target_agent": target, "confidence": 0.99, "reasoning": "Mock mode classification"})
            
        if "review the following pull request" in prompt_lower or "analyze this diff" in prompt_lower:
            return json.dumps({
                "summary": "MOCK REVIEW: The code looks mostly good but lacks error handling.",
                "findings": [{"severity": "HIGH", "file": "main.py", "line": 10, "issue": "Missing try/except block", "suggestion": "Add error handling", "code_fix": "try: ... except: ..."}],
                "quality_score": 7,
                "security_risk": "Low"
            })
            
        if "explain the following code" in prompt_lower or "create a learning path" in prompt_lower:
            return json.dumps({
                "explanation": "MOCK EXPLANATION: This is a function that does X. It uses basic logic to achieve the result.",
                "learning_steps": ["Step 1", "Step 2"],
                "key_concepts": [{"term": "Mock", "definition": "A fake simulation"}],
                "analogy": "Like a spare tire."
            })

        return f"Namaste! 🙏 I am in Demo Mode ({self.current_provider} used). You asked: '{prompt[:50]}...'"

bedrock_client = BedrockService()
LLMService = BedrockService
