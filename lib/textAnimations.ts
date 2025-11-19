// Text animation utilities for character-level animations

/**
 * Splits text into individual characters wrapped in spans
 * @param text - The text to split
 * @returns Array of character objects with random initial positions
 */
export function splitTextToChars(text: string) {
  return text.split('').map((char, index) => ({
    char: char === ' ' ? '\u00A0' : char, // Non-breaking space for spaces
    index,
    // Random initial positions for scramble effect
    initialX: (Math.random() - 0.5) * 200,
    initialY: (Math.random() - 0.5) * 200,
    initialRotation: (Math.random() - 0.5) * 360,
    initialOpacity: 0,
  }));
}

/**
 * Generates random characters for scramble effect
 */
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

export function getRandomChar(): string {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

/**
 * Creates a scrambled version of text
 * @param length - Length of scrambled text
 */
export function scrambleText(length: number): string {
  return Array.from({ length }, () => getRandomChar()).join('');
}

/**
 * Animates text from scrambled characters to final text
 * @param finalText - The final text to display
 * @param onUpdate - Callback with current text state
 * @param duration - Duration of the animation
 */
export function animateScramble(
  finalText: string,
  onUpdate: (text: string) => void,
  duration: number = 1500
) {
  const chars = finalText.split('');
  const totalChars = chars.length;
  const intervalDuration = duration / totalChars / 3; // Multiple scrambles per char

  let currentIndex = 0;
  let iteration = 0;

  const interval = setInterval(() => {
    const newText = chars
      .map((char, index) => {
        if (index < currentIndex) {
          return char; // Already revealed
        }
        if (index === currentIndex && iteration % 3 === 0) {
          return char; // Reveal this char
        }
        return getRandomChar(); // Still scrambling
      })
      .join('');

    onUpdate(newText);

    iteration++;
    if (iteration % 3 === 0) {
      currentIndex++;
    }

    if (currentIndex >= totalChars) {
      clearInterval(interval);
      onUpdate(finalText); // Ensure final text is correct
    }
  }, intervalDuration);

  return () => clearInterval(interval);
}

/**
 * Calculate stagger delay for character animations
 * @param index - Character index
 * @param total - Total characters
 * @param staggerAmount - Time between each character
 */
export function getStaggerDelay(
  index: number,
  total: number,
  staggerAmount: number = 0.05
): number {
  return index * staggerAmount;
}
