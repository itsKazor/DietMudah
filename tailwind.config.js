/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark:  '#1B4332',   // header, hero bg, CTA button
          mid:   '#2D6A4F',   // hover state, secondary button
          light: '#52B788',   // accent, icon aktif
          tint:  '#D8F3DC',   // badge bg, light highlight
        },
        surface: '#F5F5F0',   // page background
        card:    '#FFFFFF',   // card background
        text: {
          primary:   '#1A1A1A',
          secondary: '#6B7280',
          muted:     '#9CA3AF',
        },
        calorie:  '#FF6B35',  // kalori (orange warm)
        protein:  '#4EA8DE',  // protein (blue)
        carbs:    '#F4A261',  // karbohidrat (orange)
        fat:      '#E76F51',  // lemak (red-orange)
        success:  '#74C69D',  // success / achieved
        danger:   '#EF4444',  // error / delete
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
