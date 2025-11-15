import { createTailwindMerge, getDefaultConfig } from "tailwind-merge";
import theme from "./tokens";

export const twMerge = createTailwindMerge(() => {
  const defaultConfig = getDefaultConfig();

  return {
    ...defaultConfig,

    cacheSize: 500,
    separator: ":",

    classGroups: {
      ...defaultConfig.classGroups,

      rounded: Object.keys(theme.borderRadius).map((key) =>
        key === "DEFAULT" ? "rounded" : `rounded-${key}`
      ),

      "font-size": Object.keys(theme.fontSize).map((key) => `text-${key}`),
    },

    theme: defaultConfig.theme,
    conflictingClassGroups: defaultConfig.conflictingClassGroups,
    conflictingClassGroupModifiers: defaultConfig.conflictingClassGroupModifiers,
  };
});

// export CVA for variants
export { cva } from "class-variance-authority";
export type { VariantProps } from "class-variance-authority";
