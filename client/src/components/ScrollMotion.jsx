import { createElement } from 'react';
import { useSeenOnScreen } from '../hooks/useSeenOnScreen.js';

/* Fades and lifts its children into place when scrolled to */
export function SlideInOnScroll({ as = 'div', delay = 0, className = '', children, ...rest }) {
  const [spotRef, hasBeenSeen] = useSeenOnScreen();
  return createElement(
    as,
    {
      ref: spotRef,
      className: `slideIn ${hasBeenSeen ? 'slideInDone' : ''} ${className}`.trim(),
      style: { '--slideDelay': `${delay}ms` },
      ...rest,
    },
    children
  );
}

/* Reveals a sentence one word at a time when scrolled to */
export function WordByWord({ text = '', as = 'p', className = '' }) {
  const [spotRef, hasBeenSeen] = useSeenOnScreen(0.3);
  const words = text.split(' ').filter(Boolean);
  return createElement(
    as,
    { ref: spotRef, className: `wordByWord ${hasBeenSeen ? 'wordByWordDone' : ''} ${className}`.trim(), 'aria-label': text },
    words.map((word, position) => (
      <span key={`${word}-${position}`} className="singleWord" aria-hidden="true" style={{ '--wordPosition': position }}>
        {word}&nbsp;
      </span>
    ))
  );
}
