'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

export const ThemedImage = React.forwardRef<
  HTMLImageElement,
  { srcDark?: string } & React.ImgHTMLAttributes<HTMLImageElement>
>(({ src, srcDark, ...rest }, forwardedRef) => {
  const { theme } = useTheme();
  const [imgSrc, setImgSrc] = React.useState(src);

  React.useEffect(() => {
    setImgSrc(theme === 'dark' && srcDark ? srcDark || src : src);
  }, [theme, src, srcDark]);

  // eslint-disable-next-line jsx-a11y/alt-text
  return <img ref={forwardedRef} src={imgSrc} {...rest} />;
});
ThemedImage.displayName = 'ThemedImage';
