import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dev-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-white rounded-lg shadow-sm border border-slate-200 prose prose-slate max-w-none">
      <h2 class="text-xl font-bold text-slate-900 border-b pb-2 mb-4">Developer Guide</h2>
      <p class="text-slate-600 mb-4">You can connect to this app's API for external integrations. The following endpoints are available:</p>
      
      <div class="space-y-6">
        <section>
          <h3 class="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">Send Chat Prompt</h3>
          <div class="bg-slate-900 rounded-md p-4 text-slate-100 overflow-x-auto text-sm">
            <code>POST /api/chat</code>
            <pre class="mt-2 text-slate-400">
{{ '{' }}
  "prompt": "Hello world",
  "model": "llama3" (optional)
{{ '}' }}</pre>
          </div>
        </section>

        <section>
          <h3 class="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">Get Today's Logs</h3>
          <div class="bg-slate-900 rounded-md p-4 text-slate-100 overflow-x-auto text-sm">
            <code>GET /api/logs</code>
          </div>
        </section>

        <section class="bg-primary-50 p-4 rounded-lg border border-primary-100">
          <h3 class="text-sm font-bold text-primary-800 mb-1">Architecture Note</h3>
          <p class="text-xs text-primary-700">This app acts as a secure bridge between your network and the local Ollama instance. No auth is required for local usage.</p>
        </section>
      </div>
    </div>
  `
})
export class DevGuideComponent {}
