// Simple content moderation utility
// Checks for inappropriate content in reviews

const PROHIBITED_WORDS = [
  // Add profanity/inappropriate terms here
  "spam",
  "fake",
  "golpe",
  "fraude",
  "scam",
];

const SUSPICIOUS_PATTERNS = [
  /(.)\1{4,}/gi, // Repeated characters (e.g., "aaaaaaa")
  /https?:\/\/[^\s]+/gi, // URLs
  /[A-Z]{5,}/g, // All caps words
  /\d{10,}/g, // Long number sequences (phone numbers, etc.)
];

type ModerationResult = {
  isApproved: boolean;
  reasons: string[];
  confidence: number;
};

export const moderateContent = (content: string): ModerationResult => {
  const reasons: string[] = [];
  let score = 100;

  // Check for empty or very short content
  if (!content || content.trim().length < 10) {
    return {
      isApproved: false,
      reasons: ["Conteúdo muito curto"],
      confidence: 100,
    };
  }

  // Check for prohibited words
  const lowerContent = content.toLowerCase();
  PROHIBITED_WORDS.forEach((word) => {
    if (lowerContent.includes(word.toLowerCase())) {
      reasons.push(`Palavra proibida detectada: "${word}"`);
      score -= 30;
    }
  });

  // Check for suspicious patterns
  SUSPICIOUS_PATTERNS.forEach((pattern) => {
    if (pattern.test(content)) {
      reasons.push("Padrão suspeito detectado");
      score -= 20;
    }
  });

  // Check for excessive punctuation
  const punctuationCount = (content.match(/[!?]{2,}/g) || []).length;
  if (punctuationCount > 2) {
    reasons.push("Uso excessivo de pontuação");
    score -= 10;
  }

  // Check content length ratio (too much caps)
  const capsCount = (content.match(/[A-Z]/g) || []).length;
  const totalLetters = (content.match(/[a-zA-Z]/g) || []).length;
  if (totalLetters > 20 && capsCount / totalLetters > 0.5) {
    reasons.push("Uso excessivo de letras maiúsculas");
    score -= 15;
  }

  return {
    isApproved: score >= 50,
    reasons,
    confidence: Math.max(0, Math.min(100, score)),
  };
};

export const moderateReview = (
  title: string,
  comment: string,
  rating: number
): ModerationResult => {
  const titleResult = moderateContent(title);
  const commentResult = comment ? moderateContent(comment) : { isApproved: true, reasons: [], confidence: 100 };

  const allReasons = [...titleResult.reasons, ...commentResult.reasons];
  
  // Check for rating manipulation patterns
  if (rating === 1 && comment && comment.length > 200) {
    // Long negative reviews might be legitimate complaints
    // Just flag for review
    allReasons.push("Avaliação negativa longa - verificar manualmente");
  }

  if (rating === 5 && (!comment || comment.length < 20)) {
    // Very short 5-star reviews might be fake
    allReasons.push("Avaliação 5 estrelas com pouco conteúdo");
  }

  const avgConfidence = (titleResult.confidence + commentResult.confidence) / 2;

  return {
    isApproved: titleResult.isApproved && commentResult.isApproved && avgConfidence >= 50,
    reasons: [...new Set(allReasons)], // Remove duplicates
    confidence: avgConfidence,
  };
};
