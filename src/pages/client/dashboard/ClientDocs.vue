<template>
  <VaForm ref="formRef">
    <!-- Responsive grid layout for mobile and larger screens -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- First Name -->
      <!-- Last Name -->
      <VaSelect
        v-model="form.document_type"
        placeholder="Select Document Type"
        label="Document Type"
        :options="doctypelist"
        searchable
        highlight-matched-text
      />

      <!-- Document Owner -->
      <VaSelect
        v-model="form.forWho"
        placeholder="Select Document Owner"
        label="Document Owner"
        :options="observerCompanions"
        searchable
        highlight-matched-text
      />

      <VaFileUpload
        v-model="form.document"
        upload-button-text="Upload Document"
        color="secondary"
        label="Upload Document"
        dropzone
        undo
        size="50mb"
        file-types="image/jpeg, image/png, image/pdf, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        undo-duration="500"
        :rules="[(v: any) => v.length > 0 || 'Document is required']"
        :max-files="1"
      />
    </div>

    <!-- Submit Button -->
    <div class="mt-4 d-flex">
      <VaButton icon="save" class="mr-3 mb-2" :disabled="!isValid" @click="validate() && add()"> Save </VaButton>

      <VaButton class="mr-3 mb-2" icon="save" :disabled="!isValid" color="warning" @click="validate() && edit()">
        save
      </VaButton>
    </div>
  </VaForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useForm } from '@/composables/useForm'
import axios from 'axios'
import { useToast } from '@/composables/useToast'
import { onMounted } from 'vue'
import handleErrors from '../../../utils/errorHandler'

const { isValid, validate } = useForm()
const { init } = useToast()
// import { useModal } from '@/composables/useModal'

const form = reactive({
  document_type: null as any,
  forWho: null as any,
  document: [] as any,
})
// const { confirm } = useModal()

const observerCompanions: any[] = []

const doctypelist: any[] = [
  {
    text: 'Travel Packet (Passport Copy)',
    value: 'Passport_Copy',
  },
  {
    text: 'Travel Packet (Passport Photo)',
    value: 'Passport_Photo',
  },
  {
    text: 'Visa',
    value: 'Visa',
  },
  {
    text: 'Gun Permits',
    value: 'Gun_Permits',
  },
  {
    text: 'CITES Documentation',
    value: 'CITES_Documentation',
  },
  {
    text: 'Sales Invoice',
    value: 'sales_invoice',
  },
  {
    text: 'Receipt',
    value: 'receipt',
  },
]

const submit = async (method: string) => {
  try {
    const data = new FormData()
    // format it to 1990-05-15
    data.append('document_type', form.document_type.value)
    data.append('forWho', form.forWho.value)
    data.append('document', form.document[0]) // Assuming the file has been added to form.photo

    const config = {
      method: method,
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CLIENT_DOCS_VSET_URL,
      headers: {
        'Content-Type': 'multipart/form-data',
      },

      data: data,
    }

    const response = await axios.request(config)
    console.log(JSON.stringify(response.data))
    if (response.status === 200 || response.status === 201) {
      init({ message: response.data.message, color: 'success' })
    }
  } catch (error: any) {
    if (error.response) {
      const errors: any = handleErrors(error)
      init({
        message: '\n' + errors.map((error: any, index: any) => `${index + 1}. ${error}`).join('\n'),
        color: 'danger',
      })
    } else {
      console.log(error)
      init({ message: 'Something went wrong', color: 'danger' })
    }
  }

  // get countries from API
}

const edit = () => {
  submit('patch')
}
const add = () => {
  submit('post')
}

const getClientObserverCompanions = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_CLIENT_COMPANION_OBSERVER_LIST_URL,
  }

  const response = await axios.request(config)
  if (response.status === 200 || response.status === 201) {
    //  add default
    observerCompanions.push({ text: 'Me', value: 'Me' })
    observerCompanions.push(
      ...response.data.observer_and_companion.map((user: any) => ({
        text: user.user.first_name + ' ' + user.user.last_name,
        value: user.id,
      })),
    )
  }
}

onMounted(() => {
  //   getCountries()
  //   getClientBasicInfo()
  getClientObserverCompanions()
})
</script>
