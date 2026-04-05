import { Pipe, PipeTransform, inject, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  async transform(value: string): Promise<SafeHtml> {
    if (!value) return '';
    
    // Configure marked for safe SaaS usage
    const html = await marked.parse(value, {
      async: true,
      breaks: true,
      gfm: true
    });
    
    return this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }
}
