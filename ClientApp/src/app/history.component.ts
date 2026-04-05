import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col space-y-8">
      <!-- Section: Today -->
      <div class="space-y-2">
        <h3 class="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Recent Conversations</h3>
        <div class="space-y-1">
          @if (reversedHistory().length === 0) {
            <div class="px-4 py-8 text-center border border-dashed border-slate-800 rounded-xl">
               <p class="text-xs text-slate-500 font-medium">No history found</p>
            </div>
          }
          @for (item of reversedHistory(); track item.id) {
            <button class="w-full text-left px-4 py-3 rounded-xl transition-all group hover:bg-slate-800/50 border border-transparent hover:border-slate-800 active:scale-[0.98]">
              <div class="flex flex-col min-w-0">
                <span class="text-sm font-semibold text-slate-200 truncate group-hover:text-brand-400 transition-colors">
                  {{ item.prompt }}
                </span>
                <div class="flex items-center space-x-2 mt-1">
                   <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ item.createdAt | date:'shortTime' }}</span>
                   <span class="w-1 h-1 bg-slate-700 rounded-full"></span>
                   <span class="text-[10px] font-bold text-slate-600 uppercase truncate tracking-tighter">{{ item.response.substring(0, 20) }}...</span>
                </div>
              </div>
            </button>
          }
        </div>
      </div>

      <!-- Quick Stats / Status -->
      <div class="px-4 py-6 bg-slate-800/30 rounded-2xl border border-slate-800/50">
         <div class="flex items-center justify-between mb-4">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Environment</span>
            <span [class]="'flex h-2 w-2 rounded-full ' + (chatService.isConnected() ? 'bg-emerald-500' : 'bg-rose-500')"></span>
         </div>
         <div class="space-y-3">
            <div class="flex justify-between items-center text-xs">
               <span class="text-slate-400">Ollama Status</span>
               <span [class]="'font-bold ' + (chatService.isConnected() ? 'text-emerald-400' : 'text-rose-400')">
                  {{ chatService.isConnected() ? 'Active' : 'Inactive' }}
               </span>
            </div>
            <div class="flex justify-between items-center text-xs">
               <span class="text-slate-400">Local Models</span>
               <span class="text-slate-200 font-bold">{{ chatService.models().length }}</span>
            </div>
         </div>
      </div>
    </div>
  `
})
export class HistoryComponent implements OnInit {
  chatService = inject(ChatService);
  reversedHistory = computed(() => [...this.chatService.history()].reverse());

  ngOnInit() {
    this.chatService.loadHistory();
  }
}
