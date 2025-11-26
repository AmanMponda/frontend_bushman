# Laravel Trophy Fees API Setup

## Error Analysis

**404 Error:** `http://localhost:8000/api/v1.0/settings/trophy-fees/`

The route doesn't exist in your Laravel backend yet. Follow these steps to create it.

---

## Step 1: Create Migration (if not exists)

```bash
php artisan make:migration create_trophy_fees_table
```

**Migration file:**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('trophy_fees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('species_id')->constrained('species')->onDelete('cascade');
            $table->foreignId('area_id')->constrained('hunting_areas')->onDelete('cascade');
            $table->integer('sequence_order')->default(1);
            $table->decimal('price_usd', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('trophy_fees');
    }
};
```

Run: `php artisan migrate`

---

## Step 2: Create Model

**File:** `app/Models/TrophyFee.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrophyFee extends Model
{
    use HasFactory;

    protected $table = 'trophy_fees';

    protected $fillable = [
        'species_id',
        'area_id',
        'sequence_order',
        'price_usd',
    ];

    protected $casts = [
        'price_usd' => 'decimal:2',
        'sequence_order' => 'integer',
    ];

    // Relationships
    public function species()
    {
        return $this->belongsTo(Species::class, 'species_id');
    }

    public function area()
    {
        return $this->belongsTo(HuntingArea::class, 'area_id');
    }
}
```

---

## Step 3: Create Controller

```bash
php artisan make:controller Api/V1/Settings/TrophyFeeController --api
```

**File:** `app/Http/Controllers/Api/V1/Settings/TrophyFeeController.php`

```php
<?php

namespace App\Http\Controllers\Api\V1\Settings;

use App\Http\Controllers\Controller;
use App\Models\TrophyFee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TrophyFeeController extends Controller
{
    /**
     * Display a listing of trophy fees.
     * GET /api/v1.0/settings/trophy-fees/
     */
    public function index(Request $request)
    {
        try {
            $query = TrophyFee::with(['species', 'area']);

            // Filter by species_id
            if ($request->has('species_id') && $request->species_id != null) {
                $query->where('species_id', $request->species_id);
            }

            // Filter by area_id
            if ($request->has('area_id') && $request->area_id != null) {
                $query->where('area_id', $request->area_id);
            }

            $trophyFees = $query->orderBy('species_id')
                               ->orderBy('sequence_order')
                               ->get();

            return response()->json([
                'success' => true,
                'data' => $trophyFees,
                'message' => 'Trophy fees retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch trophy fees',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created trophy fee.
     * POST /api/v1.0/settings/trophy-fees/
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'species_id' => 'required|exists:species,id',
            'area_id' => 'required|exists:hunting_areas,id',
            'sequence_order' => 'required|integer|min:1',
            'price_usd' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $trophyFee = TrophyFee::create($request->all());
            $trophyFee->load(['species', 'area']);

            return response()->json([
                'success' => true,
                'data' => $trophyFee,
                'message' => 'Trophy fee created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create trophy fee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified trophy fee.
     * GET /api/v1.0/settings/trophy-fees/{id}/
     */
    public function show($id)
    {
        try {
            $trophyFee = TrophyFee::with(['species', 'area'])->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $trophyFee,
                'message' => 'Trophy fee retrieved successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Trophy fee not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified trophy fee.
     * PUT /api/v1.0/settings/trophy-fees/{id}/
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'species_id' => 'required|exists:species,id',
            'area_id' => 'required|exists:hunting_areas,id',
            'sequence_order' => 'required|integer|min:1',
            'price_usd' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $trophyFee = TrophyFee::findOrFail($id);
            $trophyFee->update($request->all());
            $trophyFee->load(['species', 'area']);

            return response()->json([
                'success' => true,
                'data' => $trophyFee,
                'message' => 'Trophy fee updated successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update trophy fee',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified trophy fee.
     * DELETE /api/v1.0/settings/trophy-fees/{id}/
     */
    public function destroy($id)
    {
        try {
            $trophyFee = TrophyFee::findOrFail($id);
            $trophyFee->delete();

            return response()->json([
                'success' => true,
                'message' => 'Trophy fee deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete trophy fee',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
```

---

## Step 4: Add API Route

**File:** `routes/api.php`

Find your `v1.0` API routes group and add:

```php
Route::prefix('v1.0')->group(function () {

    // ... your existing routes ...

    // Settings routes
    Route::prefix('settings')->group(function () {

        // ... your existing settings routes ...

        // Trophy Fees routes
        Route::apiResource('trophy-fees', App\Http\Controllers\Api\V1\Settings\TrophyFeeController::class);

    });
});
```

**Or if you prefer explicit routes:**

```php
Route::prefix('v1.0/settings')->group(function () {
    Route::get('trophy-fees', [TrophyFeeController::class, 'index']);
    Route::post('trophy-fees', [TrophyFeeController::class, 'store']);
    Route::get('trophy-fees/{id}', [TrophyFeeController::class, 'show']);
    Route::put('trophy-fees/{id}', [TrophyFeeController::class, 'update']);
    Route::delete('trophy-fees/{id}', [TrophyFeeController::class, 'destroy']);
});
```

---

## Step 5: Update Species and HuntingArea Models (if needed)

**Species Model:**

```php
public function trophyFees()
{
    return $this->hasMany(TrophyFee::class);
}
```

**HuntingArea Model:**

```php
public function trophyFees()
{
    return $this->hasMany(TrophyFee::class, 'area_id');
}
```

---

## Step 6: Test the API

### Test with Postman or curl:

**List all trophy fees:**

```bash
GET http://localhost:8000/api/v1.0/settings/trophy-fees/
```

**Filter by species:**

```bash
GET http://localhost:8000/api/v1.0/settings/trophy-fees/?species_id=37
```

**Create trophy fee:**

```bash
POST http://localhost:8000/api/v1.0/settings/trophy-fees/
Content-Type: application/json

{
  "species_id": 37,
  "area_id": 3,
  "sequence_order": 1,
  "price_usd": 41.00
}
```

**Update trophy fee:**

```bash
PUT http://localhost:8000/api/v1.0/settings/trophy-fees/1/
Content-Type: application/json

{
  "species_id": 37,
  "area_id": 3,
  "sequence_order": 2,
  "price_usd": 43.00
}
```

**Delete trophy fee:**

```bash
DELETE http://localhost:8000/api/v1.0/settings/trophy-fees/1/
```

---

## Step 7: Clear Laravel Cache

```bash
php artisan route:clear
php artisan cache:clear
php artisan config:clear
```

---

## Expected Response Format

The controller returns data in the format your frontend expects:

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
        "name": "MASWA (N) GR"
      },
      "sequence_order": 1,
      "price_usd": "41.00",
      "created_at": "2025-11-25T12:27:14.000000Z",
      "updated_at": "2025-11-25T12:27:14.000000Z"
    }
  ],
  "message": "Trophy fees retrieved successfully"
}
```

---

## Troubleshooting

1. **Still getting 404?**

   - Run: `php artisan route:list | grep trophy-fees`
   - Check if route is registered

2. **Database errors?**

   - Make sure migration ran: `php artisan migrate:status`
   - Check table exists: `SELECT * FROM trophy_fees;`

3. **CORS errors?**

   - Update `config/cors.php`
   - Or install: `php artisan install:api`

4. **Model not found?**
   - Make sure Species and HuntingArea models exist
   - Update table names if different
