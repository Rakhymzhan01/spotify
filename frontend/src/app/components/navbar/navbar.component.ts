import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    AsyncPipe
  ]
})

export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  
  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
  }
  
  logout(): void {
    this.authService.logout();
  }
}