import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Импортируем FormsModule для standalone компонента
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,  // Указываем, что это standalone компонент
  imports: [FormsModule],  // Добавляем FormsModule в imports
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onRegister() {
    // Form validation
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        // Navigate to login page after successful registration
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Registration failed. Please try again.';
      }
    });
  }
}
