# Sales Inquiry Backend Implementation Guide

## Overview
This document outlines the backend changes required to support the enhanced Sales Inquiry feature with standard and custom package selection.

## Database Schema

### 1. sales_inquiry_price_lists (Already exists)
Links price lists to sales inquiries (many-to-many relationship).

```sql
CREATE TABLE `sales_inquiry_price_lists` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `price_list_id` bigint(20) DEFAULT NULL,
  `sales_inquiry_id` bigint(20) DEFAULT NULL,
  `create_date` datetime(6) NOT NULL,
  `updated_date` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_inquiry_price__sales_inquiry_id_89a36cd6_fk_sales_inq` (`sales_inquiry_id`),
  KEY `sales_inquiry_price_lists_price_list_id_120c56fa` (`price_list_id`),
  CONSTRAINT `sales_inquiry_price__price_list_id_120c56fa_fk_hunting_p` FOREIGN KEY (`price_list_id`) REFERENCES `hunting_price_list` (`id`),
  CONSTRAINT `sales_inquiry_price__sales_inquiry_id_89a36cd6_fk_sales_inq` FOREIGN KEY (`sales_inquiry_id`) REFERENCES `sales_inquiries` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```

### 2. sales_inquiry_companions (Already exists)
Tracks companion and observer counts for price calculations.

```sql
CREATE TABLE `sales_inquiry_companions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sales_inquiry_price_list_id` bigint(20) NOT NULL,
  `companions_count` int(11) DEFAULT 0,
  `observers_count` int(11) DEFAULT 0,
  `create_date` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_date` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  PRIMARY KEY (`id`),
  KEY `companions_sales_inquiry_price_list_fk` (`sales_inquiry_price_list_id`),
  CONSTRAINT `companions_sales_inquiry_price_list_fk` FOREIGN KEY (`sales_inquiry_price_list_id`) REFERENCES `sales_inquiry_price_lists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```

### 3. sales_inquiries (Modifications needed)
Add a `package_type` field to distinguish between standard and custom packages.

```sql
ALTER TABLE `sales_inquiries` 
ADD COLUMN `package_type` ENUM('standard', 'custom') DEFAULT 'standard' AFTER `identity_number`;
```

## API Endpoint Changes

### POST /api/v1.0/sales-inquiries

#### Request Body Structure

```json
{
  "categories": "Hunter",
  "full_name": "John Doe",
  "contacts": [
    {
      "contact_type": "email",
      "contact": "john@example.com"
    },
    {
      "contact_type": "phone",
      "contact": "+1234567890"
    },
    {
      "contact_type": "address",
      "contact": "123 Main St"
    }
  ],
  "nationality": 1,
  "country": 1,
  "price_list_id": 12,
  "no_of_hunters": 1,
  "no_of_days": 14,
  "no_of_companions": 2,
  "no_of_observers": 1,
  "preferred_species": [
    {
      "species_id": 37,
      "name": "Buffalo African Cape",
      "quantity": 2
    },
    {
      "species_id": 42,
      "name": "Leopard",
      "quantity": 1
    }
  ],
  "area_id": 3,
  "season": 1,
  "preferred_date": "2025-07-15",
  "start_date": "2025-07-01",
  "end_date": "2025-07-14",
  "identity_number": "ABC123456",
  "package_type": "standard"
}
```

#### Key Changes:

1. **package_type**: New field indicating "standard" or "custom"
   - `standard`: Client selected an existing price list
   - `custom`: Client is creating a custom package

2. **price_list_id**: 
   - Required when `package_type = "standard"`
   - Null when `package_type = "custom"`

3. **preferred_species**: Array structure updated
   - Each species now has `species_id`, `name`, and `quantity`
   - For standard packages: only species with `requested_quantity > 0` are sent
   - For custom packages: all manually added species are sent

## Backend Processing Logic

### Standard Package Flow

```php
if ($request->package_type === 'standard') {
    // 1. Create sales inquiry record
    $salesInquiry = SalesInquiry::create([
        'full_name' => $request->full_name,
        'nationality' => $request->nationality,
        'country' => $request->country,
        'area_id' => $request->area_id,
        'season' => $request->season,
        'preferred_date' => $request->preferred_date,
        'start_date' => $request->start_date,
        'end_date' => $request->end_date,
        'identity_number' => $request->identity_number,
        'package_type' => 'standard',
        'no_of_hunters' => $request->no_of_hunters,
        'no_of_days' => $request->no_of_days,
    ]);

    // 2. Link to existing price list
    $salesInquiryPriceList = SalesInquiryPriceList::create([
        'sales_inquiry_id' => $salesInquiry->id,
        'price_list_id' => $request->price_list_id,
        'create_date' => now(),
        'updated_date' => now(),
    ]);

    // 3. Create companions record
    if ($request->no_of_companions > 0 || $request->no_of_observers > 0) {
        SalesInquiryCompanion::create([
            'sales_inquiry_price_list_id' => $salesInquiryPriceList->id,
            'companions_count' => $request->no_of_companions,
            'observers_count' => $request->no_of_observers,
        ]);
    }

    // 4. Store preferred species selections
    foreach ($request->preferred_species as $species) {
        SalesInquirySpecies::create([
            'sales_inquiry_id' => $salesInquiry->id,
            'species_id' => $species['species_id'],
            'quantity' => $species['quantity'],
        ]);
    }

    // 5. Store contacts
    foreach ($request->contacts as $contact) {
        EntityContact::create([
            'entity_id' => $salesInquiry->entity_id,
            'contact_type' => $contact['contact_type'],
            'contact' => $contact['contact'],
        ]);
    }
}
```

### Custom Package Flow

```php
if ($request->package_type === 'custom') {
    // 1. Create sales inquiry record
    $salesInquiry = SalesInquiry::create([
        'full_name' => $request->full_name,
        'nationality' => $request->nationality,
        'country' => $request->country,
        'area_id' => $request->area_id,
        'season' => $request->season,
        'preferred_date' => $request->preferred_date,
        'start_date' => $request->start_date,
        'end_date' => $request->end_date,
        'identity_number' => $request->identity_number,
        'package_type' => 'custom',
        'no_of_hunters' => $request->no_of_hunters,
        'no_of_days' => $request->no_of_days,
    ]);

    // 2. Create custom price list (optional approach)
    // You could create a dynamic price list or just store species directly
    
    // 3. Store preferred species
    foreach ($request->preferred_species as $species) {
        SalesInquirySpecies::create([
            'sales_inquiry_id' => $salesInquiry->id,
            'species_id' => $species['species_id'],
            'quantity' => $species['quantity'],
        ]);
    }

    // 4. Handle companions (if applicable)
    // Custom packages might not need this initially
    
    // 5. Store contacts
    foreach ($request->contacts as $contact) {
        EntityContact::create([
            'entity_id' => $salesInquiry->entity_id,
            'contact_type' => $contact['contact_type'],
            'contact' => $contact['contact'],
        ]);
    }
}
```

## Price Calculation Logic

### For Standard Packages:

1. **Base Price**: From `hunting_price_list.price_list_type.amount`
2. **Species Fees**: Sum of trophy fees based on selected species
   - Get trophy fees from `trophy_fees` table
   - Match by `species_id` and `area_id`
   - Consider `sequence_order` for upgrade pricing
3. **Companions Cost**: From `componions_hunter` table in price list
4. **Observers Cost**: From `observer` table in price list
5. **Safari Extras**: From `safari_extras` table in price list

```php
$totalPrice = 0;

// Base amount
$totalPrice += $priceList->price_list_type->amount;

// Trophy fees
foreach ($preferredSpecies as $species) {
    $trophyFee = TrophyFee::where('species_id', $species->species_id)
        ->where('area_id', $priceList->area_id)
        ->where('sequence_order', 1) // First animal
        ->first();
    
    $totalPrice += $trophyFee->price_usd * $species->quantity;
    
    // Handle additional animals (2nd, 3rd, etc.)
    // Logic for sequence_order > 1
}

// Companions
$companionRate = $priceList->componions_hunter->first()->charges_per_day ?? 0;
$totalPrice += $companionRate * $noOfDays * $noOfCompanions;

// Observers
$observerRate = $priceList->observer->first()->charges_per_day ?? 0;
$totalPrice += $observerRate * $noOfDays * $noOfObservers;
```

### For Custom Packages:

1. Calculate base daily rate based on area/hunting type defaults
2. Sum trophy fees for selected species
3. Add companion/observer costs if applicable
4. Generate custom pricing document

## Response Structure

```json
{
  "status": 201,
  "message": "Sales inquiry created successfully",
  "data": {
    "sales_inquiry_id": 45,
    "entity": {
      "id": 123,
      "full_name": "John Doe",
      "nationality": "American",
      "country": "USA"
    },
    "price_list": {
      "id": 12,
      "name": "Standard Package - Area MS",
      "start_date": "2025-07-01",
      "end_date": "2026-06-30",
      "area": "MS",
      "hunting_type": "Trophy Hunting"
    },
    "companions": {
      "companions_count": 2,
      "observers_count": 1
    },
    "selected_species": [
      {
        "species_id": 37,
        "name": "Buffalo African Cape",
        "quantity": 2
      }
    ],
    "estimated_price": {
      "base_amount": 14000.00,
      "trophy_fees": 82.00,
      "companion_costs": 5600.00,
      "observer_costs": 2800.00,
      "total": 22482.00,
      "currency": "USD"
    }
  }
}
```

## Validation Rules

### Backend Validation:

```php
$validator = Validator::make($request->all(), [
    'full_name' => 'required|string|max:255',
    'contacts' => 'required|array|min:1',
    'contacts.*.contact_type' => 'required|string|in:email,phone,address',
    'contacts.*.contact' => 'required|string',
    'nationality' => 'required|integer|exists:nationalities,id',
    'country' => 'required|integer|exists:countries,id',
    'package_type' => 'required|in:standard,custom',
    'price_list_id' => 'required_if:package_type,standard|integer|exists:hunting_price_list,id',
    'no_of_hunters' => 'required|integer|min:1',
    'no_of_days' => 'required|integer|min:1',
    'no_of_companions' => 'nullable|integer|min:0',
    'no_of_observers' => 'nullable|integer|min:0',
    'preferred_species' => 'required|array|min:1',
    'preferred_species.*.species_id' => 'required|integer|exists:species,id',
    'preferred_species.*.quantity' => 'required|integer|min:1',
    'area_id' => 'required|integer|exists:areas,id',
    'season' => 'required|integer|exists:seasons,id',
    'start_date' => 'required|date',
    'end_date' => 'required|date|after:start_date',
    'preferred_date' => 'nullable|date',
    'identity_number' => 'required|string|max:50',
]);
```

### Business Logic Validation:

1. **Quota Availability**: Check if requested species quantities are available in quota
2. **Price List Validity**: Ensure selected price list is active and within date range
3. **Companion Limits**: Verify companion/observer counts are within allowed limits
4. **Area Matching**: Ensure selected area matches price list area

## Testing Checklist

- [ ] Create sales inquiry with standard package
- [ ] Create sales inquiry with custom package
- [ ] Verify price list linking in `sales_inquiry_price_lists`
- [ ] Verify companion data in `sales_inquiry_companions`
- [ ] Test price calculation for standard packages
- [ ] Test price calculation for custom packages
- [ ] Validate species quantity against quota availability
- [ ] Test with multiple species selections
- [ ] Test with zero companions/observers
- [ ] Test with multiple companions/observers
- [ ] Verify entity contacts are created correctly
- [ ] Test date range validations
- [ ] Test invalid price list ID handling
- [ ] Test package type enum validation

## Migration Script

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPackageTypeToSalesInquiries extends Migration
{
    public function up()
    {
        Schema::table('sales_inquiries', function (Blueprint $table) {
            $table->enum('package_type', ['standard', 'custom'])
                  ->default('standard')
                  ->after('identity_number');
        });
    }

    public function down()
    {
        Schema::table('sales_inquiries', function (Blueprint $table) {
            $table->dropColumn('package_type');
        });
    }
}
```

## Notes

1. The frontend now sends `requested_quantity` separately from available `quantity`
2. Species data structure changed from using `quantity` to using `requested_quantity`
3. Package details card shows area, hunting type, duration, and base amount
4. Date ranges are formatted and displayed for each price list option
5. Validation prevents requesting more species than available in quota
6. The system tracks both standard (pre-defined) and custom (ad-hoc) packages

## Future Enhancements

1. **Custom Package Builder**: Allow admins to save custom packages as templates
2. **Price Estimator**: Real-time price calculation preview before submission
3. **Package Comparison**: Side-by-side comparison of multiple price lists
4. **Seasonal Pricing**: Automatic price adjustments based on season
5. **Multi-Price-List Selection**: Allow combining multiple price lists
6. **Package History**: Track which packages are most popular
7. **Automated Quotes**: Generate PDF quotes automatically upon inquiry creation
