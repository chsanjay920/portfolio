import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { ToastService } from '../../shared/toast/toast.service';

@Directive({
  selector: '[appCodeCopy]',
  standalone: true,
})
export class CodeCopyDirective {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly toast = inject(ToastService);

  @HostListener('click', ['$event'])
  async onHostClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const copyButton = target.closest('.code-window__copy') as HTMLButtonElement | null;
    if (!copyButton) return;

    const codeWindow = copyButton.closest('.code-window');
    const codeElement = codeWindow?.querySelector('pre code');
    if (!codeElement) return;

    const text = codeElement.textContent?.trim() ?? '';
    if (!text) return;

    try {
      if ('clipboard' in navigator) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      this.toast.success('Code copied to clipboard');
    } catch {
      this.toast.error('Unable to copy code');
    }
  }
}
