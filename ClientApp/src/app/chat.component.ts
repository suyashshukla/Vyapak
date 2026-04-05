import { Component, inject, signal, OnInit, effect, viewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService, ChatMessage } from './chat.service';
import { FormsModule } from '@angular/forms';
import { MarkdownPipe } from './markdown.pipe';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownPipe],
  template: `
    <div class="flex flex-col h-full relative bg-white">
      <!-- Messages List -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth" #scrollContainer>
        @if (chatService.history().length === 0) {
          <div class="max-w-3xl mx-auto h-full flex flex-col items-center justify-center space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div class="text-center space-y-4">
               <div class="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-100">
                  <svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
               </div>
               <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight px-4">How can I help you today?</h1>
               <p class="text-slate-500 text-base sm:text-lg max-w-lg mx-auto leading-relaxed px-4">Vyapak AI is connected to your local Ollama server. Ask anything or choose a suggestion below.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl px-4">
              @for (suggestion of suggestions; track suggestion.title) {
                <button 
                  (click)="prompt.set(suggestion.text); sendPrompt()"
                  class="p-4 sm:p-6 text-left bg-slate-50 border border-slate-200 rounded-2xl hover:border-brand-400 hover:bg-brand-50/30 transition-all group shadow-sm hover:shadow-md"
                >
                  <h3 class="font-bold text-slate-900 mb-1 group-hover:text-brand-700 text-sm sm:text-base">{{ suggestion.title }}</h3>
                  <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">{{ suggestion.description }}</p>
                </button>
              }
            </div>
          </div>
        }

        <div class="max-w-4xl mx-auto w-full space-y-8">
          @for (msg of chatService.history(); track msg.id) {
            <!-- User Message -->
            <div class="flex flex-col items-end group">
              <div class="chat-bubble-user max-w-[90%] sm:max-w-[85%]">
                {{ msg.prompt }}
              </div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">You</span>
            </div>

            <!-- AI Message -->
            @if (msg.response) {
              <div class="flex flex-col items-start group">
                <div class="w-full flex space-x-3 sm:space-x-4">
                  <div class="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 mt-1">
                    <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div class="flex-1 min-w-0 space-y-3">
                    <div class="chat-bubble-ai markdown-content w-full max-w-none sm:max-w-[90%] lg:max-w-[85%]" [innerHTML]="msg.response | markdown | async"></div>
                    <div class="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button (click)="copyToClipboard(msg.response)" class="text-[10px] font-bold text-slate-400 hover:text-brand-600 uppercase tracking-widest flex items-center space-x-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        <span>Copy</span>
                      </button>
                      <span class="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{{ msg.createdAt | date:'shortTime' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        @if (chatService.loading()) {
          <div class="max-w-4xl mx-auto w-full flex space-x-4 animate-pulse">
            <div class="flex-shrink-0 w-8 h-8 bg-slate-50 rounded-lg border border-slate-100"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-slate-50 rounded w-3/4"></div>
              <div class="h-4 bg-slate-50 rounded w-1/2"></div>
            </div>
          </div>
        }
      </div>

      <!-- Floating Input Area -->
      <div class="p-4 sm:p-6 bg-white border-t border-slate-100">
        <div class="max-w-4xl mx-auto relative group">
          <form (submit)="sendPrompt()" class="relative">
            <textarea 
              [ngModel]="prompt()" 
              (ngModelChange)="prompt.set($event)"
              name="prompt"
              rows="1"
              placeholder="Message Vyapak AI..."
              (keydown.enter)="$event.preventDefault(); sendPrompt()"
              class="w-full px-4 sm:px-6 py-4 pr-28 sm:pr-36 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none transition-all placeholder:text-slate-400 font-medium"
              [disabled]="chatService.loading()"
            ></textarea>
            
            <div class="absolute right-2 sm:right-3 bottom-3 flex items-center space-x-1.5 sm:space-x-2">
               <div class="flex flex-col items-end mr-1 sm:mr-3">
                  <select 
                    [ngModel]="selectedModel()" 
                    (ngModelChange)="selectedModel.set($event)"
                    class="text-[10px] font-bold text-slate-400 uppercase bg-transparent border-none focus:ring-0 cursor-pointer hover:text-brand-600 transition-colors max-w-[80px] sm:max-w-none truncate"
                  >
                    @for (model of chatService.models(); track model) {
                      <option [value]="model">{{ model }}</option>
                    }
                  </select>
               </div>

               <button 
                  type="submit"
                  [disabled]="!prompt().trim() || chatService.loading()"
                  class="w-9 h-9 sm:w-10 sm:h-10 bg-brand-600 text-white rounded-xl flex items-center justify-center hover:bg-brand-700 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-brand-500/20 active:scale-90"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </button>
            </div>
          </form>
          <p class="text-[9px] sm:text-[10px] text-center text-slate-400 mt-3 uppercase tracking-widest font-bold">Vyapak AI may provide inaccurate info. Verify important facts.</p>
        </div>
      </div>
    </div>
  `
})
export class ChatComponent implements OnInit {
  chatService = inject(ChatService);
  prompt = signal('');
  selectedModel = signal('');
  scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  suggestions = [
    { title: 'Explain Quantum', description: 'What is quantum entanglement in simple terms?', text: 'Explain quantum entanglement like I am 5 years old.' },
    { title: 'Code Review', description: 'Help me optimize this JavaScript function.', text: 'Can you review this code for performance: \n\n const arr = [1,2,3]; \n arr.map(x => x * 2);' },
    { title: 'Write Email', description: 'Draft a professional follow-up email.', text: 'Write a professional follow-up email after a job interview for a Software Engineer position.' },
    { title: 'Creative Idea', description: 'Give me 5 blog post titles for AI tech.', text: 'Generate 5 catchy blog post titles about the future of local LLMs like Ollama.' }
  ];

  constructor() {
    effect(() => {
      const models = this.chatService.models();
      if (models.length > 0 && !this.selectedModel()) {
        this.selectedModel.set(models[0]);
      }
    });

    effect(() => {
      const history = this.chatService.history();
      if (history.length > 0) {
        setTimeout(() => this.scrollToBottom(), 100);
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

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }

  sendPrompt() {
    const text = this.prompt().trim();
    if (text) {
      this.prompt.set('');
      this.chatService.sendMessage(text, this.selectedModel() || undefined).subscribe();
    }
  }
}
