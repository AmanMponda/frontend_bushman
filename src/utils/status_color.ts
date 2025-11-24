const getStatusColor = (status: any) => {
  const statusMapping: any = {
    pending: 'secondary',
    provision_sales: 'warning',
    confirmed: 'success',
    declined: 'danger',
    cancelled: 'danger',
    completed: 'primary',
  }
  return statusMapping[status] || 'default'
}

export default getStatusColor
