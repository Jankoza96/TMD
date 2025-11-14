import type { Task } from '../types/task';

type QueryToken =
  | {
      type: 'field';
      field: 'priority' | 'status' | 'tag';
      value: string;
      operator: 'equals' | 'not';
    }
  | { type: 'operator'; operator: 'AND' | 'OR' | 'NOT' }
  | { type: 'text'; value: string };

interface ParsedQuery {
  tokens: QueryToken[];
  hasAdvancedSyntax: boolean;
}

export const parseQuery = (query: string): ParsedQuery => {
  if (!query.trim()) {
    return { tokens: [], hasAdvancedSyntax: false };
  }

  const tokens: QueryToken[] = [];
  const trimmedQuery = query.trim();

  const hasAdvancedSyntax = /(priority|status|tag):|(AND|OR|NOT)\s/i.test(
    trimmedQuery
  );

  if (!hasAdvancedSyntax) {
    return {
      tokens: [{ type: 'text', value: trimmedQuery }],
      hasAdvancedSyntax: false
    };
  }

  const regex = /\s+(AND|OR|NOT)\s+/gi;
  const parts: string[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(trimmedQuery)) !== null) {
    if (match.index > lastIndex) {
      parts.push(trimmedQuery.substring(lastIndex, match.index));
    }
    parts.push(match[1].toUpperCase());
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < trimmedQuery.length) {
    parts.push(trimmedQuery.substring(lastIndex));
  }

  let pendingOperator: 'AND' | 'OR' | 'NOT' | null = null;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    const upperPart = part.toUpperCase();

    if (upperPart === 'AND' || upperPart === 'OR' || upperPart === 'NOT') {
      pendingOperator = upperPart as 'AND' | 'OR' | 'NOT';
      if (i > 0 && tokens.length > 0) {
        tokens.push({ type: 'operator', operator: pendingOperator });
      }
      continue;
    }

    let isNot = false;
    let queryPart = part;

    if (pendingOperator === 'NOT') {
      isNot = true;
      pendingOperator = null;
    } else if (part.toUpperCase().startsWith('NOT ')) {
      isNot = true;
      queryPart = part.substring(4).trim();
    }

    const fieldMatch = queryPart.match(/^(priority|status|tag):(.+)$/i);
    if (fieldMatch) {
      const [, field, value] = fieldMatch;
      const normalizedField = field.toLowerCase() as
        | 'priority'
        | 'status'
        | 'tag';
      const normalizedValue = value.trim();

      tokens.push({
        type: 'field',
        field: normalizedField,
        value: normalizedValue,
        operator: isNot ? 'not' : 'equals'
      });
      pendingOperator = null;
      continue;
    }

    if (queryPart && !['AND', 'OR', 'NOT'].includes(upperPart)) {
      tokens.push({ type: 'text', value: queryPart });
      pendingOperator = null;
    }
  }

  return { tokens, hasAdvancedSyntax: true };
};

export const applyQuery = (tasks: Task[], parsedQuery: ParsedQuery): Task[] => {
  if (parsedQuery.tokens.length === 0) {
    return tasks;
  }

  if (!parsedQuery.hasAdvancedSyntax) {
    const firstToken = parsedQuery.tokens[0];
    if (firstToken && firstToken.type === 'text') {
      const searchText = firstToken.value.toLowerCase();
      return tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchText) ||
          task.description.toLowerCase().includes(searchText) ||
          task.tags.some((tag) => tag.toLowerCase().includes(searchText))
      );
    }
    return tasks;
  }

  return tasks.filter((task) => {
    let result: boolean | null = null;
    let currentOperator: 'AND' | 'OR' | null = null;
    let nextIsNot = false;

    for (let i = 0; i < parsedQuery.tokens.length; i++) {
      const token = parsedQuery.tokens[i];

      if (token.type === 'operator') {
        if (token.operator === 'NOT') {
          nextIsNot = true;
          continue;
        }
        currentOperator = token.operator;
        continue;
      }

      let tokenResult: boolean;

      if (token.type === 'field') {
        if (token.field === 'priority') {
          const matches =
            task.priority.toLowerCase() === token.value.toLowerCase();
          tokenResult =
            token.operator === 'not' || nextIsNot ? !matches : matches;
        } else if (token.field === 'status') {
          const matches =
            task.status.toLowerCase() === token.value.toLowerCase();
          tokenResult =
            token.operator === 'not' || nextIsNot ? !matches : matches;
        } else if (token.field === 'tag') {
          const matches = task.tags.some(
            (tag) => tag.toLowerCase() === token.value.toLowerCase()
          );
          tokenResult =
            token.operator === 'not' || nextIsNot ? !matches : matches;
        } else {
          tokenResult = true;
        }
      } else {
        const searchText = token.value.toLowerCase();
        const matches =
          task.title.toLowerCase().includes(searchText) ||
          task.description.toLowerCase().includes(searchText) ||
          task.tags.some((tag) => tag.toLowerCase().includes(searchText));
        tokenResult = nextIsNot ? !matches : matches;
      }

      if (result === null) {
        result = tokenResult;
      } else if (currentOperator === 'AND') {
        result = result && tokenResult;
      } else if (currentOperator === 'OR') {
        result = result || tokenResult;
      } else {
        result = result && tokenResult;
      }

      currentOperator = null;
      nextIsNot = false;
    }

    return result ?? true;
  });
};
