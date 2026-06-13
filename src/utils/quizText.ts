const htmlEntityMap: Record<string, string> = {
  amp: '&',
  apos: "'",
  '#039': "'",
  '#39': "'",
  quot: '"',
  lt: '<',
  gt: '>',
};

export const decodeHtmlEntities = (value: string) => {
  if (!value) {
    return value;
  }

  return value.replace(/&(#\d+|#x[a-fA-F0-9]+|[a-zA-Z]+);/g, (match, entity) => {
    if (entity.startsWith('#x')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(2), 16));
    }

    if (entity.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(entity.slice(1), 10));
    }

    return htmlEntityMap[entity] ?? match;
  });
};

const hashString = (value: string) => {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const seededRandom = (seed: number) => {
  let value = seed || 1;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

export const shuffleWithSeed = <T,>(items: T[], seedSource: string) => {
  const shuffled = [...items];
  const random = seededRandom(hashString(seedSource));

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};
