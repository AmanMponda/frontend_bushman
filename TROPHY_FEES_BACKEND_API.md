# Trophy Fees Backend API Implementation Guide

## Database Schema

```sql
CREATE TABLE `trophy_fees` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `species_id` bigint(20) NOT NULL,
  `sequence_order` int(11) DEFAULT 1,
  `area_id` bigint(20) NOT NULL,
  `price_usd` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `species_id` (`species_id`),
  KEY `area_id` (`area_id`),
  CONSTRAINT `trophy_fees_ibfk_1` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`),
  CONSTRAINT `trophy_fees_ibfk_2` FOREIGN KEY (`area_id`) REFERENCES `hunting_areas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## API Endpoints

### Base URL

`http://localhost:8000/api/v1.0/settings/trophy-fees/`

### 1. List Trophy Fees (GET)

**Endpoint:** `GET /api/v1.0/settings/trophy-fees/`

**Query Parameters:**

- `species_id` (optional): Filter by species ID
- `area_id` (optional): Filter by area ID

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "species_id": 37,
      "species": {
        "id": 37,
        "name": "Buffalo African Cape",
        "scientific_name": "Syncerus caffer caffer"
      },
      "area_id": 3,
      "area": {
        "id": 3,
        "name": "MASWA (N) GR",
        "description": "MASWA North Game Reserve"
      },
      "sequence_order": 1,
      "price_usd": "41.00",
      "created_at": "2025-11-25T12:27:14Z",
      "updated_at": "2025-11-25T12:27:14Z"
    }
  ],
  "message": "Trophy fees retrieved successfully"
}
```

### 2. Create Trophy Fee (POST)

**Endpoint:** `POST /api/v1.0/settings/trophy-fees/`

**Request Body:**

```json
{
  "species_id": 37,
  "area_id": 3,
  "sequence_order": 1,
  "price_usd": 41.0
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "species_id": 37,
    "area_id": 3,
    "sequence_order": 1,
    "price_usd": "41.00",
    "created_at": "2025-11-25T12:27:14Z",
    "updated_at": "2025-11-25T12:27:14Z"
  },
  "message": "Trophy fee created successfully"
}
```

### 3. Update Trophy Fee (PUT)

**Endpoint:** `PUT /api/v1.0/settings/trophy-fees/{id}/`

**Request Body:**

```json
{
  "species_id": 37,
  "area_id": 3,
  "sequence_order": 2,
  "price_usd": 43.0
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "species_id": 37,
    "area_id": 3,
    "sequence_order": 2,
    "price_usd": "43.00",
    "updated_at": "2025-11-25T13:00:00Z"
  },
  "message": "Trophy fee updated successfully"
}
```

### 4. Delete Trophy Fee (DELETE)

**Endpoint:** `DELETE /api/v1.0/settings/trophy-fees/{id}/`

**Response (200 OK or 204 No Content):**

```json
{
  "success": true,
  "message": "Trophy fee deleted successfully"
}
```

## Important Notes

### Sequence Order

The `sequence_order` field is used to differentiate pricing for the same species taken multiple times:

- `sequence_order: 1` = 1st Buffalo fee
- `sequence_order: 2` = 2nd Buffalo fee
- `sequence_order: 3` = 3rd Buffalo fee
- etc.

### Relationships

- Each trophy fee belongs to one species (species_id)
- Each trophy fee belongs to one hunting area (area_id)
- The API should return nested species and area objects for display

### Validation

1. `species_id` must exist in the species table
2. `area_id` must exist in the hunting_areas table
3. `price_usd` must be greater than 0
4. `sequence_order` must be greater than 0

### Django ViewSet Example

```python
from rest_framework import viewsets
from rest_framework.response import Response

class TrophyFeesViewSet(viewsets.ModelViewSet):
    queryset = TrophyFees.objects.select_related('species', 'area').all()
    serializer_class = TrophyFeesSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        species_id = self.request.query_params.get('species_id')
        area_id = self.request.query_params.get('area_id')

        if species_id:
            queryset = queryset.filter(species_id=species_id)
        if area_id:
            queryset = queryset.filter(area_id=area_id)

        return queryset.order_by('species__name', 'sequence_order')
```

### Serializer Example

```python
class TrophyFeesSerializer(serializers.ModelSerializer):
    species = SpeciesSerializer(read_only=True)
    area = HuntingAreaSerializer(read_only=True)

    class Meta:
        model = TrophyFees
        fields = ['id', 'species_id', 'species', 'area_id', 'area',
                  'sequence_order', 'price_usd', 'created_at', 'updated_at']
```

## Frontend Integration Complete

The frontend has been set up with:

- ✅ Trophy fees management page at `/module-settings/trophy-fees`
- ✅ List view with species and area filters
- ✅ Create/Edit form with validation
- ✅ Delete functionality with confirmation
- ✅ Pinia store for state management
- ✅ Navigation menu item added

## Testing

Once the backend is implemented, test these scenarios:

1. Create a trophy fee for 1st Buffalo in MASWA area
2. Create a trophy fee for 2nd Buffalo in the same area (higher price)
3. Filter by species to see all Buffalo fees
4. Filter by area to see all MASWA fees
5. Edit a trophy fee to update the price
6. Delete a trophy fee
