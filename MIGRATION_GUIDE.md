# Migration Guide: Vuestic UI to Bootstrap 4/5

## ✅ Completed

### Bootstrap Components Created

- ✅ `BootstrapInput` - Form input with validation support
- ✅ `BootstrapSelect` - Dropdown select
- ✅ `BootstrapForm` - Form wrapper
- ✅ `BootstrapButton` - Button with loading states
- ✅ `BootstrapBadge` - Badge component
- ✅ `BootstrapChip` - Chip component (rounded badge)
- ✅ `BootstrapModal` - Modal dialog
- ✅ `BootstrapCheckbox` - Checkbox input
- ✅ `BootstrapValue` - Value wrapper for state management
- ✅ `ToastContainer` - Toast notification container

### Composables Created

- ✅ `useToast()` - Toast notification system (replaces `useToast` from vuestic-ui)
- ✅ `useForm()` - Form validation system (replaces `useForm` from vuestic-ui)

### Global Registration

All Bootstrap components are registered globally with both prefixes:

- `Bootstrap*` prefix (e.g., `BootstrapInput`)
- `Va*` prefix (e.g., `VaInput`) for easier migration

### Example Migration

- ✅ `src/pages/auth/Login.vue` - Fully migrated to Bootstrap

## 🔄 Migration Pattern

### Before (Vuestic):

```vue
<VaForm>
  <VaInput v-model="email" :rules="[validators.required]" label="Email" />
  <VaButton @click="submit">Submit</VaButton>
</VaForm>

<script setup>
import { useForm, useToast } from 'vuestic-ui'
const { init } = useToast()
</script>
```

### After (Bootstrap):

```vue
<BootstrapForm>
  <BootstrapInput v-model="email" :rules="[validators.required]" label="Email" />
  <BootstrapButton @click="submit">Submit</BootstrapButton>
</BootstrapForm>

<script setup>
import { useToast } from '@/composables/useToast'
const { init } = useToast()
</script>
```

## 📋 Component Mapping

| Vuestic UI     | Bootstrap Equivalent                       | Status              |
| -------------- | ------------------------------------------ | ------------------- |
| `VaCard`       | `Card` (from Vue Studio)                   | ✅ Available        |
| `VaCardBody`   | `CardBody`                                 | ✅ Available        |
| `VaCardHeader` | `CardHeader`                               | ✅ Available        |
| `VaInput`      | `BootstrapInput` / `VaInput`               | ✅ Available        |
| `VaSelect`     | `BootstrapSelect` / `VaSelect`             | ✅ Available        |
| `VaButton`     | `BootstrapButton` / `VaButton`             | ✅ Available        |
| `VaForm`       | `BootstrapForm` / `VaForm`                 | ✅ Available        |
| `VaModal`      | `BootstrapModal` / `VaModal`               | ✅ Available        |
| `VaBadge`      | `BootstrapBadge` / `VaBadge`               | ✅ Available        |
| `VaChip`       | `BootstrapChip` / `VaChip`                 | ✅ Available        |
| `VaCheckbox`   | `BootstrapCheckbox` / `VaCheckbox`         | ✅ Available        |
| `VaDataTable`  | Bootstrap `<table>` with classes           | ⚠️ Manual migration |
| `VaIcon`       | Material Icons / Bootstrap Icons           | ⚠️ Use `<i>` tags   |
| `useToast()`   | `useToast()` from `@/composables/useToast` | ✅ Available        |
| `useForm()`    | `useForm()` from `@/composables/useForm`   | ✅ Available        |

## 🚧 Remaining Tasks

### High Priority

1. **DataTable Migration** - Replace `VaDataTable` with Bootstrap tables
2. **Icon Migration** - Replace `VaIcon` with Material Icons or Bootstrap Icons
3. **Remove Vuestic UI** - Remove vuestic-ui from main.ts once all pages migrated

### Pages to Migrate (97 files found)

Key pages to prioritize:

- Auth pages (Signup, RecoverPassword, etc.)
- Dashboard pages
- Settings pages
- Payment pages
- Module settings pages

## 📝 Migration Steps for Each Page

1. **Replace imports:**

   ```ts
   // Before
   import { VaInput, VaButton } from 'vuestic-ui'
   import { useToast } from 'vuestic-ui'

   // After
   import { useToast } from '@/composables/useToast'
   // Components are global, no import needed
   ```

2. **Replace components:**

   - `VaCard` → `Card`
   - `VaCardBody` → `CardBody`
   - `VaInput` → `BootstrapInput` or keep `VaInput` (it's aliased)
   - `VaButton` → `BootstrapButton` or keep `VaButton`
   - etc.

3. **Update composables:**

   ```ts
   // Before
   import { useToast } from 'vuestic-ui'

   // After
   import { useToast } from '@/composables/useToast'
   ```

4. **Replace VaDataTable:**

   ```vue
   <!-- Before -->
   <VaDataTable :items="items" :columns="columns" />

   <!-- After -->
   <div class="table-responsive">
     <table class="table table-hover table-striped">
       <thead>
         <tr>
           <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
         </tr>
       </thead>
       <tbody>
         <tr v-for="item in items" :key="item.id">
           <td v-for="col in columns" :key="col.key">{{ item[col.key] }}</td>
         </tr>
       </tbody>
     </table>
   </div>
   ```

5. **Replace VaIcon:**

   ```vue
   <!-- Before -->
   <VaIcon name="mso-visibility" />

   <!-- After -->
   <i class="material-icons">visibility</i>
   <!-- or -->
   <i class="bi bi-eye"></i>
   ```

## 🎯 Quick Wins

Since components are registered with `Va*` prefix, you can:

1. Keep using `VaInput`, `VaButton`, etc. - they're already Bootstrap components
2. Only need to update imports for composables (`useToast`, `useForm`)
3. Focus on migrating `VaDataTable` and `VaIcon` which need manual replacement

## 📚 Resources

- Bootstrap 5 Documentation: https://getbootstrap.com/docs/5.3/
- Material Icons: https://fonts.google.com/icons
- Bootstrap Icons: https://icons.getbootstrap.com/
