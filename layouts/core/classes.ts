import { createClasses } from '@/theme/create-classes';

export const layoutClasses = {
  root: createClasses('layout__root'),
  main: createClasses('layout__main'),
  header: createClasses('layout__header'),
  nav: {
    root: createClasses('layout__nav__root'),
    mobile: createClasses('layout__nav__mobile'),
  },
  content: createClasses('layout__main__content'),
};
