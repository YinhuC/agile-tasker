export function sortByIndex<T extends { index: number }>(items: T[]): T[] {
  return items.slice().sort((a, b) => {
    return a.index - b.index;
  });
}

export function sortByUpdateTime<T extends { updatedAt: string }>(
  items: T[]
): T[] {
  return items.slice().sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function sortByCreateTime<T extends { createdAt: string }>(
  items: T[]
): T[] {
  return items.slice().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
