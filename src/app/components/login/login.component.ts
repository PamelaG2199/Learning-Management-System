import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;
  errorMessage = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    if (this.auth.isLoggedIn()) {
      this.navigateByRole();
    }
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.auth.login(this.form.value.email, this.form.value.password);
    if (user) {
      this.navigateByRole();
    } else {
      this.errorMessage = 'Invalid email or password. Please try again.';
    }
  }

  private navigateByRole(): void {
    const user = this.auth.getCurrentUser();
    if (user?.role === 'admin') {
      this.router.navigate(['/admin/courses']);
    } else if (user?.role === 'lead') {
      this.router.navigate(['/admin/courses']);
    } else {
      this.router.navigate(['/courses']);
    }
  }
}
