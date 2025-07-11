/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [
    'prettier-plugin-tailwindcss',
    require('tailwindcss-animate'),
    require('tailwind-scrollbar'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#ffd166",
          "secondary": "#3c91e6",
          "accent": "#f59e0b",
          "neutral": "#4b5d67",
          "base-100": "#f5f5f5",
          "info": "#42a9e0",
          "success": "#4caf50",
          "warning": "#ffc107",
          "error": "#d32f2f",
        },
      },
    ],
  },
  theme: {
  	extend: {
  		container: {
  			screens: {
  				'sm': '640px',
  				'md': '768px', 
  				'lg': '1024px',
  				'xl': '1280px',
  				'2xl': '1540px', // 4px wider than default (1536px + 4px)
  			},
  		},
  		borderWidth: {
  			'3': '3px',
  			'5': '5px',
  			'6': '6px',
  			'7': '7px',
  			'8': '8px',
  			'9': '9px',
  			'10': '10px',
  			'1.5': '1.9px'
  		},
  		width: {
			'icon-2xs': '0.7rem',
			'icon-xs': '0.8rem',
			'icon-sm': '0.9rem',
			'icon': '1.1rem',
  			'50': '12.5rem',
  			'54': '13.5rem',
  			'58': '14.5rem',
  			'62': '15.5rem',
  			'66': '16.5rem',
  			'68': '17rem',
  			'70': '17.5rem',
  			'74': '18.5rem',
  			'76': '19rem',
  			'78': '19.5rem',
  			'82': '20.5rem',
  			'84': '21rem',
  			'86': '21.5rem',
  			'88': '22rem',
  			'90': '22.5rem',
  			'92': '23rem',
  			'94': '23.5rem',
  			'98': '24.5rem',
  			'100': '25rem',
  			'104': '26rem',
  			'108': '27rem',
  			'112': '28rem',
  			'116': '29rem',
  			'120': '30rem',
  			'2.5': '0.625rem',
  			'3.5': '0.875rem',
  			'4.5': '1.125rem',
  			'5.5': '1.375rem',
  			'6.5': '1.625rem',
  			'7.5': '1.875rem',
  			'8.5': '2.125rem',
  			'9.5': '2.375rem',
  			'10.5': '2.625rem',
  			'11.5': '2.875rem',
  			'12.5': '3.125rem'
  		},
  		height: {
  			'2.5': '0.625rem',
  			'3.5': '0.875rem',
  			'4.5': '1.125rem',
			'icon-xs': '0.8rem',
			'icon-sm': '0.9rem',
			'icon': '1.1rem',
  			'5.5': '1.375rem',
  			'6.5': '1.625rem',
			'button': '1.875rem',
  			'7.5': '1.875rem',
  			'8.5': '2.125rem',
  			'9.5': '2.375rem',
  			'10.5': '2.625rem',
  			'11.5': '2.875rem',
  			'12.5': '3.125rem',
  			'18': '4.5rem',
			'30': '7.5rem'
  		},
  		maxHeight: {
  			'3xl': '48rem',
  			'4xl': '56rem',
  			'5xl': '64rem',
  			'6xl': '72rem',
  			'7xl': '80rem',
  			'8xl': '90rem'
  		},
		maxWidth: {
			'7xl': '80rem',
			'8xl': '90rem',
			'9xl': '100rem',
			'10xl': '110rem',
			'11xl': '120rem',
		},
		
  		ringOffsetWidth: {
  			'3': '3px',
  			'5': '5px',
  			'6': '6px',
  			'7': '7px',
  			'10': '10px',
  			'12': '12px',
  			'16': '16px'
  		},
  		gridTemplateColumns: {
  			'13': 'repeat(13, minmax(0, 1fr))',
  			'14': 'repeat(14, minmax(0, 1fr))',
  			'15': 'repeat(15, minmax(0, 1fr))',
  			'16': 'repeat(16, minmax(0, 1fr))',
  			'17': 'repeat(17, minmax(0, 1fr))',
  			'18': 'repeat(18, minmax(0, 1fr))',
  			'19': 'repeat(19, minmax(0, 1fr))',
  			'20': 'repeat(20, minmax(0, 1fr))',
  			'21': 'repeat(21, minmax(0, 1fr))',
  			'22': 'repeat(22, minmax(0, 1fr))',
  			'23': 'repeat(23, minmax(0, 1fr))',
  			'24': 'repeat(24, minmax(0, 1fr))'
  		},
  		gridTemplateRows: {
  			'7': 'repeat(7, minmax(0, 1fr))',
  			'8': 'repeat(8, minmax(0, 1fr))',
  			'9': 'repeat(9, minmax(0, 1fr))',
  			'10': 'repeat(10, minmax(0, 1fr))',
  			'11': 'repeat(11, minmax(0, 1fr))',
  			'12': 'repeat(12, minmax(0, 1fr))',
  			'13': 'repeat(13, minmax(0, 1fr))',
  			'14': 'repeat(14, minmax(0, 1fr))',
  			'15': 'repeat(15, minmax(0, 1fr))',
  			'16': 'repeat(16, minmax(0, 1fr))'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		screens: {
  			xs: '475px',
  			'2xs': '375px',
  			'3xs': '275px',
  			mdlg: '896px'
  		},
  		fontSize: {
			'xlg': '1.375rem',
			'md': '1rem',
  			smd: '.925rem',
			'nums': '.825rem',
			'button': '.775rem',
  			'2xs': '.650rem',
  			'3xs': '.600rem',
  			'4xs': '.550rem',
  			'5xs': '.500rem',
  			'6xs': '.450rem',
  			'7xs': '.400rem',
  			'8xs': '.350rem',
  			'9xs': '.300rem',
  		},
		lineHeight: {
			'relaxed-plus': '1.9',
		},
  		fontFamily: {
  			sans: [
  				'din-2014',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-dm-mono)',
  				'monospace'
  			]
  		},
  		colors: {
  			neutral: '#FEF9F3',
  			pb_darkergray: '#2d2d2d',
  			pb_darkgray: '#383838', // primary black
  			pb_darkgrayhover: '#4c4c4c',
  			pb_mddarkgray: '#606060',
  			pb_midgray: '#707070',
  			pb_textgray: '#747474',
  			pb_textlightgray: '#888888',
  			pb_textlightergray: '#9c9c9c',
			pb_textlightestgray: '#afafaf',
			pb_textlighterestgray: '#c3c3c3',
  			pb_lightgray: '#d7d7d7',
  			pb_lightergray: '#ebebeb',
  			pb_lightestgray: '#efefef',
  			pb_backgroundgray: '#f5f5f5',
  			pb_paperwhite: '#fcfcfc',
  			pb_bluehover: '#1f7ec5',
  			pb_bluedisabled: '#186299',
  			pb_blue: {
  				'50': '#e9f4fb',
  				'100': '#bdddf4',
  				'200': '#91c6ed',
  				'300': '#64afe6',
  				'400': '#4ea3e2',
  				'500': '#3898df',
  				'600': '#1f7ec5',
  				'700': '#186299',
  				'800': '#11466e',
  				'900': '#0a2a42',
  				DEFAULT: '#228cdb'
  			},
  			pb_orangehover: '#e6b949',
  			pb_orangedisabled: '#b39039',
  			pb_orange: {
  				'50': '#fff5dc',
  				'100': '#ffebb9',
  				'200': '#ffe197',
  				'300': '#ffdc85',
  				'400': '#ffd774',
  				'500': '#ffd262',
  				'600': '#e6b949',
  				'700': '#cca441',
  				'800': '#997b31',
  				'900': '#665220',
  				DEFAULT: '#ffcd51'
  			},
  			pb_green: {
  				'50': '#e5f7ed',
  				'100': '#def5e9',
  				'200': '#cdf0de',
  				'300': '#bdebd3',
  				'400': '#ace6c8',
  				'500': '#9be1bc',
  				'600': '#8bdcb1',
  				'700': '#7ad7a6',
  				'800': '#6ad29b',
  				DEFAULT: '#59cd90'
  			},
  			pb_greenhover: '#50b982',
  			pb_greendisabled: '#3e9065',
  			pb_red: {
  				'50': '#fdefee',
  				'100': '#fce0dc',
  				'200': '#fad0cb',
  				'300': '#f8c1ba',
  				'400': '#f7b1a9',
  				'500': '#f5a197',
  				'600': '#f39286',
  				'700': '#f18275',
  				'800': '#f07363',
  				DEFAULT: '#ee6352'
  			},
  			pb_redhover: '#d6594a',
  			pb_reddisabled: '#a74539',
  			pb_pastelblue: '#79addc',
  			pb_pastelpurple: '#ababef',
  			pb_pastelorange: '#f5d491',
  			pb_pastelred: '#f17e92',
  			pb_pastelgreen: '#b8dca7',
  			pb_pastelbrown: '#9b8e82',
  			pb_pastelstone: '#d6d3c2',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			sm2: 'calc(var(--radius) - 5px)',
  			xs: 'calc(var(--radius) - 6px)'
  		},
  		boxShadow: {
  			sm_light: '0 1px 2px 0 rgb(0 0 0 / 0.08)'
  		},
  		keyframes: {
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(-4%)'
  				},
  				'50%': {
  					transform: 'translateY(4%)'
  				}
  			},
  			'pop-bounce-in': {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.5) translateY(25%)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'scale(1.05) translateY(0)'
  				},
  				'80%': {
  					transform: 'scale(0.95) translateY(5%)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1) translateY(0)'
  				}
  			},
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
  			},
  			'fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'fade-out': {
  				'0%': {
  					opacity: '1'
  				},
  				'100%': {
  					opacity: '0'
  				}
  			},
  			'background-pan': {
  				'0%': {
  					backgroundPosition: '0% center'
  				},
  				'100%': {
  					backgroundPosition: '-200% center'
  				}
  			},
  			'spin-and-pulse': {
  				'0%': {
  					transform: 'scale(1) rotate(0deg)'
  				},
  				'50%': {
  					transform: 'scale(1.2) rotate(180deg)'
  				},
  				'100%': {
  					transform: 'scale(1) rotate(360deg)'
  				}
  			}
  		},
  		animation: {
  			shimmer: 'shimmer 5s linear infinite',
  			float: 'float 6s ease-in-out infinite',
  			'pop-bounce-in': 'pop-bounce-in 0.35s ease-out',
  			'toast-hide': 'fade-out 0.3s ease-in-out forwards',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.5s ease-in-out',
  			'fade-out': 'fade-out 0.5s ease-in-out',
  			'background-pan': 'background-pan 3s linear infinite',
  			'spin-and-pulse': 'spin-and-pulse 0.8s ease-in-out infinite'
  		}
  	}
  },
  plugins: [
    'prettier-plugin-tailwindcss',
    require('tailwindcss-animate'),
    require('tailwind-scrollbar'),
  ],
}




