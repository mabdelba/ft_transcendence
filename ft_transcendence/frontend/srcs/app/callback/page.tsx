// pages/callback.js
'use client';

import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useEffect } from 'react';

const CallbackPage = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      if (window.opener && code) {
        window.opener.postMessage({ code }, 'http://localhost:4000');
      }
    }
  }, []);
  return (
    <div>
      <h1>Callback Page</h1>
    </div>
  );
};

export default CallbackPage;
