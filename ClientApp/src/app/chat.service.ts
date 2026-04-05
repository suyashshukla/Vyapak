import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of, finalize } from 'rxjs';

export interface ChatMessage {
  id: number;
  prompt: string;
  response: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = '/api';

  history = signal<ChatMessage[]>([]);
  models = signal<string[]>([]);
  loading = signal<boolean>(false);
  modelsFetched = signal<boolean>(false);
  
  isConnected = computed(() => this.modelsFetched() && this.models().length > 0);
  
  // Global processing only tracks background requests (models, history)
  // 'loading' is reserved for chat messages to show local indicators
  private activeRequests = signal<number>(0);
  isProcessing = computed(() => this.activeRequests() > 0);

  private startRequest() {
    this.activeRequests.update(v => v + 1);
  }

  private endRequest() {
    this.activeRequests.update(v => Math.max(0, v - 1));
  }

  loadHistory() {
    this.startRequest();
    this.http.get<ChatMessage[]>(`${this.apiUrl}/logs`).pipe(
      finalize(() => this.endRequest())
    ).subscribe(logs => {
      // API returns Descending (newest first), reverse it for chronological chat order
      this.history.set([...logs].reverse());
    });
  }

  loadModels() {
    this.startRequest();
    this.http.get<string[]>(`${this.apiUrl}/models`).pipe(
      catchError(() => of([])),
      finalize(() => this.endRequest())
    ).subscribe(models => {
      this.models.set(models);
      this.modelsFetched.set(true);
    });
  }

  sendMessage(prompt: string, model?: string): Observable<ChatMessage> {
    this.loading.set(true);
    
    // Create an optimistic temporary message
    const tempId = -Date.now();
    const tempMsg: ChatMessage = {
      id: tempId,
      prompt: prompt,
      response: '', // Empty response while loading
      createdAt: new Date().toISOString()
    };
    
    // Add to history immediately
    this.history.update(h => [...h, tempMsg]);

    return this.http.post<ChatMessage>(`${this.apiUrl}/chat`, { prompt, model }).pipe(
      tap(msg => {
        // Replace the temporary message with the real one from the server
        this.history.update(h => h.map(m => m.id === tempId ? msg : m));
      }),
      catchError(err => {
        // Remove the temporary message on error
        this.history.update(h => h.filter(m => m.id !== tempId));
        throw err;
      }),
      finalize(() => this.loading.set(false))
    );
  }
}
