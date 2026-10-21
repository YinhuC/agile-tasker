import { useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

/** True from the md breakpoint up, known on the first render so desktop-only images are never fetched on phones. */
export function useIsDesktop() {
  const theme = useMantineTheme();
  return useMediaQuery(`(min-width: ${theme.breakpoints.md})`, undefined, {
    getInitialValueInEffect: false,
  });
}
