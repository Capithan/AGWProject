import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Kid } from '../../models/kid.model';
import { KidsStorageService } from '../../services/kids-storage.service';
import { calculateAge } from '../../utils/age-eligibility.util';
import { v4 as uuidv4 } from 'uuid';

const STYLES = `
  .all-records-container {
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  h2 {
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 1rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  h3 {
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .message-container {
    margin-bottom: 1rem;
  }

  .message {
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.95rem;
  }

  .message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
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
    width: 100%;
  }

  .btn:hover {
    transform: translateY(-2px);
  }

  .btn:active {
    transform: translateY(0);
  }

  .btn-primary {
    background-color: #3498db;
    color: white;
  }

  .btn-primary:hover {
    background-color: #2980b9;
  }

  .btn-secondary {
    background-color: #2c3e50;
    color: white;
    width: auto;
  }

  .btn-secondary:hover {
    background-color: #1f2d3a;
  }

  .btn-success {
    background-color: #27ae60;
    color: white;
  }

  .btn-success:hover {
    background-color: #229954;
  }

  .btn-delete {
    background-color: #e74c3c;
    color: white;
    padding: 0.4rem 0.6rem;
    font-size: 0.85rem;
    width: auto;
    min-width: 70px;
  }

  .btn-delete:hover {
    background-color: #c0392b;
  }

  .add-form-container {
    background-color: #ecf0f1;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .form-intro {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #5d6d7e;
    font-size: 0.95rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.3rem;
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.95rem;
  }

  .form-input {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #bdc3c7;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
    transition: border-color 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }

  .error-text {
    display: block;
    color: #e74c3c;
    font-size: 0.8rem;
    margin-top: 0.2rem;
  }

  .table-container {
    margin-top: 1.5rem;
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
    background-color: #34495e;
    color: white;
  }

  .kids-table th {
    padding: 0.75rem 0.5rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #2c3e50;
    font-size: 0.9rem;
  }

  .kids-table td {
    padding: 0.6rem 0.5rem;
    border-bottom: 1px solid #ecf0f1;
    word-break: break-word;
  }

  .table-row:hover {
    background-color: #f9f9f9;
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
    .all-records-container {
      padding: 1rem;
      border-radius: 4px;
    }

    h2 {
      font-size: 1.2rem;
      margin-bottom: 0.75rem;
    }

    h3 {
      font-size: 1rem;
    }

    .add-form-container {
      padding: 0.75rem;
    }

    .form-intro {
      font-size: 0.85rem;
    }

    .message {
      padding: 0.6rem 0.75rem;
      font-size: 0.85rem;
    }

    .toolbar {
      margin-bottom: 0.75rem;
    }

    .btn {
      padding: 0.5rem 0.8rem;
      font-size: 0.9rem;
    }

    .kids-table {
      font-size: 0.85rem;
    }

    .kids-table th {
      padding: 0.5rem 0.4rem;
      font-size: 0.8rem;
    }

    .kids-table td {
      padding: 0.4rem 0.3rem;
      font-size: 0.8rem;
    }

    .btn-delete {
      padding: 0.3rem 0.4rem;
      font-size: 0.75rem;
      min-width: 55px;
    }

    .form-input {
      padding: 0.5rem;
      font-size: 16px;
    }

    label {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 480px) {
    .all-records-container {
      padding: 0.75rem;
    }

    h2 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    h3 {
      font-size: 0.95rem;
    }

    .btn {
      padding: 0.5rem;
      font-size: 0.85rem;
    }

    .kids-table th,
    .kids-table td {
      padding: 0.3rem 0.2rem;
      font-size: 0.7rem;
    }

    .kids-table th {
      font-size: 0.7rem;
    }

    .btn-delete {
      padding: 0.25rem 0.3rem;
      font-size: 0.65rem;
      min-width: 50px;
    }

    .message {
      padding: 0.5rem;
      font-size: 0.8rem;
    }

    .form-input,
    label {
      font-size: 0.9rem;
    }

    .add-form-container {
      padding: 0.5rem;
    }

    .form-group {
      margin-bottom: 0.75rem;
    }
  }
`;

@Component({
  selector: 'app-all-records',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './all-records.component.html',
  styles: [STYLES],
})
export class AllRecordsComponent implements OnInit {
  kids: Kid[] = [];
  addKidForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private kidsStorageService: KidsStorageService,
    private fb: FormBuilder
  ) {
    this.addKidForm = this.fb.group({
      name: ['', [Validators.required]],
      dob: ['', [Validators.required, this.dobNotInFutureValidator.bind(this)]],
      guardianName: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadKids();
  }

  private loadKids(): void {
    this.kidsStorageService.getAllKids()
      .then((kids) => {
        this.kids = kids;
      })
      .catch((err) => {
        console.error('Failed to load kids:', err);
        this.errorMessage = 'Failed to load kids records.';
      });
  }

  private dobNotInFutureValidator(control: any): { [key: string]: any } | null {
    if (!control.value) return null;
    const dob = new Date(control.value);
    const today = new Date();
    if (dob > today) {
      return { dobInFuture: true };
    }
    return null;
  }

  submitForm(): void {
    if (this.addKidForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const formValue = this.addKidForm.value;
    const newKid: Kid = {
      id: uuidv4(),
      name: formValue.name,
      dob: formValue.dob,
      guardianName: formValue.guardianName,
      address: formValue.address,
    };

    this.kidsStorageService.addKid(newKid)
      .then(() => {
        this.successMessage = `${newKid.name} added successfully!`;
        this.addKidForm.reset();
        this.loadKids();
        setTimeout(() => (this.successMessage = ''), 3000);
      })
      .catch((err) => {
        console.error('Failed to add kid:', err);
        this.errorMessage = 'Failed to add kid record.';
      });
  }

  deleteKid(id: string, name: string): void {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      this.kidsStorageService.deleteKid(id)
        .then(() => {
          this.successMessage = `${name} deleted successfully.`;
          this.loadKids();
          setTimeout(() => (this.successMessage = ''), 3000);
        })
        .catch((err) => {
          console.error('Failed to delete kid:', err);
          this.errorMessage = 'Failed to delete kid record.';
        });
    }
  }

  getAge(dob: string): number {
    return calculateAge(dob);
  }

  downloadCsv(): void {
    if (this.kids.length === 0) {
      this.errorMessage = 'No records available to download.';
      return;
    }

    const headers = ['Name', 'Date of Birth', 'Current Age', 'Guardian Name', 'Address'];
    const rows = this.kids.map((kid) => [
      kid.name,
      kid.dob,
      String(this.getAge(kid.dob)),
      kid.guardianName,
      kid.address,
    ]);

    this.downloadRowsAsCsv('all-records.csv', headers, rows);
  }

  private downloadRowsAsCsv(fileName: string, headers: string[], rows: string[][]): void {
    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => this.escapeCsvValue(value)).join(','))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  private escapeCsvValue(value: string): string {
    return `"${value.replace(/"/g, '""')}"`;
  }

  getFieldError(fieldName: string): string {
    const control = this.addKidForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`;
    }
    if (control?.hasError('dobInFuture')) {
      return 'Date of birth cannot be in the future.';
    }
    return '';
  }
}
