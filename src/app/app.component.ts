import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './app.component.html',
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .navbar {
      background-color: #2c3e50;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .app-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .nav-links {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 2rem;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    .nav-links a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-links a.active {
      background-color: #3498db;
      font-weight: 600;
    }

    .main-content {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: 2rem 1rem;
    }

    @media (max-width: 768px) {
      .nav-content {
        flex-direction: column;
        gap: 1rem;
      }

      .nav-links {
        gap: 1rem;
      }

      .app-title {
        font-size: 1.2rem;
      }
    }
  `],
})
export class AppComponent {
  title = 'Kids Records Management System';
}
