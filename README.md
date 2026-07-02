# AGW Kids Records Management System

A government-use Angular 17+ standalone application for tracking children's records and displaying them in two views: all records and only those currently aged 10–18.

## Features

- **Standalone Angular Components**: Built with Angular 17+ standalone API
- **IndexedDB Persistence**: Uses IndexedDB with a 'dob' index for efficient range queries
- **Two Views**:
  - **All Records**: Complete table with add/delete functionality
  - **Eligible (10–18)**: Read-only view of kids in the 10–18 age range
- **Live Age Calculation**: Age is computed from DOB at render time, never cached
- **Correct Date Logic**: Uses full elapsed years calculation to avoid off-by-one errors near birthdays
- **Reactive Forms**: Angular Reactive Forms with validation
- **Pure CSS Styling**: Clean, presentable UI without component libraries

## Data Model

```typescript
interface Kid {
  id: string;           // UUID
  name: string;         // Child's name
  dob: string;          // ISO date (e.g., "2020-06-06")
  guardianName: string; // Guardian's name
  address: string;      // Physical address
}
```

## Project Structure

```
src/
├── app/
│   ├── models/
│   │   └── kid.model.ts              # Data interface
│   ├── services/
│   │   └── kids-storage.service.ts   # IndexedDB service with CRUD & queries
│   ├── utils/
│   │   ├── age-eligibility.util.ts   # Pure age logic (framework-agnostic)
│   │   └── age-eligibility.util.spec.ts  # Unit tests
│   ├── components/
│   │   ├── all-records/
│   │   │   ├── all-records.component.ts
│   │   │   ├── all-records.component.html
│   │   │   └── all-records.component.css
│   │   └── eligible-kids/
│   │       ├── eligible-kids.component.ts
│   │       ├── eligible-kids.component.html
│   │       └── eligible-kids.component.css
│   ├── app.component.ts              # Root component with navigation
│   ├── app.component.html
│   ├── app.component.css
│   ├── app.routes.ts                 # Router configuration
│   └── app.config.ts                 # Application config
├── styles.css                        # Global styles
├── index.html                        # Entry HTML
└── main.ts                           # Bootstrap
```

## Eligibility Logic

A person is eligible if they are **at least 10 years old AND have not yet turned 18**. Age is calculated using **full elapsed years** (not calendar-year subtraction) to avoid off-by-one errors near birthdays.

### Example:
- DOB: 2014-06-15, Today: 2024-06-14 → Age 9 (not eligible, birthday tomorrow)
- DOB: 2014-06-15, Today: 2024-06-15 → Age 10 (eligible, just turned 10)
- DOB: 2006-06-15, Today: 2024-06-14 → Age 17 (eligible, day before 18th birthday)
- DOB: 2006-06-15, Today: 2024-06-15 → Age 18 (not eligible, just turned 18)

## Unit Tests

The utility function `isEligible()` is thoroughly tested with Jasmine, covering:
- Just turned 10 ✓
- Day before 10th birthday ✓
- Just turned 18 ✓
- Day before 18th birthday ✓
- Well within range ✓
- Well outside range (too young) ✓
- Well outside range (too old) ✓
- Leap year edge cases ✓

Run tests:
```bash
npm test
```

## Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the dev server:
   ```bash
   npm start
   ```

3. Open http://localhost:4200 in your browser

## Building for Production

```bash
npm run build
```

Output is in `dist/agw-kids-records/`

## Architecture Highlights

- **Separation of Concerns**: Eligibility logic in `age-eligibility.util.ts` (pure, testable)
- **IndexedDB Integration**: Efficient range queries via `KidsStorageService`
- **Reactive State Management**: BehaviorSubject for data synchronization between views
- **Standalone Components**: No NgModule dependencies
- **Angular Router**: Simple navigation between views
- **Reactive Forms**: Validation and form state management

## Browser Compatibility

- Requires IndexedDB support (all modern browsers)
- Tested on Chrome, Firefox, Safari, Edge

## Government Use Case Considerations

- **Data Persistence**: Uses IndexedDB (client-side storage, no server required for demo)
- **Privacy**: All data stored locally; no external communication
- **Accessibility**: Plain CSS with semantic HTML for screen readers
- **Auditability**: Clean component structure, easy to extend and audit
