

import React, { Suspense } from 'react';
import CallbackCodeToken from '@/app/components/callbackCodeToken';

export default function CallbackCodeTokenPage() {
  return (
    <Suspense fallback={<div></div>}>
      <CallbackCodeToken />
    </Suspense>
  );
}

