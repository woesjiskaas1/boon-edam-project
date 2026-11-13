export function normalizeSkillText(value) {
  return value.normalize("NFD").replace(/\p{M}/gu, "")
    .toLocaleLowerCase("nl").replace(/[^\p{L}\p{N}+#]+/gu, " ").trim();
}

export function buildEscoIndex(skills) {
  return skills.map((skill) => ({
    skill,
    labels: [...new Set([skill.name, skill.englishLabel, skill.code, ...(skill.aliases || [])].filter(Boolean))]
      .map((label) => {
        const normalized = normalizeSkillText(label);
        return { label, normalized, compact: normalized.replaceAll(" ", ""), words: normalized.split(" ") };
      }),
  }));
}

// Damerau-Levenshtein: ook omgewisselde letters tellen als één typefout.
function editDistance(first, second, maximum) {
  if (Math.abs(first.length - second.length) > maximum) return maximum + 1;
  let previous = Array.from({ length: second.length + 1 }, (_, index) => index);
  let beforePrevious;
  for (let row = 1; row <= first.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= second.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1, previous[column] + 1,
        previous[column - 1] + (first[row - 1] === second[column - 1] ? 0 : 1),
      );
      if (row > 1 && column > 1 && first[row - 1] === second[column - 2] && first[row - 2] === second[column - 1]) {
        current[column] = Math.min(current[column], beforePrevious[column - 2] + 1);
      }
    }
    if (Math.min(...current) > maximum) return maximum + 1;
    beforePrevious = previous;
    previous = current;
  }
  return previous[second.length];
}

function scoreLabel(label, query, queryWords) {
  const lengthPenalty = Math.abs(label.normalized.length - query.length) / 1000;
  if (label.normalized === query) return 1000;
  if (label.compact === query.replaceAll(" ", "")) return 990;
  if (label.normalized.startsWith(query)) return 950 - lengthPenalty;
  if (label.words.some((word) => word.startsWith(query))) return 900 - lengthPenalty;
  if (label.normalized.includes(query)) return 850 - lengthPenalty;

  let edits = 0;
  for (const queryWord of queryWords) {
    if (label.words.some((word) => word.startsWith(queryWord))) continue;
    const maximum = queryWord.length < 4 ? 0 : queryWord.length < 8 ? 1 : 2;
    if (maximum === 0) return 0;
    let best = maximum + 1;
    for (const word of label.words) {
      if (word.length < queryWord.length - maximum) continue;
      best = Math.min(best, editDistance(queryWord, word.slice(0, queryWord.length + maximum), maximum));
      if (best === 1) break;
    }
    if (best > maximum) return 0;
    edits += best;
  }
  return (edits === 0 ? 800 : 600 - edits * 40) - lengthPenalty;
}

export function findEscoSuggestions(index, text, limit = 8) {
  const query = normalizeSkillText(text);
  if (query.length < 2) return [];
  const words = query.split(" ");
  const matches = new Map();
  for (const entry of index) {
    let bestScore = 0;
    let matchedLabel = "";
    for (const label of entry.labels) {
      const score = scoreLabel(label, query, words);
      if (score > bestScore) {
        bestScore = score;
        matchedLabel = label.label;
      }
    }
    // Een typefout stelt eerst een officiële groep voor; een exacte eigen naam blijft bovenaan.
    if (entry.skill.isCustom && bestScore < 990) bestScore -= 25;
    if (bestScore > 0 && bestScore > (matches.get(entry.skill.uri)?.score || 0)) {
      matches.set(entry.skill.uri, {
        ...entry.skill, score: bestScore, matchedLabel, isCorrection: bestScore < 700,
      });
    }
  }
  return [...matches.values()].sort((first, second) => second.score - first.score ||
    first.name.localeCompare(second.name, "nl") || (first.code?.length || 0) - (second.code?.length || 0))
    .slice(0, limit);
}
