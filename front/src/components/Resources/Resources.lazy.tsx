import React, { lazy, Suspense } from 'react';

const LazyResources = lazy(() => import('./Resources'));

// const Resources = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
//   <Suspense fallback={null}>
//     <LazyResources {...props} />
//   </Suspense>
// );
//
// export default Resources;
