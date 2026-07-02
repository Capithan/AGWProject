import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Kid } from '../../models/kid.model';
import { KidsStorageService } from '../../services/kids-storage.service';
import { calculateAge } from '../../utils/age-eligibility.util';

const STYLES = `
  .eligible-kids-container {
    background-color: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  h2 {
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #27ae60;
    padding-bottom: 0.5rem;
  }

  .message {
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  .message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .loading {
    text-align: center;
    color: #95a5a6;
    padding: 2rem 1rem;
    font-style: italic;
  }

  .table-container {
    margin-top: 1rem;
  }

  .kids-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .kids-table thead {
    background-color: #27ae60;
    color: white;
  }

  .kids-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #1e8449;
  }

  .kids-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #ecf0f1;
  }

  .table-row:hover {
    background-color: #f0fdf4;
  }

  .table-row:last-child td {
    border-bottom: none;
  }

  .no-records {
    text-align: center;
    color: #95a5a6;
    font-style: italic;
    padding: 2rem 1rem;
  }

  @media (max-width: 768px) {
    .eligible-kids-container {
      padding: 1rem;
    }

    .kids-table {
      font-size: 0.9rem;
    }

    .kids-table th,
    .kids-table td {
      padding: 0.5rem;
    }
  }
`;

@Component({
  selector: 'app-eligible-kids',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eligible-kids.component.html',
  styles: [STYLES],
})
export class EligibleKidsComponent implements OnInit {
  eligibleKids: Kid[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private kidsStorageService: KidsStorageService) {}

  ngOnInit(): void {
    this.loadEligibleKids();
    this.kidsStorageService.getAllKids$().subscribe(() => {
      this.loadEligibleKids();
    });
  }

  private loadEligibleKids(): void {
    this.isLoading = true;
    this.kidsStorageService.getEligibleKids()
      .then((kids) => {
        this.eligibleKids = kids;
        this.isLoading = false;
      })
      .catch((err) => {
        console.error('Failed to load eligible kids:', err);
        this.errorMessage = 'Failed to load eligible kids records.';
        this.isLoading = false;
      });
  }

  getAge(dob: string): number {
    return calculateAge(dob);
  }
}
