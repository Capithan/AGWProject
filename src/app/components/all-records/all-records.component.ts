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
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  h2 {
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
  }

  h3 {
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 1rem;
  }

  .message-container {
    margin-bottom: 1rem;
  }

  .message {
    padding: 0.75rem 1rem;
    border-radius: 4px;
    font-weight: 500;
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

  .form-toggle {
    margin-bottom: 1.5rem;
  }

  .btn {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
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

  .btn-primary {
    background-color: #3498db;
    color: white;
  }

  .btn-primary:hover {
    background-color: #2980b9;
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
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  .btn-delete:hover {
    background-color: #c0392b;
  }

  .add-form-container {
    background-color: #ecf0f1;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 600;
    color: #2c3e50;
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
    font-size: 0.85rem;
    margin-top: 0.3rem;
  }

  .table-container {
    margin-top: 2rem;
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
    background-color: #34495e;
    color: white;
  }

  .kids-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    border-bottom: 2px solid #2c3e50;
  }

  .kids-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #ecf0f1;
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
    padding: 2rem 1rem;
  }

  @media (max-width: 768px) {
    .all-records-container {
      padding: 1rem;
    }

    .kids-table {
      font-size: 0.9rem;
    }

    .kids-table th,
    .kids-table td {
      padding: 0.5rem;
    }

    .btn {
      padding: 0.5rem 1rem;
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
  showForm = false;
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

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.addKidForm.reset();
      this.errorMessage = '';
      this.successMessage = '';
    }
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
        this.showForm = false;
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
