<template>
  <div class="sales-inquiries-page">
    <!-- Breadcrumb -->
    <div class="d-flex align-items-center mb-3">
      <div>
        <ul class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">Sales</a></li>
          <li class="breadcrumb-item active">Sales Inquiries</li>
        </ul>
      </div>
    </div>

    <!-- Main Content -->
    <template v-if="!showAddSalesInquiriesForm">
      <!-- Sales Inquiries List View -->
      <template v-if="showDetailsPage === false">
        <div class="row layout-top-spacing bg-white rounded">
          <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
            <div class="panel br-6 p-0">
              <div class="custom-table p-3">
                <StandardDataTable
                  :columns="columns"
                  :data="dataFetched"
                  :loading="loading"
                  :filters="tableFilters"
                  :default-page-size="tableFilters.pageSize"
                  :disable-pagination="false"
                  :show-date-filters="false"
                  :action-buttons="pageActions"
                  :custom-filters="customFilters"
                  @update:filters="handleFiltersUpdate"
                >
                  <template #client_name="{ row }">
                    {{ (row as any).name }}
                  </template>
                  <template #area="{ row }">
                    {{ (row as any).area }}
                  </template>
                  <template #hunting_type="{ row }">
                    {{ (row as any).hunting_type }}
                  </template>
                  <template #start_date="{ row }">
                    {{ formatDate((row as any).start_date) }}
                  </template>
                  <template #end_date="{ row }">
                    {{ formatDate((row as any).end_date) }}
                  </template>
                  <template #season="{ row }">
                    {{ (row as any).season || 'N/A' }}
                  </template>
                  <template #species_count="{ row }">
                    {{ (row as any).species_count || 0 }}
                  </template>
                  <template #status="{ row }">
                    {{ (row as any).status }}
                  </template>
                  <template #actions="{ row }">
                    <div class="d-flex gap-1">
                      <button class="btn btn-info btn-sm" title="View" @click="viewInquiries(row as any)">
                        <i class="fa fa-eye"></i>
                      </button>
                      <button class="btn btn-secondary btn-sm" title="Edit" @click="editInquiry(row as any)">
                        <i class="fa fa-pen"></i>
                      </button>
                      <button class="btn btn-danger btn-sm" title="Delete" @click="confirmDeleteInquiry(row as any)">
                        <i class="fa fa-trash"></i>
                      </button>
                    </div>
                  </template>
                </StandardDataTable>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Detail View -->
      <template v-else>
        <div class="price-list-details">
          <div class="row gx-4">
            <div class="col-lg-12">
              <div class="card">
                <!-- HEADER -->
                <div class="card-header d-flex align-items-center bg-white fw-400">
                  <div class="d-flex align-items-center">
                    <div class="vehicle-icon me-3">
                      <i class="fa fa-search fa-3x text-primary"></i>
                    </div>
                    <div>
                      <h4 class="mb-0">{{ selectedInquiryItem?.entity?.full_name || 'Sales Inquiry Details' }}</h4>
                      <small class="text-muted">
                        {{ selectedInquiryItem?.code || 'Sales Inquiry' }} •
                        {{ selectedInquiryItem?.season?.name || 'N/A' }}
                        <span
                          v-if="selectedInquiryItem?.inquiry_type"
                          :class="
                            selectedInquiryItem?.inquiry_type === 'standard'
                              ? 'badge bg-success ms-2'
                              : 'badge bg-info ms-2'
                          "
                        >
                          {{ selectedInquiryItem?.inquiry_type === 'standard' ? 'Standard' : 'Custom' }}
                        </span>
                      </small>
                    </div>
                  </div>

                  <div class="ms-auto d-flex align-items-center gap-2">
                    <button
                      class="btn btn-outline-secondary text-nowrap btn-sm px-3 rounded-pill"
                      @click="handleGoBack"
                    >
                      <i class="fa fa-arrow-left me-1"></i> Back
                    </button>
                  </div>
                </div>

                <!-- Content -->
                <SalesInquiryDetails :item="selectedInquiryItem" @goBack="handleGoBack" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- Create/Edit Form -->
    <template v-if="showAddSalesInquiriesForm">
      <div class="form-wizard-container">
        <!-- Form Wizard -->
        <div class="card sales-inquiry-wizard">
          <div class="card-header bg-white border-bottom">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-2">
                <i class="fa fa-edit text-primary fs-4"></i>
                <h2 class="h4 mb-0">{{ isEditMode ? 'Edit Enquiry' : 'Create New Enquiry' }}</h2>
              </div>
              <div class="d-flex align-items-center gap-2">
                <span class="badge bg-primary">{{ `Step ${currentStep + 1} of ${wizardSteps.length}` }}</span>
                <span class="text-muted d-none d-md-inline">{{ wizardSteps[currentStep].label }}</span>
              </div>
            </div>
          </div>

          <div class="card-body">
            <!-- Progress Bar -->
            <div class="progress mb-4" style="height: 8px">
              <div
                class="progress-bar bg-primary"
                role="progressbar"
                :style="{ width: `${((currentStep + 1) / wizardSteps.length) * 100}%` }"
              ></div>
            </div>

            <!-- Bootstrap Stepper -->
            <ul class="nav nav-pills nav-justified mb-4">
              <li v-for="(step, index) in wizardSteps" :key="index" class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: currentStep === index, 'text-success': currentStep > index }"
                  href="#"
                  @click.prevent="goToStep(index)"
                >
                  <i
                    class="fa"
                    :class="{
                      'fa-user': index === 0,
                      'fa-calendar': index === 1,
                      'fa-hiking': index === 2,
                      'fa-check-circle': index === 3,
                    }"
                  ></i>
                  <span class="d-none d-md-inline ms-1">{{ step.label }}</span>
                  <i v-if="index === 0 && isStep1Complete" class="fa fa-check-circle text-success ms-1"></i>
                  <i v-if="index === 1 && isStep2Complete" class="fa fa-check-circle text-success ms-1"></i>
                  <i v-if="index === 2 && isStep3Complete" class="fa fa-check-circle text-success ms-1"></i>
                </a>
              </li>
            </ul>

            <form ref="formRef">
              <!-- Step 1: Customer Information -->
              <div v-show="currentStep === 0">
                <!-- Customer Selection Section -->
                <div class="card mb-4">
                  <div class="card-header bg-light">
                    <div class="d-flex align-items-center gap-2">
                      <i class="fa fa-user text-primary"></i>
                      <h5 class="mb-0">Customer Selection</h5>
                      <i v-if="customerType" class="fa fa-check-circle text-success ms-auto"></i>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="alert alert-info">
                      <strong>New or Existing Customer?</strong><br />
                      Select an existing customer to auto-fill their information, or choose "New Customer" to enter
                      details manually.
                    </div>

                    <div class="row mb-3">
                      <div class="col-md-6">
                        <div class="form-check">
                          <input
                            id="customerTypeNew"
                            v-model="customerType"
                            class="form-check-input"
                            type="radio"
                            name="customerType"
                            value="new"
                          />
                          <label class="form-check-label" for="customerTypeNew"> New Customer </label>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="form-check">
                          <input
                            id="customerTypeExisting"
                            v-model="customerType"
                            class="form-check-input"
                            type="radio"
                            name="customerType"
                            value="existing"
                          />
                          <label class="form-check-label" for="customerTypeExisting"> Existing Customer </label>
                        </div>
                      </div>
                    </div>

                    <div v-if="customerType === 'existing'" class="mb-3">
                      <label class="form-label">Select Customer</label>
                      <select
                        v-model="selectedExistingCustomer"
                        class="form-select"
                        @change="populateFormFromCustomer(selectedExistingCustomer)"
                      >
                        <option value="">Search and select an existing customer</option>
                        <option v-for="customer in existingCustomersOptions" :key="customer.value" :value="customer">
                          {{ customer.text }} - {{ customer.selfItem?.email || 'N/A' }} •
                          {{ customer.selfItem?.country || 'N/A' }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Basic Information Section -->
                <div class="card mb-4">
                  <div class="card-header bg-light">
                    <div class="d-flex align-items-center gap-2">
                      <i class="fa fa-user text-primary"></i>
                      <h5 class="mb-0">Basic Information</h5>
                      <i
                        v-if="form.full_name && form.country && form.nationality"
                        class="fa fa-check-circle text-success ms-auto"
                      ></i>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-4 mb-3">
                        <label class="form-label">Full name <span class="text-danger">*</span></label>
                        <input
                          v-model="form.full_name"
                          type="text"
                          class="form-control"
                          placeholder="Enter your Full name"
                          required
                        />
                      </div>
                      <div class="col-md-4 mb-3">
                        <label class="form-label">Country <span class="text-danger">*</span></label>
                        <select v-model="form.country" class="form-select" required>
                          <option value="">Select Country</option>
                          <option v-for="country in countries" :key="country.value" :value="country">
                            {{ country.text }}
                          </option>
                        </select>
                      </div>
                      <div class="col-md-4 mb-3">
                        <label class="form-label">Client Nationality <span class="text-danger">*</span></label>
                        <select v-model="form.nationality" class="form-select" required>
                          <option value="">Select Client nationality</option>
                          <option v-for="nat in nationality" :key="nat.value" :value="nat">
                            {{ nat.text }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Contact Information Section -->
                <div class="card mb-4">
                  <div class="card-header bg-light">
                    <div class="d-flex align-items-center gap-2">
                      <i class="fa fa-envelope text-primary"></i>
                      <h5 class="mb-0">Contact Information</h5>
                      <i
                        v-if="form.email && form.phone && form.address"
                        class="fa fa-check-circle text-success ms-auto"
                      ></i>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Email <span class="text-danger">*</span></label>
                        <input
                          v-model="form.email"
                          type="email"
                          class="form-control"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Primary Phone <span class="text-danger">*</span></label>
                        <input
                          v-model="form.phone"
                          type="text"
                          class="form-control"
                          placeholder="eg: +971501234567"
                          required
                        />
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Additional Phone</label>
                        <input
                          v-model="form.phone_additional"
                          type="text"
                          class="form-control"
                          placeholder="eg: +971501234567 (Optional)"
                        />
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label">Address <span class="text-danger">*</span></label>
                        <input
                          v-model="form.address"
                          type="text"
                          class="form-control"
                          maxlength="30"
                          placeholder="Enter your address"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Season, Package, Dates & Hunt Party -->
              <div v-show="currentStep === 1">
                <!-- Season & Package Section - Optimized Layout -->
                <div class="card mb-3">
                  <div class="card-header bg-light py-2">
                    <div class="d-flex align-items-center gap-2">
                      <i class="fa fa-calendar text-primary"></i>
                      <h5 class="mb-0">Season & Package</h5>
                      <i v-if="form.season && form.priceListId" class="fa fa-check-circle text-success ms-auto"></i>
                    </div>
                  </div>
                  <div class="card-body py-3">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">Season</label>
                        <select
                          v-model="form.season"
                          class="form-select"
                          required
                          @change="onSeasonSelected(form.season)"
                        >
                          <option value="">Select Season</option>
                          <option v-for="season in seasonsOptions" :key="season.value" :value="season">
                            {{ season.text }}
                            <template v-if="season.selfItem">
                              - {{ formatDateRange(season.selfItem.start_at, season.selfItem.end_at) }}
                            </template>
                          </option>
                        </select>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">Hunting Package</label>
                        <select
                          v-model="form.priceListId"
                          class="form-select"
                          :disabled="!form.season || filteredPackagesOptions.length === 0"
                          required
                          @change="populateFormFromPackage()"
                        >
                          <option value="">Select a Hunting Package</option>
                          <option v-for="pkg in filteredPackagesOptions" :key="pkg.value" :value="pkg">
                            {{ pkg.text }}
                            <template v-if="pkg.selfItem">
                              - {{ pkg.selfItem?.area || pkg.selfItem?.area_package || 'N/A' }} •
                              {{ pkg.selfItem?.hunting_type || 'N/A' }} • {{ pkg.selfItem?.duration || 0 }} days
                            </template>
                          </option>
                        </select>
                      </div>
                    </div>

                    <!-- Package Details - Compact Display -->
                    <div v-if="form.priceListId && form.priceListId.selfItem" class="alert alert-info mb-0 mt-3 py-2">
                      <div class="row g-2 small">
                        <div class="col-6 col-md-3">
                          <strong>Area:</strong>
                          {{
                            form.priceListId.selfItem?.sales_package?.area?.name ||
                            form.priceListId.selfItem?.area ||
                            'N/A'
                          }}
                        </div>
                        <div class="col-6 col-md-3">
                          <strong>Hunting Type:</strong>
                          {{
                            form.priceListId.selfItem?.price_list_type?.hunting_type?.name ||
                            form.priceListId.selfItem?.hunting_type ||
                            'N/A'
                          }}
                        </div>
                        <div class="col-6 col-md-3">
                          <strong>Duration:</strong>
                          {{
                            form.priceListId.selfItem?.price_list_type?.duration ||
                            form.priceListId.selfItem?.duration ||
                            0
                          }}
                          days
                        </div>
                        <div class="col-6 col-md-3">
                          <strong>Base Amount:</strong>
                          {{ form.priceListId.selfItem?.price_list_type?.currency?.symbol || '$'
                          }}{{
                            form.priceListId.selfItem?.price_list_type?.amount ||
                            form.priceListId.selfItem?.amount ||
                            'N/A'
                          }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Hunt Dates Section - Optimized Layout -->
                <div class="card mb-3">
                  <div class="card-header bg-light py-2">
                    <div class="d-flex align-items-center gap-2">
                      <i class="fa fa-calendar-alt text-primary"></i>
                      <h5 class="mb-0">Hunt Dates</h5>
                      <i
                        v-if="form.preferred_date && form.start_date && form.end_date"
                        class="fa fa-check-circle text-success ms-auto"
                      ></i>
                    </div>
                  </div>
                  <div class="card-body py-3">
                    <div class="row g-3">
                      <div class="col-md-4">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">Preferred Date</label>
                        <input
                          v-model="form.preferred_date"
                          type="date"
                          class="form-control"
                          :disabled="!form.season"
                          required
                          @change="checkBookedDateConflict"
                        />
                      </div>
                      <div class="col-md-4">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">Start Date</label>
                        <input
                          v-model="form.start_date"
                          type="date"
                          class="form-control"
                          :disabled="!form.season"
                          required
                          @change="onStartDateChange"
                        />
                      </div>
                      <div class="col-md-4">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">End Date</label>
                        <input
                          v-model="form.end_date"
                          type="date"
                          class="form-control"
                          :disabled="!form.season || !form.start_date"
                          :min="form.start_date"
                          required
                          @change="onEndDateChange"
                        />
                      </div>
                    </div>

                    <!-- Date Info & Warnings - Compact -->
                    <div
                      v-if="form.start_date && form.end_date && huntDuration > 0"
                      class="alert alert-info mt-3 mb-0 py-2"
                    >
                      <i class="fa fa-calendar-check me-2"></i>
                      <strong>Hunt Duration:</strong> {{ huntDuration }} days
                      <span class="ms-2"
                        >From {{ formatDate(form.start_date) }} to {{ formatDate(form.end_date) }}</span
                      >
                    </div>
                    <div v-if="dateConflictWarning" class="alert alert-warning mt-2 mb-0 py-2">
                      <i class="fa fa-exclamation-triangle me-2"></i>
                      <strong>Date Conflict Detected:</strong> {{ dateConflictWarning }}
                    </div>
                    <div v-if="bookedDatesForSelectedSeason.length > 0" class="mt-2">
                      <small class="text-muted d-block mb-1">
                        <i class="fa fa-calendar-times me-1"></i>Already Booked Dates:
                      </small>
                      <div class="d-flex flex-wrap gap-1">
                        <span
                          v-for="(booking, index) in bookedDatesForSelectedSeason"
                          :key="index"
                          class="badge bg-danger"
                        >
                          {{ formatBookingDateRange(booking) }} - {{ booking.client_name }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Hunt Party Details - Optimized Compact Layout -->
                <div class="card mb-3">
                  <div class="card-header bg-light py-2">
                    <div class="d-flex align-items-center gap-2">
                      <i class="fa fa-users text-primary"></i>
                      <h5 class="mb-0">Hunt Party Details</h5>
                      <i
                        v-if="huntDuration > 0 && form.no_of_hunters"
                        class="fa fa-check-circle text-success ms-auto"
                      ></i>
                    </div>
                  </div>
                  <div class="card-body py-3">
                    <div class="row g-3">
                      <div class="col-md-3">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">Hunting Days</label>
                        <div class="input-group">
                          <span class="input-group-text"><i class="fa fa-calendar text-primary"></i></span>
                          <input
                            type="text"
                            class="form-control"
                            :value="huntDuration > 0 ? `${huntDuration} days` : 'Select dates above'"
                            readonly
                            disabled
                          />
                        </div>
                      </div>
                      <div class="col-md-3">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">Hunting Area</label>
                        <select v-model="form.area" class="form-select" disabled required>
                          <option value="">Select Area</option>
                          <option v-for="area in areasOptions" :key="area.value" :value="area">
                            {{ area.text }}
                          </option>
                        </select>
                      </div>
                      <div class="col-md-2">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">Hunters</label>
                        <input v-model="form.no_of_hunters" type="number" class="form-control" min="1" required />
                      </div>
                      <div class="col-md-2">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">Observers</label>
                        <input v-model="form.no_of_observers" type="number" class="form-control" min="0" />
                      </div>
                      <div class="col-md-2">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">Companions</label>
                        <input v-model="form.no_of_companions" type="number" class="form-control" min="0" />
                      </div>
                    </div>

                    <!-- Observer and Companion Rates - Compact Display -->
                    <div v-if="form.priceListId?.selfItem" class="row g-2 mt-2">
                      <div v-if="form.priceListId.selfItem.observer?.length > 0" class="col-md-6">
                        <div class="alert alert-success mb-0 py-2">
                          <div class="d-flex justify-content-between align-items-center">
                            <div>
                              <i class="fa fa-eye me-2"></i>
                              <strong>Observer Rate:</strong>
                              {{ form.priceListId.selfItem.price_list_type?.currency?.symbol || '$'
                              }}{{ form.priceListId.selfItem.observer[0].amount }}
                              <small class="text-muted">per observer</small>
                            </div>
                            <div v-if="form.no_of_observers > 0" class="text-end">
                              <div class="small text-muted">Subtotal:</div>
                              <div class="fw-bold">
                                {{ form.priceListId.selfItem.price_list_type?.currency?.symbol || '$'
                                }}{{
                                  (form.no_of_observers * form.priceListId.selfItem.observer[0].amount).toLocaleString()
                                }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="form.priceListId.selfItem.companion_hunter_costs?.length > 0" class="col-md-6">
                        <div class="alert alert-primary mb-0 py-2">
                          <div class="d-flex justify-content-between align-items-center">
                            <div>
                              <i class="fa fa-users me-2"></i>
                              <strong>Companion Rate:</strong>
                              {{ form.priceListId.selfItem.price_list_type?.currency?.symbol || '$'
                              }}{{ form.priceListId.selfItem.companion_hunter_costs[0].amount }}
                              <small class="text-muted">per companion</small>
                            </div>
                            <div v-if="form.no_of_companions > 0" class="text-end">
                              <div class="small text-muted">Subtotal:</div>
                              <div class="fw-bold">
                                {{ form.priceListId.selfItem.price_list_type?.currency?.symbol || '$'
                                }}{{
                                  (
                                    form.no_of_companions * form.priceListId.selfItem.companion_hunter_costs[0].amount
                                  ).toLocaleString()
                                }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Upgrade Fees Section -->
                <div
                  v-if="form.priceListId?.selfItem?.upgrade_fees && form.priceListId.selfItem.upgrade_fees.length > 0"
                  class="mb-6"
                >
                  <div class="flex items-center gap-2 mb-4">
                    <VaIcon name="upgrade" color="warning" size="large" />
                    <h3 class="text-xl font-bold text-gray-800">Upgrade Fees</h3>
                  </div>

                  <VaCard outlined class="bg-amber-50">
                    <VaCardContent>
                      <div class="va-table-responsive">
                        <table class="va-table va-table--hoverable w-full text-sm">
                          <thead>
                            <tr>
                              <th class="text-left">Species</th>
                              <th class="text-right">Upgrade Fee</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="fee in form.priceListId.selfItem.upgrade_fees" :key="fee.id">
                              <td class="font-medium">{{ fee.species_name || fee.species?.name || 'Unknown' }}</td>
                              <td class="text-right font-semibold text-warning">
                                {{
                                  fee.currency_symbol ||
                                  form.priceListId.selfItem.price_list_type?.currency?.symbol ||
                                  '$'
                                }}{{ fee.amount }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </VaCardContent>
                  </VaCard>
                </div>

                <!-- Species Selection Section - Optimized -->
                <div class="card mb-3">
                  <div class="card-header bg-light py-2">
                    <div class="d-flex align-items-center gap-2">
                      <i class="fa fa-paw text-primary"></i>
                      <h5 class="mb-0">Species Selection</h5>
                    </div>
                  </div>
                  <div class="card-body py-3">
                    <div class="row g-2 mb-3">
                      <div class="col-md-5">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">Species</label>
                        <select v-model="form.species" class="form-select">
                          <option value="">Select Species</option>
                          <option v-for="species in speciesOptions" :key="species.value" :value="species">
                            {{ species.text }}
                          </option>
                        </select>
                      </div>
                      <div class="col-md-3">
                        <label class="form-label small text-uppercase fw-bold text-muted mb-1">Quantity</label>
                        <input
                          v-model="form.quantity"
                          type="number"
                          class="form-control"
                          min="1"
                          max="100"
                          placeholder="Qty"
                        />
                      </div>
                      <div class="col-md-4 d-flex align-items-end">
                        <button type="button" class="btn btn-primary w-100" @click="addNewSpeciesItemToStorage()">
                          <i class="fa fa-plus me-1"></i> Add Species
                        </button>
                      </div>
                    </div>

                    <hr />

                    <div class="mt-3">
                      <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong class="small">Selected Species ({{ speciesObjects.length }})</strong>
                      </div>
                      <div v-if="speciesObjects.length > 0" class="list-group">
                        <div
                          v-for="(s, index) in speciesObjects"
                          :key="index"
                          class="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div class="d-flex align-items-center gap-2">
                            <strong>{{ s.name }}</strong>
                            <span v-if="s.fromPackage" class="badge bg-info">from Package</span>
                          </div>
                          <div class="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              class="btn btn-sm btn-outline-primary"
                              :disabled="s.quantity <= 1"
                              @click="decrementQuantity(index)"
                            >
                              <i class="fa fa-minus"></i>
                            </button>
                            <span class="badge bg-primary" style="min-width: 30px">{{ s.quantity }}</span>
                            <button
                              type="button"
                              class="btn btn-sm btn-outline-primary"
                              @click="incrementQuantity(index)"
                            >
                              <i class="fa fa-plus"></i>
                            </button>
                            <button
                              type="button"
                              class="btn btn-sm btn-outline-danger ms-2"
                              @click="deleteFromStorage(index)"
                            >
                              <i class="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div v-else class="alert alert-secondary mb-0">
                        No species selected yet. Add species using the form above or select a package.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- End of Step 2 -->

              <!-- Step 3: Safari Extras & Trophy Fees -->
              <div v-show="currentStep === 2" class="animate-fade-in">
                <!-- Safari Extras Section -->
                <div class="mb-6">
                  <div class="flex items-center gap-2 mb-4">
                    <VaIcon name="hiking" color="primary" size="large" />
                    <h3 class="text-xl font-bold text-gray-800">Safari Extras</h3>
                  </div>

                  <VaAlert v-if="selectedSafariExtras.length === 0" color="secondary" class="mb-4" border="left">
                    <template #title>No Safari Extras Selected</template>
                    Safari extras will be populated when you select a package. You can also add them manually later.
                  </VaAlert>

                  <template v-else>
                    <VaAlert color="info" class="mb-4" border="left">
                      <template #title>Customize Safari Extras ({{ selectedSafariExtras.length }} selected)</template>
                      Remove any safari extras that your client does not require by clicking the remove button.
                    </VaAlert>

                    <VaCard outlined class="mb-4 bg-gray-50">
                      <VaCardContent>
                        <div class="space-y-3">
                          <div
                            v-for="(extra, index) in selectedSafariExtras"
                            :key="extra.id"
                            class="p-3 border rounded-lg bg-white flex justify-between items-center"
                          >
                            <div class="flex items-center gap-3">
                              <div class="font-semibold text-base capitalize">{{ extra.name }}</div>
                              <VaBadge v-if="extra.fromPackage" color="info" size="small" text="FROM PACKAGE" />
                              <div class="text-xs text-gray-600">{{ extra.description }}</div>
                            </div>

                            <div class="flex items-center gap-2">
                              <div class="text-sm text-gray-600 mr-3">
                                {{ extra.currency?.symbol || '$' }}{{ extra.amount }}
                              </div>
                              <VaButton
                                preset="plain"
                                color="danger"
                                size="small"
                                icon="delete"
                                title="Remove this safari extra"
                                @click="removeSafariExtra(index)"
                              />
                            </div>
                          </div>
                        </div>
                      </VaCardContent>
                    </VaCard>
                  </template>
                </div>

                <!-- Trophy Fees Section -->
                <div v-if="form.priceListId?.selfItem?.trophy_fees?.length > 0" class="mb-6">
                  <div class="flex items-center gap-2 mb-4">
                    <VaIcon name="emoji_events" color="primary" size="large" />
                    <h3 class="text-xl font-bold text-gray-800">Trophy Fees</h3>
                  </div>

                  <VaAlert color="info" class="mb-4" border="left">
                    <template #title
                      >Trophy Fees Included ({{ form.priceListId.selfItem.trophy_fees.length }} species)</template
                    >
                    These trophy fees are included in the selected package and will be shown in the final review.
                  </VaAlert>

                  <VaCard outlined class="mb-4 bg-gray-50">
                    <VaCardContent>
                      <div class="va-table-responsive">
                        <table class="va-table va-table--hoverable w-full">
                          <thead>
                            <tr>
                              <th class="text-left">Species</th>
                              <th class="text-center">Sequence</th>
                              <th class="text-right">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(fee, index) in form.priceListId.selfItem.trophy_fees"
                              :key="`trophy-${fee.id}-${index}`"
                            >
                              <td class="font-medium">{{ fee.species?.name || 'Unknown' }}</td>
                              <td class="text-center">
                                <VaBadge :text="getSequenceLabel(fee.sequence_order)" color="primary" size="small" />
                              </td>
                              <td class="text-right font-semibold">
                                {{ form.priceListId.selfItem?.price_list_type?.currency?.symbol || '$'
                                }}{{ fee.amount }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </VaCardContent>
                  </VaCard>
                </div>

                <!-- Quotation Creation Section -->
                <div class="mb-6">
                  <div class="flex items-center gap-2 mb-4">
                    <VaIcon name="request_quote" color="primary" size="large" />
                    <h3 class="text-xl font-bold text-gray-800">Quotation</h3>
                  </div>

                  <VaCard outlined class="mb-4">
                    <VaCardContent>
                      <div class="flex items-center justify-between mb-4">
                        <div>
                          <h4 class="font-semibold text-lg">Create Quotation for this Inquiry?</h4>
                          <p class="text-sm text-gray-600">
                            Enable this option to generate a quotation with payment installments for the client.
                          </p>
                        </div>
                        <VaSwitch v-model="createQuotation" color="primary" size="medium" />
                      </div>

                      <!-- Quotation Form (shown when enabled) -->
                      <template v-if="createQuotation">
                        <VaDivider class="mb-4" />

                        <!-- Quotation Details -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div class="text-xs font-semibold text-gray-700 uppercase mb-1">Confirmation Date</div>
                            <VaDateInput
                              v-model="quotationForm.confirmation_date"
                              placeholder="Select confirmation date"
                              first-weekday="Monday"
                            />
                          </div>
                          <div>
                            <div class="text-xs font-semibold text-gray-700 uppercase mb-1">
                              Hunting License (Optional)
                            </div>
                            <VaInput v-model="quotationForm.hunting_license" placeholder="Enter license number" />
                          </div>
                        </div>

                        <div class="mb-4">
                          <div class="text-xs font-semibold text-gray-700 uppercase mb-1">Remarks (Optional)</div>
                          <VaTextarea
                            v-model="quotationForm.remarks"
                            placeholder="Add any additional notes or remarks..."
                            :min-rows="2"
                          />
                        </div>

                        <!-- Payment Installments -->
                        <div class="mb-4">
                          <div class="flex items-center justify-between mb-3">
                            <div class="text-xs font-semibold text-gray-700 uppercase">Payment Installments</div>
                            <VaButton preset="secondary" size="small" icon="add" @click="addQuotationInstallment">
                              Add Installment
                            </VaButton>
                          </div>

                          <VaAlert
                            v-if="quotationForm.installments.length === 0"
                            color="warning"
                            class="mb-3"
                            border="left"
                          >
                            <template #title>Required</template>
                            At least one payment installment is required to create a quotation.
                          </VaAlert>

                          <div
                            v-for="(installment, index) in quotationForm.installments"
                            :key="index"
                            class="p-4 border rounded-lg mb-3 bg-gray-50"
                          >
                            <div class="flex justify-between items-start mb-3">
                              <span class="font-semibold text-gray-700">Installment {{ index + 1 }}</span>
                              <VaButton
                                preset="plain"
                                color="danger"
                                size="small"
                                icon="delete"
                                @click="removeQuotationInstallment(index)"
                              />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <VaInput
                                v-model="installment.narration"
                                placeholder="e.g., Deposit Due upon booking"
                                label="Description"
                              />
                              <VaInput
                                v-model="installment.amount_due"
                                label="Amount (USD)"
                                type="number"
                                placeholder="5000"
                              />
                              <VaSelect
                                v-model="installment.due_days_type"
                                :options="dueDaysTypeOptions"
                                label="Due Type"
                                placeholder="Select when due"
                              />
                              <VaInput
                                v-model="installment.due_days"
                                :label="
                                  installment.due_days_type === 'before_arrival' ? 'Days Before Arrival' : 'Due Days'
                                "
                                type="number"
                                placeholder="e.g., 90"
                                :disabled="installment.due_days_type === 'upon_booking'"
                              />
                            </div>
                          </div>

                          <!-- Total -->
                          <div
                            v-if="quotationForm.installments.length > 0"
                            class="p-4 bg-primary rounded-lg text-white"
                          >
                            <div class="flex justify-between items-center">
                              <span class="text-lg font-semibold">TOTAL</span>
                              <span class="text-2xl font-bold">${{ quotationTotalAmount.toLocaleString() }}</span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </VaCardContent>
                  </VaCard>
                </div>
              </div>
              <!-- End of Step 3 -->

              <!-- Step 4: Review & Submit -->
              <div v-show="currentStep === 3" class="animate-fade-in">
                <div class="mb-6">
                  <div class="flex items-center gap-2 mb-4">
                    <VaIcon name="fact_check" color="primary" size="large" />
                    <h3 class="text-xl font-bold text-gray-800">Review Your Enquiry</h3>
                  </div>

                  <VaAlert color="info" class="mb-4" border="left">
                    <template #title>Please Review</template>
                    Review all the information below before submitting your enquiry.
                  </VaAlert>

                  <!-- Customer Summary -->
                  <VaCard outlined class="mb-4">
                    <VaCardTitle class="flex items-center gap-2">
                      <VaIcon name="person" size="small" color="primary" />
                      Customer Information
                    </VaCardTitle>
                    <VaCardContent>
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span class="text-gray-600">Full Name:</span>
                          <span class="ml-2 font-medium">{{ form.full_name || 'N/A' }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Country:</span>
                          <span class="ml-2 font-medium">{{ form.country?.text || 'N/A' }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Nationality:</span>
                          <span class="ml-2 font-medium">{{ form.nationality?.text || 'N/A' }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Email:</span>
                          <span class="ml-2 font-medium">{{ form.email || 'N/A' }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Primary Phone:</span>
                          <span class="ml-2 font-medium">{{ form.phone || 'N/A' }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Additional Phone:</span>
                          <span class="ml-2 font-medium">{{ form.phone_additional || 'N/A' }}</span>
                        </div>
                        <div class="md:col-span-3">
                          <span class="text-gray-600">Address:</span>
                          <span class="ml-2 font-medium">{{ form.address || 'N/A' }}</span>
                        </div>
                      </div>
                    </VaCardContent>
                  </VaCard>

                  <!-- Season & Package Summary -->
                  <VaCard outlined class="mb-4">
                    <VaCardTitle class="flex items-center gap-2">
                      <VaIcon name="inventory_2" size="small" color="primary" />
                      Season & Package
                    </VaCardTitle>
                    <VaCardContent>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span class="text-gray-600">Season:</span>
                          <span class="ml-2 font-medium">{{ form.season?.text || 'N/A' }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Package:</span>
                          <span class="ml-2 font-medium">{{ form.priceListId?.text || 'No package selected' }}</span>
                        </div>
                      </div>
                    </VaCardContent>
                  </VaCard>

                  <!-- Schedule Summary -->
                  <VaCard outlined class="mb-4">
                    <VaCardTitle class="flex items-center gap-2">
                      <VaIcon name="event" size="small" color="primary" />
                      Schedule & Hunt Party
                    </VaCardTitle>
                    <VaCardContent>
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <span class="text-gray-600">Preferred Date:</span>
                          <span class="ml-2 font-medium">{{ formatReviewDate(form.preferred_date) }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Start Date:</span>
                          <span class="ml-2 font-medium">{{ formatReviewDate(form.start_date) }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">End Date:</span>
                          <span class="ml-2 font-medium">{{ formatReviewDate(form.end_date) }}</span>
                        </div>
                      </div>
                      <VaDivider class="my-3" />
                      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span class="text-gray-600">Hunting Area:</span>
                          <span class="ml-2 font-medium">{{ form.area?.text || 'N/A' }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Days:</span>
                          <span class="ml-2 font-medium">{{ form.no_of_days || 'N/A' }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Hunters:</span>
                          <span class="ml-2 font-medium">{{ form.no_of_hunters || 1 }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Observers:</span>
                          <span class="ml-2 font-medium">{{ form.no_of_observers || 0 }}</span>
                        </div>
                        <div>
                          <span class="text-gray-600">Companions:</span>
                          <span class="ml-2 font-medium">{{ form.no_of_companions || 0 }}</span>
                        </div>
                      </div>
                    </VaCardContent>
                  </VaCard>

                  <!-- Species Summary -->
                  <VaCard outlined class="mb-4">
                    <VaCardTitle class="flex items-center gap-2">
                      <VaIcon name="pets" size="small" color="primary" />
                      Selected Species ({{ speciesObjects.length }})
                    </VaCardTitle>
                    <VaCardContent>
                      <div v-if="speciesObjects.length > 0" class="flex flex-wrap gap-2">
                        <VaBadge
                          v-for="(s, index) in speciesObjects"
                          :key="index"
                          :text="`${s.name} (x${s.quantity})`"
                          :color="s.fromPackage ? 'info' : 'primary'"
                        />
                      </div>
                      <span v-else class="text-gray-500">No species selected</span>
                    </VaCardContent>
                  </VaCard>

                  <!-- Safari Extras Summary -->
                  <VaCard v-if="selectedSafariExtras.length > 0" outlined class="mb-4">
                    <VaCardTitle class="flex items-center gap-2">
                      <VaIcon name="hiking" size="small" color="primary" />
                      Safari Extras ({{ selectedSafariExtras.length }})
                    </VaCardTitle>
                    <VaCardContent>
                      <div class="flex flex-wrap gap-2">
                        <VaBadge
                          v-for="extra in selectedSafariExtras"
                          :key="extra.id"
                          :text="`${extra.name} - ${extra.currency?.symbol || '$'}${extra.amount}`"
                          color="success"
                        />
                      </div>
                    </VaCardContent>
                  </VaCard>

                  <!-- Trophy Fees Summary -->
                  <VaCard v-if="form.priceListId?.selfItem?.trophy_fees?.length > 0" outlined class="mb-4">
                    <VaCardTitle class="flex items-center gap-2">
                      <VaIcon name="emoji_events" size="small" color="primary" />
                      Trophy Fees ({{ form.priceListId.selfItem.trophy_fees.length }})
                    </VaCardTitle>
                    <VaCardContent>
                      <div class="va-table-responsive">
                        <table class="va-table va-table--hoverable w-full text-sm">
                          <thead>
                            <tr>
                              <th class="text-left">Species</th>
                              <th class="text-center">Sequence</th>
                              <th class="text-right">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(fee, index) in form.priceListId.selfItem.trophy_fees"
                              :key="`trophy-review-${fee.id}-${index}`"
                            >
                              <td class="font-medium">{{ fee.species?.name || 'Unknown' }}</td>
                              <td class="text-center">
                                <VaBadge :text="getSequenceLabel(fee.sequence_order)" color="primary" size="small" />
                              </td>
                              <td class="text-right font-semibold">
                                {{ form.priceListId.selfItem?.price_list_type?.currency?.symbol || '$'
                                }}{{ fee.amount }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </VaCardContent>
                  </VaCard>
                </div>
              </div>
              <!-- End of Step 5 -->
            </form>
          </div>
        </div>

        <!-- Floating Sticky Footer Navigation -->
        <div class="floating-footer-wrapper">
          <div class="floating-footer bg-white border-top shadow-lg">
            <div class="d-flex justify-content-between align-items-center py-3 px-4">
              <div>
                <button v-if="currentStep > 0" type="button" class="btn btn-secondary" @click="previousStep">
                  <i class="fa fa-arrow-left me-1"></i> Previous
                </button>
              </div>
              <div class="text-muted d-none d-sm-inline">Step {{ currentStep + 1 }} of {{ wizardSteps.length }}</div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-secondary" @click="handleGoBack">Cancel</button>
                <button
                  v-if="currentStep < wizardSteps.length - 1"
                  type="button"
                  class="btn btn-primary"
                  :disabled="!canProceedToNextStep"
                  @click="nextStep"
                >
                  Next <i class="fa fa-arrow-right ms-1"></i>
                </button>
                <button
                  v-else
                  type="button"
                  class="btn btn-success"
                  :disabled="!isValidForm || saving"
                  @click="submit()"
                >
                  <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i v-else class="fa fa-save me-1"></i>
                  {{ isEditMode ? 'Update Enquiry' : 'Submit Enquiry' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- Delete Confirmation Modal -->
  <VaModal v-model="showDeleteModal" hide-default-actions>
    <template #header>
      <h3 class="va-h6">Confirm Delete</h3>
    </template>
    <template #default>
      <p>Are you sure you want to delete this sales inquiry?</p>
      <p class="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-end">
        <VaButton preset="secondary" @click="showDeleteModal = false">Cancel</VaButton>
        <VaButton color="danger" :loading="deleting" @click="deleteInquiry">Delete</VaButton>
      </div>
    </template>
  </VaModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onMounted } from 'vue'
import axios from 'axios'
// Va* components are globally registered Bootstrap components - no import needed
import handleErrors from '../../../utils/errorHandler'
import { validators } from '../../../services/utils'
// import SalesConfirmationClientDetails from './components/SalesConfirmationClientDetails.vue'

import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { mapActions, mapState } from 'pinia'
import { useQuotaStore } from '../../../stores/quota-store'
import { useSalesInquiriesStore } from '../../../stores/sales-store'
import { useSettingsStore } from '../../../stores/settings-store'
import SalesInquiryDetails from './components/SalesInquiryDetails.vue'
// import pdfMake from 'pdfmake/build/pdfmake'
// import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import downloadPdf from '../../../utils/pdfDownloader'
import { usePriceListStore } from '../../../stores/price-list-store'
import StandardDataTable from '@/components/bootstrap/StandardDataTable.vue'

// pdfMake.vfs = pdfFonts?.pdfMake?.vfs
// pdfMake.vfs = pdfFonts.pdfMake.vfs
export default defineComponent({
  components: {
    // Va* components (VaInput, VaSelect, VaButton) are globally registered - no need to import
    SalesInquiryDetails,
    StandardDataTable,
    // SalesConfirmationClientDetails,
  },
  setup() {
    const formRef = ref()
    const contactFormRef = ref()
    const showAddSalesInquiriesForm = ref(false)
    const btnIcon = ref('add')

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm()

    const {
      isValid: isValidContactForm,
      validate: validateContactForm,
      resetValidation: resetValidationContactForm,
      reset: resetContactForm,
    } = useForm()

    const { init } = useToast()
    const showDetailsPage = ref(false)

    const form = reactive({
      id: null as any,
      full_name: '',
      nick_name: '',
      country: null as any,
      nationality: null as any,
      category: null,
      email: '',
      phone: '',
      phone_additional: '',
      address: '',
      no_of_hunters: 1,
      no_of_observers: 0,
      priceListId: null as any,
      no_of_days: 0,
      no_of_companions: 0,
      species: null as any,
      quantity: 0,
      area: null as any,
      season: null as any,
      preferred_date: null as any,
      start_date: null as any,
      end_date: null as any,
    })

    const contactForm = reactive({
      id: null as any,
      client_id: null as any,
      contact: '',
      contact_type: null as any,
      contactable: false,
    })

    const toggleAddSalesInquiriesForm = () => {
      showAddSalesInquiriesForm.value = true
    }
    const gotBack = () => {
      showAddSalesInquiriesForm.value = false
      showDetailsPage.value = false
      // btnIcon.value = showAddSalesInquiriesForm.value ? 'list_alt' : 'add'
    }

    const countries = ref([]) as any
    const nationality = ref([]) as any
    const categoryOptions = ref([]) as any
    const contactsTypes = ref([]) as any
    const clients = ref([]) as any
    const step = ref(0) as any
    // const salesInquiryItems = ref([]) as any

    const getCountries = async () => {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_COUNTRIES_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const response = await axios.request(config)
      if (response.status === 200) {
        countries.value.push(
          ...response.data.map((country: { id: any; name: any }) => ({ value: country.id, text: country.name })),
        )
      }
    }

    const getCategories = async () => {
      try {
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_ENTITY_CATEGORIES_VSET_URL,
        }

        const response = await axios.request(config)
        if (response.status === 200) {
          categoryOptions.value.push(
            ...response.data.map((category: { id: any; name: any }) => ({ value: category.id, text: category.name })),
          )
        }
      } catch (error) {
        // Endpoint not available - categories not used in current form
        console.warn('Categories endpoint not available')
      }
    }

    const getNationalities = async () => {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_NATIONALITIES_URL,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios.request(config)
      if (response.status === 200) {
        nationality.value.push(
          ...response.data.map((nationality: { id: any; name: any }) => ({
            value: nationality.id,
            text: nationality.name,
          })),
        )
      }
    }

    const getContactTypes = async () => {
      try {
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CONTACT_TYPES_URL,
          headers: {
            'Content-Type': 'application/json',
          },
        }
        const response = await axios.request(config)
        if (response.status === 200) {
          contactsTypes.value.push(
            ...response.data.map((contactType: { id: any; name: any }) => ({
              value: contactType.id,
              text: contactType.name,
            })),
          )
        }
      } catch (error) {
        // Endpoint not available - contact types not used in current form
        console.warn('Contact types endpoint not available')
      }
    }

    const contactFieldType = computed(() => {
      let contact_field_type = ''
      const contactType = contactForm.contact_type?.value

      if (contactType === 'email') {
        contact_field_type = 'email'
      } else if (contactType === 'phone_number') {
        contact_field_type = 'phone'
      } else {
        contact_field_type = ''
      }

      return contact_field_type
    })

    onMounted(() => {
      getCountries()
      getCategories()
      getNationalities()
      getContactTypes()
      // getClients()
    })

    return {
      formRef,
      contactFormRef,
      showAddSalesInquiriesForm,
      btnIcon,
      form,
      contactForm,
      showDetailsPage,
      countries,
      nationality,
      categoryOptions,
      contactsTypes,
      clients,
      step,
      // steps,
      init,
      toggleAddSalesInquiriesForm,
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,
      isValidContactForm,
      validateContactForm,
      resetValidationContactForm,
      resetContactForm,

      validators,
      getCountries,
      // deleteSalesInquireItem,
      getCategories,
      getNationalities,
      getContactTypes,
      contactFieldType,
      gotBack,
    }
  },
  data() {
    return {
      // preferred_species: [] as any,

      speciesOptions: [] as any,
      speciesObjects: [] as any,
      areasOptions: [] as any,
      seasonsOptions: [] as any,
      selectedInquiryItem: null as any,

      downloadPdf,
      saving: false,
      packagesOptions: [] as any,
      originalQuantities: reactive({} as any), // to keep track of original quantities

      // Table data
      dataFetched: [] as any[],
      loading: false,
      columns: [
        { key: 'client_name', label: 'Client Name', sortable: true, visible: true },
        { key: 'area', label: 'Area', sortable: true, visible: true },
        { key: 'hunting_type', label: 'Hunting Type', sortable: true, visible: true },
        { key: 'start_date', label: 'Start Date', sortable: true, visible: true },
        { key: 'end_date', label: 'End Date', sortable: true, visible: true },
        { key: 'season', label: 'Season', sortable: true, visible: true },
        { key: 'species_count', label: 'Species', sortable: true, visible: true },
        { key: 'status', label: 'Status', sortable: true, visible: true },
        { key: 'actions', label: 'Actions', sortable: false, visible: true },
      ] as any[],
      tableFilters: {
        search: '',
        pageSize: 10,
        currentPage: 1,
        sortField: '',
        sortDirection: 'asc',
        showAdvancedFilters: false,
        date_from: '',
        date_to: '',
        season_id: '',
      } as any,
      showDeleteModal: false,
      itemToDelete: null as any,
      deleting: false,

      // Season date range constraints
      seasonMinDate: null as Date | null,
      seasonMaxDate: null as Date | null,

      // Edit mode
      isEditMode: false,
      editingInquiryId: null as number | null,

      // Customer selection
      customerType: 'new' as 'new' | 'existing',
      selectedExistingCustomer: null as any,
      existingCustomersOptions: [] as any,
      loadingCustomers: false,

      // Wizard steps
      currentStep: 0,
      wizardSteps: [
        { label: 'Personal Info' },
        { label: 'Season, Package, Dates & Species' },
        { label: 'Safari Extras & Trophy Fees' },
        { label: 'Review' },
      ],

      // Safari extras selected by the client
      selectedSafariExtras: [] as any[],
      // helper field for adding extras (removed: selection UI disabled)

      // Booked dates (confirmed hunts)
      bookedDates: [] as { start_date: string; end_date: string; client_name: string; area_id: number }[],
      loadingBookedDates: false,
      dateConflictWarning: '' as string,

      // Quotation creation
      createQuotation: false,
      quotationForm: {
        confirmation_date: null as Date | null,
        hunting_license: '',
        remarks: '',
        installments: [] as { narration: string; amount_due: number; due_days_type: string; due_days: number }[],
      },
      dueDaysTypeOptions: [
        { value: 'upon_booking', text: 'Upon Booking' },
        { value: 'before_arrival', text: 'Before Arrival' },
        { value: 'on_arrival', text: 'On Arrival' },
        { value: 'after_hunt', text: 'After Hunt' },
      ],
    }
  },
  computed: {
    ...mapState(useSettingsStore, ['logo', 'salesPackagesSpecies']),

    // Get booked dates for the currently selected season
    bookedDatesForSelectedSeason(): { start_date: string; end_date: string; client_name: string; area_id: number }[] {
      return this.bookedDates
    },

    // Step completion indicators
    isStep1Complete(): boolean {
      return !!(
        this.form.full_name &&
        this.form.country &&
        this.form.nationality &&
        this.form.email &&
        this.form.phone &&
        this.form.address
      )
    },

    isStep2Complete(): boolean {
      return !!(
        this.form.season &&
        this.form.preferred_date &&
        this.form.start_date &&
        this.form.end_date &&
        this.form.no_of_days &&
        this.speciesObjects.length > 0
      )
    },

    isStep3Complete(): boolean {
      // Step 3 (Safari Extras & Trophy Fees) is complete if we've reached step 4 (Review)
      return this.currentStep >= 3
    },

    // Validation for each wizard step
    canProceedToNextStep(): boolean {
      const hasInput = (value: any) => {
        if (typeof value === 'string') {
          return value.trim().length > 0
        }
        return !!value
      }

      switch (this.currentStep) {
        case 0: // Personal Info
          return (
            hasInput(this.form.full_name) &&
            hasInput(this.form.country) &&
            hasInput(this.form.nationality) &&
            hasInput(this.form.email) &&
            hasInput(this.form.phone) &&
            hasInput(this.form.address) &&
            (this.customerType === 'existing' ? hasInput(this.selectedExistingCustomer) : true)
          )
        case 1: // Season, Package, Dates & Species
          return (
            hasInput(this.form.season) &&
            hasInput(this.form.preferred_date) &&
            hasInput(this.form.start_date) &&
            hasInput(this.form.end_date) &&
            hasInput(this.form.area) &&
            !!(this.form.no_of_days && this.form.no_of_days > 0) &&
            this.speciesObjects.length > 0
          )
        case 2: // Review
          return true
        default:
          return false
      }
    },

    // Maximum allowed hunting days from the selected package
    maxPackageDays(): number {
      if (this.form.priceListId?.selfItem?.price_list_type?.duration) {
        return this.form.priceListId.selfItem.price_list_type.duration
      }
      return 365 // Default to a large number if no package selected
    },

    // Calculate the maximum end date based on start date and package duration
    maxEndDate(): Date | null {
      if (!this.form.start_date || this.maxPackageDays >= 365) {
        return null
      }
      const startDate = new Date(this.form.start_date)
      const maxEnd = new Date(startDate)
      maxEnd.setDate(startDate.getDate() + this.maxPackageDays - 1)
      return maxEnd
    },

    // Format the max end date for display
    formatMaxEndDate(): string {
      if (!this.maxEndDate) return ''
      return this.maxEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },

    // Calculate hunt duration in days
    huntDuration(): number {
      if (!this.form.start_date || !this.form.end_date) return 0
      const start = new Date(this.form.start_date)
      const end = new Date(this.form.end_date)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end dates
      return diffDays > 0 ? diffDays : 0
    },

    // Calculate quotation total amount
    quotationTotalAmount(): number {
      return this.quotationForm.installments.reduce((sum, inst) => sum + (Number(inst.amount_due) || 0), 0)
    },

    // Filtered packages based on selected season
    filteredPackagesOptions(): any[] {
      if (!this.form.season?.value) {
        return []
      }

      const selectedSeasonId = this.form.season.value
      return this.packagesOptions.filter((pkg: any) => {
        // Check if package belongs to the selected season
        const pkgSeasonId = pkg.selfItem?.season_id || pkg.selfItem?.price_list_type?.price_list?.season_id
        return pkgSeasonId === selectedSeasonId
      })
    },

    speciesList() {
      return this.salesPackagesSpecies
    },
    // Get the month (0-11) of the season start date for calendar view
    seasonStartMonth(): number {
      if (this.seasonMinDate) {
        return this.seasonMinDate.getMonth()
      }
      return new Date().getMonth()
    },
    // Get the year of the season start date for calendar view
    seasonStartYear(): number {
      if (this.seasonMinDate) {
        return this.seasonMinDate.getFullYear()
      }
      return new Date().getFullYear()
    },
    // Page actions for StandardDataTable
    pageActions(): any[] {
      const actions = []
      if (!this.showAddSalesInquiriesForm && !this.showDetailsPage) {
        actions.push({
          label: 'Create Enquiry',
          icon: 'fa fa-plus',
          class: 'btn btn-primary',
          method: () => this.toggleAddSalesInquiriesForm(),
        })
        actions.push({
          label: 'Download PDF',
          icon: 'fa fa-download',
          class: 'btn btn-info',
          method: () => this.downloadAllInquiriesPdf(),
        })
      }
      return actions
    },
    // Custom filters for StandardDataTable
    customFilters(): any[] {
      return [
        {
          key: 'season_id',
          label: 'Season',
          type: 'select',
          placeholder: 'Select Season',
          options: this.seasonsOptions.map((opt: any) => ({
            value: opt.value,
            label: opt.text,
          })),
          defaultValue: '',
        },
      ]
    },
  },

  watch: {
    customerType(newType: 'new' | 'existing') {
      if (newType === 'new') {
        this.selectedExistingCustomer = null
        this.clearCustomerInformation()
      } else if (newType === 'existing') {
        this.selectedExistingCustomer = null
        this.clearCustomerInformation()
      }
    },
    selectedExistingCustomer(newValue: any) {
      if (!newValue && this.customerType === 'existing') {
        this.clearCustomerInformation()
      }
    },
  },

  mounted() {
    this.getSpecies()
    this.getAreas()
    this.getSeasonList()
    this.getPL()
    this.getExistingCustomers()
    this.getSalesInquiryList()
  },
  methods: {
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useQuotaStore, ['getAllSpeciesPerQuotaPerArea']),
    ...mapActions(useSalesInquiriesStore, [
      'createSalesInquiry',
      'updateSalesInquiry',
      'getSalesInquiries',
      'deleteSalesInquiry',
    ]),
    ...mapActions(useSettingsStore, ['getSeasons', 'getSalespackagesSpecies']),
    ...mapActions(usePriceListStore, ['getPriceList', 'getPriceListById']),

    async getExistingCustomers() {
      this.loadingCustomers = true
      try {
        // Fetch all sales inquiries to get unique customers
        const response: any = await this.getSalesInquiries('', '')
        if (response.status === 200) {
          const dataArray = Array.isArray(response.data) ? response.data : response.data.data || []

          // Create a map to store unique customers by entity ID
          const customersMap = new Map()

          dataArray.forEach((item: any) => {
            const entity = item.entity
            if (entity && entity.id && !customersMap.has(entity.id)) {
              // Get contact info
              let email = ''
              let phone = ''
              let address = ''

              if (entity.contacts && Array.isArray(entity.contacts)) {
                entity.contacts.forEach((contact: any) => {
                  if (contact.contact_type?.name === 'email' || contact.contact_type_id === 1) {
                    email = contact.contact || ''
                  } else if (contact.contact_type?.name === 'phone_number' || contact.contact_type_id === 2) {
                    phone = contact.contact || ''
                  } else if (contact.contact_type?.name === 'address' || contact.contact_type_id === 3) {
                    address = contact.contact || ''
                  }
                })
              }

              customersMap.set(entity.id, {
                value: entity.id,
                text: entity.full_name,
                selfItem: {
                  id: entity.id,
                  full_name: entity.full_name,
                  country: entity.country?.name || entity.country_name || '',
                  country_id: entity.country?.id || entity.country_id,
                  nationality: entity.nationality?.name || entity.nationality_name || '',
                  nationality_id: entity.nationality?.id || entity.nationality_id,
                  email: email,
                  phone: phone,
                  address: address,
                },
              })
            }
          })

          this.existingCustomersOptions = Array.from(customersMap.values())
        }
      } catch (error) {
        console.error('Error fetching existing customers:', error)
      } finally {
        this.loadingCustomers = false
      }
    },

    populateFormFromCustomer(selectedCustomer: any) {
      if (this.customerType !== 'existing') {
        return
      }

      if (!selectedCustomer || !selectedCustomer.selfItem) {
        // Clear form if no customer selected
        this.clearCustomerInformation()
        return
      }

      const customer = selectedCustomer.selfItem

      // Populate basic information
      this.form.full_name = customer.full_name || ''

      // Find and set country
      if (customer.country_id) {
        const countryOption = this.countries.find((c: any) => c.value === customer.country_id)
        if (countryOption) this.form.country = countryOption
      } else if (customer.country) {
        const countryOption = this.countries.find((c: any) => c.text === customer.country)
        if (countryOption) this.form.country = countryOption
      }

      // Find and set nationality
      if (customer.nationality_id) {
        const nationalityOption = this.nationality.find((n: any) => n.value === customer.nationality_id)
        if (nationalityOption) this.form.nationality = nationalityOption
      } else if (customer.nationality) {
        const nationalityOption = this.nationality.find((n: any) => n.text === customer.nationality)
        if (nationalityOption) this.form.nationality = nationalityOption
      }

      // Populate contact information
      this.form.email = customer.email || ''
      this.form.phone = customer.phone || ''
      this.form.address = customer.address || ''

      this.init({
        message: `Customer "${customer.full_name}" information loaded successfully`,
        color: 'success',
      })
    },

    clearCustomerInformation() {
      this.form.full_name = ''
      this.form.country = null
      this.form.nationality = null
      this.form.email = ''
      this.form.phone = ''
      this.form.address = ''
    },

    async submit() {
      this.saving = true

      // Validate required fields
      if (!this.form.full_name || !this.form.country || !this.form.nationality || !this.form.email) {
        this.init({
          message: 'Please fill in all required fields (Name, Country, Nationality, Email).',
          color: 'warning',
        })
        this.saving = false
        return
      }

      // Validate species - at least one species should be selected
      if (this.speciesObjects.length === 0) {
        this.init({
          message: 'Please add at least one species.',
          color: 'warning',
        })
        this.saving = false
        return
      }

      // Validate area and season
      if (!this.form.area) {
        this.init({
          message: 'Please select a hunting area.',
          color: 'warning',
        })
        this.saving = false
        return
      }

      if (!this.form.season) {
        this.init({
          message: 'Please select a season.',
          color: 'warning',
        })
        this.saving = false
        return
      }

      if (!this.form.no_of_days || this.form.no_of_days <= 0) {
        this.init({
          message: 'Please enter the number of days.',
          color: 'warning',
        })
        this.saving = false
        return
      }

      // Prepare entity data
      const entityData = {
        full_name: this.form.full_name,
        country_id: this.form.country?.value,
        nationality_id: this.form.nationality?.value,
      }

      // Prepare contacts with proper contact type IDs
      const contacts = [
        {
          contact_type_id: 1, // email type from contact_types table
          contact: this.form.email,
          contactable: true,
        },
        {
          contact_type_id: 2, // phone_number type from contact_types table
          contact: this.form.phone,
          contactable: true,
        },
        {
          contact_type_id: 3, // address type from contact_types table
          contact: this.form.address,
          contactable: false,
        },
      ]

      // Prepare sales inquiry preferences
      const preferences = {
        preferred_date: this.form.preferred_date,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        no_of_observers: this.form.no_of_observers || 0,
        no_of_companions: this.form.no_of_companions || 0,
        no_of_hunters: this.form.no_of_hunters || 1,
        no_of_days: this.form.no_of_days,
      }

      const requestdata: any = {
        // Entity and contacts
        entity: entityData,
        contacts: contacts,

        // Preferences
        preferences: preferences,

        // Species data (user can always edit)
        species: this.speciesObjects,

        // Area and Season
        area_id: this.form.area?.value,
        season_id: this.form.season?.value,

        // Safari extras selected by the client - send as array of IDs
        safari_extras: this.selectedSafariExtras.map((extra: any) => extra.safari_extras_id || extra.id),
      }

      // Include reference price_list_id if a package was selected as reference
      if (this.form.priceListId?.value) {
        requestdata.reference_price_list_id = this.form.priceListId.value
      }

      // Include quotation data if user chose to create one
      if (this.createQuotation && this.quotationForm.installments.length > 0) {
        requestdata.create_quotation = true
        requestdata.quotation = {
          confirmation_date: this.quotationForm.confirmation_date,
          hunting_license: this.quotationForm.hunting_license,
          remarks: this.quotationForm.remarks,
          installments: this.quotationForm.installments.map((inst) => ({
            narration: inst.narration,
            amount_due: Number(inst.amount_due),
            due_days_type: inst.due_days_type,
            due_days: Number(inst.due_days) || 0,
          })),
        }
      }

      console.log('Request payload:', JSON.stringify(requestdata, null, 2))

      try {
        let response: any

        if (this.isEditMode && this.editingInquiryId) {
          // Update existing inquiry
          response = await this.updateSalesInquiry(this.editingInquiryId, requestdata)

          if (response.status === 200) {
            this.saving = false
            this.init({ message: 'Sales inquiry updated successfully', color: 'success' })
            this.resetForm()
            this.resetValidationContactForm()
            this.speciesObjects = []
            this.selectedSafariExtras = []
            this.resetQuotationForm()
            this.isEditMode = false
            this.editingInquiryId = null
            this.customerType = 'new'
            this.selectedExistingCustomer = null
            this.currentStep = 0
            this.showAddSalesInquiriesForm = false
          }
        } else {
          // Create new inquiry
          response = await this.createSalesInquiry(requestdata)

          if (response.status === 201) {
            this.saving = false
            this.init({ message: response.data.message, color: 'success' })
            this.resetForm()
            this.resetValidationContactForm()
            this.speciesObjects = []
            this.selectedSafariExtras = []
            this.resetQuotationForm()
            this.customerType = 'new'
            this.selectedExistingCustomer = null
            this.currentStep = 0
          }
        }
      } catch (error: any) {
        this.saving = false
        console.error('Error saving sales inquiry:', error)

        // Handle errors with server response
        if (error.response) {
          const errors = handleErrors(error.response)
          this.init({
            message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
            color: 'danger',
          })
        } else if (error.request) {
          // Request was made but no response received
          this.init({
            message: 'No response from server. Please check your network connection.',
            color: 'danger',
          })
        } else {
          // Something else happened
          this.init({
            message: error.message || 'An unexpected error occurred',
            color: 'danger',
          })
        }
      }
    },

    viewInquiries(i: any) {
      this.showDetailsPage = true
      this.selectedInquiryItem = i.selfitem || i
    },

    // Format date for display
    formatDate(dateString: string | any): string {
      if (!dateString || dateString === 'N/A') return 'N/A'
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return 'N/A'
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch {
        return 'N/A'
      }
    },

    // Fetch sales inquiries list
    async getSalesInquiryList() {
      this.loading = true
      try {
        const response: any = await this.getSalesInquiries('', '')
        if (response.status === 200) {
          const dataArray = Array.isArray(response.data) ? response.data : response.data.data || []
          this.dataFetched = dataArray.map((item: any) => {
            const speciesCount = item?.inquiry_species?.length || item?.species?.length || 0
            const refPriceList = item?.reference_price_list
            const priceListData = item?.price_lists?.[0]?.price_list?.price_list_type
            const amount = refPriceList?.amount || priceListData?.amount || '0.00'
            const currencySymbol = priceListData?.currency?.symbol || '$'
            const areaName =
              refPriceList?.area_name || item?.inquiry_areas?.[0]?.area_name || item?.areas?.[0]?.area?.name || 'N/A'
            const huntingType = refPriceList?.hunting_type_name || priceListData?.hunting_type?.name || 'N/A'

            return {
              id: item.id,
              selfitem: item,
              name: item?.entity?.full_name || 'N/A',
              area: areaName,
              hunting_type: huntingType,
              price: `${currencySymbol}${parseFloat(amount).toFixed(2)}`,
              start_date: item?.formatted_preferences?.start_date || 'N/A',
              end_date: item?.formatted_preferences?.end_date || 'N/A',
              season: item?.season?.name || 'N/A',
              species_count: speciesCount,
              status: item?.status || 'PENDING',
            }
          })
        }
      } catch (error) {
        console.error('Error fetching sales inquiries:', error)
      } finally {
        this.loading = false
      }
    },

    // Handle filters update
    handleFiltersUpdate(filters: any) {
      this.tableFilters = { ...this.tableFilters, ...filters }
      this.getSalesInquiryList()
    },

    // Confirm delete inquiry
    confirmDeleteInquiry(rowData: any) {
      this.itemToDelete = rowData
      this.showDeleteModal = true
    },

    // Delete inquiry
    async deleteInquiry() {
      if (!this.itemToDelete) return

      this.deleting = true
      try {
        const response: any = await this.deleteSalesInquiry(this.itemToDelete.id)
        if (response.status === 200 || response.status === 204) {
          this.init({
            message: 'Inquiry deleted successfully',
            color: 'success',
          })
          this.showDeleteModal = false
          this.itemToDelete = null
          this.getSalesInquiryList()
        }
      } catch (error: any) {
        console.error('Error deleting inquiry:', error)
        this.init({
          message: error.response?.data?.message || 'Failed to delete inquiry',
          color: 'danger',
        })
      } finally {
        this.deleting = false
      }
    },

    resetEditMode() {
      this.isEditMode = false
      this.editingInquiryId = null
      this.speciesObjects = []
      this.selectedSafariExtras = []
      this.resetQuotationForm()
      this.customerType = 'new'
      this.selectedExistingCustomer = null
      this.currentStep = 0
    },

    handleGoBack() {
      this.resetEditMode()
      this.currentStep = 0
      this.gotBack()
    },

    // Wizard navigation methods
    nextStep() {
      if (this.currentStep < this.wizardSteps.length - 1 && this.canProceedToNextStep) {
        this.currentStep++
      } else if (!this.canProceedToNextStep) {
        this.showStepValidationError()
      }
    },

    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },

    goToStep(stepIndex: number) {
      // Only allow going to previous steps or current step
      if (stepIndex <= this.currentStep) {
        this.currentStep = stepIndex
      }
    },

    showStepValidationError() {
      const stepMessages: { [key: number]: string } = {
        0: 'Please fill in all customer information fields (Name, Country, Nationality, Email, Phone, Address).',
        1: 'Please select season, dates, hunting area, enter the number of days, and add at least one species.',
      }
      this.init({
        message: stepMessages[this.currentStep] || 'Please complete all required fields.',
        color: 'warning',
      })
    },

    formatReviewDate(date: any): string {
      if (!date) return 'N/A'
      try {
        const d = new Date(date)
        if (isNaN(d.getTime())) return 'N/A'
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch {
        return 'N/A'
      }
    },

    getSpeciesNameById(speciesId: number): string | null {
      if (!speciesId) return null
      const species = this.speciesOptions.find((s: any) => s.value === speciesId)
      return species ? species.text : null
    },

    editInquiry(rowData: any) {
      // Set edit mode
      this.isEditMode = true
      this.editingInquiryId = rowData.id

      // Show the form
      this.showAddSalesInquiriesForm = true

      // Populate form with existing data
      const item = rowData.selfitem || rowData

      // Basic Information
      this.form.full_name = item.entity?.full_name || rowData.name || ''

      // Find and set country
      const countryName = item.entity?.country?.name || item.entity?.country_name
      if (countryName) {
        const countryOption = this.countries.find((c: any) => c.text === countryName)
        if (countryOption) this.form.country = countryOption
      }

      // Find and set nationality
      const nationalityName = item.entity?.nationality?.name || item.entity?.nationality_name
      if (nationalityName) {
        const nationalityOption = this.nationality.find((n: any) => n.text === nationalityName)
        if (nationalityOption) this.form.nationality = nationalityOption
      }

      // Contact Information from entity contacts
      if (item.entity?.contacts && Array.isArray(item.entity.contacts)) {
        item.entity.contacts.forEach((contact: any) => {
          if (contact.contact_type?.name === 'email' || contact.contact_type_id === 1) {
            this.form.email = contact.contact || ''
          } else if (contact.contact_type?.name === 'phone_number' || contact.contact_type_id === 2) {
            this.form.phone = contact.contact || ''
          } else if (contact.contact_type?.name === 'address' || contact.contact_type_id === 3) {
            this.form.address = contact.contact || ''
          }
        })
      }

      // Preferences
      const prefs = item.formatted_preferences || rowData.preference || {}
      this.form.no_of_hunters = prefs.no_of_hunters || 1
      this.form.no_of_observers = prefs.no_of_observers || 0
      this.form.no_of_days = prefs.no_of_days || 0
      this.form.no_of_companions = prefs.no_of_companions || 0

      // Dates
      if (prefs.preferred_date) this.form.preferred_date = new Date(prefs.preferred_date)
      if (prefs.start_date) this.form.start_date = new Date(prefs.start_date)
      if (prefs.end_date) this.form.end_date = new Date(prefs.end_date)

      // Area
      const areaName = item.inquiry_areas?.[0]?.area?.name || rowData.area
      if (areaName) {
        const areaOption = this.areasOptions.find((a: any) => a.text === areaName)
        if (areaOption) this.form.area = areaOption
      }

      // Season
      if (item.season) {
        const seasonOption = this.seasonsOptions.find(
          (s: any) => s.value === item.season.id || s.text === item.season.name,
        )
        if (seasonOption) this.form.season = seasonOption
      }

      // Reference Price List
      if (item.reference_price_list) {
        const priceListOption = this.packagesOptions.find((p: any) => p.value === item.reference_price_list.id)
        if (priceListOption) this.form.priceListId = priceListOption
      }

      // Species
      this.speciesObjects = []
      const speciesArray = item.inquiry_species || rowData.inquiry_species || []
      console.log('Species array from API:', JSON.stringify(speciesArray, null, 2))
      speciesArray.forEach((speciesItem: any) => {
        // Try multiple paths to get the species name
        const speciesName =
          speciesItem.species_name ||
          speciesItem.species?.name ||
          speciesItem.name ||
          this.getSpeciesNameById(speciesItem.species_id) ||
          'Unknown'
        this.speciesObjects.push({
          species_id: speciesItem.species_id || speciesItem.species?.id || speciesItem.id,
          name: speciesName,
          quantity: speciesItem.quantity || 1,
          fromPackage: false,
        })
      })

      // Safari Extras - load from sales_confirmation_safary_extras
      this.selectedSafariExtras = []
      const safariExtrasArray = item.safari_extras || item.sales_confirmation_safari_extras || []
      console.log('Safari extras from API:', JSON.stringify(safariExtrasArray, null, 2))
      safariExtrasArray.forEach((extraItem: any) => {
        // Handle both nested and flat structures
        const extra = extraItem.safari_extra || extraItem.safary_extra || extraItem
        this.selectedSafariExtras.push({
          id: extra.id || extraItem.safari_extras_id || extraItem.safary_extras_id,
          safari_extras_id: extra.id || extraItem.safari_extras_id || extraItem.safary_extras_id,
          name: extra.name || 'Unknown',
          description: extra.description || '',
          amount: extra.amount || 0,
          charges_per: extra.charges_per || '',
          currency: extra.currency,
        })
      })

      this.init({
        message: 'Loaded inquiry data for editing',
        color: 'info',
      })
    },

    async downloadAllInquiriesPdf() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL}sales/sales-inquiries-pdf`, {
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.data.success && response.data.pdf) {
          // Decode base64 PDF and download
          const pdfData = response.data.pdf
          const byteCharacters = atob(pdfData)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'application/pdf' })

          // Create download link
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `sales-inquiries-${new Date().toISOString().split('T')[0]}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)

          this.init({
            message: `PDF downloaded successfully. Total records: ${response.data.total_records}`,
            color: 'success',
          })
        } else {
          this.init({
            message: 'Failed to generate PDF',
            color: 'danger',
          })
        }
      } catch (error) {
        console.error('Error downloading PDF:', error)
        this.init({
          message: 'Error downloading PDF',
          color: 'danger',
        })
      }
    },

    // async getAllSpieces() {
    //   try {
    //     // if (this.form.sales_quota_id?.value || this.form?.area?.value) {
    //     const response = await this.getAllSpeciesPerQuotaPerArea(null, this.form.area?.value ?? null, null)
    //     this.speciesOptions = response.data.data.map((item: any) => {
    //       return {
    //         value: item.species.id,
    //         text: item.species.name,
    //       }
    //     })
    //     // }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },

    addNewSpeciesItemToStorage() {
      // Check if all required fields in this.sform are not null
      if (!this.form.species || !this.form.quantity) {
        this.init({
          message: 'Please fill all required fields.',
          color: 'warning',
        })
        return // Exit the method if any field is null
      }

      // Ensure quantity is a positive number
      if (Number(this.form.quantity) <= 0) {
        // Uncomment the toast message if needed
        // this.toast.init({
        //   message: 'Quantity must be greater than zero.',
        //   color: 'warning',
        // });

        this.init({
          message: 'Quantity must be greater than zero.',
          color: 'warning',
        })

        return
      }

      // Check if the species item already exists
      const exists = this.speciesObjects.some(
        (species: { species_id: any }) => species.species_id === this.form.species.value,
      )

      if (!exists) {
        this.speciesObjects.push({
          species_id: this.form.species.value,
          name: this.form.species.text,
          quantity: this.form.quantity,
          fromPackage: false,
        })
        // console.log('New species item added:', this.speciesObjects)
      } else {
        console.log('Species item already exists:', this.form.species.value)
      }

      // this.resetSForm()
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
    },

    removeSafariExtra(index: number) {
      const removed = this.selectedSafariExtras.splice(index, 1)
      if (removed.length > 0) {
        this.init({
          message: `Removed "${removed[0].name}" from safari extras`,
          color: 'info',
        })
      }
    },

    // Quotation installment methods
    addQuotationInstallment() {
      this.quotationForm.installments.push({
        narration: '',
        amount_due: 0,
        due_days_type: 'upon_booking',
        due_days: 0,
      })
    },

    removeQuotationInstallment(index: number) {
      this.quotationForm.installments.splice(index, 1)
    },

    resetQuotationForm() {
      this.createQuotation = false
      this.quotationForm = {
        confirmation_date: null,
        hunting_license: '',
        remarks: '',
        installments: [],
      }
    },

    // Validate and limit the number of hunting days to not exceed package duration
    validateAndLimitDays(value: any) {
      const numValue = parseInt(value, 10)
      if (numValue > this.maxPackageDays) {
        this.form.no_of_days = this.maxPackageDays
        this.init({
          message: `Number of days limited to ${this.maxPackageDays} (package maximum)`,
          color: 'warning',
        })
      } else if (numValue < 1 && numValue !== 0) {
        this.form.no_of_days = 1
      }
    },

    incrementQuantity(index: number) {
      if (this.speciesObjects[index]) {
        this.speciesObjects[index].quantity++
      }
    },

    decrementQuantity(index: number) {
      if (this.speciesObjects[index] && this.speciesObjects[index].quantity > 1) {
        this.speciesObjects[index].quantity--
      }
    },

    async getSpecies() {
      try {
        const response = await this.getSpeciesList()
        if (response.status === 200) {
          this.speciesOptions = response.data.map((item: any) => ({
            value: item.id,
            text: item.name,
          }))
        }
      } catch (error) {
        console.error('Error loading species:', error)
      }
    },

    async getAreas() {
      try {
        const response = await this.getAreaList()
        this.areasOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    async getSeasonList() {
      try {
        const response = await this.getSeasons()
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Filter to only show current and future seasons (end_at >= today)
        this.seasonsOptions = response.data
          .filter((item: any) => {
            if (!item.end_at) return true // Include if no end date
            const endDate = new Date(item.end_at)
            endDate.setHours(23, 59, 59, 999)
            return endDate >= today
          })
          .map((item: any) => {
            return {
              value: item.id,
              text: item.name,
              selfItem: item, // Include full item data for date range access
            }
          })
      } catch (error) {
        console.log(error)
      }
    },

    // Called when user selects a season - sets date constraints and fetches booked dates
    async onSeasonSelected(selectedSeason: any) {
      // Reset date conflict warning
      this.dateConflictWarning = ''

      // Clear previously selected dates when season changes
      this.form.preferred_date = null
      this.form.start_date = null
      this.form.end_date = null

      if (!selectedSeason || !selectedSeason.selfItem) {
        this.seasonMinDate = null
        this.seasonMaxDate = null
        this.bookedDates = []
        return
      }

      const seasonData = selectedSeason.selfItem

      // Set the date range constraints for the calendar from season dates
      if (seasonData.start_at) {
        this.seasonMinDate = new Date(seasonData.start_at)
      }
      if (seasonData.end_at) {
        this.seasonMaxDate = new Date(seasonData.end_at)
      }

      // Fetch booked dates for this season
      await this.fetchBookedDates(selectedSeason.value)
    },

    // Fetch confirmed/booked hunt dates for the selected season using the dedicated API
    async fetchBookedDates(seasonId: number, areaId?: number) {
      this.loadingBookedDates = true
      this.bookedDates = []

      try {
        // Build query params
        const params = new URLSearchParams()
        if (seasonId) params.append('season_id', seasonId.toString())
        if (areaId) params.append('area_id', areaId.toString())

        const queryString = params.toString() ? `?${params.toString()}` : ''
        const response = await axios.get(`/sales/booked-dates${queryString}`)

        if (response.status === 200) {
          const dataArray = Array.isArray(response.data) ? response.data : response.data.data || []

          this.bookedDates = dataArray.map((item: any) => ({
            start_date: item.start_date,
            end_date: item.end_date,
            client_name: item.client_name || item.entity?.full_name || 'Unknown Client',
            area_id: item.area_id,
          }))
        }
      } catch (error) {
        console.error('Error fetching booked dates:', error)
      } finally {
        this.loadingBookedDates = false
      }
    },

    // Check if selected date conflicts with booked dates
    checkBookedDateConflict() {
      this.dateConflictWarning = ''

      const selectedStart = this.form.start_date ? new Date(this.form.start_date) : null
      const selectedEnd = this.form.end_date ? new Date(this.form.end_date) : null
      const preferredDate = this.form.preferred_date ? new Date(this.form.preferred_date) : null

      if (!selectedStart && !selectedEnd && !preferredDate) {
        return
      }

      // Check each booked date range for conflicts
      for (const booking of this.bookedDates) {
        const bookedStart = new Date(booking.start_date)
        const bookedEnd = new Date(booking.end_date)

        bookedStart.setHours(0, 0, 0, 0)
        bookedEnd.setHours(23, 59, 59, 999)

        // Check if any of the selected dates fall within a booked range
        const checkDate = (date: Date | null) => {
          if (!date) return false
          const d = new Date(date)
          d.setHours(12, 0, 0, 0)
          return d >= bookedStart && d <= bookedEnd
        }

        // Check if date ranges overlap
        const rangesOverlap = (start: Date | null, end: Date | null) => {
          if (!start || !end) return false
          const s = new Date(start)
          const e = new Date(end)
          s.setHours(0, 0, 0, 0)
          e.setHours(23, 59, 59, 999)

          // Ranges overlap if one starts before the other ends
          return s <= bookedEnd && e >= bookedStart
        }

        if (
          checkDate(preferredDate) ||
          checkDate(selectedStart) ||
          checkDate(selectedEnd) ||
          rangesOverlap(selectedStart, selectedEnd)
        ) {
          const startStr = new Date(booking.start_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
          const endStr = new Date(booking.end_date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
          this.dateConflictWarning = `The selected dates overlap with a confirmed hunt for "${booking.client_name}" (${startStr} - ${endStr}). Please inform the client that this time slot may not be available.`
          return
        }
      }
    },

    // Format booking date range for display
    formatBookingDateRange(booking: { start_date: string; end_date: string }) {
      const start = new Date(booking.start_date)
      const end = new Date(booking.end_date)
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }

      if (start.getFullYear() !== end.getFullYear()) {
        return `${start.toLocaleDateString('en-US', { ...options, year: 'numeric' })} - ${end.toLocaleDateString(
          'en-US',
          { ...options, year: 'numeric' },
        )}`
      }

      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`
    },

    // Calculate additional cost for companions and observers
    calculateAdditionalCost(): number {
      let total = 0
      const priceListData = this.form.priceListId?.selfItem

      if (!priceListData) return 0

      // Add companion hunter costs
      if (this.form.no_of_companions > 0 && priceListData.companion_hunter_costs?.length > 0) {
        total += this.form.no_of_companions * priceListData.companion_hunter_costs[0].amount
      }

      // Add observer costs
      if (this.form.no_of_observers > 0 && priceListData.observer?.length > 0) {
        total += this.form.no_of_observers * priceListData.observer[0].amount
      }

      return total
    },

    async getPL() {
      const response = await this.getPriceList()

      if (response.status === 200) {
        this.packagesOptions = response.data.data.map((item: any) => ({
          value: item.id,
          text: `${item.package_name || `Package ${item.id}`} - ${item.hunting_type || 'N/A'} (${
            item.season_name || 'No Season'
          })`,
          selfItem: item,
        }))

        console.log('packagesOptions:', this.packagesOptions)
      } else {
        console.log('Error getting price list')
      }
    },

    async populateFormFromPackage() {
      const settingsStore = useSettingsStore()

      if (!this.form.priceListId || !this.form.priceListId.value) {
        settingsStore.salesPackagesSpecies = []
        return
      }

      try {
        // Fetch detailed price list information
        const response = await this.getPriceListById(this.form.priceListId.value)
        console.log('Price list detail response:', response)

        if (response.status === 200 && response.data.success) {
          const priceListData = response.data.data

          // Update form with price list details
          this.form.priceListId.selfItem = priceListData

          // Auto-populate form fields from package data (all fields are editable)
          // Set hunting area
          if (priceListData.sales_package?.area?.name) {
            const areaOption = this.areasOptions.find((a: any) => a.text === priceListData.sales_package.area.name)
            if (areaOption) {
              this.form.area = areaOption
            }
          }

          // Set duration (number of days)
          if (priceListData.price_list_type?.duration) {
            this.form.no_of_days = priceListData.price_list_type.duration
          }

          // Set season date range from price list and populate season dropdown
          if (priceListData.price_list_type?.price_list) {
            const priceList = priceListData.price_list_type.price_list

            // Set the date range constraints for the calendar
            if (priceList.start_date) {
              this.seasonMinDate = new Date(priceList.start_date)
            }
            if (priceList.end_date) {
              this.seasonMaxDate = new Date(priceList.end_date)
            }

            // Create a season display based on the price list dates
            const startDate = new Date(priceList.start_date)
            const endDate = new Date(priceList.end_date)
            const seasonName = `${startDate.toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })} - ${endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`

            // Get the actual season_id from the API response
            const seasonId = priceListData.season_id

            // Try to find matching season in options
            let seasonOption = this.seasonsOptions.find((s: any) => {
              if (s.selfItem?.start_at) {
                const seasonStart = new Date(s.selfItem.start_at)
                return seasonStart.getFullYear() === startDate.getFullYear()
              }
              return false
            })

            // If no match found, create a temporary option for display with actual ID
            if (!seasonOption) {
              seasonOption = {
                value: seasonId,
                text: seasonName,
                selfItem: {
                  start_at: priceList.start_date,
                  end_at: priceList.end_date,
                },
              }
              // Add to options so it can be displayed
              this.seasonsOptions.push(seasonOption)
            }

            this.form.season = seasonOption

            // Pre-populate dates with season start date so calendar opens at the correct month
            if (priceList.start_date) {
              const seasonStartDate = new Date(priceList.start_date)
              this.form.preferred_date = seasonStartDate
              this.form.start_date = seasonStartDate
              this.form.end_date = seasonStartDate
            }
          }

          // Extract species from sales_package.species and add to speciesObjects for editing
          if (priceListData.sales_package?.species && Array.isArray(priceListData.sales_package.species)) {
            // Clear existing species and populate from package
            // Use species_id from the pivot table, or species.id from the nested object
            console.log('Raw species data:', JSON.stringify(priceListData.sales_package.species, null, 2))
            this.speciesObjects = priceListData.sales_package.species.map((item: any) => {
              // Try multiple ways to get the species ID
              const speciesId = item.species_id || item.species?.id || item.id
              console.log('Species item:', item, 'Using species_id:', speciesId)
              return {
                species_id: speciesId,
                name: item.species?.name || item.name || 'Unknown',
                quantity: item.quantity || 0,
                fromPackage: true,
              }
            })

            // Also update store for display purposes
            const speciesList = priceListData.sales_package.species.map((item: any) => ({
              id: item.species_id || item.species?.id || item.id,
              name: item.species?.name || item.name || 'Unknown',
              scientific_name: item.species?.scientific_name || item.scientific_name || 'N/A',
              quantity: item.quantity || 0,
              requested_quantity: 0,
            }))

            settingsStore.salesPackagesSpecies = speciesList

            console.log('Populated species:', this.speciesObjects)

            this.init({
              message: `Loaded ${speciesList.length} species from the selected package. You can now customize all fields.`,
              color: 'success',
              position: 'bottom-right',
            })
          } else {
            console.log('No species array found. Response structure:', priceListData.sales_package)
            settingsStore.salesPackagesSpecies = []
            this.init({
              message: 'No species found in the selected package.',
              color: 'warning',
              position: 'bottom-right',
            })
          }

          // Extract safari extras from the price list and add to selectedSafariExtras for editing
          if (priceListData.safari_extras && Array.isArray(priceListData.safari_extras)) {
            this.selectedSafariExtras = priceListData.safari_extras.map((extra: any) => ({
              id: extra.id,
              safari_extras_id: extra.id,
              name: extra.name,
              description: extra.description || '',
              amount: extra.amount,
              charges_per: extra.charges_per,
              currency: extra.currency,
              fromPackage: true,
            }))
            console.log('Populated safari extras:', this.selectedSafariExtras)
          } else {
            this.selectedSafariExtras = []
          }
        }
      } catch (error) {
        console.error('Error fetching price list details:', error)
        this.init({
          message: 'Failed to load package details. Please try again.',
          color: 'danger',
          position: 'bottom-right',
        })
        settingsStore.salesPackagesSpecies = []
      }
    },

    onChange(id: any, newValue: any) {
      console.log('Quantity changed:', id, newValue)

      const updatedItem = this.salesPackagesSpecies.find((item: any) => item.id === id)
      if (updatedItem) {
        updatedItem.requested_quantity = newValue
        // then update list
        this.salesPackagesSpecies = [...this.salesPackagesSpecies]

        // Validate against available quantity
        if (newValue > updatedItem.quantity) {
          this.init({
            message: `Warning: Requested quantity (${newValue}) exceeds available quantity (${updatedItem.quantity}) for ${updatedItem.name}.`,
            color: 'warning',
            position: 'bottom-right',
          })
        } else if (newValue > 0) {
          this.init({
            message: `Quantity for ${updatedItem.name} has been set to ${newValue}.`,
            color: 'success',
            position: 'bottom-right',
          })
        }
      }
    },

    // Function to check if date is allowed (for VaDateInput allowed-days prop)
    checkDateAllowed(date: Date): boolean {
      // If no range is set, allow all dates
      if (!this.seasonMinDate && !this.seasonMaxDate) {
        return true
      }

      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)

      let isAllowed = true

      if (this.seasonMinDate) {
        const minDate = new Date(this.seasonMinDate)
        minDate.setHours(0, 0, 0, 0)
        if (checkDate < minDate) {
          isAllowed = false
        }
      }

      if (this.seasonMaxDate && isAllowed) {
        const maxDate = new Date(this.seasonMaxDate)
        maxDate.setHours(0, 0, 0, 0)
        if (checkDate > maxDate) {
          isAllowed = false
        }
      }

      return isAllowed
    },

    // Function to check if END DATE is allowed (must be within package duration from start date)
    checkEndDateAllowed(date: Date): boolean {
      // First check if date is within season range
      if (!this.checkDateAllowed(date)) {
        return false
      }

      // If no start date selected, allow all dates within season
      if (!this.form.start_date) {
        return true
      }

      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)

      const startDate = new Date(this.form.start_date)
      startDate.setHours(0, 0, 0, 0)

      // End date must be >= start date
      if (checkDate < startDate) {
        return false
      }

      // If package has a duration limit, check it
      if (this.maxPackageDays < 365 && this.maxEndDate) {
        const maxEnd = new Date(this.maxEndDate)
        maxEnd.setHours(0, 0, 0, 0)
        if (checkDate > maxEnd) {
          return false
        }
      }

      return true
    },

    // Check if end date exceeds max allowed days
    exceedsMaxDays(endDate: any): boolean {
      if (!this.form.start_date || !endDate || this.maxPackageDays >= 365) {
        return false
      }
      const start = new Date(this.form.start_date)
      const end = new Date(endDate)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays > this.maxPackageDays
    },

    // Handle start date change - reset end date if it exceeds max
    onStartDateChange() {
      this.checkBookedDateConflict()

      // If end date is set and now exceeds max, clear it
      if (this.form.end_date && this.exceedsMaxDays(this.form.end_date)) {
        this.form.end_date = null
        this.$vaToast.init({
          message: `End date cleared - it exceeded the ${this.maxPackageDays} day package limit`,
          color: 'warning',
          position: 'bottom-right',
        })
      }
    },

    // Handle end date change
    onEndDateChange(newDate: any) {
      this.checkBookedDateConflict()

      // Update number of days to match the duration
      if (this.form.start_date && newDate) {
        const calculatedDays = this.huntDuration
        if (calculatedDays > 0 && calculatedDays !== this.form.no_of_days) {
          this.form.no_of_days = calculatedDays
        }
      }
    },

    // Check if a date is within the season date range
    isDateInSeasonRange(date: Date): boolean {
      // If no range is set, allow all dates
      if (!this.seasonMinDate && !this.seasonMaxDate) {
        return true
      }

      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)

      if (this.seasonMinDate) {
        const minDate = new Date(this.seasonMinDate)
        minDate.setHours(0, 0, 0, 0)
        if (checkDate < minDate) {
          return false
        }
      }

      if (this.seasonMaxDate) {
        const maxDate = new Date(this.seasonMaxDate)
        maxDate.setHours(0, 0, 0, 0)
        if (checkDate > maxDate) {
          return false
        }
      }

      return true
    },

    formatDateRange(startDate: string, endDate: string) {
      if (!startDate || !endDate) return 'N/A'
      const start = new Date(startDate)
      const end = new Date(endDate)
      const startFormatted = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      const endFormatted = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      return `${startFormatted} - ${endFormatted}`
    },

    formatCurrency(amount: number) {
      if (!amount) return '$0.00'
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
    },

    formatChargesPer(chargesPer: string) {
      if (!chargesPer) return ''
      return chargesPer
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    },

    getSequenceLabel(sequence: number) {
      const labels: { [key: number]: string } = {
        1: '1st',
        2: '2nd',
        3: '3rd',
      }
      return labels[sequence] || `${sequence}th`
    },
  },
})
</script>

<style scoped>
.price-list-details {
  max-width: 1400px;
  margin: 0 auto;
}

.price-list-details .card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.price-list-details .card-header {
  background: #fff !important;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 1.5rem;
  font-weight: 400;
}

.price-list-details .card-header .vehicle-icon i {
  font-size: 2.5rem;
}

.price-list-details .card-header h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.price-list-details .card-header small {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Smooth animations for step transitions */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Progress bar primary color */
.bg-primary {
  background-color: var(--va-primary);
}

/* Sticky navigation shadow and styling */
.sales-inquiry-wizard {
  position: relative;
  padding-bottom: 80px; /* Space for sticky nav */
}

/* Step completion checkmark positioning */
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.-top-1 {
  top: -0.25rem;
}

.-right-1 {
  right: -0.25rem;
}

/* Ensure sticky nav works properly */
.sticky {
  position: sticky;
}

.bottom-0 {
  bottom: 0;
}

.z-10 {
  z-index: 10;
}

/* Form Wizard Container - wraps card and footer */
.form-wizard-container {
  position: relative;
}

/* Floating Footer Wrapper - matches card width and adds margins */
.floating-footer-wrapper {
  position: sticky;
  bottom: 1rem;
  z-index: 1050;
  padding: 0 1rem;
  margin-top: 1rem;
}

/* Floating Footer - matches card width, rounded corners, shadow, doesn't touch sides */
.floating-footer {
  width: 100%;
  max-width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  margin: 0 auto;
}

/* Add padding to card body to prevent content from being hidden behind sticky footer */
.sales-inquiry-wizard .card-body {
  padding-bottom: 100px;
}
.breadcrumb {
  text-transform: uppercase !important;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0 !important;

  .breadcrumb-item {
    text-transform: uppercase !important;

    &::before {
      content: ' / ' !important;
      color: #9ca3af !important;
      padding: 0 0.5rem;
    }

    &:first-child::before {
      display: none !important;
    }

    a {
      text-transform: uppercase !important;
      color: #374151 !important;
      font-weight: 600;
      text-decoration: none !important;

      &:hover {
        color: #1f2937 !important;
        text-decoration: none !important;
      }
    }

    &.active {
      color: #9ca3af !important;
      font-weight: 400;
      text-transform: uppercase !important;
    }
  }
}
</style>
