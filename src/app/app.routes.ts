import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/registration/registration.component').then(m => m.RegistrationComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./components/course-list/course-list.component').then(m => m.CourseListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'submit-course',
    loadComponent: () =>
      import('./components/user/submit-course/submit-course.component').then(m => m.SubmitCourseComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'flow',
    loadComponent: () =>
      import('./components/flow-view/flow-view.component').then(m => m.FlowViewComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/courses',
    loadComponent: () =>
      import('./components/admin/manage-courses/manage-courses.component').then(m => m.ManageCoursesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/add-course',
    loadComponent: () =>
      import('./components/admin/add-course/add-course.component').then(m => m.AddCourseComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: 'login' }
];
