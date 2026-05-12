export const quickFade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

export const slideIn = {
  initial: { opacity: 0, x: -12 },
  animate: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  }),
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
}

export const pageTransition = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2 } },
}

export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
}

export const badgePop = {
  initial: { scale: 0 },
  animate: { scale: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
}
