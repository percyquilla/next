// ----------------------------------------------------------------------

export const transitionEnter = (props?: Record<string, any>) => ({
  duration: 0.64,
  ease: [0.43, 0.13, 0.23, 0.96],
  ...props,
});

export const transitionExit = (props?: Record<string, any>) => ({
  duration: 0.48,
  ease: [0.43, 0.13, 0.23, 0.96],
  ...props,
});
