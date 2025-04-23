import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;
    this.error = '';
    
    const { username, email, password } = this.registerForm.value;
    
    this.authService.register(username, email, password)
      .subscribe({
        next: () => {
          this.router.navigate(['/login'], { queryParams: { registered: true } });
        },
        error: err => {
          if (err.error.username) {
            this.error = `Username error: ${err.error.username}`;
          } else if (err.error.email) {
            this.error = `Email error: ${err.error.email}`;
          } else if (err.error.password) {
            this.error = `Password error: ${err.error.password}`;
          } else {
            this.error = 'Registration failed. Please try again.';
          }
          this.loading = false;
        }
      });
  }
}