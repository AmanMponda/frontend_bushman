<template>
  <div v-if="!contractItem" class="text-center p-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else class="price-list-details">
    <div class="row gx-4">
      <div class="col-lg-12">
        <div class="card">
          <!-- HEADER -->
          <div class="card-header d-flex align-items-center bg-white fw-400">
            <div class="d-flex align-items-center">
              <div class="vehicle-icon me-3">
                <i class="fa fa-file-contract fa-3x text-primary"></i>
              </div>
              <div>
                <h4 class="mb-0">{{ contractItem?.contract_number || 'Contract Details' }}</h4>
                <small class="text-muted">
                  {{ contractItem?.entity?.full_name || 'Contract' }} • {{ formatDate(contractItem?.start_date) }} -
                  {{ formatDate(contractItem?.end_date) }}
                  <span
                    v-if="contractItem?.contractor_type"
                    :class="getContractTypeBadgeClass(contractItem.contractor_type)"
                    class="badge ms-2"
                  >
                    {{ formatContractType(contractItem.contractor_type) }}
                  </span>
                </small>
              </div>
            </div>

            <div class="ms-auto d-flex align-items-center gap-2">
              <button class="btn btn-outline-secondary text-nowrap btn-sm px-3 rounded-pill" @click="$emit('close')">
                <i class="fa fa-arrow-left me-1"></i> Back
              </button>
              <button
                v-if="!isEditMode"
                class="btn btn-outline-warning text-nowrap btn-sm px-3 rounded-pill"
                @click="handleEdit"
              >
                <i class="fa fa-pen me-1"></i> Edit
              </button>
              <button
                v-if="!isEditMode"
                class="btn btn-outline-danger text-nowrap btn-sm px-3 rounded-pill"
                @click="handleDelete"
              >
                <i class="fa fa-trash me-1"></i> Delete
              </button>
              <button
                v-if="contractItem?.id && !isEditMode"
                class="btn btn-outline-primary text-nowrap btn-sm px-3 rounded-pill"
                :disabled="downloadingPdf"
                @click="downloadContractPdf"
              >
                <i class="fa fa-download me-1"></i>
                {{ downloadingPdf ? 'Downloading...' : 'Download PDF' }}
              </button>
            </div>
          </div>

          <!-- Document Upload Mode -->
          <template v-if="isEditMode">
            <div class="card-body p-4">
              <div class="document-upload-form">
                <h3 class="upload-title">Upload Supporting Documents</h3>
                <p class="upload-description">
                  Choose a document type, select a file, and click "Add Document". Repeat to add more documents.
                </p>

                <!-- Upload Section -->
                <div class="upload-section">
                  <div class="upload-row">
                    <div class="upload-field">
                      <label class="field-label">Document Type *</label>
                      <select v-model="newDocument.type" class="form-select" :disabled="isUploading">
                        <option value="">-- Select Type --</option>
                        <option value="Passport_Copy">Passport Copy</option>
                        <option value="Passport_Photo">Passport Photo</option>
                        <option value="Visa">Visa</option>
                        <option value="Gun_Permits">Gun Permits</option>
                        <option value="CITES_Documentation">CITES Documentation</option>
                        <option value="sales_invoice">Sales Invoice</option>
                        <option value="receipt">Receipt</option>
                        <option value="document">General Document</option>
                      </select>
                    </div>
                    <div class="upload-field">
                      <label class="field-label">Select File *</label>
                      <input
                        ref="fileInput"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                        class="form-input"
                        :disabled="isUploading"
                        @change="onFileSelected"
                      />
                    </div>
                  </div>
                  <div class="upload-actions-row">
                    <button
                      class="btn-add-document"
                      :disabled="!newDocument.file || !newDocument.type || isUploading"
                      @click="addDocument"
                    >
                      ➕ Add Document
                    </button>
                  </div>
                  <small class="help-text">Select document type and file, then click to add</small>
                </div>

                <!-- Upload Status Messages -->
                <div v-if="uploadMessage" :class="['upload-message', uploadMessageType]">
                  {{ uploadMessage }}
                </div>

                <!-- Upload Progress -->
                <div v-if="isUploading && uploadProgress > 0" class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
                  <span class="progress-text">{{ uploadProgress }}%</span>
                </div>

                <!-- List of Added Documents -->
                <div v-if="selectedFiles.length > 0" class="added-documents">
                  <h4 class="documents-title">📋 Documents to Upload ({{ selectedFiles.length }}):</h4>
                  <div class="documents-list">
                    <div v-for="(doc, index) in selectedFiles" :key="index" class="document-item">
                      <div class="doc-info">
                        <span class="doc-type">{{ doc.type }}</span>
                        <span class="doc-name">{{ doc.file.name }}</span>
                        <span class="doc-size">({{ (doc.file.size / 1024 / 1024).toFixed(2) }} MB)</span>
                      </div>
                      <button
                        class="btn-remove-doc"
                        :disabled="isUploading"
                        title="Remove this document"
                        @click="removeFromQueue(index)"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div class="upload-all-actions">
                    <button
                      :disabled="isUploading || selectedFiles.length === 0"
                      class="btn-upload-all"
                      @click="uploadBatchDocuments"
                    >
                      {{
                        isUploading
                          ? `⏳ Uploading ${selectedFiles.length}...`
                          : `✅ Upload ${selectedFiles.length} Document(s)`
                      }}
                    </button>
                    <button class="btn-clear-all" :disabled="isUploading" @click="clearQueue">🗑️ Clear All</button>
                  </div>
                </div>
                <div v-else class="no-documents-message">
                  ⚠️ No documents added yet. Add documents and click Upload.
                </div>

                <p class="upload-help">
                  <strong>How it works:</strong> Select type → Choose file → Click "Add Document" → Repeat for more →
                  Click "Upload All"
                </p>
                <p class="upload-help">
                  <strong>Supported formats:</strong> PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (Max 10MB per file)
                </p>

                <!-- Submit Section -->
                <div class="submit-section">
                  <hr class="divider" />
                  <div class="submit-actions">
                    <button class="btn-cancel-submit" @click="$emit('close')">❌ Close</button>
                  </div>
                  <small class="submit-help">Upload documents or close to go back</small>
                </div>
              </div>
            </div>
          </template>

          <!-- View Mode with Tabs -->
          <template v-else>
            <!-- TABS -->
            <div class="card-header p-0 border-bottom bg-white">
              <ul class="nav nav-tabs w-100 overflow-auto flex-nowrap mt-2">
                <li v-for="tab in tabs" :key="tab.key" class="nav-item flex-fill text-center">
                  <a
                    :href="'#' + tab.key"
                    class="nav-link"
                    :class="{ active: activeTab === tab.key }"
                    data-bs-toggle="tab"
                    @click.prevent="onTabClick(tab)"
                  >
                    <i :class="tab.icon"></i> {{ tab.label }}
                  </a>
                </li>
              </ul>
            </div>

            <!-- TAB CONTENT -->
            <div class="tab-content p-4">
              <!-- Overview Tab -->
              <div id="overview" class="tab-pane fade" :class="{ 'show active': activeTab === 'overview' }">
                <!-- Summary Cards -->
                <div class="row g-3 mb-4">
                  <div class="col-md-3">
                    <div class="card border-primary">
                      <div class="card-body text-center">
                        <i class="fa fa-file-contract fa-2x text-primary mb-2"></i>
                        <div class="h6 mb-0">{{ contractItem?.contract_number || 'N/A' }}</div>
                        <small class="text-muted">Contract Number</small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card border-success">
                      <div class="card-body text-center">
                        <i class="fa fa-calendar fa-2x text-success mb-2"></i>
                        <div class="h4 mb-0">{{ calculateDurationDays() }}</div>
                        <small class="text-muted">Days Duration</small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card border-warning">
                      <div class="card-body text-center">
                        <i class="fa fa-user fa-2x text-warning mb-2"></i>
                        <div class="h6 mb-0">{{ formatContractType(contractItem?.contractor_type) }}</div>
                        <small class="text-muted">Contract Type</small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card border-info">
                      <div class="card-body text-center">
                        <i class="fa fa-file-alt fa-2x text-info mb-2"></i>
                        <div class="h4 mb-0">{{ displayDocuments.length }}</div>
                        <small class="text-muted">Documents</small>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Contract Information -->
                <div class="card mb-4">
                  <div class="card-header bg-white">
                    <h6 class="mb-0">
                      <i class="fa fa-info-circle me-2 text-primary"></i>
                      Contract Information
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-4 mb-3">
                        <strong>Contract Number:</strong>
                        <div>{{ contractItem?.contract_number || 'N/A' }}</div>
                      </div>
                      <div class="col-md-4 mb-3">
                        <strong>Start Date:</strong>
                        <div>{{ formatDateTime(contractItem?.start_date) || 'N/A' }}</div>
                      </div>
                      <div class="col-md-4 mb-3">
                        <strong>End Date:</strong>
                        <div>{{ formatDateTime(contractItem?.end_date) || 'N/A' }}</div>
                      </div>
                      <div class="col-md-4 mb-3">
                        <strong>Duration:</strong>
                        <div>{{ calculateDuration() }}</div>
                      </div>
                      <div class="col-md-4 mb-3">
                        <strong>Contract Type:</strong>
                        <div>
                          <span :class="getContractTypeBadgeClass(contractItem?.contractor_type)" class="badge">
                            {{ formatContractType(contractItem?.contractor_type) }}
                          </span>
                        </div>
                      </div>
                      <div class="col-md-4 mb-3">
                        <strong>Created:</strong>
                        <div>{{ formatDateTime(contractItem?.created_at) || 'N/A' }}</div>
                      </div>
                      <div v-if="contractItem?.description" class="col-md-12 mb-3">
                        <strong>Description:</strong>
                        <div>{{ contractItem.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Important Information -->
                <div class="card mb-4">
                  <div class="card-body">
                    <h6 class="card-title">Important Information</h6>
                    <p class="text-muted small mb-0">
                      This contract is legally binding. Please ensure all documents are properly uploaded and verified
                      before finalizing.
                    </p>
                  </div>
                </div>
              </div>

              <!-- Client Tab -->
              <div
                v-if="contractItem?.entity"
                id="client"
                class="tab-pane fade"
                :class="{ 'show active': activeTab === 'client' }"
              >
                <div class="card mb-4">
                  <div class="card-header bg-white">
                    <h6 class="mb-0">
                      <i class="fa fa-user me-2 text-primary"></i>
                      Client Information
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <strong>Full Name:</strong>
                        <div>{{ contractItem.entity.full_name || 'N/A' }}</div>
                      </div>
                      <div v-if="contractItem.entity.nick_name" class="col-md-6 mb-3">
                        <strong>Nick Name:</strong>
                        <div>{{ contractItem.entity.nick_name }}</div>
                      </div>
                      <div
                        v-if="contractItem.entity.country_name || contractItem.entity.country?.name"
                        class="col-md-6 mb-3"
                      >
                        <strong>Country:</strong>
                        <div>{{ contractItem.entity.country_name || contractItem.entity.country?.name || 'N/A' }}</div>
                      </div>
                      <div
                        v-if="contractItem.entity.nationality_name || contractItem.entity.nationality?.name"
                        class="col-md-6 mb-3"
                      >
                        <strong>Nationality:</strong>
                        <div>
                          {{ contractItem.entity.nationality_name || contractItem.entity.nationality?.name || 'N/A' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sales Confirmation Tab -->
              <div
                v-if="contractItem?.sales_confirmation_proposal"
                id="sales-confirmation"
                class="tab-pane fade"
                :class="{ 'show active': activeTab === 'sales-confirmation' }"
              >
                <div class="card mb-4">
                  <div class="card-header bg-white">
                    <h6 class="mb-0">
                      <i class="fa fa-file-invoice me-2 text-primary"></i>
                      Sales Confirmation Details
                    </h6>
                  </div>
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6 mb-3">
                        <strong>Proposal ID:</strong>
                        <div>{{ contractItem.sales_confirmation_proposal.id || 'N/A' }}</div>
                      </div>
                      <div v-if="contractItem.sales_confirmation_proposal.confirmation_date" class="col-md-6 mb-3">
                        <strong>Confirmation Date:</strong>
                        <div>{{ formatDateTime(contractItem.sales_confirmation_proposal.confirmation_date) }}</div>
                      </div>
                      <div v-if="contractItem.sales_confirmation_proposal.sales_inquiry_id" class="col-md-6 mb-3">
                        <strong>Sales Inquiry ID:</strong>
                        <div>{{ contractItem.sales_confirmation_proposal.sales_inquiry_id }}</div>
                      </div>
                      <div v-if="contractItem.sales_confirmation_proposal.hunting_license" class="col-md-6 mb-3">
                        <strong>Hunting License:</strong>
                        <div>{{ contractItem.sales_confirmation_proposal.hunting_license }}</div>
                      </div>
                      <div v-if="contractItem.sales_confirmation_proposal.remarks" class="col-md-12 mb-3">
                        <strong>Remarks:</strong>
                        <div>{{ contractItem.sales_confirmation_proposal.remarks }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Documents Tab -->
              <div id="documents" class="tab-pane fade" :class="{ 'show active': activeTab === 'documents' }">
                <div class="card">
                  <div class="card-header bg-white">
                    <h6 class="mb-0">
                      <i class="fa fa-file-alt me-2 text-primary"></i>
                      Documents
                      <span v-if="hasDocuments" class="badge bg-primary ms-2">{{ displayDocuments.length }}</span>
                    </h6>
                  </div>
                  <div class="card-body">
                    <div v-if="hasDocuments" class="table-responsive">
                      <table class="table table-hover">
                        <thead>
                          <tr>
                            <th>Document Type</th>
                            <th>Uploaded Date</th>
                            <th>For</th>
                            <th class="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(doc, index) in displayDocuments" :key="index">
                            <td class="fw-semibold">{{ doc.document_type || doc.doc_type || 'Document' }}</td>
                            <td>{{ formatDateTime(doc.uploaded_at) || 'N/A' }}</td>
                            <td>{{ doc.forWho || 'N/A' }}</td>
                            <td class="text-end">
                              <a
                                v-if="doc.document_url || doc.document"
                                :href="doc.document_url || doc.document"
                                target="_blank"
                                class="btn btn-sm btn-primary"
                              >
                                <i class="fa fa-eye"></i> View
                              </a>
                              <button
                                class="btn btn-sm btn-danger ms-2"
                                :disabled="isDeleting && deletingDocId === (doc.id || doc.document_id)"
                                @click="deleteDocument(doc.id || doc.document_id)"
                              >
                                <i class="fa fa-trash"></i> Delete
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div v-else class="text-center py-5">
                      <i class="fa fa-file-alt fa-3x text-muted mb-3"></i>
                      <p class="text-muted">No documents uploaded for this contract</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { formatDateTime } from '../../../../services/utils'
import { useToast } from 'vuestic-ui'
import downloadPdf from '../../../../utils/pdfDownloader'

export default defineComponent({
  props: {
    contractItem: {
      type: Object as PropType<any>,
      required: true,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'edit', 'delete'],
  setup() {
    const { init } = useToast()
    const activeTab = ref('overview')
    return {
      formatDateTime,
      init,
      activeTab,
    }
  },
  data() {
    return {
      documents: [] as any[],
      newDocument: {
        type: '',
        file: null as any,
      },
      selectedFiles: [] as any[],
      uploadMessage: '',
      uploadMessageType: '',
      isUploading: false,
      uploadProgress: 0,
      isDeleting: false,
      deletingDocId: null as any,
      downloadingPdf: false,
    }
  },
  computed: {
    displayDocuments(): any[] {
      return this.documents.length > 0 ? this.documents : this.contractItem?.client_docs || []
    },
    hasDocuments(): boolean {
      return this.displayDocuments.length > 0
    },
    tabs() {
      const tabList = [
        {
          key: 'overview',
          label: 'Overview',
          icon: 'fa fa-info-circle',
        },
      ]

      if (this.contractItem?.entity) {
        tabList.push({
          key: 'client',
          label: 'Client',
          icon: 'fa fa-user',
        })
      }

      if (this.contractItem?.sales_confirmation_proposal) {
        tabList.push({
          key: 'sales-confirmation',
          label: 'Sales Confirmation',
          icon: 'fa fa-file-invoice',
        })
      }

      tabList.push({
        key: 'documents',
        label: `Documents (${this.displayDocuments.length})`,
        icon: 'fa fa-file-alt',
      })

      return tabList
    },
  },
  watch: {
    contractItem: {
      handler(newVal) {
        if (newVal?.client_docs && newVal.client_docs.length > 0) {
          this.documents = newVal.client_docs
        }
      },
      deep: true,
      immediate: true,
    },
    isEditMode(newVal: boolean) {
      if (newVal === false) {
        this.fetchDocuments()
      }
    },
  },
  mounted() {
    if (this.contractItem?.client_docs && this.contractItem.client_docs.length > 0) {
      this.documents = this.contractItem.client_docs
    }
    this.fetchDocuments()
  },
  methods: {
    onTabClick(tab: any) {
      this.activeTab = tab.key
    },
    formatDate(dateStr: string | null | undefined) {
      if (!dateStr) return 'N/A'
      try {
        return new Date(dateStr).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      } catch {
        return dateStr
      }
    },
    calculateDuration() {
      if (!this.contractItem?.start_date || !this.contractItem?.end_date) return 'N/A'
      try {
        const start = new Date(this.contractItem.start_date)
        const end = new Date(this.contractItem.end_date)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`
      } catch {
        return 'N/A'
      }
    },
    calculateDurationDays() {
      if (!this.contractItem?.start_date || !this.contractItem?.end_date) return 'N/A'
      try {
        const start = new Date(this.contractItem.start_date)
        const end = new Date(this.contractItem.end_date)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      } catch {
        return 'N/A'
      }
    },
    formatContractType(type: string) {
      if (!type) return 'N/A'
      return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    },
    getContractTypeBadgeClass(type: string) {
      const typeLower = (type || '').toLowerCase()
      if (typeLower.includes('main')) {
        return 'bg-primary'
      }
      if (typeLower.includes('companion')) {
        return 'bg-success'
      }
      return 'bg-secondary'
    },
    handleEdit() {
      this.$emit('edit')
    },
    handleDelete() {
      if (confirm('Are you sure you want to delete this contract? This action cannot be undone.')) {
        this.$emit('delete')
      }
    },
    async downloadContractPdf() {
      if (!this.contractItem?.id) {
        this.init({
          message: 'Contract ID is missing. Cannot download PDF.',
          color: 'warning',
        })
        return
      }

      this.downloadingPdf = true
      try {
        const baseUrl = import.meta.env.VITE_APP_BASE_URL
        const contractId = this.contractItem.id
        const endpoint = `sales-confirmation/contracts/${contractId}/pdf`
        const pdfUrl = `${baseUrl}${endpoint}`

        const contractNumber = this.contractItem.contract_number || `contract-${contractId}`
        const filename = `${contractNumber}.pdf`

        await downloadPdf(pdfUrl, filename)

        this.init({
          message: 'PDF downloaded successfully',
          color: 'success',
        })
      } catch (error: any) {
        console.error('PDF download error:', error)
        const message = error?.message || 'Unknown error'

        if (message.includes('500') || message.includes('503')) {
          this.init({
            message: 'The PDF generation service is temporarily unavailable. Please try again in a few moments.',
            color: 'warning',
          })
        } else if (message.includes('404')) {
          this.init({
            message: 'The PDF file was not found. The contract may not have been processed yet.',
            color: 'warning',
          })
        } else {
          this.init({
            message: `Failed to download PDF: ${message}`,
            color: 'danger',
          })
        }
      } finally {
        this.downloadingPdf = false
      }
    },
    async deleteDocument(docId: any) {
      if (!docId) {
        this.uploadMessage = '❌ Document ID is missing'
        this.uploadMessageType = 'error'
        return
      }

      if (!confirm('Are you sure you want to delete this document?')) {
        return
      }

      this.isDeleting = true
      this.deletingDocId = docId
      this.uploadMessage = '⏳ Deleting document...'
      this.uploadMessageType = 'info'

      try {
        const baseUrl = import.meta.env.VITE_APP_BASE_URL
        const endpoint = `sales-confirmation/contract-documents/${docId}`
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'DELETE',
        })

        const responseData = await response.json().catch(() => ({}))

        if (response.ok) {
          this.documents = this.documents.filter((doc) => (doc.id || doc.document_id) !== docId)
          this.init({
            message: 'Document deleted successfully',
            color: 'success',
          })
          this.uploadMessage = ''
          this.uploadMessageType = ''
        } else {
          const errorMsg = responseData?.message || responseData?.error || 'Unknown error'
          this.init({
            message: `Failed to delete document: ${errorMsg}`,
            color: 'danger',
          })
        }
      } catch (error: any) {
        console.error('Delete error:', error)
        this.init({
          message: `Error: ${error.message || 'Failed to delete document'}`,
          color: 'danger',
        })
      } finally {
        this.isDeleting = false
        this.deletingDocId = null
      }
    },
    async fetchDocuments() {
      const contractId = this.contractItem?.id

      if (!contractId) {
        return
      }

      try {
        const baseUrl = import.meta.env.VITE_APP_BASE_URL
        const endpoint = `sales-confirmation/contract-documents/?entity_id=${contractId}`

        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'GET',
        })

        if (response.ok) {
          const responseData = await response.json().catch(() => ({}))

          let fetchedDocuments = []
          if (responseData.data && Array.isArray(responseData.data)) {
            fetchedDocuments = responseData.data
          } else if (responseData.value && Array.isArray(responseData.value)) {
            fetchedDocuments = responseData.value
          } else if (Array.isArray(responseData)) {
            fetchedDocuments = responseData
          }

          this.documents = fetchedDocuments
        }
      } catch (error: any) {
        console.error('Error fetching documents:', error)
      }
    },
    onFileSelected(event: any) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          this.uploadMessage = '❌ File size exceeds 50MB limit'
          this.uploadMessageType = 'error'
          this.newDocument.file = null
          return
        }

        const allowedTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]

        if (!allowedTypes.includes(file.type)) {
          this.uploadMessage = '❌ File type not supported. Use PDF, JPG, PNG, DOC, or XLS'
          this.uploadMessageType = 'error'
          this.newDocument.file = null
          return
        }

        this.newDocument.file = file
        this.uploadMessage = `✓ Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
        this.uploadMessageType = 'info'
      }
    },
    addDocument() {
      if (!this.newDocument.file || !this.newDocument.type) {
        this.uploadMessage = '❌ Please select both a document type and file'
        this.uploadMessageType = 'error'
        return
      }

      this.selectedFiles.push({
        file: this.newDocument.file,
        type: this.newDocument.type,
      })

      this.uploadMessage = `✅ Added: ${this.newDocument.file.name} (${this.newDocument.type})`
      this.uploadMessageType = 'success'

      this.newDocument = { type: '', file: null }
      if (this.$refs.fileInput) {
        ;(this.$refs.fileInput as HTMLInputElement).value = ''
      }

      setTimeout(() => {
        this.uploadMessage = ''
        this.uploadMessageType = ''
      }, 2000)
    },
    removeFromQueue(index: number) {
      this.selectedFiles.splice(index, 1)
    },
    clearQueue() {
      this.selectedFiles = []
      this.newDocument = { type: '', file: null }
      this.uploadMessage = ''
      this.uploadMessageType = ''
    },
    async uploadBatchDocuments() {
      if (this.selectedFiles.length === 0) {
        this.uploadMessage = '❌ Please select at least one file'
        this.uploadMessageType = 'error'
        return
      }

      if (!this.contractItem?.id) {
        this.uploadMessage = '❌ Error: Contract ID is missing. Cannot upload documents.'
        this.uploadMessageType = 'error'
        return
      }

      this.isUploading = true
      this.uploadMessage = `⏳ Uploading ${this.selectedFiles.length} document(s)...`
      this.uploadMessageType = 'info'
      this.uploadProgress = 0

      try {
        const baseUrl = import.meta.env.VITE_APP_BASE_URL
        const contractId = this.contractItem.id
        const endpoint = `sales-confirmation/contracts/${contractId}/documents`

        const formData = new FormData()

        this.selectedFiles.forEach((item: any, index: number) => {
          formData.append('documents[]', item.file)
          formData.append(`doc_types[${index}]`, item.type)
        })

        const response = await fetch(`${baseUrl}${endpoint}`, {
          method: 'POST',
          body: formData,
        })

        const responseData = await response.json().catch(() => {})

        if (response.ok || response.status === 201) {
          if (responseData.data && Array.isArray(responseData.data)) {
            responseData.data.forEach((doc: any) => {
              this.documents.push({
                id: doc.id,
                document_type: doc.doc_type,
                doc_type: doc.doc_type,
                forWho: this.contractItem?.entity?.full_name || 'Unknown',
                document_url: doc.url || doc.document,
                document: doc.document,
                uploaded_at: doc.created_at || new Date().toISOString(),
              })
            })
          }

          const count = responseData.total || responseData.data?.length || this.selectedFiles.length
          this.init({
            message: `${count} document(s) uploaded successfully!`,
            color: 'success',
          })

          setTimeout(() => {
            this.fetchDocuments()
          }, 500)

          setTimeout(() => {
            this.clearQueue()
          }, 2000)
        } else {
          const errorMsg = responseData?.message || `Upload failed with status ${response.status}`
          this.init({
            message: `Upload failed: ${errorMsg}`,
            color: 'danger',
          })
        }
      } catch (error: any) {
        console.error('Upload error:', error)
        this.init({
          message: `Error: ${error.message || 'Failed to upload documents'}`,
          color: 'danger',
        })
      } finally {
        this.isUploading = false
        this.uploadProgress = 0
      }
    },
  },
})
</script>

<style scoped>
.price-list-details {
  max-width: 1400px;
  margin: 0 auto;
}

.card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: #fff !important;
  border-bottom: 1px solid #dee2e6;
  padding: 1rem 1.5rem;
  font-weight: 400;
}

.card-header .vehicle-icon i {
  font-size: 2.5rem;
}

.card-header h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.card-header small {
  font-size: 0.875rem;
  color: #6b7280;
}

.nav-tabs .nav-link {
  color: #6c757d;
  border: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-tabs .nav-link:hover {
  color: #495057;
  border-bottom-color: #dee2e6;
}

.nav-tabs .nav-link.active {
  color: #0d6efd;
  border-bottom-color: #0d6efd;
  font-weight: 600;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

/* Document Upload Styles */
.document-upload-form {
  background: #f8fafc;
  border-radius: 10px;
  padding: 20px;
}

.upload-title {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.upload-description {
  font-size: 13px;
  color: #666;
  margin-bottom: 15px;
  font-style: italic;
}

.upload-section {
  margin-bottom: 20px;
}

.upload-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.upload-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  font-weight: 700;
  font-size: 12px;
  color: #333;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-select,
.form-input {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-actions-row {
  margin-bottom: 10px;
}

.btn-add-document {
  padding: 10px 20px;
  background: linear-gradient(135deg, #34a853, #0d652d);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-document:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(52, 168, 83, 0.3);
  transform: translateY(-1px);
}

.btn-add-document:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.help-text {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 5px;
}

.upload-message {
  padding: 12px 15px;
  border-radius: 4px;
  font-size: 13px;
  margin-bottom: 15px;
  border-left: 4px solid transparent;
}

.upload-message.success {
  background: #d4edda;
  color: #155724;
  border-left-color: #28a745;
}

.upload-message.error {
  background: #f8d7da;
  color: #721c24;
  border-left-color: #dc3545;
}

.upload-message.info {
  background: #d1ecf1;
  color: #0c5460;
  border-left-color: #17a2b8;
}

.progress-bar-container {
  margin: 15px 0;
  height: 24px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #45a049);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  width: 100%;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.added-documents {
  margin-top: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.documents-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 15px;
}

.documents-list {
  margin-bottom: 15px;
}

.document-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  margin-bottom: 10px;
}

.doc-info {
  flex: 1;
}

.doc-type {
  font-weight: 600;
  margin-right: 10px;
}

.doc-name {
  color: #666;
  margin-right: 10px;
}

.doc-size {
  color: #999;
  font-size: 12px;
}

.btn-remove-doc {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: 600;
}

.upload-all-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-upload-all {
  flex: 1;
  padding: 12px;
  background: linear-gradient(135deg, #4caf50, #2e7d32);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.btn-upload-all:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-clear-all {
  padding: 12px 20px;
  background: #f5f5f5;
  color: #666;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.upload-help {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
  margin-bottom: 0;
}

.submit-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.submit-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel-submit {
  padding: 12px 24px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  background: white;
  color: #666;
}

.submit-help {
  display: block;
  margin-top: 12px;
  font-size: 12px;
  color: #666;
  text-align: center;
  font-style: italic;
}
</style>
