/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,jsx}",
		"./components/**/*.{js,jsx}",
		"./app/**/*.{js,jsx}",
		"./src/**/*.{js,jsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		colors: {
			'custom-red-1': '#FF1C1C',
			'custom-red-2': '#FF5345',
			'custom-light-red-3': '#EF7D74',
			'custom-green': '#22C33C',
			'custom-blue': '#5295FA',
			white: '#FFFFFF',
			black: '#000000',
			'custom-light-gray': '#F5F5F5',
			// gray - 300: #E0E0E0
			'custom-gray-100': "#e0e0e0",
			// gray - 500: #9E9E9E
			'custom-gray-200': "#9e9e9e",
			// gray - 700: #616161
			'custom-gray-300': "#616161",
			'red-100': '#FFEBEE',
			'red-200': '#FFCDD2',
			'red-300': '#EF9A9A',
			'red-400': '#E57373',
			'red-500': '#EF5350',
			'red-600': '#E53935',
			'red-700': '#D32F2F',
			'red-800': '#C62828',
			'red-900': '#B71C1C',
			'yellow-100': '#FFF9C4',
			'yellow-200': '#FFF59D',
			'yellow-300': '#FFF176',
			'yellow-400': '#FFEE58',
			'yellow-500': '#FFEB3B',
			'yellow-600': '#FDD835',
			'yellow-700': '#FBC02D',
			'yellow-800': '#F9A825',
			'yellow-900': '#F57F17',
			'gray-100': '#F5F5F5',
			'gray-200': '#EEEEEE',
			'gray-300': '#E0E0E0',
			'gray-400': '#BDBDBD',
			'gray-500': '#9E9E9E',
			'gray-600': '#757575',
			'gray-700': '#616161',
			'gray-800': '#424242',
			'gray-900': '#212121',
			'blue-100': '#E3F2FD',
			'blue-200': '#BBDEFB',
			'blue-300': '#90CAF9',
			'blue-400': '#64B5F6',
			'blue-500': '#42A5F5',
			'blue-600': '#2196F3',
			'blue-700': '#1E88E5',
			'blue-800': '#1976D2',
			'blue-900': '#1565C0',
			'green-100': '#C8E6C9',
			'green-200': '#A5D6A7',
			'green-300': '#81C784',
			'green-400': '#66BB6A',
			'green-500': '#4CAF50',
			'green-600': '#43A047',
			'green-700': '#388E3C',
			'green-800': '#2E7D32',
			'green-900': '#1B5E20',
			'purple-100': '#E1BEE7',
			'purple-200': '#CE93D8',
			'purple-300': '#BA68C8',
			'purple-400': '#AB47BC',
			'purple-500': '#9C27B0',
			'purple-600': '#8E24AA',
			'purple-700': '#7B1FA2',
			'purple-800': '#6A1B9A',
			'purple-900': '#4A148C',
			'orange-100': '#FFE0B2',
			'orange-200': '#FFCC80',
			'orange-300': '#FFB74D',
			'orange-400': '#FFA726',
			'orange-500': '#FF9800',
			'orange-600': '#FB8C00',
			'orange-700': '#F57C00',
			'orange-800': '#EF6C00',
			'orange-900': '#E65100',

		},
		extend: {
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {}
		}
	},
	// eslint-disable-next-line no-undef
	plugins: [require("tailwindcss-animate")],
};
