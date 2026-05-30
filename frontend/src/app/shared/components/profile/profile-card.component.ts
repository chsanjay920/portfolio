import { Component, Input, OnChanges } from '@angular/core';
import { ProfileData } from '../../../models/portfolio.models';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
})
export class ProfileCardComponent implements OnChanges {
  @Input({ required: true }) profile!: ProfileData;

  protected avatarFailed = false;

  ngOnChanges() {
    this.avatarFailed = false;
  }

  protected handleAvatarError() {
    this.avatarFailed = true;
  }
}

