import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Pipe({
  name: 'markdownHtml',
  standalone: true,
})
export class MarkdownHtmlPipe implements PipeTransform {
  transform(markdown?: string): string {
    if (!markdown) return '';

    // Marked can return HTML for headings/paragraphs/links.
    const parsed = marked.parse(markdown, { gfm: true }) as string | Promise<string>;
    if (typeof parsed !== 'string') return '';

    // Ensure any user-authored content is sanitized before binding to `innerHTML`.
    return DOMPurify.sanitize(parsed);
  }
}

