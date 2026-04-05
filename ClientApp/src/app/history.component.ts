import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div class="p-4 border-b border-slate-100 bg-slate-50">
        <h2 class="font-semibold text-slate-800 flex items-center">
          <svg class="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History (Today)
        </h2>
      </div>
      <div class="flex-1 overflow-y-auto">
        @if (reversedHistory().length === 0) {
          <div class="p-8 text-center text-slate-400 text-sm">
            No history yet
          </div>
        }
        <ul class="divide-y divide-slate-100">
          @for (item of reversedHistory(); track item.id) {
            <li class="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div class="text-xs text-slate-400 mb-1">
                {{ item.createdAt | date:'shortTime' }}
              </div>
              <div class="text-sm font-medium text-slate-700 truncate group-hover:text-primary-600">
                {{ item.prompt }}
              </div>
              <div class="text-xs text-slate-500 truncate mt-1">
                {{ item.response }}
              </div>
            </li>
          }
        </ul>
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
