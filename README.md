# @xsw/react-support

React/Next.js integration package for XSW AI Support Agent.

## Installation

```bash
npm install @xsw/react-support
# or
yarn add @xsw/react-support
# or
pnpm add @xsw/react-support
```

## Quick Start

### Next.js 13+ (App Router)

```tsx
// app/layout.tsx
'use client';
import { XSWProvider } from '@xsw/react-support';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <XSWProvider
          apiUrl="http://localhost:8000"
          apiKey="your_api_key"
          autoTrack={true}
          primaryColor="#667eea"
          position="bottom-right"
        >
          {children}
        </XSWProvider>
      </body>
    </html>
  );
}
```

### Next.js 12 (Pages Router)

```tsx
// pages/_app.tsx
import { XSWProvider } from '@xsw/react-support';

function MyApp({ Component, pageProps }) {
  return (
    <XSWProvider
      apiUrl="http://localhost:8000"
      apiKey="your_api_key"
      autoTrack={true}
    >
      <Component {...pageProps} />
    </XSWProvider>
  );
}

export default MyApp;
```

### React (Vite/CRA)

```tsx
// App.tsx
import { XSWProvider } from '@xsw/react-support';

function App() {
  return (
    <XSWProvider
      apiUrl="http://localhost:8000"
      apiKey="your_api_key"
      autoTrack={true}
    >
      <YourApp />
    </XSWProvider>
  );
}
```

## Usage

### Track Custom Events

```tsx
import { useXSW } from '@xsw/react-support';

function CheckoutButton() {
  const { track } = useXSW({
    apiUrl: 'http://localhost:8000',
    apiKey: 'your_api_key'
  });

  const handleCheckout = async () => {
    try {
      const result = await processPayment();
      
      track('payment_success', {
        amount: 99.99,
        orderId: result.id,
        gateway: 'stripe'
      });
    } catch (error) {
      track('payment_failed', {
        error: error.message,
        errorCode: error.code
      });
    }
  };

  return <button onClick={handleCheckout}>Checkout</button>;
}
```

### Control Widget Programmatically

```tsx
import { useXSWWidget } from '@xsw/react-support';

function HelpButton() {
  const { open, close, toggle } = useXSWWidget({
    apiUrl: 'http://localhost:8000',
    apiKey: 'your_api_key',
    primaryColor: '#667eea'
  });

  return (
    <div>
      <button onClick={open}>Get Help</button>
      <button onClick={close}>Close Help</button>
      <button onClick={toggle}>Toggle Help</button>
    </div>
  );
}
```

### Combined Hook

```tsx
import { useXSWSupport } from '@xsw/react-support';

function MyComponent() {
  const { 
    track, 
    identify, 
    openWidget, 
    isReady 
  } = useXSWSupport({
    apiUrl: 'http://localhost:8000',
    apiKey: 'your_api_key',
    autoTrack: true
  });

  useEffect(() => {
    if (isReady) {
      identify('user_123', {
        email: 'user@example.com',
        plan: 'premium'
      });
    }
  }, [isReady, identify]);

  return (
    <div>
      <button onClick={() => track('button_click')}>
        Track Event
      </button>
      <button onClick={openWidget}>
        Need Help?
      </button>
    </div>
  );
}
```

## API Reference

### `XSWProvider`

Wrapper component that initializes XSW for your entire app.

**Props:**
- `apiUrl` (string, required): Your XSW backend URL
- `apiKey` (string, required): Your API key
- `autoTrack` (boolean, optional): Auto-track page views and clicks
- `userId` (string, optional): User identifier
- `sessionId` (string, optional): Session identifier
- `primaryColor` (string, optional): Widget primary color
- `accentColor` (string, optional): Widget accent color
- `position` (string, optional): Widget position ('bottom-right', 'bottom-left', etc.)
- `greeting` (string, optional): Custom greeting message

### `useXSW(config)`

Hook for event tracking.

**Returns:**
- `track(eventName, properties?)`: Track custom events
- `identify(userId, traits?)`: Identify users
- `isReady`: Boolean indicating if SDK is loaded
- `error`: Error object if initialization failed

### `useXSWWidget(config)`

Hook for widget control.

**Returns:**
- `open()`: Open the chat widget
- `close()`: Close the chat widget
- `toggle()`: Toggle widget visibility
- `isReady`: Boolean indicating if widget is loaded
- `error`: Error object if initialization failed

### `useXSWSupport(config)`

Combined hook for both tracking and widget.

**Returns:** All methods from `useXSW` and `useXSWWidget`

## TypeScript Support

This package includes full TypeScript definitions.

```tsx
import type { XSWConfig, XSWWidgetConfig, XSWEvent } from '@xsw/react-support';
```

## Environment Variables

For Next.js, you can use environment variables:

```env
NEXT_PUBLIC_XSW_API_URL=http://localhost:8000
NEXT_PUBLIC_XSW_API_KEY=your_api_key
```

```tsx
<XSWProvider
  apiUrl={process.env.NEXT_PUBLIC_XSW_API_URL!}
  apiKey={process.env.NEXT_PUBLIC_XSW_API_KEY!}
>
  {children}
</XSWProvider>
```

## Examples

See the [examples](../../examples) directory for complete examples:
- Next.js 13 App Router
- Next.js 12 Pages Router
- React with Vite
- React with Create React App

## License

MIT
