import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  // Импортируем FormsModule для standalone компонента
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,  // Указываем, что это standalone компонент
  imports: [FormsModule],  // Добавляем FormsModule в imports
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = error.error.detail || 'Login failed. Please check your credentials.';
      }
    });
  }
}
