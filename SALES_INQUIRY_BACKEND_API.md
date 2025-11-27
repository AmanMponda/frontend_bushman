# Sales Inquiry Backend API Specification

## Endpoint
`POST /api/v1.0/sales-inquiries`

## Request Structure

### For Standard Package Inquiry

```json
{
  "entity": {
    "full_name": "John Doe",
    "country_id": 1,
    "nationality_id": 2
  },
  "contacts": [
    {
      "contact_type_id": 1,
      "contact": "john@example.com",
      "contactable": true
    },
    {
      "contact_type_id": 2,
      "contact": "+255123456789",
      "contactable": true
    },
    {
      "contact_type_id": 3,
      "contact": "123 Main St, City",
      "contactable": false
    }
  ],
  "inquiry_type": "standard",
  "season_id": 5,
  "preferences": {
    "preferred_date": "2025-06-15T00:00:00",
    "start_date": "2025-06-15T00:00:00",
    "end_date": "2025-06-29T00:00:00",
    "no_of_observers": 2,
    "no_of_companions": 3,
    "no_of_hunters": 3,
    "no_of_days": null
  },
  "price_list_id": 12,
  "species": [],
  "area_id": null
}
```

### For Custom Package Inquiry

```json
{
  "entity": {
    "full_name": "Jane Smith",
    "country_id": 1,
    "nationality_id": 2
  },
  "contacts": [
    {
      "contact_type_id": 1,
      "contact": "jane@example.com",
      "contactable": true
    },
    {
      "contact_type_id": 2,
      "contact": "+255987654321",
      "contactable": true
    },
    {
      "contact_type_id": 3,
      "contact": "456 Oak Ave, Town",
      "contactable": false
    }
  ],
  "inquiry_type": "custom",
  "season_id": 5,
  "preferences": {
    "preferred_date": "2025-07-01T00:00:00",
    "start_date": "2025-07-01T00:00:00",
    "end_date": "2025-07-15T00:00:00",
    "no_of_observers": 1,
    "no_of_companions": 2,
    "no_of_hunters": 2,
    "no_of_days": 14
  },
  "price_list_id": null,
  "species": [
    {
      "species_id": 27,
      "name": "Leopard",
      "quantity": 1
    },
    {
      "species_id": 37,
      "name": "Buffalo African Cape",
      "quantity": 2
    }
  ],
  "area_id": 3
}
```

## Backend Implementation Guide

### 1. Create or Find Entity

```php
// Check if entity exists by full_name, country_id, and nationality_id
$entity = Entity::firstOrCreate([
    'full_name' => $request->entity['full_name'],
    'country_id' => $request->entity['country_id'],
    'nationality_id' => $request->entity['nationality_id'],
    'user_id' => auth()->id()
]);
```

### 2. Create Contacts

```php
foreach ($request->contacts as $contactData) {
    Contact::create([
        'entity_id' => $entity->id,
        'contact_type_id' => $contactData['contact_type_id'],
        'contact' => $contactData['contact'],
        'contactable' => $contactData['contactable'] ?? false
    ]);
}
```

### 3. Create Sales Inquiry

```php
$salesInquiry = SalesInquiry::create([
    'entity_id' => $entity->id,
    'season_id' => $request->season_id,
    'inquiry_type' => $request->inquiry_type, // 'standard' or 'custom'
    'user_id' => auth()->id(),
    'code' => $this->generateInquiryCode(), // Your code generation logic
    'created_date' => now(),
    'updated_date' => now()
]);
```

### 4. Create Sales Inquiry Preferences

```php
$preferencesData = $request->preferences;

// For standard packages, get no_of_days from price list
if ($request->inquiry_type === 'standard' && $request->price_list_id) {
    $priceList = HuntingPriceList::with('priceListType')->find($request->price_list_id);
    $preferencesData['no_of_days'] = $priceList->priceListType->duration;
}

SalesInquiryPreference::create([
    'sales_inquiry_id' => $salesInquiry->id,
    'preferred_date' => $preferencesData['preferred_date'],
    'start_date' => $preferencesData['start_date'],
    'end_date' => $preferencesData['end_date'],
    'no_of_observers' => $preferencesData['no_of_observers'] ?? 0,
    'no_of_companions' => $preferencesData['no_of_companions'] ?? 0,
    'no_of_hunters' => $preferencesData['no_of_hunters'] ?? 1,
    'no_of_days' => $preferencesData['no_of_days'],
    'create_date' => now(),
    'updated_date' => now()
]);
```

### 5. Link Price List (Standard Package Only)

```php
if ($request->inquiry_type === 'standard' && $request->price_list_id) {
    SalesInquiryPriceList::create([
        'sales_inquiry_id' => $salesInquiry->id,
        'price_list_id' => $request->price_list_id,
        'create_date' => now(),
        'updated_date' => now()
    ]);
}
```

### 6. Handle Species (Custom Package Only)

```php
if ($request->inquiry_type === 'custom' && !empty($request->species)) {
    foreach ($request->species as $speciesData) {
        // Your custom species handling logic
        // This depends on your custom package structure
        SalesInquirySpecies::create([
            'sales_inquiry_id' => $salesInquiry->id,
            'species_id' => $speciesData['species_id'],
            'quantity' => $speciesData['quantity']
        ]);
    }
}
```

### 7. Create Companions Entry

```php
if ($request->preferences['no_of_companions'] > 0 && $request->inquiry_type === 'standard') {
    // Get the sales_inquiry_price_list_id
    $inquiryPriceList = SalesInquiryPriceList::where('sales_inquiry_id', $salesInquiry->id)->first();
    
    SalesInquiryCompanion::create([
        'sales_inquiry_price_list_id' => $inquiryPriceList->id,
        'companions_count' => $request->preferences['no_of_companions'],
        'observers_count' => $request->preferences['no_of_observers'] ?? 0,
        'create_date' => now(),
        'updated_date' => now()
    ]);
}
```

## Key Differences: Standard vs Custom Package

### Standard Package
- `inquiry_type`: "standard"
- `price_list_id`: Required (links to `hunting_price_list`)
- `species`: Empty array (species come from price list)
- `area_id`: null (area comes from price list)
- `preferences.no_of_days`: null (duration comes from price list)
- Backend creates entry in `sales_inquiry_price_lists` table
- Backend creates entry in `sales_inquiry_companions` table with companions and observers count

### Custom Package
- `inquiry_type`: "custom"
- `price_list_id`: null
- `species`: Array of selected species with quantities
- `area_id`: Required (user selects hunting area)
- `preferences.no_of_days`: Required (user specifies duration)
- Backend handles custom species entries

## Contact Types Reference
```
1 - email
2 - phone_number
3 - address
4 - phone
```

## Important Notes

1. **Entity Uniqueness**: Check if entity already exists before creating (by full_name + country_id + nationality_id)

2. **Participants Logic**: 
   - `no_of_companions` → Goes to both `preferences.no_of_companions` AND `preferences.no_of_hunters`
   - `no_of_observers` → Goes to `preferences.no_of_observers`

3. **Date Handling**: All dates should be in ISO 8601 format with timezone

4. **Standard Package Data Inheritance**: When `inquiry_type` is "standard":
   - Get `no_of_days` from `hunting_price_list_type.duration`
   - Get `area_id` from `hunting_price_list.area_id`
   - Get species from `sales_package.species`

5. **Inquiry Code**: Generate unique code for each inquiry (format: e.g., "INQ-2025-001")

## Response Structure

```json
{
  "success": true,
  "message": "Sales inquiry created successfully",
  "data": {
    "inquiry_id": 25,
    "code": "INQ-2025-025",
    "entity_id": 42,
    "inquiry_type": "standard",
    "created_at": "2025-11-26T10:30:00.000000Z"
  }
}
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "entity.full_name": ["The full name field is required"],
    "price_list_id": ["Price list is required for standard inquiries"]
  }
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Price list not found",
  "error_code": "PRICE_LIST_NOT_FOUND"
}
```
