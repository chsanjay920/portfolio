import { Pipe, PipeTransform } from '@angular/core';
import { marked, type Tokens } from 'marked';
import DOMPurify from 'dompurify';

@Pipe({
  name: 'markdownHtml',
  standalone: true,
})
export class MarkdownHtmlPipe implements PipeTransform {
  transform(markdown?: string): string {
    if (!markdown) return '';

    const renderer = new marked.Renderer();

    renderer.code = ({ text, lang, escaped }: Tokens.Code) => {
      const language = (lang || '').trim();
      const title = language ? language : 'Code';
      const codeText = escaped ? text : text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      return `
        <div class="code-window">
          <div class="code-window__header">
            <span class="code-window__language">${title}</span>
            <button type="button" class="code-window__copy">Copy</button>
          </div>
          <pre><code class="language-${language}">${codeText}</code></pre>
        </div>
      `;
    };

    const parsed = marked.parse(markdown, { gfm: true, renderer }) as string | Promise<string>;
    if (typeof parsed !== 'string') return '';

    return DOMPurify.sanitize(parsed, {
      ADD_TAGS: ['button', 'span', 'div'],
      ADD_ATTR: ['class', 'type', 'aria-label'],
    });
  }
}

