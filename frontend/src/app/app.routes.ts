import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home.page';
import { BlogsPageComponent } from './pages/blogs/blogs.page';
import { BlogDetailsPageComponent } from './pages/blogs/blog-details.page';
import { ProjectsPageComponent } from './pages/projects/projects.page';
import { ProjectDetailsPageComponent } from './pages/projects/project-details.page';
import { ProjectIdeasPageComponent } from './pages/project-ideas/project-ideas.page';
import { IdeaDetailsPageComponent } from './pages/project-ideas/idea-details.page';
import { ExperiencePageComponent } from './pages/experience/experience.page';
import { EducationPageComponent } from './pages/education/education.page';
import { CertificatesPageComponent } from './pages/certificates/certificates.page';
import { CertificateDetailsPageComponent } from './pages/certificates/certificate-details.page';
import { SearchPageComponent } from './pages/search/search.page';
import { AdminLoginPageComponent } from './pages/admin/login/admin-login.page';
import { authGuard } from './auth/auth.guard';
import { AdminShellComponent } from './pages/admin/admin-shell/admin-shell.component';
import { AdminHomePageComponent } from './pages/admin/admin-home/admin-home.page';
import { AdminProfilePageComponent } from './pages/admin/profile/admin-profile.page';
import { AdminBlogsPageComponent } from './pages/admin/blogs/admin-blogs.page';
import { AdminProjectsPageComponent } from './pages/admin/projects/admin-projects.page';
import { AdminProjectIdeasPageComponent } from './pages/admin/project-ideas/admin-project-ideas.page';
import { AdminExperiencePageComponent } from './pages/admin/experience/admin-experience.page';
import { AdminEducationPageComponent } from './pages/admin/education/admin-education.page';
import { AdminCertificatesPageComponent } from './pages/admin/certificates/admin-certificates.page';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'blogs', component: BlogsPageComponent },
  { path: 'blogs/:slug', component: BlogDetailsPageComponent },
  { path: 'projects', component: ProjectsPageComponent },
  { path: 'projects/:slug', component: ProjectDetailsPageComponent },
  { path: 'project-ideas', component: ProjectIdeasPageComponent },
  { path: 'project-ideas/:slug', component: IdeaDetailsPageComponent },
  { path: 'experience', component: ExperiencePageComponent },
  { path: 'education', component: EducationPageComponent },
  { path: 'certificates', component: CertificatesPageComponent },
  { path: 'certificates/:slug', component: CertificateDetailsPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'admin/login', component: AdminLoginPageComponent },
  {
    path: 'admin',
    component: AdminShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: AdminHomePageComponent },
      { path: 'profile', component: AdminProfilePageComponent },
      { path: 'blogs', component: AdminBlogsPageComponent },
      { path: 'projects', component: AdminProjectsPageComponent },
      { path: 'project-ideas', component: AdminProjectIdeasPageComponent },
      { path: 'experience', component: AdminExperiencePageComponent },
      { path: 'education', component: AdminEducationPageComponent },
      { path: 'certificates', component: AdminCertificatesPageComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
