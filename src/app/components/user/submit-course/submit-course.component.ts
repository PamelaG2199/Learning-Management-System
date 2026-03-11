import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-submit-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './submit-course.component.html',
  styleUrls: ['./submit-course.component.scss']
})
export class SubmitCourseComponent {
  form: FormGroup;
  successMessage = '';
  errorMessage = '';
  currentUser = this.auth.getCurrentUser();

  technologies = ['Angular', 'React', 'Vue', 'Java', 'Spring Boot', 'Python', 'Node.js', 'TypeScript', 'JavaScript', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'DevOps', 'SQL', 'MongoDB'];

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(20)]],
      courseDuration: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
      courseDescription: ['', [Validators.required, Validators.minLength(100)]],
      technology: ['', Validators.required],
      launchUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  get courseName() { return this.form.get('courseName')!; }
  get courseDuration() { return this.form.get('courseDuration')!; }
  get courseDescription() { return this.form.get('courseDescription')!; }
  get technology() { return this.form.get('technology')!; }
  get launchUrl() { return this.form.get('launchUrl')!; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const addedBy = this.currentUser?.username || this.currentUser?.email || 'Unknown';
    this.courseService.addCourse({
      ...this.form.value,
      courseDuration: Number(this.form.value.courseDuration),
      addedBy
    });
    this.successMessage = `Course "${this.form.value.courseName}" submitted for approval! A Lead will review it first, then Admin will give final approval.`;
    this.errorMessage = '';
    this.form.reset();
  }
}
