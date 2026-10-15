import { Item, MatchScoreResult } from '../types/campuskhoj';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'is', 'was', 'near', 'by', 'from', 'my', 'lost', 'found', 'campus', 'room'
]);

function extractMeaningfulTokens(text: string): Set<string> {
  if (!text) return new Set();
  const tokens = new Set<string>();
  const words = text.toLowerCase().split(/[^a-z0-9]+/);
  for (const w of words) {
    if (w.length > 2 && !STOP_WORDS.has(w)) {
      tokens.add(w);
    }
  }
  return tokens;
}

export function evaluateItemMatch(lost: Item, found: Item): MatchScoreResult {
  let catScore = 0;
  let locScore = 0;
  let dateScore = 0;
  let kwScore = 0;
  const reasons: string[] = [];

  // 1. Category match (+40)
  if (lost.category === found.category) {
    catScore = 40;
    reasons.push(`Exact Category Match: ${lost.category} (+40 pts)`);
  }

  // 2. Location match (+20)
  if (lost.location && found.location) {
    const l1 = lost.location.toLowerCase().trim();
    const l2 = found.location.toLowerCase().trim();
    if (l1 === l2) {
      locScore = 20;
      reasons.push(`Exact Location Match: "${lost.location}" (+20 pts)`);
    } else if (l1.includes(l2) || l2.includes(l1)) {
      locScore = 15;
      reasons.push(`Zone Proximity Match: "${lost.location}" & "${found.location}" (+15 pts)`);
    }
  }

  // 3. Date within 3 days (+10)
  if (lost.incidentDate && found.incidentDate) {
    const d1 = new Date(lost.incidentDate).getTime();
    const d2 = new Date(found.incidentDate).getTime();
    const diffDays = Math.round(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) {
      dateScore = 10;
      reasons.push(`Date Proximity: ${diffDays === 0 ? 'Same day' : `${diffDays} day(s) apart`} (+10 pts)`);
    }
  }

  // 4. Keyword similarity (up to +30)
  const tokensLost = extractMeaningfulTokens(`${lost.name} ${lost.description}`);
  const tokensFound = extractMeaningfulTokens(`${found.name} ${found.description}`);
  const overlap: string[] = [];

  tokensLost.forEach(t => {
    if (tokensFound.has(t)) {
      overlap.push(t);
    }
  });

  if (overlap.length >= 3) {
    kwScore = 30;
    reasons.push(`High Keyword Overlap (${overlap.slice(0, 4).join(', ')}): (+30 pts)`);
  } else if (overlap.length === 2) {
    kwScore = 20;
    reasons.push(`Moderate Keyword Overlap (${overlap.join(', ')}): (+20 pts)`);
  } else if (overlap.length === 1) {
    kwScore = 10;
    reasons.push(`Single Keyword Match ("${overlap[0]}"): (+10 pts)`);
  }

  const totalScore = Math.min(catScore + locScore + dateScore + kwScore, 100);
  const isQualified = totalScore >= 50;

  return {
    lostItem: lost,
    foundItem: found,
    totalScore,
    categoryScore: catScore,
    locationScore: locScore,
    dateScore,
    keywordScore: kwScore,
    reasons,
    isQualified,
  };
}

export function computeAllMatches(items: Item[]): MatchScoreResult[] {
  const lostList = items.filter(i => i.type === 'LOST');
  const foundList = items.filter(i => i.type === 'FOUND' && i.status !== 'RETURNED');
  const results: MatchScoreResult[] = [];

  for (const lost of lostList) {
    for (const found of foundList) {
      const match = evaluateItemMatch(lost, found);
      if (match.isQualified) {
        results.push(match);
      }
    }
  }

  return results.sort((a, b) => b.totalScore - a.totalScore);
}
