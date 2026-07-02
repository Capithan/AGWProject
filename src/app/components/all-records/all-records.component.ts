import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Kid } from '../../models/kid.model';
import { KidsStorageService } from '../../services/kids-storage.service';
import { calculateAge } from '../../utils/age-eligibility.util';
import { v4 as uuidv4 } from 'uuid';
import './all-records.component.css';

@Component({
  selector: 'app-all-records',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './all-records.component.html',
  styleUrls: ['./all-records.component.css'],
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
