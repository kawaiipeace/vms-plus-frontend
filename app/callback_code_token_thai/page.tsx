

import React, { Suspense } from 'react';
import CallbackCodeTokenThai from '@/components/callbackCodeTokenThai';

export default function CallbackCodeTokenPage() {
  return (
    <Suspense fallback={<div></div>}>
      <CallbackCodeTokenThai />
    </Suspense>
  );
}

