import 'react-lazy-load-image-component/src/effects/blur.css';

import React from 'react';
import type { LazyLoadImageProps } from 'react-lazy-load-image-component';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const MyLazyLoadedImage: React.FC<LazyLoadImageProps> = ({ ...rest }) => {
  return <LazyLoadImage {...rest} effect="blur" />;
};

export default MyLazyLoadedImage;
