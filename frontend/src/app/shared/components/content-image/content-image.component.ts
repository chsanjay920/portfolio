import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-content-image',
  standalone: true,
  templateUrl: './content-image.component.html',
  styleUrl: './content-image.component.scss',
})
export class ContentImageComponent implements OnChanges {
  @Input() src?: string | null;
  @Input({ required: true }) alt!: string;
  @Input() variant: 'card' | 'hero' = 'card';

  protected readonly fallbackSrc = 'assets/content-fallback.svg';
  protected failed = false;

  ngOnChanges() {
    this.failed = false;
  }

  protected imageSrc(): string {
    return !this.failed && this.src ? this.src : this.fallbackSrc;
  }

  protected handleError() {
    if (this.imageSrc() !== this.fallbackSrc) {
      this.failed = true;
    }
  }
}
