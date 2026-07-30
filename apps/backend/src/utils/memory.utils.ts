const GREETINGS = /^(hi|hello|hey|thanks|thank you|yes|no|ok|okay|sure|cool|nice|great|good|bad)\b/i;
const QUESTIONS = /^(what|how|why|when|where|who|which|can you|could you|will you|do you|is it|are you|have you|did you)\b/i;
const COMMANDS =
  /^(what is|how do|how to|can you|could you|tell me|explain|show me|help me|write|create|make|generate|fix|debug|solve|find|search|look up|check|test|run|execute|deploy|install|update|delete|remove|add|insert|modify|change|set|get|fetch|load|read|send|post|put|patch)/i;
const FILE_PATHS = /[A-Za-z]:\\|\/[a-z0-9_-]+\/[a-z0-9_-]+/i;
const CODE_ERRORS = /at\s+\w+\s*\(|Error:|TypeError:|SyntaxError:|undefined is not/;

export function shouldExtractMemory(message: string): boolean {
  if (message.trim().length < 20) return false;
  if (message.includes("```")) return false;
  if (FILE_PATHS.test(message)) return false;
  if (CODE_ERRORS.test(message)) return false;
  if (GREETINGS.test(message.trim())) return false;
  if (QUESTIONS.test(message.trim())) return false;
  if (COMMANDS.test(message.trim())) return false;
  return true;
}
