/**
 * XSW AI Support Agent - React Integration
 * 
 * Provides React hooks and components for easy integration
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface XSWConfig {
    apiUrl: string;
    apiKey: string;
    autoTrack?: boolean;
    userId?: string;
    sessionId?: string;
}

export interface XSWWidgetConfig extends XSWConfig {
    primaryColor?: string;
    accentColor?: string;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    greeting?: string;
}

export interface XSWEvent {
    eventName: string;
    properties?: Record<string, any>;
}

declare global {
    interface Window {
        XSW?: {
            init: (config: XSWConfig) => void;
            track: (eventName: string, properties?: Record<string, any>) => void;
            identify: (userId: string, traits?: Record<string, any>) => void;
        };
        XSWWidget?: {
            init: (config: XSWWidgetConfig) => void;
            open: () => void;
            close: () => void;
            toggle: () => void;
        };
    }
}

/**
 * Load XSW scripts dynamically
 */
const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
    });
};

/**
 * Main hook for XSW integration
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { track, identify, isReady } = useXSW({
 *     apiUrl: 'http://localhost:8000',
 *     apiKey: 'your_api_key',
 *     autoTrack: true
 *   });
 * 
 *   const handleCheckout = () => {
 *     track('checkout_started', { amount: 99.99 });
 *   };
 * 
 *   return <button onClick={handleCheckout}>Checkout</button>;
 * }
 * ```
 */
export function useXSW(config: XSWConfig) {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const configRef = useRef(config);

    useEffect(() => {
        configRef.current = config;
    }, [config]);

    useEffect(() => {
        const init = async () => {
            try {
                await loadScript(`${config.apiUrl}/static/xsw-sdk.js`);

                if (window.XSW) {
                    window.XSW.init(configRef.current);
                    setIsReady(true);
                }
            } catch (err) {
                setError(err as Error);
                console.error('Failed to initialize XSW:', err);
            }
        };

        init();
    }, [config.apiUrl]);

    const track = useCallback((eventName: string, properties?: Record<string, any>) => {
        if (window.XSW) {
            window.XSW.track(eventName, properties);
        } else {
            console.warn('XSW not initialized yet');
        }
    }, []);

    const identify = useCallback((userId: string, traits?: Record<string, any>) => {
        if (window.XSW) {
            window.XSW.identify(userId, traits);
        } else {
            console.warn('XSW not initialized yet');
        }
    }, []);

    return { track, identify, isReady, error };
}

/**
 * Hook for XSW chat widget
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { open, close, toggle } = useXSWWidget({
 *     apiUrl: 'http://localhost:8000',
 *     apiKey: 'your_api_key',
 *     primaryColor: '#667eea',
 *     position: 'bottom-right'
 *   });
 * 
 *   return <button onClick={open}>Get Help</button>;
 * }
 * ```
 */
export function useXSWWidget(config: XSWWidgetConfig) {
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const configRef = useRef(config);

    useEffect(() => {
        configRef.current = config;
    }, [config]);

    useEffect(() => {
        const init = async () => {
            try {
                await loadScript(`${config.apiUrl}/static/xsw-widget.js`);

                if (window.XSWWidget) {
                    window.XSWWidget.init(configRef.current);
                    setIsReady(true);
                }
            } catch (err) {
                setError(err as Error);
                console.error('Failed to initialize XSW Widget:', err);
            }
        };

        init();
    }, [config.apiUrl]);

    const open = useCallback(() => {
        if (window.XSWWidget) {
            window.XSWWidget.open();
        }
    }, []);

    const close = useCallback(() => {
        if (window.XSWWidget) {
            window.XSWWidget.close();
        }
    }, []);

    const toggle = useCallback(() => {
        if (window.XSWWidget) {
            window.XSWWidget.toggle();
        }
    }, []);

    return { open, close, toggle, isReady, error };
}

/**
 * Combined hook for both tracking and widget
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { track, openWidget } = useXSWSupport({
 *     apiUrl: 'http://localhost:8000',
 *     apiKey: 'your_api_key',
 *     autoTrack: true,
 *     primaryColor: '#667eea'
 *   });
 * 
 *   return (
 *     <div>
 *       <button onClick={() => track('button_click')}>Track</button>
 *       <button onClick={openWidget}>Help</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useXSWSupport(config: XSWWidgetConfig) {
    const tracking = useXSW(config);
    const widget = useXSWWidget(config);

    return {
        // Tracking
        track: tracking.track,
        identify: tracking.identify,

        // Widget
        openWidget: widget.open,
        closeWidget: widget.close,
        toggleWidget: widget.toggle,

        // Status
        isReady: tracking.isReady && widget.isReady,
        error: tracking.error || widget.error
    };
}

/**
 * React component wrapper for XSW
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <XSWProvider
 *       apiUrl="http://localhost:8000"
 *       apiKey="your_api_key"
 *       autoTrack={true}
 *       primaryColor="#667eea"
 *     >
 *       <YourApp />
 *     </XSWProvider>
 *   );
 * }
 * ```
 */
export function XSWProvider({
    children,
    ...config
}: XSWWidgetConfig & { children: React.ReactNode }) {
    useXSWSupport(config);
    return <>{children}</>;
}

// Export types
