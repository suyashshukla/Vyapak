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
    <div class="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <!-- Loading Overlay -->
      @if (chatService.isProcessing()) {
        <div class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-300">
          <div class="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-4 border border-white/50">
            <div class="relative w-16 h-16">
              <div class="absolute inset-0 rounded-full border-4 border-brand-100"></div>
              <div class="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-lg font-semibold text-slate-900 tracking-tight">Processing</span>
              <span class="text-xs text-slate-500 font-medium">Communicating with Ollama...</span>
            </div>
          </div>
        </div>
      }

      <!-- Sidebar -->
      @if (isSidebarOpen()) {
        <div (click)="isSidebarOpen.set(false)" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden animate-in fade-in duration-300"></div>
      }
      <aside 
        [class]="'fixed lg:static inset-y-0 left-0 w-80 bg-slate-900 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 z-40 ' + (isSidebarOpen() ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')"
      >
        <!-- Logo Section -->
        <div class="p-6 border-b border-slate-800/50 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-900/20">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span class="text-xl font-bold text-white tracking-tight">Vyapak <span class="text-brand-400">AI</span></span>
          </div>
          <button (click)="isSidebarOpen.set(false)" class="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Navigation & History -->
        <div class="flex-1 overflow-hidden flex flex-col p-4 space-y-6">
          <button (click)="setActiveTab('chat')" class="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-brand-600/10 text-brand-400 border border-brand-500/20 hover:bg-brand-600/20 transition-all group">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <span class="font-semibold">New conversation</span>
          </button>
          
          <div class="flex-1 overflow-y-auto scrollbar-hide">
            <app-history></app-history>
          </div>
        </div>

        <!-- Footer Settings -->
        <div class="p-4 border-t border-slate-800/50">
           <button (click)="setActiveTab('guide')" [class]="'w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ' + (activeTab() === 'guide' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200')">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span class="font-medium text-sm">Developer Guide</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col min-w-0 bg-white relative">
        @if (chatService.modelsFetched() && chatService.models().length === 0) {
          <div class="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
            <div class="w-24 h-24 bg-amber-50 rounded-3xl flex items-center justify-center mb-6 border border-amber-100 shadow-inner">
              <svg class="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15.3c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Connection Required</h2>
            <p class="text-slate-600 max-w-md mb-8 leading-relaxed">Vyapak AI couldn't find a running Ollama instance on your machine. Please start Ollama and try again.</p>
            <button (click)="chatService.loadModels()" class="btn-primary flex items-center space-x-2 px-8 py-3 rounded-xl">
              <span>Verify Connection</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        } @else {
          <!-- Floating Header -->
          <header class="h-16 glass flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 overflow-hidden">
            <div class="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <button (click)="isSidebarOpen.set(!isSidebarOpen())" class="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div class="flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap">
                <div [class]="'w-2 h-2 rounded-full flex-shrink-0 ' + (chatService.isConnected() ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500')"></div>
                <span class="text-[10px] sm:text-sm font-bold sm:font-semibold text-slate-700 uppercase tracking-wider">
                  {{ chatService.isConnected() ? 'Live' : 'Offline' }}<span class="hidden xs:inline ml-1">{{ chatService.isConnected() ? 'Connection' : '' }}</span>
                </span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 flex-shrink-0">
               <span class="hidden sm:inline text-xs font-bold text-slate-400 uppercase tracking-widest">Model Hub</span>
               <div class="px-2 sm:px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] sm:text-xs font-bold text-slate-600 whitespace-nowrap">
                  {{ chatService.models().length }} <span class="hidden xs:inline">Available</span><span class="xs:hidden">Models</span>
               </div>
            </div>
          </header>

          <!-- Content -->
          <div class="flex-1 overflow-hidden">
            @if (activeTab() === 'chat') {
              <app-chat></app-chat>
            } @else {
              <div class="h-full overflow-y-auto p-8 max-w-4xl mx-auto">
                <app-dev-guide></app-dev-guide>
              </div>
            }
          </div>
        }
      </main>
    </div>
  `
})
export class App implements OnInit {
  chatService = inject(ChatService);
  activeTab = signal<'chat' | 'guide'>('chat');
  isSidebarOpen = signal(false);

  ngOnInit() {
    this.chatService.loadModels();
  }

  setActiveTab(tab: 'chat' | 'guide') {
    this.activeTab.set(tab);
    this.isSidebarOpen.set(false);
  }
}
