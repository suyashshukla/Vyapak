import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dev-guide',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="border-b border-slate-200 pb-8">
        <h1 class="text-4xl font-bold text-slate-900 tracking-tight mb-4">Developer Integration</h1>
        <p class="text-lg text-slate-600 max-w-2xl leading-relaxed">Connect your external tools, scripts, and applications to Vyapak AI via our local API endpoints.</p>
      </div>

      <div class="grid grid-cols-1 gap-12">
        <section class="space-y-4">
          <div class="flex items-center space-x-3">
             <span class="px-2 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold uppercase rounded tracking-wider border border-brand-100">Endpoint</span>
             <h2 class="text-xl font-bold text-slate-900">Send Chat Message</h2>
          </div>
          <div class="bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
             <div class="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                <span class="text-xs font-mono text-slate-400">POST /api/chat</span>
                <span class="text-[10px] font-bold text-slate-500 uppercase">JSON</span>
             </div>
             <pre class="p-6 text-sm text-brand-300 overflow-x-auto">
<code>{{ '{' }}
  "prompt": "Hello from external app",
  "model": "llama3" 
{{ '}' }}</code></pre>
          </div>
          <p class="text-sm text-slate-500">Submit a new prompt to the local Ollama instance. If the model is not specified, the first available model will be used.</p>
        </section>

        <section class="space-y-4">
          <div class="flex items-center space-x-3">
             <span class="px-2 py-1 bg-brand-50 text-brand-700 text-[10px] font-bold uppercase rounded tracking-wider border border-brand-100">Endpoint</span>
             <h2 class="text-xl font-bold text-slate-900">Retrieve Logs</h2>
          </div>
          <div class="bg-slate-900 rounded-2xl overflow-hidden shadow-xl">
             <div class="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                <span class="text-xs font-mono text-slate-400">GET /api/logs</span>
             </div>
             <div class="p-6">
                <p class="text-sm text-slate-400">Returns an array of today's conversation history.</p>
             </div>
          </div>
        </section>

        <section class="p-8 bg-brand-50 rounded-3xl border border-brand-100 relative overflow-hidden">
          <div class="relative z-10">
             <h3 class="text-lg font-bold text-brand-900 mb-2">Local-First Architecture</h3>
             <p class="text-sm text-brand-800 leading-relaxed max-w-xl">Vyapak AI operates entirely on your infrastructure. All data remains local to your machine, ensuring maximum privacy and zero latency for your development workflows.</p>
          </div>
          <svg class="absolute -right-8 -bottom-8 w-48 h-48 text-brand-100 opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </section>
      </div>
    </div>
  `
})
export class DevGuideComponent {}
