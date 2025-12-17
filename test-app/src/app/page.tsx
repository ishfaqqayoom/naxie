'use client';
import { ChatComponent } from 'naxie';
import { useState } from 'react';
// Input component not available in test-app, using standard input

export default function Home() {
  const [apiKey, setApiKey] = useState('');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Naxie Chat Component Demo
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Click the chat bubble in the bottom-right corner to start chatting!
        </p>

        <div className='w-full max-w-md mx-auto mb-8 bg-white p-6 rounded-lg shadow'>
          <h2 className="text-lg font-semibold mb-4">API Configuration</h2>
          <div className='flex flex-col gap-2'>
            <label className="text-sm font-medium">Enter your Cognax API Key:</label>
            <input
              type="password"
              placeholder="Enter API Key here..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-gray-300"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Setup Instructions:</h2>

          <h3 className="text-lg font-semibold mb-2 text-gray-700">1. Add Environment Variable</h3>
          <p className="text-gray-600 mb-3">Create a <code className="bg-gray-200 px-1 rounded">.env.local</code> file in your project root:</p>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>NEXT_PUBLIC_API_ENDPOINT_SOCKET=wss://your-server.com</pre>
          </div>

          <h3 className="text-lg font-semibold mb-2 text-gray-700">2. Use the Component</h3>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
            <pre>{`<ChatComponent
  websocketConfig={{
    endpoint: 'dashboard/chat',
    baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT_SOCKET
  }}
  apiConfig={{
    baseUrl: 'https://api.cognax.ai/api', // or your base url
    apiKey: 'your-api-key'
  }}
  title="Chat with Naxie"
  placeholder="Ask a question..."
/>`}</pre>
          </div>
        </div>
      </div>

      {/* Naxie Chat Component */}
      <ChatComponent
        websocketConfig={{
          endpoint: 'answer/ws',
          baseUrl: process.env.NEXT_PUBLIC_API_ENDPOINT_SOCKET || 'wss://dev-api.cognax.ai/api',
        }}

        title="Chat with Naxie"
        placeholder="Ask a question about your data..."
        defaultOpen={false}
        apiConfig={{
          baseUrl: 'https://dev-api.cognax.ai/api', // Hardcoded base URL for demo, could make this configurable too
          apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWRjMGQxMTktZmRhYi00OTBkLWI0NWItMDdkNTI1Mzc0MzEyIiwib3JnYW5pc2F0aW9uX2lkIjoiZDk2ZTliZWQtZTUxZS00NmY5LWEzZDYtYWY4YWQ5NDYyMWU5IiwiZW1haWwiOiJhZG1pbkBjb2duYXhkZXYuYWkiLCJyb2xlIjoiYWRtaW4iLCJwYXNzd29yZF9zdGF0dXMiOnRydWUsImV4cCI6MTc2NjAzNzE4N30.NfbxfjXLm0Z8aP9AS-W4g9UaKsNPV6PGr3HQNciLjYE'
        }}
      />
    </main>
  );
}
