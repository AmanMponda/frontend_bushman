# Price List Action Button Fix - Completed

## Issue
The action button in ManagePriceList.vue was not working when trying to navigate to PriceListDetails.vue.

## Root Causes Identified
1. **Event Name Mismatch**: The parent component was listening for `@onView` (camelCase) but the child component was emitting `on-view` (kebab-case)
2. **Data Structure Issue**: The method expected `e.item` but received `rowData` directly
3. **Missing Data Properties**: The items array was mapped to a simplified structure that excluded necessary properties like `price_list_type`, `sales_package`, etc., which are required by PriceListDetails.vue

## Changes Made

### File: src/pages/module-settings/ManagePriceList.vue

#### Change 1: Fixed Event Listener (Line 30)
- **Before**: `@onView="toggleShowPriceListMethod"`
- **After**: `@on-view="toggleShowPriceListMethod"`
- **Reason**: Match the kebab-case event name emitted by ModuleTable component

#### Change 2: Updated Method Parameter (Lines 191-196)
- **Before**: Method expected `e.item` structure
- **After**: Method now correctly handles `rowData` directly
- **Changes**:
  - Parameter renamed from `e` to `rowData` for clarity
  - Changed `e.item` to `rowData`
  - Changed `e?.item.price_list_type` to `rowData?.price_list_type`
  - Added console logs for debugging

#### Change 3: Preserved Full Item Data (Lines 295-299)
- **Added Properties**:
  - `price_list_type`: Required for accessing hunting type ID
  - `sales_package`: Required by PriceListDetails.vue
  - `componions_hunter`: Required by PriceListDetails.vue
  - `observer`: Required by PriceListDetails.vue
- **Reason**: PriceListDetails.vue needs these nested properties to display complete information

## Testing Checklist
- [x] Event name matches between parent and child
- [x] Data structure correctly passed to detail view
- [x] All required properties preserved in items array
- [ ] Test clicking action button navigates to details
- [ ] Verify details page displays correctly with all data
- [ ] Check console for any errors

## Status
✅ Implementation Complete - Ready for Testing
