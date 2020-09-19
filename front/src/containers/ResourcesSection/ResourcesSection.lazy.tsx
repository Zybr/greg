import React, { lazy, Suspense } from 'react';

const LazyResourcesSection = lazy(() => import('./ResourcesSection'));

const ResourcesSection = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyResourcesSection {...props} />
  </Suspense>
);

export default ResourcesSection;
