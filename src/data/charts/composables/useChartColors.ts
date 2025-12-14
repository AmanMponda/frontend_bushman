import { ref, watch } from 'vue'
import { useColors } from '@/composables/useColors'

type chartColors = string | string[]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useChartColors(chartColors = [] as chartColors, _alfa = 0.6) {
  const { getColor } = useColors()

  const generateHSLAColors = (colors: chartColors) => {
    // Simplified version without HSL manipulation - use Bootstrap colors directly
    if (typeof colors === 'string') {
      return getColor(colors)
    }
    return colors.map((color) => getColor(color))
  }

  const generateColors = (colors: chartColors) => {
    if (typeof colors === 'string') {
      return getColor(colors)
    }
    return colors.map((color) => getColor(color))
  }

  const generatedHSLAColors = ref(generateHSLAColors(chartColors))
  const generatedColors = ref(generateColors(chartColors))

  // Watch for color changes (simplified - no theme watching for now)
  watch(
    () => chartColors,
    () => {
      generatedHSLAColors.value = generateHSLAColors(chartColors)
      generatedColors.value = generateColors(chartColors)
    },
  )

  return {
    generateHSLAColors,
    generateColors,
    generatedColors,
    generatedHSLAColors,
  }
}
