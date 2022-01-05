import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import plugin from 'windicss/plugin'

export default defineConfig({
//   darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        frontier: '#00DFFF',
      },

    },
  },
})