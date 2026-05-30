import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag-pill',
  standalone: true,
  templateUrl: './tag-pill.component.html',
  styleUrl: './tag-pill.component.scss',
})
export class TagPillComponent {
  @Input({ required: true }) label!: string;
}

