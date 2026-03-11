import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  form: FormGroup;
  successMessage = '';
  errorMessage = '';
  showPassword = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, this.emailDomainValidator]],
      password: ['', [Validators.required, Validators.minLength(8), this.alphanumericValidator]]
    });
  }

  private emailDomainValidator(control: AbstractControl) {
    const val = control.value as string;
    if (val && (!val.includes('@') || !val.includes('.com'))) {
      return { emailDomain: true };
    }
    return null;
  }

  private alphanumericValidator(control: AbstractControl) {
    const val = control.value as string;
    if (val && !/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/.test(val)) {
      return { alphanumeric: true };
    }
    return null;
  }

  get username() { return this.form.get('username')!; }
  get email() { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const result = this.auth.register(this.form.value);
    if (result.success) {
      this.successMessage = result.message;
      this.errorMessage = '';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } else {
      this.errorMessage = result.message;
      this.successMessage = '';
    }
  }
}
