// ----------------------------------------------------------------------

export const varContainer = (props?: Record<string, any>) => ({
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
      ...props?.transitionIn,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      ...props?.transitionOut,
    },
  },
});
