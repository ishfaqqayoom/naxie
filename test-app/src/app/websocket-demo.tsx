'use client';

import { ChatComponent } from 'naxie';

export default function WebSocketDemo() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Naxie WebSocket Demo
        </h1>
        <p className="text-center text-gray-600 mb-8">
          This demo uses WebSocket mode - configure your WebSocket server below
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">WebSocket Configuration:</h2>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
            <p className="mb-2"><strong>Endpoint:</strong> 'dashboard/chat'</p>
            <p className="mb-2"><strong>Base URL:</strong> Your WebSocket server URL</p>
            <p className="text-gray-600 text-xs mt-4">
              Update the websocketConfig prop in the ChatComponent below with your server details
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> This example requires a WebSocket server. 
            If you don't have one, use the controlled mode demo instead (page.tsx).
          </p>
        </div>
      </div>

      {/* Naxie Chat Component with WebSocket */}
      <ChatComponent
        websocketConfig={{
          endpoint: 'dashboard/chat',
          baseUrl: 'wss://your-websocket-server.com', // Replace with your WebSocket server
          onConnect: () => console.log('WebSocket connected!'),
          onDisconnect: () => console.log('WebSocket disconnected'),
          onError: (error) => console.error('WebSocket error:', error),
        }}
        title="WebSocket Chat"
        placeholder="Type a message..."
        defaultOpen={false}
      />
    </main>
  );
}
