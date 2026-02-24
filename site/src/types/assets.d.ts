/**
 * SVG module declarations for TypeScript
 */

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '@tenant-theme' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.svg' {
  import { FC, SVGProps } from 'react';
  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;
}

declare module '*.svg?url' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.ico' {
  const content: string;
  export default content;
}
