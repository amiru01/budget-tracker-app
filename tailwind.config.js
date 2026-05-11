export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            emerald: {
              300: '#6ee7b7',
              400: '#34d399',
              500: '#10b981',
              600: '#059669',
            },
            cyan: {
              300: '#67e8f9',
              400: '#22d3ee',
              500: '#06b6d4',
              600: '#0891b2',
            },
            teal: {
              400: '#2dd4bf',
              500: '#14b8a6',
            },
          },
        },
      },
    },
    plugins: [],
  }