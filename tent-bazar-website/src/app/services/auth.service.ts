import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private route:Router) { }
  isLoggedIn(): Observable<boolean> {
    // Implement your actual authentication logic here
    // For demonstration, return true if a user is "logged in"
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return of(loggedIn);
  }

  login(): void {
    localStorage.setItem('isLoggedIn', 'true');
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.route.navigate(['/admin-login']);
  }
}
