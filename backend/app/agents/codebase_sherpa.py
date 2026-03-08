from app.agents.base_agent import BaseAgent
import json
import re
import logging

logger = logging.getLogger(__name__)

class CodebaseSherpaAgent(BaseAgent):
    def __init__(self):
        super().__init__("codebase_sherpa")
        self.system_prompt = """You are 'Codebase Sherpa', a friendly mentor and guide for developers.
        
        Your Goal: Explain complex code, generate learning paths, and help developers navigate the codebase.
        
        Tone: Patient, teacher-like, and culturally attuned to Indian devs (using analogies when possible).
        
        Capabilities:
        1. Explain Code: Breakdown complex snippets into simple terms.
        2. Learning Path: Create a step-by-step specific guide to master a concept or file.
        3. Language Support: Output can be in 'English', 'Hindi', or 'Hinglish'. default to English if not specified.
        4. Architecture Map: Visualize how files connect.
        
        Output Format: JSON
        {
            "explanation": "Markdown text...",
            "learning_steps": ["step 1", "step 2"],
            "key_concepts": [{"term": "DI", "definition": "Dependency Injection"}],
            "analogy": "A culturally relevant analogy (e.g. comparing load balancing to a Mumbai train system?)"
        }
        """

    async def process(self, input_data: dict, session_id: str) -> dict:
        action = input_data.get("action", "explain")
        code = input_data.get("code_snippet", "")
        language = input_data.get("target_language", "English")
        user_message = input_data.get("message", f"{action} request for code snippet.")
        
        # 1. Call save_to_memory BEFORE AI call
        await self.save_to_memory(session_id, "user", user_message)
        
        if action == "explain":
            prompt = f"""
            Task: Explain the following code snippet.
            Target Language: {language}
            
            Code:
            ```
            {code}
            ```
            
            Provide a detailed breakdown, key concepts, and a local analogy to help understanding.
            """
        elif action == "learning_path":
            prompt = f"""
            Task: Create a learning path for this code module.
            Target Language: {language}
            
            Code/Context:
            ```
            {code}
            ```
            
            Suggest a step-by-step path to understand and master this pattern/technology.
            """
        else:
            return {"error": "Unknown action"}

        response_text = await self.call_claude(
            prompt=prompt,
            system_prompt=self.system_prompt,
            temperature=0.7,
            provider="groq"
        )
        
        result_data = self._parse_response(response_text)
            
        explanation = result_data.get("explanation", "")
        aws_services_used = {"dynamodb": self.aws.dynamodb.enabled}
        
        # Translation: AWS Translate first, fallback to AI translation
        if language.lower() in ["hindi", "tamil", "bengali", "hinglish"]:
            explanation = result_data.get("explanation", "")
            is_english = explanation and not any(ord(c) > 900 for c in explanation[:100])
            if is_english:
                if self.aws.translate.enabled:
                    translated = await self.translate_response(explanation, language)
                    result_data["explanation"] = translated
                    result_data["translated_by"] = "AWS Translate"
                else:
                    translate_prompt = f"Translate this to {language} language. Return only the translated text, no JSON:\n\n{explanation[:1000]}"
                    translated = await self.call_claude(translate_prompt)
                    result_data["explanation"] = translated
                    result_data["translated_by"] = f"AI Translation ({self.bedrock.current_provider})"
                
        # 3. Call AWS Polly to generate audio
        if self.aws.polly.enabled:
            audio_base64 = await self.speak(explanation[:400], language)
            if audio_base64:
                # 4. Add to result
                result_data["audio_base64"] = audio_base64
                result_data["voice_by"] = "AWS Polly"
                aws_services_used["polly"] = True
                
        # 5. Call save_to_memory AFTER AI call
        await self.save_to_memory(session_id, "assistant", json.dumps(result_data))
        
        # 6. Add aws_services_used dict to response
        result_data["aws_services_used"] = aws_services_used
        
        return result_data

    def _parse_response(self, response_text: str) -> dict:
        """Robustly parse AI response — handles JSON, markdown, and plain text."""
        try:
            clean = response_text.strip()
            clean = re.sub(r"```json\s*", "", clean)
            clean = re.sub(r"```\s*", "", clean)
            clean = clean.strip()
            return json.loads(clean)
        except json.JSONDecodeError:
            pass
        try:
            match = re.search(r"\{[\s\S]*\}", response_text)
            if match:
                return json.loads(match.group())
        except Exception:
            pass
        return {
            "explanation": response_text,
            "learning_steps": [],
            "key_concepts": [],
            "analogy": "N/A"
        }
