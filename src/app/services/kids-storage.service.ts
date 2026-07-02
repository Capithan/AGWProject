import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Kid } from '../models/kid.model';
import { isEligible, getEligibleDobRange } from '../utils/age-eligibility.util';

@Injectable({
  providedIn: 'root',
})
export class KidsStorageService {
  private dbName = 'KidsRecordsDB';
  private storeName = 'kids';
  private db: IDBDatabase | null = null;

  private kidsSubject = new BehaviorSubject<Kid[]>([]);
  public kids$ = this.kidsSubject.asObservable();

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    const request = indexedDB.open(this.dbName, 1);

    request.onerror = () => {
      console.error('IndexedDB initialization failed');
    };

    request.onsuccess = (event: Event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
      this.loadAllKids();
    };

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id' });
        objectStore.createIndex('dob', 'dob', { unique: false });
      }
    };
  }

  public addKid(kid: Kid): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.add(kid);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.loadAllKids();
        resolve();
      };
    });
  }

  public updateKid(kid: Kid): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.put(kid);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.loadAllKids();
        resolve();
      };
    });
  }

  public deleteKid(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.loadAllKids();
        resolve();
      };
    });
  }

  public getAllKids(): Promise<Kid[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const request = objectStore.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const kids = request.result as Kid[];
        kids.sort((a, b) => a.name.localeCompare(b.name));
        resolve(kids);
      };
    });
  }

  public getEligibleKids(): Promise<Kid[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const today = new Date();
      const range = getEligibleDobRange(today);

      const transaction = this.db.transaction([this.storeName], 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const index = objectStore.index('dob');

      const keyRange = IDBKeyRange.bound(range.from, range.to, false, false);
      const request = index.getAll(keyRange);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        let kids = request.result as Kid[];
        kids = kids.filter((kid) => isEligible(kid.dob, today));
        kids.sort((a, b) => a.name.localeCompare(b.name));
        resolve(kids);
      };
    });
  }

  private loadAllKids(): void {
    this.getAllKids()
      .then((kids) => this.kidsSubject.next(kids))
      .catch((err) => console.error('Failed to load kids:', err));
  }

  public getAllKids$(): Observable<Kid[]> {
    return this.kids$.asObservable();
  }
}
