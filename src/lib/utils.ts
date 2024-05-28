import { MutableRefObject } from 'react';
import { User } from './entities';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any
export const debounce = (func: (args: any) => void, delay: number) => {
  let timeoutId: number;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any
  return function (...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      func.apply(this, args);
    }, delay);
  };
};

export const getPseudoTagElement = () => {
  const pseudoTagElement = document.createElement('span');
  pseudoTagElement.dataset.type = 'pseudoTag';
  pseudoTagElement.className = 'pseudoTag';
  pseudoTagElement.innerText = '@';

  return pseudoTagElement;
};

export const getTagElement = ({ username }: { username: string }) => {
  const tagElement = document.createElement('span');
  tagElement.className = 'userTag';
  tagElement.innerText = `@${username}`;

  return tagElement;
};

export const moveCaretInsidePotentialTag = ({
  element,
}: {
  element: Element;
}) => {
  const range = document.createRange();
  range.setStartAfter(element);
  range.collapse(true);

  const selection = window.getSelection();

  if (selection) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const moveCaretAfterTag = (element: Element) => {
  const range = document.createRange();
  const selection = window.getSelection();

  if (element && selection) {
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export const moveCaretToEnd = (element: Element) => {
  const range = document.createRange();
  const selection = window.getSelection();

  if (element && selection) {
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export function getCaretCoordinates() {
  let x = 0,
    y = 0;

  const isSupported = typeof window.getSelection !== 'undefined';

  if (isSupported) {
    const selection = window.getSelection();

    if (selection && selection.rangeCount !== 0) {
      const range = selection.getRangeAt(0).cloneRange();
      const rect = range.getClientRects()[0];
      console.log('rect', rect);
      if (rect) {
        x = rect.left;
        y = rect.top;
      }
    }
  }
  return { x, y };
}

export const getPopupPosition = () => {
  const pos = getCaretCoordinates();
  return { x: pos.x, y: pos.y };
};

const getTaggingModeHTMLElem = (content: string) => {
  return `<span class="userTag" contentEditable="true">${content}</span>`;
};

export const wrapTextAfterAt = ({
  elementRef,
  users,
}: {
  elementRef: MutableRefObject<Element>;
  users: User[];
}) => {
  const element = elementRef.current;
  const text = element.textContent;
  const regex = /(@\S+?)(\s|$)/g; //Text between @ and empty space
  let match;
  const newContent = [];
  let lastIndex = 0;

  if (!text) {
    return;
  }

  while ((match = regex.exec(text)) !== null) {
    let tagContent;
    const usernames = users.map((u) => u.username);
    const tag = match[1].substring(1, match[1].length);
    const usertag = usernames.find((u) => u === tag);

    if (usertag) {
      tagContent = getTagElement({ username: match[1] });
    } else {
      tagContent = getTaggingModeHTMLElem(match[1]);
    }

    newContent.push(text.substring(lastIndex, match.index));
    newContent.push(tagContent);
    lastIndex = match.index + match[1].length;
  }

  newContent.push(text.substring(lastIndex));
  element.innerHTML = newContent.join('');

  moveCaretToEnd(element);
};

export function getTextAfterChar({ str, char }: { str: string; char: string }) {
  const index = str.lastIndexOf(char);
  if (index === -1) {
    // Character not found
    return '';
  }
  // Get the substring after the character
  return str.substring(index + char.length);
}

export const getUserTagSuggestions = ({
  usernames,
  searchTerm,
}: {
  usernames: string[];
  searchTerm: string;
}): string[] => {
  if (!usernames) {
    return [];
  }

  if (!searchTerm) {
    return usernames.slice(0, 5);
  }

  return usernames
    .filter((user) => user.toLowerCase().startsWith(searchTerm.toLowerCase()))
    .slice(0, 5);
};

export const getUserTagContent = ({
  text,
  usernames,
}: {
  text: string;
  usernames: string[];
}) => {
  if (!text) {
    return;
  }

  return usernames.find(
    (username: string) => username.toLowerCase() == text.toLowerCase()
  );
};
