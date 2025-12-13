const formatKey = (key: string): string => {
  return key
    .replace(/_/g, ' ') // Replace underscores with spaces
    .split(' ') // Split the string into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' ') // Join the words back into a single string
}

export default formatKey
