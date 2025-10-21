import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Google Identity Services sign-in button
const GoogleSignIn = ({ onSuccess, onError }) => {
  const googleButtonRef = useRef(null);
  const { /* login not required for OAuth here */ } = useAuth();

  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google && window.google.accounts && googleButtonRef.current) {
        initializeGoogle();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      if (!window.google || !googleButtonRef.current) return;

      const clientId = (import.meta?.env?.VITE_GOOGLE_CLIENT_ID) || '383189715408-nvk330ofsp601rrm9866idvk3m5anfqh.apps.googleusercontent.com';

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        ux_mode: 'popup',
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        logo_alignment: 'left',
      });
    };

    const handleCredentialResponse = async (response) => {
      try {
        if (!response?.credential) throw new Error('No credential from Google');

        const backendResponse = await fetch('http://localhost:5001/api/v1/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential })
        });

        const data = await backendResponse.json();

        if (data.status === 'success') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          onSuccess && onSuccess(data);
        } else {
          throw new Error(data.message || 'Google sign-in failed');
        }
      } catch (err) {
        console.error('Google sign-in error:', err);
        onError && onError(err);
      }
    };

    loadGoogleScript();

    return () => {
      try {
        window.google?.accounts?.id?.cancel?.();
      } catch {}
    };
  }, [onSuccess, onError]);

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="w-full" />
    </div>
  );
};

export default GoogleSignIn;

import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Real Google Identity Services sign-in button
const GoogleSignIn = ({ onSuccess, onError }) => {
	const googleButtonRef = useRef(null);
	const { /* login (not needed for OAuth, we set storage directly) */ } = useAuth();

	useEffect(() => {
		const loadGoogleScript = () => {
			if (window.google && window.google.accounts && googleButtonRef.current) {
				initializeGoogle();
				return;
			}

			const script = document.createElement('script');
			script.src = 'https://accounts.google.com/gsi/client';
			script.async = true;
			script.defer = true;
			script.onload = initializeGoogle;
			document.head.appendChild(script);
		};

		const initializeGoogle = () => {
			if (!window.google || !googleButtonRef.current) return;

			const clientId = (import.meta?.env?.VITE_GOOGLE_CLIENT_ID) || '383189715408-nvk330ofsp601rrm9866idvk3m5anfqh.apps.googleusercontent.com';

			window.google.accounts.id.initialize({
				client_id: clientId,
				callback: handleCredentialResponse,
				auto_select: false,
				ux_mode: 'popup'
			});

			window.google.accounts.id.renderButton(googleButtonRef.current, {
				theme: 'outline',
				size: 'large',
				type: 'standard',
				shape: 'rectangular',
				text: 'signin_with',
				logo_alignment: 'left'
			});
		};

		const handleCredentialResponse = async (response) => {
			try {
				if (!response?.credential) throw new Error('No credential from Google');

				const backendResponse = await fetch('http://localhost:5001/api/v1/auth/google', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ credential: response.credential })
				});

				const data = await backendResponse.json();

				if (data.status === 'success') {
					localStorage.setItem('token', data.token);
					localStorage.setItem('user', JSON.stringify(data.data.user));
					if (onSuccess) onSuccess(data);
				} else {
					throw new Error(data.message || 'Google sign-in failed');
				}
			} catch (err) {
				console.error('Google sign-in error:', err);
				if (onError) onError(err);
			}
		};

		loadGoogleScript();

		return () => {
			try {
				window.google?.accounts?.id?.cancel?.();
			} catch {}
		};
	}, [onSuccess, onError]);

	return (
		<div className="w-full">
			<div ref={googleButtonRef} className="w-full" />
		</div>
	);
};

export default GoogleSignIn;

