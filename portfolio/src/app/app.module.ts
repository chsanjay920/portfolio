import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './profile/about/about.component';
import { SkillsComponent } from './profile/skills/skills.component';
import { ExperienceComponent } from './profile/experience/experience.component';
import { ProjectsComponent } from './profile/projects/projects.component';
import { ExtraCurricularComponent } from './profile/extra-curricular/extra-curricular.component';
import { ContactsComponent } from './profile/contacts/contacts.component';
import { PortfolioComponent } from './profile/portfolio/portfolio.component';
import { PictureComponent } from './profile/picture/picture.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    ExtraCurricularComponent,
    ContactsComponent,
    PortfolioComponent,
    PictureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
