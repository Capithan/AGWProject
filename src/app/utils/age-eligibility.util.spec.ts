import { calculateAge, isEligible } from './age-eligibility.util';

describe('Age Eligibility Utility', () => {
  describe('calculateAge', () => {
    it('should return correct age for someone well within their lifetime', () => {
      const dob = '2000-01-15';
      const today = new Date('2024-06-15');
      expect(calculateAge(dob, today)).toBe(24);
    });

    it('should return 0 for someone born less than a year ago', () => {
      const dob = '2024-01-01';
      const today = new Date('2024-06-15');
      expect(calculateAge(dob, today)).toBe(0);
    });
  });

  describe('isEligible', () => {
    it('should return true for someone who just turned 10', () => {
      const dob = '2014-06-15';
      const today = new Date('2024-06-15');
      expect(isEligible(dob, today)).toBe(true);
    });

    it('should return false for someone one day before their 10th birthday', () => {
      const dob = '2014-06-15';
      const today = new Date('2024-06-14');
      expect(isEligible(dob, today)).toBe(false);
    });

    it('should return false for someone who just turned 18', () => {
      const dob = '2006-06-15';
      const today = new Date('2024-06-15');
      expect(isEligible(dob, today)).toBe(false);
    });

    it('should return true for someone one day before their 18th birthday', () => {
      const dob = '2006-06-15';
      const today = new Date('2024-06-14');
      expect(isEligible(dob, today)).toBe(true);
    });

    it('should return true for someone well within the eligible range (age 14)', () => {
      const dob = '2010-03-20';
      const today = new Date('2024-06-15');
      expect(isEligible(dob, today)).toBe(true);
    });

    it('should return false for someone too young (age 5)', () => {
      const dob = '2019-06-15';
      const today = new Date('2024-06-15');
      expect(isEligible(dob, today)).toBe(false);
    });

    it('should return false for someone too old (age 25)', () => {
      const dob = '1999-06-15';
      const today = new Date('2024-06-15');
      expect(isEligible(dob, today)).toBe(false);
    });

    it('should handle leap year birthday correctly', () => {
      const dob = '2004-02-29';
      const today = new Date('2024-02-29');
      expect(calculateAge(dob, today)).toBe(20);
    });

    it('should handle leap year birthday when current year is not a leap year', () => {
      const dob = '2004-02-29';
      const today = new Date('2025-03-01');
      expect(calculateAge(dob, today)).toBe(21);
    });
  });
});
