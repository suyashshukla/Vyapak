import { Component, inject, signal, OnInit, effect, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, ChatMessage } from './chat.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col h-full bg-slate-50 rounded-lg shadow-sm overflow-hidden">
      <!-- Model Selection -->
      <div class="p-2 bg-white border-b border-slate-200 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <label class="text-xs font-semibold text-slate-500 uppercase">Model:</label>
          <select 
            [ngModel]="selectedModel()" 
            (ngModelChange)="selectedModel.set($event)"
            class="text-sm border-none bg-slate-50 rounded px-2 py-1 focus:ring-1 focus:ring-primary-500 outline-none"
          >
            @for (model of chatService.models(); track model) {
              <option [value]="model">{{ model }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4" #scrollContainer>
        @if (chatService.history().length === 0) {
          <div class="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Start a new conversation with Ollama</p>
          </div>
        }
        @for (msg of chatService.history(); track msg.id) {
          <div class="flex flex-col space-y-1">
            <div class="self-end bg-primary-600 text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
              {{ msg.prompt }}
            </div>
            <div class="self-start bg-white border border-slate-200 text-slate-800 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] shadow-sm mt-2 whitespace-pre-wrap">
              {{ msg.response }}
            </div>
          </div>
        }
        @if (chatService.loading()) {
          <div class="flex items-center space-x-2 p-2">
            <div class="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-100"></div>
            <div class="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-200"></div>
          </div>
        }
      </div>

      <!-- Input Area -->
      <div class="p-4 bg-white border-t border-slate-200">
        <form (submit)="sendPrompt()" class="flex space-x-2">
          <input 
            type="text" 
            [ngModel]="prompt()" 
            (ngModelChange)="prompt.set($event)"
            name="prompt"
            placeholder="Ask something..."
            class="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            [disabled]="chatService.loading()"
          />
          <button 
            type="submit"
            [disabled]="!prompt().trim() || chatService.loading()"
            class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit {
  chatService = inject(ChatService);
  prompt = signal('');
  selectedModel = signal('');
  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  constructor() {
    // Effect to select the first model automatically
    effect(() => {
      const models = this.chatService.models();
      if (models.length > 0 && !this.selectedModel()) {
        this.selectedModel.set(models[0]);
      }
    });

    // Effect to scroll to the bottom when history changes
    effect(() => {
      const history = this.chatService.history();
      if (history.length > 0) {
        // Wait for DOM update
        setTimeout(() => this.scrollToBottom(), 0);
      }
    });
  }

  ngOnInit() {
    this.chatService.loadHistory();
  }

  private scrollToBottom() {
    const el = this.scrollContainer()?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }

  sendPrompt() {
    const text = this.prompt().trim();
    if (text) {
      this.prompt.set('');
      this.chatService.sendMessage(text, this.selectedModel() || undefined).subscribe();
    }
  }
}
