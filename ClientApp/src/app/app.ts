import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { HistoryComponent } from './history.component';
import { DevGuideComponent } from './dev-guide.component';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChatComponent, HistoryComponent, DevGuideComponent],
  template: `
    <!-- Global Loading Overlay -->
    @if (chatService.isProcessing()) {
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center transition-all">
        <div class="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center space-y-4">
          <div class="relative">
            <div class="w-12 h-12 border-4 border-primary-100 rounded-full"></div>
            <div class="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p class="text-sm font-medium text-slate-600">Processing...</p>
        </div>
      </div>
    }

    @if (chatService.modelsFetched() && chatService.models().length === 0) {
      <div class="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-600 space-y-4 p-8">
        <div class="bg-amber-100 p-4 rounded-full">
          <svg class="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15.3c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold">Ollama is not running</h2>
        <p class="text-center max-w-md">Please start Ollama on your machine to use the chat interface.</p>
        <button (click)="chatService.loadModels()" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
          Try Again
        </button>
      </div>
    } @else {
      <div class="min-h-screen bg-slate-100 flex flex-col">
        <!-- Header -->
        <header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200 overflow-hidden">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 leading-tight">Vyapak AI</h1>
              <p class="text-xs font-medium text-slate-500 uppercase tracking-widest">Local Ollama Bridge</p>
            </div>
          </div>
          <nav class="flex items-center space-x-1">
            <button 
              (click)="activeTab.set('chat')"
              [class]="'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' + (activeTab() === 'chat' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50')"
            >
              Chat
            </button>
            <button 
              (click)="activeTab.set('guide')"
              [class]="'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' + (activeTab() === 'guide' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50')"
            >
              Developer Guide
            </button>
          </nav>
        </header>

        <!-- Main Content -->
        <main class="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
          <!-- Sidebar: History (Visible on large screens) -->
          <aside class="hidden lg:block lg:col-span-1">
            <app-history></app-history>
          </aside>

          <!-- Dynamic Content Area -->
          <div class="lg:col-span-3 h-[calc(100vh-10rem)]">
            @if (activeTab() === 'chat') {
              <app-chat></app-chat>
            } @else if (activeTab() === 'guide') {
              <app-dev-guide></app-dev-guide>
            }
          </div>
        </main>

        <!-- Footer -->
        <footer class="bg-white border-t border-slate-200 px-6 py-3 text-center text-xs text-slate-400">
          Vyapak AI Bridge &copy; 2026. Powered by OllamaSharp & Angular.
        </footer>
      </div>
    }
  `
})
export class App implements OnInit {
  chatService = inject(ChatService);
  activeTab = signal<'chat' | 'guide'>('chat');

  ngOnInit() {
    this.chatService.loadModels();
  }
}
