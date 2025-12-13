// async getRequisitions() {
//     this.loadingRequisitions = true

//     const url = import.meta.env.VITE_APP_BASE_URL + import.meta.env.VITE_APP_REQUISITION_VSET_URL

//     const config = {
//       method: 'get',
//       maxBodyLength: Infinity,
//       url: url,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }
//     const response = await axios.request(config)
//     if (response.status === 200) {
//       this.loadingRequisitions = false
//       this.requisitions = response.data.map((requisition: any) => {
//         return {
//           status:
//             requisition.current_level_status !== null && requisition.current_level_status.status === 'PENDING'
//               ? `Waiting to be ${requisition.current_level_status.level?.approval_chain_role?.past} by ${requisition?.current_level_status?.level?.approval_chain_role?.name}`
//               : requisition.current_level_status !== null &&
//                   requisition?.current_level_status?.status === 'IN_PROGRESS'
//                 ? `Waiting to be ${requisition?.next_level?.approval_chain_role?.past} by ${requisition?.next_level?.approval_chain_role?.name}`
//                 : requisition.status,
//           requested_at: formatDate(requisition.date, 'MMM dd yyyy'),
//           required_date: formatDate(requisition.required_date, 'MMM dd yyyy'),
//           requested_by:
//             requisition.requested_by.first_name === '' && requisition.requested_by.last_name === ''
//               ? requisition.requested_by.username
//               : requisition.requested_by.first_name + '' + requisition.requested_by.last_name,
//           type: requisition.type,
//           selfItem: requisition,
//           main_status: requisition.status,
//         }
//       })
//     }

//     return response
//   },

export const requestStatus = (requisition: any): string => {
  if (requisition.current_level_status) {
    const currentStatus = requisition.current_level_status

    if (currentStatus.status === 'PENDING') {
      return `Waiting to be ${currentStatus.level?.approval_chain_role?.past} by ${currentStatus.level?.approval_chain_role?.name}`
    }

    if (currentStatus.status === 'IN_PROGRESS') {
      return `Waiting to be ${requisition.next_level?.approval_chain_role?.past} by ${requisition.next_level?.approval_chain_role?.name}`
    }
  }

  return requisition.status
}
