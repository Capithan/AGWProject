import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Kid } from '../../models/kid.model';
import { KidsStorageService } from '../../services/kids-storage.service';
import { calculateAge } from '../../utils/age-eligibility.util';

const STYLES = `
  .eligible-kids-container {
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  h2 {
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 1rem;
    border-bottom: 2px solid #27ae60;
    padding-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  .message {
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-weight: 500;
    margin-bottom: 1rem;
    font-size: 0.95rem;
  }

  .message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }

  .toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
  }

  .btn {
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.1s ease;
    font-weight: 500;
  }

  .btn:hover {
    transform: translateY(-2px);
  }

  .btn:active {
    transform: translateY(0);
  }

  .btn-secondary {
    background-color: #2c3e50;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #1f2d3a;
  }

  .loading {
    text-align: center;
    color: #95a5a6;
    padding: 1.5rem 1rem;
    font-style: italic;
  }

  .table-container {
    margin-top: 1rem;
    overflow-x: auto;
  }

  .kids-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    font-size: 0.95rem;
  }

  .kids-table thead {
    background-color: #27ae60;
    color: white;
  }

  .kids-table th {
    padding: 0.75rem 0.5rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #1e8449;
    font-size: 0.9rem;
  }

  .kids-table td {
    padding: 0.6rem 0.5rem;
    border-bottom: 1px solid #ecf0f1;
    word-break: break-word;
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
    padding: 1.5rem 1rem;
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    .eligible-kids-container {
      padding: 1rem;
      border-radius: 4px;
    }

    h2 {
      font-size: 1.2rem;
      margin-bottom: 0.75rem;
    }

    .kids-table {
      font-size: 0.85rem;
    }

    .toolbar {
      margin-bottom: 0.75rem;
    }

    .btn {
      padding: 0.5rem 0.8rem;
      font-size: 0.9rem;
    }

    .kids-table th {
      padding: 0.5rem 0.4rem;
      font-size: 0.8rem;
    }

    .kids-table td {
      padding: 0.4rem 0.3rem;
      font-size: 0.8rem;
    }

    .message {
      padding: 0.6rem 0.75rem;
      font-size: 0.85rem;
    }

    .loading {
      padding: 1rem 0.75rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .eligible-kids-container {
      padding: 0.75rem;
    }

    h2 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    .kids-table th,
    .kids-table td {
      padding: 0.3rem 0.2rem;
      font-size: 0.7rem;
    }

    .kids-table th {
      font-size: 0.7rem;
    }

    .message {
      padding: 0.5rem;
      font-size: 0.8rem;
    }

    .loading {
      padding: 0.75rem;
      font-size: 0.85rem;
    }

    .no-records {
      padding: 1rem 0.5rem;
      font-size: 0.8rem;
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

  downloadCsv(): void {
    if (this.eligibleKids.length === 0) {
      this.errorMessage = 'No eligible records available to download.';
      return;
    }

    const headers = ['Name', 'Date of Birth', 'Current Age', 'Guardian Name', 'Address'];
    const rows = this.eligibleKids.map((kid) => [
      kid.name,
      kid.dob,
      String(this.getAge(kid.dob)),
      kid.guardianName,
      kid.address,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'eligible-records.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}
