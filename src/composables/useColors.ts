// Bootstrap-compatible color system
export function useColors() {
  const getColor = (colorName: string): string => {
    // Map Vuestic color names to Bootstrap colors
    const colorMap: Record<string, string> = {
      primary: '#0d6efd',
      secondary: '#6c757d',
      success: '#198754',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#0dcaf0',
      light: '#f8f9fa',
      dark: '#212529',
      'on-primary': '#ffffff',
      'on-secondary': '#ffffff',
      'on-success': '#ffffff',
      'on-danger': '#ffffff',
      'on-warning': '#000000',
      'on-info': '#000000',
      'on-light': '#000000',
      'on-dark': '#ffffff',
    }

    return colorMap[colorName] || colorMap['primary']
  }

  return {
    getColor,
  }
}
