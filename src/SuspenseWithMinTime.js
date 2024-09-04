import React, { useState, useEffect, Suspense } from 'react';

function SuspenseWithMinTime({ fallback, children, minDisplayTime = 1000 }) {
  const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRenderChildren(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  return (
    <Suspense fallback={fallback}>
      {shouldRenderChildren ? children : fallback}
    </Suspense>
  );
}

export default SuspenseWithMinTime;