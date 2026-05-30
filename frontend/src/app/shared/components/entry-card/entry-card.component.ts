import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TagPillComponent } from '../tag-pill/tag-pill.component';
import { ContentImageComponent } from '../content-image/content-image.component';

export interface CardLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-entry-card',
  standalone: true,
  imports: [RouterLink, TagPillComponent, ContentImageComponent],
  templateUrl: './entry-card.component.html',
  styleUrl: './entry-card.component.scss',
})
export class EntryCardComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input() tags: string[] = [];
  @Input() date?: string;
  @Input() internalRoute?: string; // e.g. /blogs/:slug
  @Input() imageSrc?: string;
  @Input() externalLinks: CardLink[] = [];
}

