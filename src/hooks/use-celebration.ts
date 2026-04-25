import { useCallback, useRef } from "react";
import confetti from "canvas-confetti";

const COLORS_NAVY_GOLD = ["#2C4A7C", "#B8860B", "#FDFBF7", "#4A6FA5"];
const COLORS_WARM = ["#B8860B", "#D4A843", "#E8C872", "#FDFBF7"];

/**
 * Celebration animations for meaningful events.
 *
 * - `firework()`   — milestone completion, grade raise
 * - `sectionComplete()` — finishing an entire grade-level roadmap
 * - `miniPop(e)`   — small task check-off (anchored to click position)
 */
export function useCelebration() {
  // Throttle to prevent rapid-fire spam
  const lastFired = useRef(0);

  const throttle = (ms: number) => {
    const now = Date.now();
    if (now - lastFired.current < ms) return false;
    lastFired.current = now;
    return true;
  };

  /** Major celebration — single burst of confetti. For milestones & grade raises. */
  const firework = useCallback(() => {
    if (!throttle(800)) return;

    // Two angled bursts from bottom corners for a balanced feel
    const defaults = {
      particleCount: 40,
      spread: 55,
      colors: COLORS_NAVY_GOLD,
      ticks: 80,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
      disableForReducedMotion: true,
    };

    confetti({ ...defaults, angle: 60, origin: { x: 0.3, y: 0.7 } });
    confetti({ ...defaults, angle: 120, origin: { x: 0.7, y: 0.7 } });
  }, []);

  /** Big celebration — completing all milestones for a grade level. */
  const sectionComplete = useCallback(() => {
    if (!throttle(1200)) return;

    const duration = 1500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.6 },
        colors: COLORS_WARM,
        ticks: 100,
        gravity: 0.8,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.6 },
        colors: COLORS_WARM,
        ticks: 100,
        gravity: 0.8,
        disableForReducedMotion: true,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  /** Mini pop — subtle confetti anchored to the click origin. For small tasks. */
  const miniPop = useCallback((e?: React.MouseEvent) => {
    if (!throttle(400)) return;

    const x = e ? e.clientX / window.innerWidth : 0.5;
    const y = e ? e.clientY / window.innerHeight : 0.5;

    confetti({
      particleCount: 15,
      spread: 40,
      startVelocity: 15,
      ticks: 50,
      gravity: 1.5,
      decay: 0.92,
      origin: { x, y },
      colors: COLORS_NAVY_GOLD,
      scalar: 0.7,
      disableForReducedMotion: true,
    });
  }, []);

  return { firework, sectionComplete, miniPop };
}
