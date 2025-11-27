# Sales Inquiry Frontend Changes

## Overview

Enhanced the Sales Inquiry page to support both standard package selection and custom package creation, with improved UX for selecting price lists and species.

## Changes Made

### 1. Package Selection Type (Radio Buttons)

- Added radio button selection: "Use Standard Package" vs "Create Custom Package"
- Default selection: "standard"
- Switching between types resets the respective form sections

### 2. Standard Package Features

#### Enhanced Price List Dropdown

- **Dropdown Display**: Shows package name, hunting type, and area
- **Custom Template**: Displays date range (e.g., "Jul 2025 - Jun 2026") below each option
- **Package Details Card**: Automatically displays when a price list is selected
  - Area name
  - Hunting type
  - Duration (days)
  - Base amount (formatted as USD)

#### Improved Species Selection Table

- **Four Columns**:
  1. Species Name
  2. Scientific Name (displays "N/A" if not available)
  3. Available Quantity (color-coded badge: green for available, red for unavailable)
  4. Requested Quantity (counter with max limit set to available quantity)
- **Validation**: Counter max value is dynamically set to available quantity
- **Visual Feedback**:
  - Success toast when quantity is set (within limits)
  - Warning toast when requested quantity exceeds available quantity

### 3. Custom Package Features

- **Info Alert**: Displays instructions for creating custom packages
- **Manual Species Selection**: Users add species one-by-one using the existing species selector
- **Flexible Quantities**: Not limited by quota availability

### 4. Data Structure Changes

#### Frontend State

```typescript
packageSelectionType: ref('standard')

// Species now track two quantities:
{
  id: number,
  name: string,
  scientific_name: string,
  quantity: number,              // Available in quota
  requested_quantity: number      // What client wants (NEW)
}
```

#### API Request Payload

```json
{
  "package_type": "standard", // NEW field
  "price_list_id": 12, // Null for custom packages
  "preferred_species": [
    {
      "species_id": 37,
      "name": "Buffalo African Cape",
      "quantity": 2 // Now represents requested quantity
    }
  ]
}
```

### 5. Validation Logic

#### Standard Package Validation

- Price list must be selected
- At least one species must have requested_quantity > 0
- Warning if requested_quantity exceeds available quantity

#### Custom Package Validation

- At least one species must be manually added
- No quota restrictions

### 6. Helper Methods Added

#### `onPackageTypeChange()`

- Resets form when switching between standard/custom
- Clears price list selection for standard
- Clears manual species list for custom

#### `formatDateRange(startDate, endDate)`

- Formats date range as "Jul 2025 - Jun 2026"
- Returns "N/A" if dates are missing

#### `formatCurrency(amount)`

- Formats numbers as USD currency
- Returns "$0.00" for null/undefined values
- Example: 14000 → "$14,000.00"

#### `onChange(id, newValue)`

- Updated to track `requested_quantity` instead of modifying `quantity`
- Validates against available quantity
- Shows appropriate toast messages

### 7. UI Components Used

#### New Vuestic Components

- `VaRadio`: Package type selection
- `VaCard`, `VaCardTitle`, `VaCardContent`: Package details display
- `VaBadge`: Available quantity indicator (color-coded)
- `VaAlert`: Custom package instructions

#### Enhanced Components

- `VaSelect`: Added custom content template for date range display
- `VaCounter`: Max value now dynamically bound to available quantity

### 8. Import Updates

```typescript
import {
  VaForm,
  VaInput,
  VaSelect,
  VaButton,
  VaCard, // NEW
  VaCardTitle, // NEW
  VaCardContent, // NEW
  VaBadge, // NEW
  VaAlert, // NEW
  VaRadio, // NEW
} from 'vuestic-ui'
```

## User Flow

### Standard Package Flow

1. User selects "Use Standard Package" radio button
2. Dropdown shows all available price lists with dates
3. User selects a price list
4. Package details card appears showing area, hunting type, duration, base amount
5. Species table populates with available species from the package
6. User adjusts requested quantities using counters (limited by availability)
7. System validates quantities and shows warnings if needed
8. User fills in other details (contacts, dates, companions, etc.)
9. Submit creates inquiry linked to selected price list

### Custom Package Flow

1. User selects "Create Custom Package" radio button
2. Info alert appears with instructions
3. User manually selects species from dropdown
4. User sets quantities using counter (no quota restrictions)
5. User adds species to list
6. User fills in other details
7. Submit creates inquiry without price list link (custom package)

## Benefits

### User Experience

- Clear visual distinction between standard and custom packages
- Detailed package information before selection
- Real-time validation against quota availability
- Color-coded visual indicators (badges)
- Formatted dates and currency for better readability

### Data Integrity

- Prevents requesting more species than available (with warnings)
- Tracks requested vs available quantities separately
- Links standard packages to price lists via database
- Maintains audit trail of package type selection

### Flexibility

- Supports both pre-defined and ad-hoc inquiries
- Easy to switch between package types
- Extensible for future enhancements (multi-price-list, package comparison, etc.)

## Testing Checklist

- [x] Package type selection (standard/custom)
- [x] Price list dropdown with date formatting
- [x] Package details card display
- [x] Species table with 4 columns
- [x] Available quantity badge (color-coded)
- [x] Requested quantity counter (with max validation)
- [x] Toast messages (success/warning)
- [x] Form reset when switching package types
- [x] Standard package submission
- [x] Custom package submission
- [x] Validation for zero species
- [x] Validation for exceeded quantities
- [ ] Backend integration testing
- [ ] Price calculation verification
- [ ] Companion/observer tracking
- [ ] Multi-species selection
- [ ] Date range validation

## Browser Compatibility

- Tested on: Chrome, Firefox, Edge, Safari
- Responsive: Mobile, Tablet, Desktop
- VaCounter component: Full keyboard navigation support

## Future Enhancements

1. **Price Preview**: Show estimated total price as user selects species
2. **Package Comparison**: Side-by-side comparison modal
3. **Species Filtering**: Filter species by type, availability, price
4. **Bulk Selection**: "Select All Available" button
5. **Package Templates**: Save custom packages as templates for reuse
6. **PDF Quote**: Generate PDF quote preview before submission
7. **Multi-Price-List**: Combine species from multiple price lists
8. **Historical Data**: Show previous inquiry statistics for same client
