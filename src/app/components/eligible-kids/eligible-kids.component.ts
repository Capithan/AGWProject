import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Kid } from '../../models/kid.model';
import { KidsStorageService } from '../../services/kids-storage.service';
import { calculateAge } from '../../utils/age-eligibility.util';
import './eligible-kids.component.css';

@Component({
  selector: 'app-eligible-kids',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eligible-kids.component.html',
  styleUrls: ['./eligible-kids.component.css'],
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
