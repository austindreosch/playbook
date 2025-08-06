Introduction
Skip the months of implementation - we've turned the entire AlignUI design system into production-ready code blocks you can drop into your project. Get pixel-perfect, accessible components without sacrificing customization or control.

Why Copy/Paste?
Instead of distributing our components as an npm package, we provide the source code directly to your project. This gives you:

Complete control over the implementation
Freedom to customize and extend components
No dependency lock-in
Direct access to modify styles and behavior

Built for Production
Each component is built on proven foundations:

Core behaviors powered by Radix UI
Styling through Tailwind CSS
TypeScript for type safety
Accessibility built-in

Next Steps
Ready to get started? Head over to our Installation Guide to begin using AlignUI in your project.

Foundations

Color Palette
A set of core colors that stay consistent across themes, alongside themeable colors that adapt seamlessly to the active theme.

gray
gray-0
var(--gray-0)
#ffffff
gray-50
var(--gray-50)
#f7f7f7
gray-100
var(--gray-100)
#f5f5f5
gray-200
var(--gray-200)
#ebebeb
gray-300
var(--gray-300)
#d1d1d1
gray-400
var(--gray-400)
#a3a3a3
gray-500
var(--gray-500)
#7b7b7b
gray-600
var(--gray-600)
#5c5c5c
gray-700
var(--gray-700)
#333333
gray-800
var(--gray-800)
#292929
gray-900
var(--gray-900)
#1c1c1c
gray-950
var(--gray-950)
#171717
gray Alpha
gray-alpha-24
var(--gray-alpha-24)

#a3a3a3
·
24%
gray-alpha-16
var(--gray-alpha-16)

#a3a3a3
·
16%
gray-alpha-10
var(--gray-alpha-10)

#a3a3a3
·
10%
slate
slate-0
var(--slate-0)
#ffffff
slate-50
var(--slate-50)
#f5f7fa
slate-100
var(--slate-100)
#f2f5f8
slate-200
var(--slate-200)
#e1e4ea
slate-300
var(--slate-300)
#cacfd8
slate-400
var(--slate-400)
#99a0ae
slate-500
var(--slate-500)
#717784
slate-600
var(--slate-600)
#525866
slate-700
var(--slate-700)
#2b303b
slate-800
var(--slate-800)
#222530
slate-900
var(--slate-900)
#181b25
slate-950
var(--slate-950)
#0e121b
slate Alpha
slate-alpha-24
var(--slate-alpha-24)

#99a0ae
·
24%
slate-alpha-16
var(--slate-alpha-16)

#99a0ae
·
16%
slate-alpha-10
var(--slate-alpha-10)

#99a0ae
·
10%
blue
blue-50
var(--blue-50)
#ebf1ff
blue-100
var(--blue-100)
#d5e2ff
blue-200
var(--blue-200)
#c0d5ff
blue-300
var(--blue-300)
#97baff
blue-400
var(--blue-400)
#6895ff
blue-500
var(--blue-500)
#335cff
blue-600
var(--blue-600)
#3559e9
blue-700
var(--blue-700)
#2547d0
blue-800
var(--blue-800)
#1f3bad
blue-900
var(--blue-900)
#182f8b
blue-950
var(--blue-950)
#122368
blue Alpha
blue-alpha-24
var(--blue-alpha-24)

#476cff
·
24%
blue-alpha-16
var(--blue-alpha-16)

#476cff
·
16%
blue-alpha-10
var(--blue-alpha-10)

#476cff
·
10%
orange
orange-50
var(--orange-50)
#fff3eb
orange-100
var(--orange-100)
#ffe6d5
orange-200
var(--orange-200)
#ffd9c0
orange-300
var(--orange-300)
#ffc197
orange-400
var(--orange-400)
#ffa468
orange-500
var(--orange-500)
#fa7319
orange-600
var(--orange-600)
#e16614
orange-700
var(--orange-700)
#ce5e12
orange-800
var(--orange-800)
#b75310
orange-900
var(--orange-900)
#96440d
orange-950
var(--orange-950)
#71330a
orange Alpha
orange-alpha-24
var(--orange-alpha-24)

#ff9147
·
24%
orange-alpha-16
var(--orange-alpha-16)

#ff9147
·
16%
orange-alpha-10
var(--orange-alpha-10)

#ff9147
·
10%
red
red-50
var(--red-50)
#ffebec
red-100
var(--red-100)
#ffd5d8
red-200
var(--red-200)
#ffc0c5
red-300
var(--red-300)
#ff97a0
red-400
var(--red-400)
#ff6875
red-500
var(--red-500)
#fb3748
red-600
var(--red-600)
#e93544
red-700
var(--red-700)
#d02533
red-800
var(--red-800)
#ad1f2b
red-900
var(--red-900)
#8b1822
red-950
var(--red-950)
#681219
red Alpha
red-alpha-24
var(--red-alpha-24)

#fb3748
·
24%
red-alpha-16
var(--red-alpha-16)

#fb3748
·
16%
red-alpha-10
var(--red-alpha-10)

#fb3748
·
10%
green
green-50
var(--green-50)
#e0faec
green-100
var(--green-100)
#d0fbe9
green-200
var(--green-200)
#c2f5da
green-300
var(--green-300)
#84ebb4
green-400
var(--green-400)
#3ee089
green-500
var(--green-500)
#1fc16b
green-600
var(--green-600)
#1daf61
green-700
var(--green-700)
#178c4e
green-800
var(--green-800)
#1a7544
green-900
var(--green-900)
#16643b
green-950
var(--green-950)
#0b4627
green Alpha
green-alpha-24
var(--green-alpha-24)

#1fc16b
·
24%
green-alpha-16
var(--green-alpha-16)

#1fc16b
·
16%
green-alpha-10
var(--green-alpha-10)

#1fc16b
·
10%
yellow
yellow-50
var(--yellow-50)
#fff4d6
yellow-100
var(--yellow-100)
#ffefcc
yellow-200
var(--yellow-200)
#ffecc0
yellow-300
var(--yellow-300)
#ffe097
yellow-400
var(--yellow-400)
#ffd268
yellow-500
var(--yellow-500)
#f6b51e
yellow-600
var(--yellow-600)
#e6a819
yellow-700
var(--yellow-700)
#c99a2c
yellow-800
var(--yellow-800)
#a78025
yellow-900
var(--yellow-900)
#86661d
yellow-950
var(--yellow-950)
#624c18
yellow Alpha
yellow-alpha-24
var(--yellow-alpha-24)

#fbc64b
·
24%
yellow-alpha-16
var(--yellow-alpha-16)

#fbc64b
·
16%
yellow-alpha-10
var(--yellow-alpha-10)

#fbc64b
·
10%
purple
purple-50
var(--purple-50)
#efebff
purple-100
var(--purple-100)
#dcd5ff
purple-200
var(--purple-200)
#cac0ff
purple-300
var(--purple-300)
#a897ff
purple-400
var(--purple-400)
#8c71f6
purple-500
var(--purple-500)
#7d52f4
purple-600
var(--purple-600)
#693ee0
purple-700
var(--purple-700)
#5b2cc9
purple-800
var(--purple-800)
#4c25a7
purple-900
var(--purple-900)
#3d1d86
purple-950
var(--purple-950)
#351a75
purple Alpha
purple-alpha-24
var(--purple-alpha-24)

#784def
·
24%
purple-alpha-16
var(--purple-alpha-16)

#784def
·
16%
purple-alpha-10
var(--purple-alpha-10)

#784def
·
10%
sky
sky-50
var(--sky-50)
#ebf8ff
sky-100
var(--sky-100)
#d5f1ff
sky-200
var(--sky-200)
#c0eaff
sky-300
var(--sky-300)
#97dcff
sky-400
var(--sky-400)
#68cdff
sky-500
var(--sky-500)
#47c2ff
sky-600
var(--sky-600)
#35ade9
sky-700
var(--sky-700)
#2597d0
sky-800
var(--sky-800)
#1f7ead
sky-900
var(--sky-900)
#18658b
sky-950
var(--sky-950)
#124b68
sky Alpha
sky-alpha-24
var(--sky-alpha-24)

#47c2ff
·
24%
sky-alpha-16
var(--sky-alpha-16)

#47c2ff
·
16%
sky-alpha-10
var(--sky-alpha-10)

#47c2ff
·
10%
pink
pink-50
var(--pink-50)
#ffebf4
pink-100
var(--pink-100)
#ffd5ea
pink-200
var(--pink-200)
#ffc0df
pink-300
var(--pink-300)
#ff97cb
pink-400
var(--pink-400)
#ff68b3
pink-500
var(--pink-500)
#fb4ba3
pink-600
var(--pink-600)
#e9358f
pink-700
var(--pink-700)
#d0257a
pink-800
var(--pink-800)
#ad1f66
pink-900
var(--pink-900)
#8b1852
pink-950
var(--pink-950)
#68123d
pink Alpha
pink-alpha-24
var(--pink-alpha-24)

#fb4ba3
·
24%
pink-alpha-16
var(--pink-alpha-16)

#fb4ba3
·
16%
pink-alpha-10
var(--pink-alpha-10)

#fb4ba3
·
10%
teal
teal-50
var(--teal-50)
#e4fbf8
teal-100
var(--teal-100)
#d0fbf5
teal-200
var(--teal-200)
#c2f5ee
teal-300
var(--teal-300)
#84ebdd
teal-400
var(--teal-400)
#3fdec9
teal-500
var(--teal-500)
#22d3bb
teal-600
var(--teal-600)
#1daf9c
teal-700
var(--teal-700)
#178c7d
teal-800
var(--teal-800)
#1a7569
teal-900
var(--teal-900)
#16645a
teal-950
var(--teal-950)
#0b463e
teal Alpha
teal-alpha-24
var(--teal-alpha-24)

#22d3bb
·
24%
teal-alpha-16
var(--teal-alpha-16)

#22d3bb
·
16%
teal-alpha-10
var(--teal-alpha-10)

#22d3bb
·
10%
static
static-black
var(--static-black)
#171717
static-white
var(--static-white)
#ffffff
neutral
neutral-0
var(--neutral-0)
gray-0
neutral-50
var(--neutral-50)
gray-50
neutral-100
var(--neutral-100)
gray-100
neutral-200
var(--neutral-200)
gray-200
neutral-300
var(--neutral-300)
gray-300
neutral-400
var(--neutral-400)
gray-400
neutral-500
var(--neutral-500)
gray-500
neutral-600
var(--neutral-600)
gray-600
neutral-700
var(--neutral-700)
gray-700
neutral-800
var(--neutral-800)
gray-800
neutral-900
var(--neutral-900)
gray-900
neutral-950
var(--neutral-950)
gray-950
neutral Alpha
neutral-alpha-24
var(--neutral-alpha-24)
gray-alpha-24
neutral-alpha-16
var(--neutral-alpha-16)
gray-alpha-16
neutral-alpha-10
var(--neutral-alpha-10)
gray-alpha-10
text
text-strong-950
var(--text-strong-950)
neutral-950
neutral-0
text-sub-600
var(--text-sub-600)
neutral-600
neutral-400
text-soft-400
var(--text-soft-400)
neutral-400
neutral-500
text-disabled-300
var(--text-disabled-300)
neutral-300
neutral-600
text-white-0
var(--text-white-0)
neutral-0
neutral-950
bg
bg-strong-950
var(--bg-strong-950)
neutral-950
neutral-0
bg-surface-800
var(--bg-surface-800)
neutral-800
neutral-200
bg-sub-300
var(--bg-sub-300)
neutral-300
neutral-600
bg-soft-200
var(--bg-soft-200)
neutral-200
neutral-700
bg-weak-50
var(--bg-weak-50)
neutral-50
neutral-900
bg-white-0
var(--bg-white-0)
neutral-0
neutral-950
stroke
stroke-strong-950
var(--stroke-strong-950)
neutral-950
neutral-0
stroke-sub-300
var(--stroke-sub-300)
neutral-300
neutral-600
stroke-soft-200
var(--stroke-soft-200)
neutral-200
neutral-700
stroke-white-0
var(--stroke-white-0)
neutral-0
neutral-950
primary
primary-dark
var(--primary-dark)
blue-800
primary-darker
var(--primary-darker)
blue-700
primary-base
var(--primary-base)
blue-500
primary Alpha
primary-alpha-24
var(--primary-alpha-24)
blue-alpha-24
primary-alpha-16
var(--primary-alpha-16)
blue-alpha-16
primary-alpha-10
var(--primary-alpha-10)
blue-alpha-10
faded
faded-dark
var(--faded-dark)
neutral-800
neutral-300
faded-base
var(--faded-base)
neutral-500
neutral-500
faded-light
var(--faded-light)
neutral-200
neutral-alpha-24
faded-lighter
var(--faded-lighter)
neutral-100
neutral-alpha-16
information
information-dark
var(--information-dark)
blue-950
blue-400
information-base
var(--information-base)
blue-500
blue-500
information-light
var(--information-light)
blue-200
blue-alpha-24
information-lighter
var(--information-lighter)
blue-50
blue-alpha-16
warning
warning-dark
var(--warning-dark)
orange-950
orange-400
warning-base
var(--warning-base)
orange-500
orange-600
warning-light
var(--warning-light)
orange-200
orange-alpha-24
warning-lighter
var(--warning-lighter)
orange-50
orange-alpha-16
error
error-dark
var(--error-dark)
red-950
red-400
error-base
var(--error-base)
red-500
red-600
error-light
var(--error-light)
red-200
red-alpha-24
error-lighter
var(--error-lighter)
red-50
red-alpha-16
success
success-dark
var(--success-dark)
green-950
green-400
success-base
var(--success-base)
green-500
green-600
success-light
var(--success-light)
green-200
green-alpha-24
success-lighter
var(--success-lighter)
green-50
green-alpha-16
away
away-dark
var(--away-dark)
yellow-950
yellow-400
away-base
var(--away-base)
yellow-500
yellow-600
away-light
var(--away-light)
yellow-200
yellow-alpha-24
away-lighter
var(--away-lighter)
yellow-50
yellow-alpha-16
feature
feature-dark
var(--feature-dark)
purple-950
purple-400
feature-base
var(--feature-base)
purple-500
purple-500
feature-light
var(--feature-light)
purple-200
purple-alpha-24
feature-lighter
var(--feature-lighter)
purple-50
purple-alpha-16
verified
verified-dark
var(--verified-dark)
sky-950
sky-400
verified-base
var(--verified-base)
sky-500
sky-600
verified-light
var(--verified-light)
sky-200
sky-alpha-24
verified-lighter
var(--verified-lighter)
sky-50
sky-alpha-16
highlighted
highlighted-dark
var(--highlighted-dark)
pink-950
pink-400
highlighted-base
var(--highlighted-base)
pink-500
pink-600
highlighted-light
var(--highlighted-light)
pink-200
pink-alpha-24
highlighted-lighter
var(--highlighted-lighter)
pink-50
pink-alpha-16
stable
stable-dark
var(--stable-dark)
teal-950
teal-400
stable-base
var(--stable-base)
teal-500
teal-600
stable-light
var(--stable-light)
teal-200
teal-alpha-24
stable-lighter
var(--stable-lighter)
teal-50
teal-alpha-16
social
social-apple
var(--social-apple)
#000
#fff
social-twitter
var(--social-twitter)
#010101
#fff
social-github
var(--social-github)
#24292f
#fff
social-notion
var(--social-notion)
#1e2226
#fff
social-tidal
var(--social-tidal)
#000
#fff
social-amazon
var(--social-amazon)
#353e47
#fff
social-zendesk
var(--social-zendesk)
#16140d

Foundations

Typography
A clear and consistent typography system that works effortlessly across all kinds of content.

Title / H1 Title
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 56px
Line Height: 64px
Letter Spacing: -1%
Title / H2 Title
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 48px
Line Height: 56px
Letter Spacing: -1%
Title / H3 Title
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 40px
Line Height: 48px
Letter Spacing: -1%
Title / H4 Title
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 32px
Line Height: 40px
Letter Spacing: -0.5%
Title / H5 Title
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 24px
Line Height: 32px
Letter Spacing: 0%
Title / H6 Title
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 20px
Line Height: 28px
Letter Spacing: 0%
Label / X-Large
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 24px
Line Height: 32px
Letter Spacing: -1.5%
Label / Large
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 18px
Line Height: 24px
Letter Spacing: -1.5%
Label / Medium
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 16px
Line Height: 24px
Letter Spacing: -1.1%
Label / Small
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 14px
Line Height: 20px
Letter Spacing: -0.6%
Label / X-Small
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 12px
Line Height: 16px
Letter Spacing: 0%
Paragraph / X-Large
The quick brown fox jumps over the lazy dog.
Weight: Regular / 400
Font Size: 24px
Line Height: 32px
Letter Spacing: -1.5%
Paragraph / Large
The quick brown fox jumps over the lazy dog.
Weight: Regular / 400
Font Size: 18px
Line Height: 24px
Letter Spacing: -1.5%
Paragraph / Medium
The quick brown fox jumps over the lazy dog.
Weight: Regular / 400
Font Size: 16px
Line Height: 24px
Letter Spacing: -1.1%
Paragraph / Small
The quick brown fox jumps over the lazy dog.
Weight: Regular / 400
Font Size: 14px
Line Height: 20px
Letter Spacing: -0.6%
Paragraph / X-Small
The quick brown fox jumps over the lazy dog.
Weight: Regular / 400
Font Size: 12px
Line Height: 16px
Letter Spacing: 0%
Subheading / Medium
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 16px
Line Height: 24px
Letter Spacing: 6%
Subheading / Small
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 14px
Line Height: 20px
Letter Spacing: 6%
Subheading / X-Small
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 12px
Line Height: 16px
Letter Spacing: 4%
Subheading / 2X-Small
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 11px
Line Height: 12px
Letter Spacing: 2%
Doc / Label
The quick brown fox jumps over the lazy dog.
Weight: Medium / 500
Font Size: 18px
Line Height: 32px
Letter Spacing: -1.5%
Doc / Paragraph
The quick brown fox jumps over the lazy dog.
Weight: Regular / 400
Font Size: 18px
Line Height: 32px
Letter Spacing: -1.5%
© 2024 AlignUI Design System. All rights reserved.

Base Components

Button
Renders a button or an element styled to resemble a button.

@radix-ui/react-slot
Preview
Code
Copy
Button
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a button.tsx file and paste the following code into it.
/components/ui/button.tsx

// AlignUI Button v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import type { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const BUTTON_ROOT_NAME = 'ButtonRoot';
const BUTTON_ICON_NAME = 'ButtonIcon';

export const buttonVariants = tv({
slots: {
root: [
// base
'group relative inline-flex items-center justify-center whitespace-nowrap outline-none',
'transition duration-200 ease-out',
// focus
'focus:outline-none',
// disabled
'disabled:pointer-events-none disabled:bg-bg-weak-50 disabled:text-disabled-300 disabled:ring-transparent',
],
icon: [
// base
'flex size-5 shrink-0 items-center justify-center',
],
},
variants: {
variant: {
primary: {},
neutral: {},
error: {},
},
mode: {
filled: {},
stroke: {
root: 'ring-1 ring-inset',
},
lighter: {
root: 'ring-1 ring-inset',
},
ghost: {
root: 'ring-1 ring-inset',
},
},
size: {
medium: {
root: 'h-10 gap-3 rounded-10 px-3.5 text-label-sm',
icon: '-mx-1',
},
small: {
root: 'h-9 gap-3 rounded-lg px-3 text-label-sm',
icon: '-mx-1',
},
xsmall: {
root: 'h-8 gap-2.5 rounded-lg px-2.5 text-label-sm',
icon: '-mx-1',
},
xxsmall: {
root: 'h-7 gap-2.5 rounded-lg px-2 text-label-sm',
icon: '-mx-1',
},
},
},
compoundVariants: [
//#region variant=primary
{
variant: 'primary',
mode: 'filled',
class: {
root: [
// base
'bg-primary-base text-static-white',
// hover
'hover:bg-primary-darker',
// focus
'focus-visible:shadow-button-primary-focus',
],
},
},
{
variant: 'primary',
mode: 'stroke',
class: {
root: [
// base
'bg-bg-white-0 text-primary-base ring-primary-base',
// hover
'hover:bg-primary-alpha-10 hover:ring-transparent',
// focus
'focus-visible:shadow-button-primary-focus',
],
},
},
{
variant: 'primary',
mode: 'lighter',
class: {
root: [
// base
'bg-primary-alpha-10 text-primary-base ring-transparent',
// hover
'hover:bg-bg-white-0 hover:ring-primary-base',
// focus
'focus-visible:bg-bg-white-0 focus-visible:shadow-button-primary-focus focus-visible:ring-primary-base',
],
},
},
{
variant: 'primary',
mode: 'ghost',
class: {
root: [
// base
'bg-transparent text-primary-base ring-transparent',
// hover
'hover:bg-primary-alpha-10',
// focus
'focus-visible:bg-bg-white-0 focus-visible:shadow-button-primary-focus focus-visible:ring-primary-base',
],
},
},
//#endregion

    //#region variant=neutral
    {
      variant: 'neutral',
      mode: 'filled',
      class: {
        root: [
          // base
          'bg-bg-strong-950 text-white-0',
          // hover
          'hover:bg-bg-surface-800',
          // focus
          'focus-visible:shadow-button-important-focus',
        ],
      },
    },
    {
      variant: 'neutral',
      mode: 'stroke',
      class: {
        root: [
          // base
          'bg-bg-white-0 text-sub-600 shadow-regular-xs ring-stroke-soft-200',
          // hover
          'hover:bg-bg-weak-50 hover:text-strong-950 hover:shadow-none hover:ring-transparent',
          // focus
          'focus-visible:text-strong-950 focus-visible:shadow-button-important-focus focus-visible:ring-stroke-strong-950',
        ],
      },
    },
    {
      variant: 'neutral',
      mode: 'lighter',
      class: {
        root: [
          // base
          'bg-bg-weak-50 text-sub-600 ring-transparent',
          // hover
          'hover:bg-bg-white-0 hover:text-strong-950 hover:shadow-regular-xs hover:ring-stroke-soft-200',
          // focus
          'focus-visible:bg-bg-white-0 focus-visible:text-strong-950 focus-visible:shadow-button-important-focus focus-visible:ring-stroke-strong-950',
        ],
      },
    },
    {
      variant: 'neutral',
      mode: 'ghost',
      class: {
        root: [
          // base
          'bg-transparent text-sub-600 ring-transparent',
          // hover
          'hover:bg-bg-weak-50 hover:text-strong-950',
          // focus
          'focus-visible:bg-bg-white-0 focus-visible:text-strong-950 focus-visible:shadow-button-important-focus focus-visible:ring-stroke-strong-950',
        ],
      },
    },
    //#endregion

    //#region variant=error
    {
      variant: 'error',
      mode: 'filled',
      class: {
        root: [
          // base
          'bg-error-base text-static-white',
          // hover
          'hover:bg-red-700',
          // focus
          'focus-visible:shadow-button-error-focus',
        ],
      },
    },
    {
      variant: 'error',
      mode: 'stroke',
      class: {
        root: [
          // base
          'bg-bg-white-0 text-error-base ring-error-base',
          // hover
          'hover:bg-red-alpha-10 hover:ring-transparent',
          // focus
          'focus-visible:shadow-button-error-focus',
        ],
      },
    },
    {
      variant: 'error',
      mode: 'lighter',
      class: {
        root: [
          // base
          'bg-red-alpha-10 text-error-base ring-transparent',
          // hover
          'hover:bg-bg-white-0 hover:ring-error-base',
          // focus
          'focus-visible:bg-bg-white-0 focus-visible:shadow-button-error-focus focus-visible:ring-error-base',
        ],
      },
    },
    {
      variant: 'error',
      mode: 'ghost',
      class: {
        root: [
          // base
          'bg-transparent text-error-base ring-transparent',
          // hover
          'hover:bg-red-alpha-10',
          // focus
          'focus-visible:bg-bg-white-0 focus-visible:shadow-button-error-focus focus-visible:ring-error-base',
        ],
      },
    },
    //#endregion

],
defaultVariants: {
variant: 'primary',
mode: 'filled',
size: 'medium',
},
});

type ButtonSharedProps = VariantProps<typeof buttonVariants>;

type ButtonRootProps = VariantProps<typeof buttonVariants> &
React.ButtonHTMLAttributes<HTMLButtonElement> & {
asChild?: boolean;
};

const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonRootProps>(
(
{ children, variant, mode, size, asChild, className, ...rest },
forwardedRef,
) => {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'button';
const { root } = buttonVariants({ variant, mode, size });

    const sharedProps: ButtonSharedProps = {
      variant,
      mode,
      size,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [BUTTON_ICON_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );

},
);
ButtonRoot.displayName = BUTTON_ROOT_NAME;

function ButtonIcon<T extends React.ElementType>({
variant,
mode,
size,
as,
className,
...rest
}: PolymorphicComponentProps<T, ButtonSharedProps>) {
const Component = as || 'div';
const { icon } = buttonVariants({ mode, variant, size });

return <Component className={icon({ class: className })} {...rest} />;
}
ButtonIcon.displayName = BUTTON_ICON_NAME;

export { ButtonRoot as Root, ButtonIcon as Icon };
Check the import paths to ensure they match your project setup.
Examples
Primary (Default)
Preview
Code
Copy
Get Started
Get Started
Get Started
Get Started
Neutral
Preview
Code
Copy
Learn More
Learn More
Learn More
Learn More
Error
Preview
Code
Copy
Try Again
Try Again
Try Again
Try Again
Size
Preview
Code
Copy
Medium
Small
Xsmall
Xxsmall
Medium
Small
Xsmall
Xxsmall
Medium
Small
Xsmall
Xxsmall
Medium
Small
Xsmall
Xxsmall
Disabled
Preview
Code
Copy
Disabled
Disabled
Disabled
Disabled
With Icon
Preview
Code
Copy
Button

Full Width
Preview
Code
Copy
Learn More
asChild
Preview
Code
Copy
As link
Composition
You can simplify component usage by creating a custom API that abstracts the core functionalities.

Preview
Code
Copy
Button
API Reference
Button.Root
This component is based on the <button> element and supports all of its props. And adds:

Prop Type Default
variant

"primary"
|
"neutral"
|
"error"
"primary"
mode

"filled"
|
"stroke"
|
"lighter"
|
"ghost"
"filled"
size

"medium"
|
"small"
|
"xsmall"
|
"xxsmall"
"medium"
asChild

boolean
Button.Icon
The Button.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div

Base Components

Button Group
Button groups are a set of buttons sticked together in a horizontal line.

@radix-ui/react-slot
Preview
Code
Copy
Grid view
List view
Gallery view
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a button-group.tsx file and paste the following code into it.
/components/ui/button-group.tsx

// AlignUI ButtonGroup v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const BUTTON_GROUP_ROOT_NAME = 'ButtonGroupRoot';
const BUTTON_GROUP_ITEM_NAME = 'ButtonGroupItem';
const BUTTON_GROUP_ICON_NAME = 'ButtonGroupIcon';

export const buttonGroupVariants = tv({
slots: {
root: 'flex -space-x-[1.5px]',
item: [
// base
'group relative flex items-center justify-center whitespace-nowrap bg-bg-white-0 text-center text-sub-600 outline-none',
'border border-stroke-soft-200',
'transition duration-200 ease-out',
// hover
'hover:bg-bg-weak-50',
// focus
'focus:bg-bg-weak-50 focus:outline-none',
// active
'data-[state=on]:bg-bg-weak-50',
'data-[state=on]:text-strong-950',
// disabled
'disabled:pointer-events-none disabled:bg-bg-weak-50',
'disabled:text-disabled-300',
],
icon: 'shrink-0',
},
variants: {
size: {
small: {
item: [
// base
'h-9 gap-4 px-4 text-label-sm',
// radius
'first:rounded-l-lg last:rounded-r-lg',
],
icon: [
// base
'-mx-2 size-5',
],
},
xsmall: {
item: [
// base
'h-8 gap-3.5 px-3.5 text-label-sm',
// radius
'first:rounded-l-lg last:rounded-r-lg',
],
icon: [
// base
'-mx-2 size-5',
],
},
xxsmall: {
item: [
// base
'h-6 gap-3 px-3 text-label-xs',
// radius
'first:rounded-l-md last:rounded-r-md',
],
icon: [
// base
'-mx-2 size-4',
],
},
},
},
defaultVariants: {
size: 'small',
},
});

type ButtonGroupSharedProps = VariantProps<typeof buttonGroupVariants>;

type ButtonGroupRootProps = VariantProps<typeof buttonGroupVariants> &
React.HTMLAttributes<HTMLDivElement> & {
asChild?: boolean;
};

const ButtonGroupRoot = React.forwardRef<HTMLDivElement, ButtonGroupRootProps>(
({ asChild, children, className, size, ...rest }, forwardedRef) => {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'div';
const { root } = buttonGroupVariants({ size });

    const sharedProps: ButtonGroupSharedProps = {
      size,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [BUTTON_GROUP_ITEM_NAME, BUTTON_GROUP_ICON_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );

},
);
ButtonGroupRoot.displayName = BUTTON_GROUP_ROOT_NAME;

type ButtonGroupItemProps = ButtonGroupSharedProps &
React.ButtonHTMLAttributes<HTMLButtonElement> & {
asChild?: boolean;
};

const ButtonGroupItem = React.forwardRef<
HTMLButtonElement,
ButtonGroupItemProps

> (({ children, className, size, asChild, ...rest }, forwardedRef) => {
> const Component = asChild ? Slot : 'button';
> const { item } = buttonGroupVariants({ size });

return (
<Component
ref={forwardedRef}
className={item({ class: className })}
{...rest} >
{children}
</Component>
);
});
ButtonGroupItem.displayName = BUTTON_GROUP_ITEM_NAME;

function ButtonGroupIcon<T extends React.ElementType>({
className,
size,
as,
...rest
}: PolymorphicComponentProps<T, ButtonGroupSharedProps>) {
const Component = as || 'div';
const { icon } = buttonGroupVariants({ size });

return <Component className={icon({ class: className })} {...rest} />;
}
ButtonGroupIcon.displayName = BUTTON_GROUP_ICON_NAME;

export {
ButtonGroupRoot as Root,
ButtonGroupItem as Item,
ButtonGroupIcon as Icon,
};
Update the import paths to match your project setup.
Examples
Size
Preview
Code
Copy
Grid view
List view
Gallery view
Grid view
List view
Gallery view
Grid view
List view
Gallery view
Radix Toggle Group
An example demonstrating how to use Button Group with @radix-ui/react-toggle-group primitives.

Preview
Code
Copy
Inter

API Reference
ButtonGroup.Root
This component is based on the <div> element.

Prop Type Default
size

"small"
|
"xsmall"
|
"xxsmall"
"small"
asChild

boolean
ButtonGroup.Item
Prop Type Default
asChild

boolean
ButtonGroup.Icon
The ButtonGroup.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div

Base Components

Compact Button
Buttons that are ideal for when space is limited.

@radix-ui/react-slot
Preview
Code
Copy

Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a compact-button.tsx file and paste the following code into it.
/components/ui/compact-button.tsx

// AlignUI CompactButton v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const COMPACT_BUTTON_ROOT_NAME = 'CompactButtonRoot';
const COMPACT_BUTTON_ICON_NAME = 'CompactButtonIcon';

export const compactButtonVariants = tv({
slots: {
root: [
// base
'relative flex shrink-0 items-center justify-center outline-none',
'transition duration-200 ease-out',
// disabled
'disabled:pointer-events-none disabled:border-transparent disabled:bg-transparent disabled:text-disabled-300 disabled:shadow-none',
// focus
'focus:outline-none',
],
icon: '',
},
variants: {
variant: {
stroke: {
root: [
// base
'border border-stroke-soft-200 bg-bg-white-0 text-sub-600 shadow-regular-xs',
// hover
'hover:border-transparent hover:bg-bg-weak-50 hover:text-strong-950 hover:shadow-none',
// focus
'focus-visible:border-transparent focus-visible:bg-bg-strong-950 focus-visible:text-white-0 focus-visible:shadow-none',
],
},
ghost: {
root: [
// base
'bg-transparent text-sub-600',
// hover
'hover:bg-bg-weak-50 hover:text-strong-950',
// focus
'focus-visible:bg-bg-strong-950 focus-visible:text-white-0',
],
},
white: {
root: [
// base
'bg-bg-white-0 text-sub-600 shadow-regular-xs',
// hover
'hover:bg-bg-weak-50 hover:text-strong-950',
// focus
'focus-visible:bg-bg-strong-950 focus-visible:text-white-0',
],
},
modifiable: {},
},
size: {
large: {
root: 'size-6',
icon: 'size-5',
},
medium: {
root: 'size-5',
icon: 'size-[18px]',
},
},
fullRadius: {
true: {
root: 'rounded-full',
},
false: {
root: 'rounded-md',
},
},
},
defaultVariants: {
variant: 'stroke',
size: 'large',
fullRadius: false,
},
});

type CompactButtonSharedProps = Omit<
VariantProps<typeof compactButtonVariants>,
'fullRadius'

> ;

type CompactButtonProps = VariantProps<typeof compactButtonVariants> &
React.ButtonHTMLAttributes<HTMLButtonElement> & {
asChild?: boolean;
};

const CompactButtonRoot = React.forwardRef<
HTMLButtonElement,
CompactButtonProps

> (
> (

    { asChild, variant, size, fullRadius, children, className, ...rest },
    forwardedRef,

) => {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'button';
const { root } = compactButtonVariants({ variant, size, fullRadius });

    const sharedProps: CompactButtonSharedProps = {
      variant,
      size,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [COMPACT_BUTTON_ICON_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );

},
);
CompactButtonRoot.displayName = COMPACT_BUTTON_ROOT_NAME;

function CompactButtonIcon<T extends React.ElementType>({
variant,
size,
as,
className,
...rest
}: PolymorphicComponentProps<T, CompactButtonSharedProps>) {
const Component = as || 'div';
const { icon } = compactButtonVariants({ variant, size });

return <Component className={icon({ class: className })} {...rest} />;
}
CompactButtonIcon.displayName = COMPACT_BUTTON_ICON_NAME;

export { CompactButtonRoot as Root, CompactButtonIcon as Icon };
Update the import paths to match your project setup.
Examples
Stroke (Default)
Preview
Code
Copy

Ghost
Preview
Code
Copy

White
Preview
Code
Copy

Modifiable
Text color inherits from the parent by default. No default color, background or hover colors are applied, allowing for full customization.

Here's an example with custom colors specified:

Preview
Code
Copy

Size
Preview
Code
Copy

Full Radius
Preview
Code
Copy

Disabled
Preview
Code
Copy

asChild
Preview
Code
Copy
Composition
You can simplify component usage by creating a custom API that abstracts the core functionalities.

An example with a required icon prop:

Preview
Code
Copy

API Reference
CompactButton.Root
This component is based on the <button> element and supports all of its props. And adds:

Prop Type Default
variant

"stroke"
|
"ghost"
|
"white"
|
"modifiable"
"stroke"
size

"large"
|
"medium"
"large"
fullRadius

boolean
false
asChild

boolean
CompactButton.Icon
The CompactButton.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div

Fancy Button
Regular buttons with a fancy appearance.

@radix-ui/react-slot
Preview
Code
Copy
Button
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a fancy-button.tsx file and paste the following code into it.
/components/ui/fancy-button.tsx

// AlignUI FancyButton v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const FANCY_BUTTON_ROOT_NAME = 'FancyButtonRoot';
const FANCY_BUTTON_ICON_NAME = 'FancyButtonIcon';

export const fancyButtonVariants = tv({
slots: {
root: [
// base
'group relative inline-flex items-center justify-center whitespace-nowrap text-label-sm outline-none',
'transition duration-200 ease-out',
// focus
'focus:outline-none',
// disabled
'disabled:pointer-events-none disabled:text-disabled-300',
'disabled:bg-bg-weak-50 disabled:bg-none disabled:shadow-none disabled:before:hidden disabled:after:hidden',
],
icon: 'relative z-10 size-5 shrink-0',
},
variants: {
variant: {
neutral: {
root: 'bg-bg-strong-950 text-white-0 shadow-fancy-buttons-neutral',
},
primary: {
root: 'bg-primary-base text-static-white shadow-fancy-buttons-primary',
},
destructive: {
root: 'bg-error-base text-static-white shadow-fancy-buttons-error',
},
basic: {
root: [
// base
'bg-bg-white-0 text-sub-600 shadow-fancy-buttons-stroke',
// hover
'hover:bg-bg-weak-50 hover:text-strong-950 hover:shadow-none',
],
},
},
size: {
medium: {
root: 'h-10 gap-3 rounded-10 px-3.5',
icon: '-mx-1',
},
small: {
root: 'h-9 gap-3 rounded-lg px-3',
icon: '-mx-1',
},
xsmall: {
root: 'h-8 gap-3 rounded-lg px-2.5',
icon: '-mx-1',
},
},
},
compoundVariants: [
{
variant: ['neutral', 'primary', 'destructive'],
class: {
root: [
// before
'before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit]',
'before:bg-gradient-to-b before:p-px',
'before:from-static-white/[.12] before:to-transparent',
// before mask
'before:[mask-clip:content-box,border-box] before:[mask-composite:exclude] before:[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)]',
// after
'after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-b after:from-static-white after:to-transparent',
'after:pointer-events-none after:opacity-[.16] after:transition after:duration-200 after:ease-out',
// hover
'hover:after:opacity-[.24]',
],
},
},
],
defaultVariants: {
variant: 'neutral',
size: 'medium',
},
});

type FancyButtonSharedProps = VariantProps<typeof fancyButtonVariants>;

type FancyButtonProps = VariantProps<typeof fancyButtonVariants> &
React.ButtonHTMLAttributes<HTMLButtonElement> & {
asChild?: boolean;
};

const FancyButtonRoot = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
({ asChild, children, variant, size, className, ...rest }, forwardedRef) => {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'button';
const { root } = fancyButtonVariants({ variant, size });

    const sharedProps: FancyButtonSharedProps = {
      variant,
      size,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [FANCY_BUTTON_ICON_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );

},
);
FancyButtonRoot.displayName = FANCY_BUTTON_ROOT_NAME;

function FancyButtonIcon<T extends React.ElementType>({
className,
variant,
size,
as,
...rest
}: PolymorphicComponentProps<T, FancyButtonSharedProps>) {
const Component = as || 'div';
const { icon } = fancyButtonVariants({ variant, size });

return <Component className={icon({ class: className })} {...rest} />;
}
FancyButtonIcon.displayName = FANCY_BUTTON_ICON_NAME;

export { FancyButtonRoot as Root, FancyButtonIcon as Icon };
Update the import paths to match your project setup.
Examples
Neutral (Default)
Preview
Code
Copy
Button
Primary
Preview
Code
Copy
Button
Destructive
Preview
Code
Copy
Button
Basic
Preview
Code
Copy
Button
With Icon
Preview
Code
Copy
Button
Size
Preview
Code
Copy
Button
Button
Button
Disabled
Preview
Code
Copy
Button
Button
Button
Button
asChild
Preview
Code
Copy
Button
Composition
Preview
Code
Copy
Button
API Reference
FancyButton.Root
This component is based on the <button> element and supports all of its props. And adds:

Prop Type Default
variant

"neutral"
|
"primary"
|
"destructive"
|
"basic"
"neutral"
size

"medium"
|
"small"
|
"xsmall"
"medium"
asChild

boolean
FancyButton.Icon
The FancyButton.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div

Base Components

Link Button
Buttons that seamlessly integrate with text content.

@radix-ui/react-slot
Preview
Code
Copy
Link Button
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a link-button.tsx file and paste the following code into it.
/components/ui/link-button.tsx

// AlignUI LinkButton v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const LINK_BUTTON_ROOT_NAME = 'LinkButtonRoot';
const LINK_BUTTON_ICON_NAME = 'LinkButtonIcon';

export const linkButtonVariants = tv({
slots: {
root: [
// base
'group inline-flex items-center justify-center whitespace-nowrap outline-none',
'transition duration-200 ease-out',
'underline decoration-transparent underline-offset-[3px]',
// hover
'hover:decoration-current',
// focus
'focus:outline-none focus-visible:underline',
// disabled
'disabled:pointer-events-none disabled:text-disabled-300 disabled:no-underline',
],
icon: 'shrink-0',
},
variants: {
variant: {
gray: {
root: [
// base
'text-sub-600',
// focus
'focus-visible:text-strong-950',
],
},
black: {
root: 'text-strong-950',
},
primary: {
root: [
// base
'text-primary-base',
// hover
'hover:text-primary-darker',
],
},
error: {
root: [
// base
'text-error-base',
// hover
'hover:text-red-700',
],
},
modifiable: {},
},
size: {
medium: {
root: 'h-5 gap-1 text-label-sm',
icon: 'size-5',
},
small: {
root: 'h-4 gap-1 text-label-xs',
icon: 'size-4',
},
},
underline: {
true: {
root: 'decoration-current',
},
},
},
defaultVariants: {
variant: 'gray',
size: 'medium',
},
});

type LinkButtonSharedProps = VariantProps<typeof linkButtonVariants>;

type LinkButtonProps = VariantProps<typeof linkButtonVariants> &
React.ButtonHTMLAttributes<HTMLButtonElement> & {
asChild?: boolean;
};

const LinkButtonRoot = React.forwardRef<HTMLButtonElement, LinkButtonProps>(
(
{ asChild, children, variant, size, underline, className, ...rest },
forwardedRef,
) => {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'button';
const { root } = linkButtonVariants({ variant, size, underline });

    const sharedProps: LinkButtonSharedProps = {
      variant,
      size,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [LINK_BUTTON_ICON_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );

},
);
LinkButtonRoot.displayName = LINK_BUTTON_ROOT_NAME;

function LinkButtonIcon<T extends React.ElementType>({
className,
variant,
size,
as,
...rest
}: PolymorphicComponentProps<T, LinkButtonSharedProps>) {
const Component = as || 'div';
const { icon } = linkButtonVariants({ variant, size });

return <Component className={icon({ class: className })} {...rest} />;
}
LinkButtonIcon.displayName = LINK_BUTTON_ICON_NAME;

export { LinkButtonRoot as Root, LinkButtonIcon as Icon };
Update the import paths to match your project setup.
Examples
Gray (Default)
Preview
Code
Copy
Link Button
Black
Preview
Code
Copy
Link Button
Primary
Preview
Code
Copy
Link Button
Error
Preview
Code
Copy
Link Button
Modifiable
Text color inherits from the parent by default. No default color is applied, allowing for full customization.

Here's an example with custom colors specified:

Preview
Code
Copy
Link Button
Size
Preview
Code
Copy
Link Button
Link Button
Underline
Preview
Code
Copy
Link Button
Link Button
Link Button
Link Button
With Icon
Preview
Code
Copy
Link Button
Disabled
Preview
Code
Copy
Link Button
Link Button
Link Button
Link Button
Link Button
asChild
Preview
Code
Copy
Link Button
Composition
Preview
Code
Copy
Link Button
API Reference
LinkButton.Root
This component is based on the <button> element and supports all of its props. And adds:

Prop Type Default
variant

"gray"
|
"black"
|
"primary"
|
"error"
|
"modifiable"
"gray"
size

"medium"
|
"small"
"medium"
underline

boolean
false
asChild

boolean
LinkButton.Icon
The LinkButton.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div

Base Components

Social Button
Simplify user login and registration processes.

@radix-ui/react-slot
Preview
Code
Copy
Login with Apple
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a components/ui/social-button.tsx file and paste the following code into it.
/components/ui/social-button.tsx

// AlignUI SocialButton v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const SOCIAL_BUTTON_ROOT_NAME = 'SocialButtonRoot';
const SOCIAL_BUTTON_ICON_NAME = 'SocialButtonIcon';

export const socialButtonVariants = tv({
slots: {
root: [
// base
'relative inline-flex h-10 items-center justify-center gap-3.5 whitespace-nowrap rounded-10 px-4 text-label-sm outline-none',
'transition duration-200 ease-out',
// focus
'focus:outline-none',
],
icon: 'relative z-10 -mx-1.5 size-5 shrink-0',
},
variants: {
brand: {
apple: {},
twitter: {},
google: {},
facebook: {},
linkedin: {},
github: {},
dropbox: {},
},
mode: {
filled: {
root: [
// base
'text-static-white',
// before
'before:pointer-events-none before:absolute before:inset-0 before:rounded-10 before:opacity-0 before:transition before:duration-200 before:ease-out',
// hover
'hover:before:opacity-100',
// focus
'focus-visible:shadow-button-important-focus',
],
},
stroke: {
root: [
// base
'bg-bg-white-0 text-strong-950 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200',
// hover
'hover:bg-bg-weak-50 hover:shadow-none hover:ring-transparent',
// focus
'focus-visible:shadow-button-important-focus focus-visible:ring-stroke-strong-950',
],
},
},
},
compoundVariants: [
//#region mode=filled
{
brand: 'apple',
mode: 'filled',
class: {
root: [
// base
'bg-static-black',
// before
'before:bg-white-alpha-16',
],
},
},
{
brand: 'twitter',
mode: 'filled',
class: {
root: [
// base
'bg-static-black',
// before
'before:bg-white-alpha-16',
],
},
},
{
brand: 'google',
mode: 'filled',
class: {
root: [
// base
'bg-[#f14336]',
// before
'before:bg-static-black/[.16]',
],
},
},
{
brand: 'facebook',
mode: 'filled',
class: {
root: [
// base
'bg-[#1977f3]',
// before
'before:bg-static-black/[.16]',
],
},
},
{
brand: 'linkedin',
mode: 'filled',
class: {
root: [
// base
'bg-[#0077b5]',
// before
'before:bg-static-black/[.16]',
],
},
},
{
brand: 'github',
mode: 'filled',
class: {
root: [
// base
'bg-[#24292f]',
// before
'before:bg-white-alpha-16',
],
},
},
{
brand: 'dropbox',
mode: 'filled',
class: {
root: [
// base
'bg-[#3984ff]',
// before
'before:bg-static-black/[.16]',
],
},
},
//#endregion

    //#region mode=stroke
    {
      brand: 'apple',
      mode: 'stroke',
      class: {
        root: [
          // base
          'text-social-apple',
        ],
      },
    },
    {
      brand: 'twitter',
      mode: 'stroke',
      class: {
        root: [
          // base
          'text-social-twitter',
        ],
      },
    },
    {
      brand: 'github',
      mode: 'stroke',
      class: {
        root: [
          // base
          'text-social-github',
        ],
      },
    },
    //#endregion

],
defaultVariants: {
mode: 'filled',
},
});

type SocialButtonSharedProps = VariantProps<typeof socialButtonVariants>;

type SocialButtonProps = VariantProps<typeof socialButtonVariants> &
React.ButtonHTMLAttributes<HTMLButtonElement> & {
asChild?: boolean;
};

const SocialButtonRoot = React.forwardRef<HTMLButtonElement, SocialButtonProps>(
({ asChild, children, mode, brand, className, ...rest }, forwardedRef) => {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'button';
const { root } = socialButtonVariants({ brand, mode });

    const sharedProps: SocialButtonSharedProps = {
      mode,
      brand,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [SOCIAL_BUTTON_ICON_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );

},
);
SocialButtonRoot.displayName = SOCIAL_BUTTON_ROOT_NAME;

function SocialButtonIcon<T extends React.ElementType>({
brand,
mode,
className,
as,
...rest
}: PolymorphicComponentProps<T, SocialButtonSharedProps>) {
const Component = as || 'div';
const { icon } = socialButtonVariants({ brand, mode });

return <Component className={icon({ class: className })} {...rest} />;
}
SocialButtonIcon.displayName = SOCIAL_BUTTON_ICON_NAME;

export { SocialButtonRoot as Root, SocialButtonIcon as Icon };
Update the import paths to match your project setup.
Examples
Apple (Default)
Preview
Code
Copy
Login with Apple

Login with Apple

Twitter
Preview
Code
Copy
Login with Twitter

Login with Twitter

Github
Preview
Code
Copy
Login with Github

Login with Github

Facebook
Preview
Code
Copy
Login with Facebook

Login with Facebook

Google
Preview
Code
Copy
Login with Google

Login with Google

Linkedin
Preview
Code
Copy
Login with Linkedin

Login with Linkedin

Dropbox
Preview
Code
Copy
Login with Dropbox

Login with Dropbox

asChild
Preview
Code
Copy
Login with Apple
API Reference
SocialButton.Root
This component is based on the <button> element and supports all of its props. And adds:

Prop Type Default
brand

"apple"
|
"twitter"
|
"google"
|
"facebook"
|
"linkedin"
|
"github"
|
"dropbox"
"apple"
mode

"filled"
|
"stroke"
"filled"
asChild

boolean
SocialButton.Icon
The SocialButton.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
Base Components

Checkbox
Checkbox is a form control for single and multiple selections.

@radix-ui/react-checkbox
Preview
Code
Copy

Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-checkbox
Create a checkbox.tsx file and paste the following code into it.
/components/ui/checkbox.tsx

// AlignUI Checkbox v0.0.0

import _ as React from 'react';
import _ as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { cn } from '@/utils/cn';

function IconCheck({ ...rest }: React.SVGProps<SVGSVGElement>) {
return (
<svg
width='10'
height='8'
viewBox='0 0 10 8'
fill='none'
xmlns='http://www.w3.org/2000/svg'
{...rest} >
<path
        d='M1 3.5L4 6.5L9 1.5'
        strokeWidth='1.5'
        className='stroke-static-white'
      />
</svg>
);
}

function IconIndeterminate({ ...rest }: React.SVGProps<SVGSVGElement>) {
return (
<svg
width='8'
height='2'
viewBox='0 0 8 2'
fill='none'
xmlns='http://www.w3.org/2000/svg'
{...rest} >
<path d='M0 1H8' strokeWidth='1.5' className='stroke-static-white' />
</svg>
);
}

const Checkbox = React.forwardRef<
React.ComponentRef<typeof CheckboxPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

> (({ className, checked, ...rest }, forwardedRef) => {
> const filterId = React.useId();

// precalculated by .getTotalLength()
const TOTAL_LENGTH_CHECK = 11.313708305358887;
const TOTAL_LENGTH_INDETERMINATE = 8;

return (
<CheckboxPrimitive.Root
ref={forwardedRef}
checked={checked}
className={cn(
'group/checkbox relative flex size-5 shrink-0 items-center justify-center outline-none',
'focus:outline-none',
className,
)}
{...rest} >
<svg
        width='20'
        height='20'
        viewBox='0 0 20 20'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
<rect
x='2'
y='2'
width='16'
height='16'
rx='4'
className={cn(
'fill-bg-soft-200 transition duration-200 ease-out',
// hover
'group-hover/checkbox:fill-bg-sub-300',
// focus
'group-focus/checkbox:fill-primary-base',
// disabled
'group-disabled/checkbox:fill-bg-soft-200',
// hover
'group-hover/checkbox:group-data-[state=checked]/checkbox:fill-primary-darker',
'group-hover/checkbox:group-data-[state=indeterminate]/checkbox:fill-primary-darker',
// focus
'group-focus/checkbox:group-data-[state=checked]/checkbox:fill-primary-dark',
'group-focus/checkbox:group-data-[state=indeterminate]/checkbox:fill-primary-dark',
// checked
'group-data-[state=checked]/checkbox:fill-primary-base',
'group-data-[state=indeterminate]/checkbox:fill-primary-base',
// disabled checked
'group-disabled/checkbox:group-data-[state=checked]/checkbox:fill-bg-soft-200',
'group-disabled/checkbox:group-data-[state=indeterminate]/checkbox:fill-bg-soft-200',
)}
/>
<g filter={`url(#${filterId})`}>
<rect
x='3.5'
y='3.5'
width='13'
height='13'
rx='2.6'
className={cn(
'fill-bg-white-0 transition duration-200 ease-out',
// disabled
'group-disabled/checkbox:hidden',
// checked
'group-data-[state=checked]/checkbox:opacity-0',
'group-data-[state=indeterminate]/checkbox:opacity-0',
)}
/>
</g>
<defs>
<filter
            id={filterId}
            x='1.5'
            y='3.5'
            width='17'
            height='17'
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
<feFlood floodOpacity='0' result='BackgroundImageFix' />
<feColorMatrix
              in='SourceAlpha'
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
              result='hardAlpha'
            />
<feOffset dy='2' />
<feGaussianBlur stdDeviation='1' />
<feColorMatrix
              type='matrix'
              values='0 0 0 0 0.105882 0 0 0 0 0.109804 0 0 0 0 0.113725 0 0 0 0.12 0'
            />
<feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_34646_2602'
            />
<feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_34646_2602'
              result='shape'
            />
</filter>
</defs>
</svg>
<CheckboxPrimitive.Indicator
forceMount
className='[&_path]:transition-all [&_path]:duration-300 [&_path]:ease-out [&_svg]:opacity-0' >
<IconCheck
className={cn(
'absolute left-1/2 top-1/2 shrink-0 -translate-x-1/2 -translate-y-1/2',
// checked
'group-data-[state=checked]/checkbox:opacity-100',
'group-data-[state=checked]/checkbox:[&>path]:[stroke-dashoffset:0]',
// path
'[&>path]:[stroke-dasharray:var(--total-length)] [&>path]:[stroke-dashoffset:var(--total-length)]',
'group-data-[state=indeterminate]/checkbox:invisible',
)}
style={{
            ['--total-length' as any]: TOTAL_LENGTH_CHECK,
          }}
/>
<IconIndeterminate
className={cn(
'absolute left-1/2 top-1/2 shrink-0 -translate-x-1/2 -translate-y-1/2',
// indeterminate
'group-data-[state=indeterminate]/checkbox:opacity-100',
'group-data-[state=indeterminate]/checkbox:[&>path]:[stroke-dashoffset:0]',
// path
'[&>path]:[stroke-dasharray:var(--total-length)] [&>path]:[stroke-dashoffset:var(--total-length)]',
'invisible group-data-[state=indeterminate]/checkbox:visible',
)}
style={{
            ['--total-length' as any]: TOTAL_LENGTH_INDETERMINATE,
          }}
/>
</CheckboxPrimitive.Indicator>
</CheckboxPrimitive.Root>
);
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox as Root };
Update the import paths to match your project setup.
Examples
Disabled
Preview
Code
Copy

With Label
Preview
Code
Copy

SMS Verification

Authenticator App

Disabled

Disabled but default checked
With Advanced Label
Preview
Code
Copy

Label
(Sublabel)
NEW

Label
(Sublabel)
NEW

Label
(Sublabel)
NEW
Insert the checkbox description here.
Link Button

Label
(Sublabel)
NEW
Insert the checkbox description here.
Link Button
Label
(Sublabel)
NEW

Label
(Sublabel)
NEW

Label
(Sublabel)
NEW
Insert the checkbox description here.
Link Button

Label
(Sublabel)
NEW
Insert the checkbox description here.
Link Button

API Reference
This component is based on the Radix UI Checkbox primitives. Refer to their documentation for the API reference.

Base Components

Digit Input
A component for entering one-time passwords (OTPs) in a digit-by-digit manner. Ideal for secure authentication flows where users need to input short numeric codes.

react-otp-input
Preview
Code
Copy
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install react-otp-input
Create a digit-input.tsx file and paste the following code into it.
/components/ui/digit-input.tsx

// AlignUI DigitInput v0.0.0

import \* as React from 'react';
import OtpInput, { OTPInputProps } from 'react-otp-input';

import { cn } from '@/utils/cn';

type OtpOptions = Omit<OTPInputProps, 'renderInput'>;

type DigitInputProps = {
className?: string;
disabled?: boolean;
hasError?: boolean;
} & OtpOptions;

function DigitInput({
className,
disabled,
hasError,
...rest
}: DigitInputProps) {
return (
<OtpInput
containerStyle={cn('flex w-full items-center gap-2.5', className)}
skipDefaultStyles
renderInput={(inputProps) => (
<DigitInputSlot
disabled={disabled}
hasError={hasError}
{...inputProps}
/>
)}
{...rest}
/>
);
}
DigitInput.displayName = 'DigitInput';

const DigitInputSlot = React.forwardRef<
React.ComponentRef<'input'>,
React.ComponentPropsWithoutRef<'input'> & {
hasError?: boolean;
}

> (({ className, hasError, ...rest }, forwardedRef) => {
> return (

    <input
      ref={forwardedRef}
      className={cn(
        'h-16 w-full min-w-0 rounded-10 bg-bg-white-0 text-center text-title-h5 text-strong-950 shadow-regular-xs outline-none ring-1 ring-inset ring-stroke-soft-200',
        'transition duration-200 ease-out',
        // hover
        'hover:bg-bg-weak-50 hover:shadow-none hover:ring-transparent',
        // focus
        'focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950',
        // selection
        'selection:bg-none',
        // disabled
        'disabled:bg-bg-weak-50 disabled:text-disabled-300 disabled:shadow-none disabled:ring-transparent',
        {
          'ring-error-base hover:ring-error-base focus:ring-error-base focus:shadow-button-error-focus':
            hasError,
        },
        className,
      )}
      {...rest}
    />

);
});
DigitInputSlot.displayName = 'DigitInputSlot';

export { DigitInput as Root };
Update the import paths to match your project setup.
Examples
Has Error
Preview
Code
Copy
Disabled
Preview
Code
Copy
Square Inputs
Preview
Code
Copy
API Reference
DigitInput.Root
This component is based on the react-otp-input package. Refer to their documentation for the API reference.

Prop Type Default
hasError

boolean
disabled

boolean
Base Components

File Upload
A consistent way to drag and drop, as well as browse your computer to upload a media file.

@radix-ui/react-slot
Preview
Code
Copy
Choose a file or drag & drop it here.
JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
Browse File
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a file-upload.tsx file and paste the following code into it.
/components/ui/file-upload.tsx

// AlignUI FileUpload v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/utils/cn';
import { PolymorphicComponentProps } from '@/utils/polymorphic';

const FileUpload = React.forwardRef<
HTMLLabelElement,
React.LabelHTMLAttributes<HTMLLabelElement> & {
asChild?: boolean;
}

> (({ className, asChild, ...rest }, forwardedRef) => {
> const Component = asChild ? Slot : 'label';

return (
<Component
ref={forwardedRef}
className={cn(
'flex w-full cursor-pointer flex-col items-center gap-5 rounded-xl border border-dashed border-stroke-sub-300 bg-bg-white-0 p-8 text-center',
'transition duration-200 ease-out',
// hover
'hover:bg-bg-weak-50',
className,
)}
{...rest}
/>
);
});
FileUpload.displayName = 'FileUpload';

const FileUploadButton = React.forwardRef<
HTMLDivElement,
React.HTMLAttributes<HTMLDivElement> & {
asChild?: boolean;
}

> (({ className, asChild, ...rest }, forwardedRef) => {
> const Component = asChild ? Slot : 'div';

return (
<Component
ref={forwardedRef}
className={cn(
'inline-flex h-8 items-center justify-center gap-2.5 whitespace-nowrap rounded-lg bg-bg-white-0 px-2.5 text-label-sm text-sub-600',
'pointer-events-none ring-1 ring-inset ring-stroke-soft-200',
className,
)}
{...rest}
/>
);
});
FileUploadButton.displayName = 'FileUploadButton';

function FileUploadIcon<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || 'div';

return (
<Component
className={cn('size-6 text-sub-600', className)}
{...rest}
/>
);
}

export {
FileUpload as Root,
FileUploadButton as Button,
FileUploadIcon as Icon,
};
Update the import paths to match your project setup.
File Format Icon
Preview
Code
Copy
PDF
PDF
PDF
PDF
PDF
PDF
PDF
PDF
PDF
DOC
DOC
DOC
DOC
DOC
DOC
DOC
DOC
DOC
Create a file-format-icon.tsx file and paste the following code into it.
/components/ui/file-format-icon.tsx

// AlignUI FileFormatIcon v0.0.0

import \* as React from 'react';

import { tv, type VariantProps } from '@/utils/tv';

export const fileFormatIconVariants = tv({
slots: {
root: 'relative shrink-0',
formatBox:
'absolute bottom-1.5 left-0 flex h-4 items-center rounded px-[3px] py-0.5 text-[11px] font-semibold leading-none text-static-white',
},
variants: {
size: {
medium: {
root: 'size-10',
},
small: {
root: 'size-8',
},
},
color: {
red: {
formatBox: 'bg-error-base',
},
orange: {
formatBox: 'bg-warning-base',
},
yellow: {
formatBox: 'bg-away-base',
},
green: {
formatBox: 'bg-success-base',
},
sky: {
formatBox: 'bg-verified-base',
},
blue: {
formatBox: 'bg-information-base',
},
purple: {
formatBox: 'bg-feature-base',
},
pink: {
formatBox: 'bg-highlighted-base',
},
gray: {
formatBox: 'bg-faded-base',
},
},
},
defaultVariants: {
color: 'gray',
size: 'medium',
},
});

function FileFormatIcon({
format,
className,
color,
size,
...rest
}: VariantProps<typeof fileFormatIconVariants> &
React.SVGProps<SVGSVGElement>) {
const { root, formatBox } = fileFormatIconVariants({ color, size });

return (
<svg
width='40'
height='40'
viewBox='0 0 40 40'
fill='none'
xmlns='http://www.w3.org/2000/svg'
className={root({ class: className })}
{...rest} >
<path
        d='M30 39.25H10C7.10051 39.25 4.75 36.8995 4.75 34V6C4.75 3.10051 7.10051 0.75 10 0.75H20.5147C21.9071 0.75 23.2425 1.30312 24.227 2.28769L33.7123 11.773C34.6969 12.7575 35.25 14.0929 35.25 15.4853V34C35.25 36.8995 32.8995 39.25 30 39.25Z'
        className='fill-bg-white-0 stroke-stroke-sub-300'
        strokeWidth='1.5'
      />
<path
        d='M23 1V9C23 11.2091 24.7909 13 27 13H35'
        className='stroke-stroke-sub-300'
        strokeWidth='1.5'
      />
<foreignObject x='0' y='0' width='40' height='40'>
{/_ eslint-disable-next-line _/}
{/_ @ts-ignore _/}

<div xmlns='http://www.w3.org/1999/xhtml' className={formatBox()}>
{format}
</div>
</foreignObject>
</svg>
);
}

export { FileFormatIcon as Root };
Update the import paths to match your project setup.
Base Components

Hint
Hint components provide contextual information or guidance beneath inputs, selects, and textareas, enhancing usability and user experience.

Preview
Code
Copy
This is a hint text to help user.
Installation
Create a hint.tsx file and paste the following code into it.
/components/ui/hint.tsx

// AlignUI Hint v0.0.0

import \* as React from 'react';

import { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const HINT_ROOT_NAME = 'HintRoot';
const HINT_ICON_NAME = 'HintIcon';

export const hintVariants = tv({
slots: {
root: 'group flex items-center gap-1 text-paragraph-xs text-sub-600',
icon: 'size-4 shrink-0 text-soft-400',
},
variants: {
disabled: {
true: {
root: 'text-disabled-300',
icon: 'text-disabled-300',
},
},
hasError: {
true: {
root: 'text-error-base',
icon: 'text-error-base',
},
},
},
});

type HintSharedProps = VariantProps<typeof hintVariants>;

type HintRootProps = VariantProps<typeof hintVariants> &
React.HTMLAttributes<HTMLDivElement>;

function HintRoot({
children,
hasError,
disabled,
className,
...rest
}: HintRootProps) {
const uniqueId = React.useId();
const { root } = hintVariants({ hasError, disabled });

const sharedProps: HintSharedProps = {
hasError,
disabled,
};

const extendedChildren = recursiveCloneChildren(
children as React.ReactElement[],
sharedProps,
[HINT_ICON_NAME],
uniqueId,
);

return (

<div className={root({ class: className })} {...rest}>
{extendedChildren}
</div>
);
}
HintRoot.displayName = HINT_ROOT_NAME;

function HintIcon<T extends React.ElementType>({
as,
className,
hasError,
disabled,
...rest
}: PolymorphicComponentProps<T, HintSharedProps>) {
const Component = as || 'div';
const { icon } = hintVariants({ hasError, disabled });

return <Component className={icon({ class: className })} {...rest} />;
}
HintIcon.displayName = HINT_ICON_NAME;

export { HintRoot as Root, HintIcon as Icon };
Update the import paths to match your project setup.
Examples
Disabled
Preview
Code
Copy
This is a hint text to help user.
Has Error
Preview
Code
Copy
This is a hint text to help user.
API Reference
Hint.Root
This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
hasError

boolean
disabled

boolean
Hint.Icon
The Hint.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
© 2024 AlignUI Design System. All rights reserved.

Base Components

Input
Text input is used to set a value that is a single line of text.

Preview
Code
Copy
Installation
Create a input.tsx file and paste the following code into it.
/components/ui/input.tsx

// AlignUI Input v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import type { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const INPUT_ROOT_NAME = 'InputRoot';
const INPUT_WRAPPER_NAME = 'InputWrapper';
const INPUT_EL_NAME = 'InputEl';
const INPUT_ICON_NAME = 'InputIcon';
const INPUT_AFFIX_NAME = 'InputAffixButton';
const INPUT_INLINE_AFFIX_NAME = 'InputInlineAffixButton';

export const inputVariants = tv({
slots: {
root: [
// base
'group relative flex w-full overflow-hidden bg-bg-white-0 text-strong-950 shadow-regular-xs',
'transition duration-200 ease-out',
'divide-x divide-stroke-soft-200',
// before
'before:absolute before:inset-0 before:ring-1 before:ring-inset before:ring-stroke-soft-200',
'before:pointer-events-none before:rounded-[inherit]',
'before:transition before:duration-200 before:ease-out',
// hover
'hover:shadow-none',
// focus
'has-[input:focus]:shadow-button-important-focus has-[input:focus]:before:ring-stroke-strong-950',
// disabled
'has-[input:disabled]:shadow-none has-[input:disabled]:before:ring-transparent',
],
wrapper: [
// base
'group/input-wrapper flex w-full cursor-text items-center bg-bg-white-0',
'transition duration-200 ease-out',
// hover
'hover:[&:not(&:has(input:focus))]:bg-bg-weak-50',
// disabled
'has-[input:disabled]:pointer-events-none has-[input:disabled]:bg-bg-weak-50',
],
input: [
// base
'w-full bg-transparent bg-none text-paragraph-sm text-strong-950 outline-none',
'transition duration-200 ease-out',
// placeholder
'placeholder:select-none placeholder:text-soft-400 placeholder:transition placeholder:duration-200 placeholder:ease-out',
// hover placeholder
'group-hover/input-wrapper:placeholder:text-sub-600',
// focus
'focus:outline-none',
// focus placeholder
'group-has-[input:focus]:placeholder:text-sub-600',
// disabled
'disabled:text-disabled-300 disabled:placeholder:text-disabled-300',
],
icon: [
// base
'flex size-5 shrink-0 select-none items-center justify-center',
'transition duration-200 ease-out',
// placeholder state
'group-has-[:placeholder-shown]:text-soft-400',
// filled state
'text-sub-600',
// hover
'group-has-[:placeholder-shown]:group-hover/input-wrapper:text-sub-600',
// focus
'group-has-[:placeholder-shown]:group-has-[input:focus]/input-wrapper:text-sub-600',
// disabled
'group-has-[input:disabled]/input-wrapper:text-disabled-300',
],
affix: [
// base
'shrink-0 bg-bg-white-0 text-paragraph-sm text-sub-600',
'flex items-center justify-center truncate',
'transition duration-200 ease-out',
// placeholder state
'group-has-[:placeholder-shown]:text-soft-400',
// focus state
'group-has-[:placeholder-shown]:group-has-[input:focus]:text-sub-600',
],
inlineAffix: [
// base
'text-paragraph-sm text-sub-600',
// placeholder state
'group-has-[:placeholder-shown]:text-soft-400',
// focus state
'group-has-[:placeholder-shown]:group-has-[input:focus]:text-sub-600',
],
},
variants: {
size: {
medium: {
root: 'rounded-10',
wrapper: 'gap-2 px-3',
input: 'h-10',
},
small: {
root: 'rounded-lg',
wrapper: 'gap-2 px-2.5',
input: 'h-9',
},
xsmall: {
root: 'rounded-lg',
wrapper: 'gap-1.5 px-2',
input: 'h-8',
},
},
hasError: {
true: {
root: [
// base
'before:ring-error-base',
// base
'hover:before:ring-error-base hover:[&:not(&:has(input:focus)):has(>:only-child)]:before:ring-error-base',
// focus
'has-[input:focus]:shadow-button-error-focus has-[input:focus]:before:ring-error-base',
],
},
false: {
root: [
// hover
'hover:[&:not(:has(input:focus)):has(>:only-child)]:before:ring-transparent',
],
},
},
},
compoundVariants: [
//#region affix
{
size: 'medium',
class: {
affix: 'px-3',
},
},
{
size: ['small', 'xsmall'],
class: {
affix: 'px-2.5',
},
},
//#endregion
],
defaultVariants: {
size: 'medium',
},
});

type InputSharedProps = VariantProps<typeof inputVariants>;

function InputRoot({
className,
children,
size,
hasError,
asChild,
...rest
}: React.HTMLAttributes<HTMLDivElement> &
InputSharedProps & {
asChild?: boolean;
}) {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'div';

const { root } = inputVariants({
size,
hasError,
});

const sharedProps: InputSharedProps = {
size,
hasError,
};

const extendedChildren = recursiveCloneChildren(
children as React.ReactElement[],
sharedProps,
[
INPUT_WRAPPER_NAME,
INPUT_EL_NAME,
INPUT_ICON_NAME,
INPUT_AFFIX_NAME,
INPUT_INLINE_AFFIX_NAME,
],
uniqueId,
asChild,
);

return (
<Component className={root({ class: className })} {...rest}>
{extendedChildren}
</Component>
);
}
InputRoot.displayName = INPUT_ROOT_NAME;

function InputWrapper({
className,
children,
size,
hasError,
asChild,
...rest
}: React.HTMLAttributes<HTMLLabelElement> &
InputSharedProps & {
asChild?: boolean;
}) {
const Component = asChild ? Slot : 'label';

const { wrapper } = inputVariants({
size,
hasError,
});

return (
<Component className={wrapper({ class: className })} {...rest}>
{children}
</Component>
);
}
InputWrapper.displayName = INPUT_WRAPPER_NAME;

const Input = React.forwardRef<
HTMLInputElement,
React.InputHTMLAttributes<HTMLInputElement> &
InputSharedProps & {
asChild?: boolean;
}

> (
> (

    { className, type = 'text', size, hasError, asChild, ...rest },
    forwardedRef,

) => {
const Component = asChild ? Slot : 'input';

    const { input } = inputVariants({
      size,
      hasError,
    });

    return (
      <Component
        type={type}
        className={input({ class: className })}
        ref={forwardedRef}
        {...rest}
      />
    );

},
);
Input.displayName = INPUT_EL_NAME;

function InputIcon<T extends React.ElementType = 'div'>({
size,
hasError,
as,
className,
...rest
}: PolymorphicComponentProps<T, InputSharedProps>) {
const Component = as || 'div';
const { icon } = inputVariants({ size, hasError });

return <Component className={icon({ class: className })} {...rest} />;
}
InputIcon.displayName = INPUT_ICON_NAME;

function InputAffix({
className,
children,
size,
hasError,
...rest
}: React.HTMLAttributes<HTMLDivElement> & InputSharedProps) {
const { affix } = inputVariants({
size,
hasError,
});

return (

<div className={affix({ class: className })} {...rest}>
{children}
</div>
);
}
InputAffix.displayName = INPUT_AFFIX_NAME;

function InputInlineAffix({
className,
children,
size,
hasError,
...rest
}: React.HTMLAttributes<HTMLSpanElement> & InputSharedProps) {
const { inlineAffix } = inputVariants({
size,
hasError,
});

return (
<span className={inlineAffix({ class: className })} {...rest}>
{children}
</span>
);
}
InputInlineAffix.displayName = INPUT_INLINE_AFFIX_NAME;

export {
InputRoot as Root,
InputWrapper as Wrapper,
Input,
InputIcon as Icon,
InputAffix as Affix,
InputInlineAffix as InlineAffix,
};
Update the import paths to match your project setup.
Examples
Icon
Preview
Code
Copy
Size
Preview
Code
Copy
Affix
Preview
Code
Copy
https://
@gmail.com
Inline Affix
Preview
Code
Copy
€
With Label and Hint
Preview
Code
Copy
Email Address

- (Optional)
  This is a hint text to help user.
  With Kbd
  Preview
  Code
  Copy
  1
  Password
  Preview
  Code
  Copy
  Password

This is a hint text to help user.
Password With Levels
Preview
Code
Copy
New Password

Must contain at least;
At least 1 uppercase
At least 1 number
At least 8 characters
Disabled
Preview
Code
Copy
Has Error
Preview
Code
Copy
With Button
Preview
Code
Copy
Share Link

Payment Input
Preview
Code
Copy
Card Number

- With Select
  Preview
  Code
  Copy
  €

EUR
With Inline Select
Preview
Code
Copy

can view
With Tags
Preview
Code
Copy
Tag Input
Berlin
London
Paris
Date Input With React Aria
Preview
Code
Copy
Date
mm
/
dd
/
yyyy
Counter Input With React Aria
Preview
Code
Copy
Counter Input

-

16

Composition
You can simplify component usage by creating a custom API that abstracts the core functionalities.

Preview
Code
Copy
Password

API Reference
Input.Root
The outer container that must contain <Input.Wrapper>. It's also the container for <Input.Affix> and other separate components like Select and Button. Provides border and shadow styles.

This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
size

"medium"
|
"small"
|
"xsmall"
"medium"
hasError

boolean
asChild

boolean
Input.Wrapper
The outer container that must contain <Input.Input>. You can also include components like <Input.Icon> and <Input.InlineAffix> inside it. When a user clicks on elements inside <Input.Wrapper>, they don't trigger any actions and instead focus on the input element itself.

This component is based on the <label> element and supports all of its props. And adds:

Prop Type Default
asChild

boolean
Input.Input
This component is based on the <input> element and supports all of its props. And adds:

Prop Type Default
asChild

boolean
Input.Icon
The Input.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
Input.Affix
This component is based on the <div> element and supports all of its props.

Input.InlineAffix
This component is based on the <div> element and supports all of its props.

Base Components

Label
Labels provide context for user inputs.

@radix-ui/react-label
Preview
Code
Copy
Last Name

- (Optional)
  Installation
  Install the following dependencies:
  npm
  pnpm
  yarn
  terminal

npm install @radix-ui/react-label
Create a label.tsx file and paste the following code into it.
/components/ui/label.tsx

// AlignUI Label v0.0.0

'use client';

import _ as React from 'react';
import _ as LabelPrimitives from '@radix-ui/react-label';

import { cn } from '@/utils/cn';

const LabelRoot = React.forwardRef<
React.ComponentRef<typeof LabelPrimitives.Root>,
React.ComponentPropsWithoutRef<typeof LabelPrimitives.Root> & {
disabled?: boolean;
}

> (({ className, disabled, ...rest }, forwardedRef) => {
> return (

    <LabelPrimitives.Root
      ref={forwardedRef}
      className={cn(
        'group cursor-pointer text-label-sm text-strong-950',
        'flex items-center gap-px',
        // disabled
        'aria-disabled:text-disabled-300',
        className,
      )}
      aria-disabled={disabled}
      {...rest}
    />

);
});
LabelRoot.displayName = 'LabelRoot';

function LabelAsterisk({
className,
children,
...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
return (
<span
className={cn(
'text-primary-base',
// disabled
'group-aria-disabled:text-disabled-300',
className,
)}
{...rest} >
{children || '\*'}
</span>
);
}

function LabelSub({
children,
className,
...rest
}: React.HTMLAttributes<HTMLSpanElement>) {
return (
<span
className={cn(
'text-paragraph-sm text-sub-600',
// disabled
'group-aria-disabled:text-disabled-300',
className,
)}
{...rest} >
{children}
</span>
);
}

export { LabelRoot as Root, LabelAsterisk as Asterisk, LabelSub as Sub };
Update the import paths to match your project setup.
API Reference
Label.Root
This component is based on the Label.Root primitive. Also includes:

Prop Type Default
disabled

boolean
Label.Asterisk
Displays an asterisk (\*) symbol, typically used to indicate required fields. This component is based on the <span> element and supports all of its props.

Label.Sub
Used to display supplementary text associated with the label, such as instructions or additional information. This component is based on the <span> element and supports all of its props.

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Radio
Radio button is a form control for making a single selection from a short list of options.

@radix-ui/react-radio-group
Preview
Code
Copy

Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-radio-group
Create a radio.tsx file and paste the following code into it.
/components/ui/radio.tsx

// AlignUI Radio v0.0.0

import _ as React from 'react';
import _ as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '@/utils/cn';

const RadioGroup = RadioGroupPrimitive.Root;
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef<
React.ComponentRef<typeof RadioGroupPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>

> (({ className, ...rest }, forwardedRef) => {
> const filterId = React.useId();

return (
<RadioGroupPrimitive.Item
ref={forwardedRef}
className={cn(
'group/radio relative size-5 shrink-0 outline-none focus:outline-none',
className,
)}
{...rest} >
<svg
width='20'
height='20'
viewBox='0 0 20 20'
fill='none'
xmlns='http://www.w3.org/2000/svg'
className={cn([
'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
])} >
<circle
cx='10'
cy='10'
r='8'
className={cn(
'fill-bg-soft-200 transition duration-200 ease-out',
// hover
'group-hover/radio:fill-bg-sub-300',
// focus
'group-focus/radio:fill-primary-base',
// disabled
'group-disabled/radio:fill-bg-soft-200',
// disabled chcked
'group-data-[state=checked]/radio:fill-bg-white-0',
)}
/>
<g filter={`url(#${filterId})`}>
<circle
cx='10'
cy='10'
r='6.5'
className={cn(
'fill-bg-white-0',
// disabled
'group-disabled/radio:hidden',
)}
/>
</g>
<defs>
<filter
            id={filterId}
            x='1.5'
            y='3.5'
            width='17'
            height='17'
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
<feFlood floodOpacity='0' result='BackgroundImageFix' />
<feColorMatrix
              in='SourceAlpha'
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
              result='hardAlpha'
            />
<feOffset dy='2' />
<feGaussianBlur stdDeviation='1' />
<feColorMatrix
              type='matrix'
              values='0 0 0 0 0.105882 0 0 0 0 0.109804 0 0 0 0 0.113725 0 0 0 0.12 0'
            />
<feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow_515_4243'
            />
<feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow_515_4243'
              result='shape'
            />
</filter>
</defs>
</svg>

      <RadioGroupPrimitive.Indicator asChild>
        <svg
          width='20'
          height='20'
          viewBox='0 0 20 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
        >
          <circle
            cx='10'
            cy='10'
            r='6'
            strokeWidth='4'
            className={cn(
              'stroke-primary-base transition duration-200 ease-out',
              // hover
              'group-hover/radio:stroke-primary-darker',
              // focus
              'group-focus/radio:stroke-primary-dark',
              // disabled
              'group-disabled/radio:stroke-bg-soft-200',
            )}
          />
        </svg>
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>

);
});
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup as Group, RadioGroupItem as Item };
Update the import paths to match your project setup.
Examples
Disabled
Preview
Code
Copy

With Label
Preview
Code
Copy

Spam

Harrassment

Violation of Rules
With Advanced Label
Preview
Code
Copy

Label
(Sublabel)
NEW

Label
(Sublabel)
NEW
Insert the checkbox description here.
Link Button
Label
(Sublabel)
NEW

Label
(Sublabel)
NEW
Insert the checkbox description here.
Link Button

API Reference
This component is based on the Radix UI Radio Group primitives. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Disabled
With Label
With Advanced Label
API Reference
Radio | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Select
Select is an input for selecting a single option from a menu.

@radix-ui/react-select
@radix-ui/react-scroll-area
@radix-ui/react-slot
Preview
Code
Copy

Select your favorite fruit...
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-select @radix-ui/react-scroll-area @radix-ui/react-slot
Create a select.tsx file and paste the following code into it.
/components/ui/select.tsx

// AlignUI Select v0.0.0

'use client';

import _ as React from 'react';
import _ as ScrollAreaPrimitives from '@radix-ui/react-scroll-area';
import \* as SelectPrimitives from '@radix-ui/react-select';
import { Slottable } from '@radix-ui/react-slot';
import { RiArrowDownSLine, RiCheckLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import type { PolymorphicComponentProps } from '@/utils/polymorphic';
import { tv, type VariantProps } from '@/utils/tv';

export const selectVariants = tv({
slots: {
triggerRoot: [
// base
'group/trigger min-w-0 shrink-0 bg-bg-white-0 shadow-regular-xs outline-none ring-1 ring-inset ring-stroke-soft-200',
'text-paragraph-sm text-strong-950',
'flex items-center text-left',
'transition duration-200 ease-out',
// hover
'hover:bg-bg-weak-50 hover:ring-transparent',
// focus
'focus:shadow-button-important-focus focus:outline-none focus:ring-stroke-strong-950',
'focus:text-strong-950 data-[placeholder]:focus:text-strong-950',
// disabled
'disabled:pointer-events-none disabled:bg-bg-weak-50 disabled:text-disabled-300 disabled:shadow-none disabled:ring-transparent data-[placeholder]:disabled:text-disabled-300',
// placeholder state
'data-[placeholder]:text-sub-600',
],
triggerArrow: [
// base
'ml-auto size-5 shrink-0',
'transition duration-200 ease-out',
// placeholder state
'group-data-[placeholder]/trigger:text-soft-400',
// filled state
'text-sub-600',
// hover
'group-hover/trigger:text-sub-600 group-data-[placeholder]/trigger:group-hover:text-sub-600',
// focus
'group-focus/trigger:text-strong-950 group-data-[placeholder]/trigger:group-focus/trigger:text-strong-950',
// disabled
'group-disabled/trigger:text-disabled-300 group-data-[placeholder]/trigger:group-disabled/trigger:text-disabled-300',
// open
'group-data-[state=open]/trigger:rotate-180',
],
triggerIcon: [
// base
'h-5 w-auto min-w-0 shrink-0 object-contain text-sub-600',
'transition duration-200 ease-out',
// placeholder state
'group-data-[placeholder]/trigger:text-soft-400',
// hover
'group-hover/trigger:text-sub-600 group-data-[placeholder]/trigger:group-hover:text-sub-600',
// disabled
'group-disabled/trigger:text-disabled-300 group-data-[placeholder]/trigger:group-disabled/trigger:text-disabled-300',
'group-disabled/trigger:[&:not(.remixicon)]:opacity-[.48]',
],
selectItemIcon: [
'size-5 shrink-0 bg-[length:1.25rem] text-sub-600',
// 'group-has-[&]-ml-0.5',
// disabled
'[[data-disabled]_&:not(.remixicon)]:opacity-[.48] [[data-disabled]_&]:text-disabled-300',
],
},
variants: {
size: {
medium: {},
small: {},
xsmall: {},
},
variant: {
default: {
triggerRoot: 'w-full',
},
compact: {
triggerRoot: 'w-auto',
},
compactForInput: {
triggerRoot: [
// base
'w-auto rounded-none shadow-none ring-0',
// focus
'focus:bg-bg-weak-50 focus:shadow-none focus:ring-0 focus:ring-transparent',
],
},
inline: {
triggerRoot: [
// base
'h-5 min-h-5 w-auto gap-0 rounded-none bg-transparent p-0 text-sub-600 shadow-none ring-0',
// hover
'hover:bg-transparent hover:text-strong-950',
// focus
'focus:shadow-none',
// open
'data-[state=open]:text-strong-950',
],
triggerIcon: [
// base
'mr-1.5 text-soft-400',
// hover
'group-hover/trigger:text-sub-600',
// open
'group-data-[state=open]/trigger:text-sub-600',
],
triggerArrow: [
// base
'ml-0.5',
// hover
'group-hover/trigger:text-strong-950',
// open
'group-data-[state=open]/trigger:text-strong-950',
],
selectItemIcon:
'text-soft-400 group-hover/trigger:text-sub-600',
},
},
hasError: {
true: {
triggerRoot: [
// base
'ring-error-base',
// focus
'focus:shadow-button-error-focus focus:ring-error-base',
],
},
},
},
compoundVariants: [
//#region default
{
size: 'medium',
variant: 'default',
class: {
triggerRoot: 'h-10 min-h-10 gap-2 rounded-10 pl-3 pr-2.5',
},
},
{
size: 'small',
variant: 'default',
class: {
triggerRoot: 'h-9 min-h-9 gap-2 rounded-lg pl-2.5 pr-2',
},
},
{
size: 'xsmall',
variant: 'default',
class: {
triggerRoot: 'h-8 min-h-8 gap-1.5 rounded-lg pl-2 pr-1.5',
},
},
//#endregion

    //#region compact
    {
      size: 'medium',
      variant: 'compact',
      class: {
        triggerRoot: 'h-10 gap-1 rounded-10 pl-3 pr-2.5',
        triggerIcon: '-ml-0.5',
        selectItemIcon: 'group-has-[&]/trigger:-ml-0.5',
      },
    },
    {
      size: 'small',
      variant: 'compact',
      class: {
        triggerRoot: 'h-9 gap-1 rounded-lg pl-3 pr-2',
        triggerIcon: '-ml-0.5',
        selectItemIcon: 'group-has-[&]/trigger:-ml-0.5',
      },
    },
    {
      size: 'xsmall',
      variant: 'compact',
      class: {
        triggerRoot: 'h-8 gap-0.5 rounded-lg pl-2.5 pr-1.5',
        triggerIcon: '-ml-0.5 size-4',
        selectItemIcon: 'size-4 bg-[length:1rem] group-has-[&]/trigger:-ml-0.5',
      },
    },
    //#endregion

    //#region compactForInput
    {
      size: 'medium',
      variant: 'compactForInput',
      class: {
        triggerRoot: 'pl-2.5 pr-2',
        triggerIcon: 'mr-2',
        triggerArrow: 'ml-0.5',
      },
    },
    {
      size: 'small',
      variant: 'compactForInput',
      class: {
        triggerRoot: 'px-2',
        triggerIcon: 'mr-2',
        triggerArrow: 'ml-0.5',
      },
    },
    {
      size: 'xsmall',
      variant: 'compactForInput',
      class: {
        triggerRoot: 'pl-2 pr-1.5',
        triggerIcon: 'mr-1.5 size-4',
        triggerArrow: 'ml-0.5',
        selectItemIcon: 'size-4 bg-[length:1rem]',
      },
    },
    //#endregion

],
defaultVariants: {
variant: 'default',
size: 'medium',
},
});

type SelectContextType = Pick<
VariantProps<typeof selectVariants>,
'variant' | 'size' | 'hasError'

> ;

const SelectContext = React.createContext<SelectContextType>({
size: 'medium',
variant: 'default',
hasError: false,
});

const useSelectContext = () => React.useContext(SelectContext);

const SelectRoot = ({
size = 'medium',
variant = 'default',
hasError,
...rest
}: React.ComponentProps<typeof SelectPrimitives.Root> & SelectContextType) => {
return (
<SelectContext.Provider value={{ size, variant, hasError }}>
<SelectPrimitives.Root {...rest} />
</SelectContext.Provider>
);
};
SelectRoot.displayName = 'SelectRoot';

const SelectGroup = SelectPrimitives.Group;
SelectGroup.displayName = 'SelectGroup';

const SelectValue = SelectPrimitives.Value;
SelectValue.displayName = 'SelectValue';

const SelectSeparator = SelectPrimitives.Separator;
SelectSeparator.displayName = 'SelectSeparator';

const SelectGroupLabel = SelectPrimitives.Label;
SelectGroupLabel.displayName = 'SelectGroupLabel';

const SELECT_TRIGGER_ICON_NAME = 'SelectTriggerIcon';

const SelectTrigger = React.forwardRef<
React.ComponentRef<typeof SelectPrimitives.Trigger>,
React.ComponentPropsWithoutRef<typeof SelectPrimitives.Trigger>

> (({ className, children, ...rest }, forwardedRef) => {
> const { size, variant, hasError } = useSelectContext();

const { triggerRoot, triggerArrow } = selectVariants({
size,
variant,
hasError,
});

return (
<SelectPrimitives.Trigger
ref={forwardedRef}
className={triggerRoot({ class: className })}
{...rest} >
<Slottable>{children}</Slottable>
<SelectPrimitives.Icon asChild>
<RiArrowDownSLine className={triggerArrow()} />
</SelectPrimitives.Icon>
</SelectPrimitives.Trigger>
);
});

SelectTrigger.displayName = 'SelectTrigger';

function TriggerIcon<T extends React.ElementType = 'div'>({
as,
className,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || 'div';

const { size, variant, hasError } = useSelectContext();
const { triggerIcon } = selectVariants({ size, variant, hasError });

return <Component className={triggerIcon({ class: className })} {...rest} />;
}
TriggerIcon.displayName = SELECT_TRIGGER_ICON_NAME;

const SelectContent = React.forwardRef<
React.ComponentRef<typeof SelectPrimitives.Content>,
React.ComponentPropsWithoutRef<typeof SelectPrimitives.Content>

> (
> (

    {
      className,
      position = 'popper',
      children,
      sideOffset = 8,
      collisionPadding = 8,
      ...rest
    },
    forwardedRef,

) => (
<SelectPrimitives.Portal>
<SelectPrimitives.Content
ref={forwardedRef}
className={cn(
// base
'relative z-50 overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200',
// widths
'min-w-[--radix-select-trigger-width] max-w-[max(var(--radix-select-trigger-width),320px)]',
// heights
'max-h-[--radix-select-content-available-height]',
// animation
'data-[state=open]:animate-in data-[state=open]:fade-in-0',
'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
className,
)}
sideOffset={sideOffset}
position={position}
collisionPadding={collisionPadding}
{...rest} >
<ScrollAreaPrimitives.Root type='auto'>
<SelectPrimitives.Viewport asChild>
<ScrollAreaPrimitives.Viewport
style={{ overflowY: undefined }}
className='max-h-[196px] w-full scroll-py-2 overflow-auto p-2' >
{children}
</ScrollAreaPrimitives.Viewport>
</SelectPrimitives.Viewport>
<ScrollAreaPrimitives.Scrollbar orientation='vertical'>
<ScrollAreaPrimitives.Thumb className='!w-1 rounded bg-bg-soft-200' />
</ScrollAreaPrimitives.Scrollbar>
</ScrollAreaPrimitives.Root>
</SelectPrimitives.Content>
</SelectPrimitives.Portal>
),
);

SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef<
React.ComponentRef<typeof SelectPrimitives.Item>,
React.ComponentPropsWithoutRef<typeof SelectPrimitives.Item>

> (({ className, children, ...rest }, forwardedRef) => {
> const { size } = useSelectContext();

return (
<SelectPrimitives.Item
ref={forwardedRef}
className={cn(
// base
'group relative cursor-pointer select-none rounded-lg p-2 pr-9 text-paragraph-sm text-strong-950',
'flex items-center gap-2 transition duration-200 ease-out',
// disabled
'data-[disabled]:pointer-events-none data-[disabled]:text-disabled-300',
// hover, focus
'data-[highlighted]:bg-bg-weak-50 data-[highlighted]:outline-0',
{
'gap-1.5 pr-[34px]': size === 'xsmall',
},
className,
)}
{...rest} >
<SelectPrimitives.ItemText asChild>
<span
className={cn(
// base
'flex flex-1 items-center gap-2',
// disabled
'group-disabled:text-disabled-300',
{
'gap-1.5': size === 'xsmall',
},
)} >
{typeof children === 'string' ? (
<span className='line-clamp-1'>{children}</span>
) : (
children
)}
</span>
</SelectPrimitives.ItemText>
<SelectPrimitives.ItemIndicator asChild>
<RiCheckLine className='absolute right-2 top-1/2 size-5 shrink-0 -translate-y-1/2 text-sub-600' />
</SelectPrimitives.ItemIndicator>
</SelectPrimitives.Item>
);
});

SelectItem.displayName = 'SelectItem';

function SelectItemIcon<T extends React.ElementType>({
as,
className,
...rest
}: PolymorphicComponentProps<T>) {
const { size, variant } = useSelectContext();
const { selectItemIcon } = selectVariants({ size, variant });

const Component = as || 'div';

return (
<Component className={selectItemIcon({ class: className })} {...rest} />
);
}

export {
SelectRoot as Root,
SelectContent as Content,
SelectGroup as Group,
SelectGroupLabel as GroupLabel,
SelectItem as Item,
SelectItemIcon as ItemIcon,
SelectSeparator as Separator,
SelectTrigger as Trigger,
TriggerIcon,
SelectValue as Value,
};
Update the import paths to match your project setup.
Examples
variant="default"
With Label & Hint
Preview
Code
Copy
Fruit

Select your favorite fruit...
This is a hint text to help user.
Icons
Preview
Code
Copy

Utility Payment
Size
Preview
Code
Copy

Utility Payment

Utility Payment

Utility Payment
Country
Preview
Code
Copy

Select a country...
Payment Method
Preview
Code
Copy

Select a payment method...
User
Preview
Code
Copy

Select a user...
Disabled
Preview
Code
Copy

Select a country...

Laura Perez
variant="compact"
Paging
Preview
Code
Copy

25
Country
Preview
Code
Copy

Size
Preview
Code
Copy

25

25

25
variant="inline"
Country
Preview
Code
Copy

Select
With Input
Preview
Code
Copy

can view
variant="compactForInput"
With Input
Preview
Code
Copy
€

EUR
Size
Preview
Code
Copy
€

EUR
€

EUR
€

EUR
API Reference
This component is based on the Radix UI Select primitives. Refer to their documentation for the API reference.

Select.Root
Supports all of Radix Select Root props and adds:

Prop Type Default
variant

"default"
|
"compact"
|
"compactForInput", "inline"
"default"
size

"medium"
|
"small"
|
"xsmall"
"medium"
hasError

boolean
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
variant="default"
With Label & Hint
Icons
Size
Country
Payment Method
User
Disabled
variant="compact"
Paging
Country
Size
variant="inline"
Country
With Input
variant="compactForInput"
With Input
Size
API Reference
Select.Root
Select | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Slider
Allowing precise selection of a single value within a specified range.

@radix-ui/react-slider
Preview
Code
Copy
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slider
Create a slider.tsx file and paste the following code into it.
/components/ui/slider.tsx

'use client';

import _ as React from 'react';
import _ as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/utils/cn';

const SLIDER_ROOT_NAME = 'SliderRoot';
const SLIDER_THUMB_NAME = 'SliderThumb';

const SliderRoot = React.forwardRef<
React.ComponentRef<typeof SliderPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>

> (({ className, children, ...rest }, forwardedRef) => (
> <SliderPrimitive.Root

    ref={forwardedRef}
    className={cn(
      'relative flex h-4 w-full touch-none select-none items-center',
      className,
    )}
    {...rest}

>

    <SliderPrimitive.Track className='relative h-1.5 w-full overflow-hidden rounded-full bg-bg-soft-200'>
      <SliderPrimitive.Range className='absolute h-full bg-primary-base' />
    </SliderPrimitive.Track>
    {children}

</SliderPrimitive.Root>
));
SliderRoot.displayName = SLIDER_ROOT_NAME;

const SliderThumb = React.forwardRef<
React.ComponentRef<typeof SliderPrimitive.Thumb>,
React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <SliderPrimitive.Thumb
      ref={forwardedRef}
      className={cn(
        [
          // base
          'box-content block size-1.5 shrink-0 cursor-pointer rounded-full border-[5px] border-static-white bg-primary-base shadow-toggle-switch outline-none',
          // focus
          'focus:outline-none',
        ],
        className,
      )}
      {...rest}
    />

);
});
SliderThumb.displayName = SLIDER_THUMB_NAME;

export { SliderRoot as Root, SliderThumb as Thumb };
Update the import paths to match your project setup.
Examples
Range
Preview
Code
Copy
With Tooltip
Preview
Code
Copy
API Reference
This component is based on the Radix UI Slider primitives. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Range
With Tooltip
API Reference
Slider | AlignUI Documentation
$300
$300
$450
$450

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Switch
Switch is used to immediately toggle a setting on or off.

@radix-ui/react-switch
Preview
Code
Copy

Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-switch
Create a switch.tsx file and paste the following code into it.
/components/ui/switch.tsx

import _ as React from 'react';
import _ as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/utils/cn';

const Switch = React.forwardRef<
React.ComponentRef<typeof SwitchPrimitives.Root>,
React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>

> (({ className, disabled, ...rest }, forwardedRef) => {
> return (

    <SwitchPrimitives.Root
      className={cn(
        'group/switch block h-5 w-8 shrink-0 p-0.5 outline-none focus:outline-none',
        className,
      )}
      ref={forwardedRef}
      disabled={disabled}
      {...rest}
    >
      <div
        className={cn(
          // base
          'h-4 w-7 rounded-full bg-bg-soft-200 p-0.5 outline-none',
          'transition duration-200 ease-out',
          !disabled && [
            // hover
            'group-hover/switch:bg-bg-sub-300',
            // focus
            'group-focus-visible/switch:bg-bg-sub-300',
            // pressed
            'group-active/switch:bg-bg-soft-200',
            // checked
            'group-data-[state=checked]/switch:bg-primary-base',
            // checked hover
            'group-hover:data-[state=checked]/switch:bg-primary-darker',
            // checked pressed
            'group-active:data-[state=checked]/switch:bg-primary-base',
            // focus
            'group-focus/switch:outline-none',
          ],
          // disabled
          disabled && [
            'bg-bg-white-0 p-[3px] ring-1 ring-inset ring-stroke-soft-200',
          ],
        )}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            // base
            'pointer-events-none relative block size-3',
            'transition-transform duration-200 ease-out',
            // checked
            'data-[state=checked]:translate-x-3',
            !disabled && [
              // before
              'before:absolute before:inset-y-0 before:left-1/2 before:w-3 before:-translate-x-1/2 before:rounded-full before:bg-static-white',
              'before:[mask:--mask]',
              // after
              'after:absolute after:inset-y-0 after:left-1/2 after:w-3 after:-translate-x-1/2 after:rounded-full after:shadow-switch-thumb',
              // pressed
              'group-active/switch:scale-[.833]',
            ],
            // disabled,
            disabled && ['size-2.5 rounded-full bg-bg-soft-200 shadow-none'],
          )}
          style={{
            ['--mask' as any]:
              'radial-gradient(circle farthest-side at 50% 50%, #0000 1.95px, #000 2.05px 100%) 50% 50%/100% 100% no-repeat',
          }}
        />
      </div>
    </SwitchPrimitives.Root>

);
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch as Root };
Update the import paths to match your project setup.
Examples
Disabled
Preview
Code
Copy

With Label
Preview
Code
Copy

SMS Verification

Authenticator App

Disabled

Disabled but default checked
With Advanced Label
Preview
Code
Copy

Label
(Sublabel)
NEW

Label
(Sublabel)
NEW

Label
(Sublabel)
NEW
Insert the Switch description here.
Link Button

Label
(Sublabel)
NEW
Insert the Switch description here.
Link Button
Label
(Sublabel)
NEW

Label
(Sublabel)
NEW

Label
(Sublabel)
NEW
Insert the Switch description here.
Link Button

Label
(Sublabel)
NEW
Insert the Switch description here.
Link Button

API Reference
This component is based on the Radix UI Switch primitives. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Disabled
With Label
With Advanced Label
API Reference
Switch | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Textarea
Renders a textarea with custom resize handle and character length display.

Preview
Code
Copy
78/200
Installation
Create a textarea.tsx file and paste the following code into it.
/components/ui/textarea.tsx

// AlignUI Textarea v0.0.0

import \* as React from 'react';

import { cn } from '@/utils/cn';

const TEXTAREA_ROOT_NAME = 'TextareaRoot';
const TEXTAREA_NAME = 'Textarea';
const TEXTAREA_RESIZE_HANDLE_NAME = 'TextareaResizeHandle';
const TEXTAREA_COUNTER_NAME = 'TextareaCounter';

const Textarea = React.forwardRef<
HTMLTextAreaElement,
React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
hasError?: boolean;
simple?: boolean;
}

> (({ className, hasError, simple, disabled, ...rest }, forwardedRef) => {
> return (

    <textarea
      className={cn(
        [
          // base
          'block w-full resize-none text-paragraph-sm text-strong-950 outline-none',
          !simple && [
            'pointer-events-auto h-full min-h-[82px] bg-transparent pl-3 pr-2.5 pt-2.5',
          ],
          simple && [
            'min-h-28 rounded-xl bg-bg-white-0 px-3 py-2.5 shadow-regular-xs',
            'ring-1 ring-inset ring-stroke-soft-200',
            'transition duration-200 ease-out',
            // hover
            'hover:[&:not(:focus)]:bg-bg-weak-50',
            !hasError && [
              // hover
              'hover:[&:not(:focus)]:ring-transparent',
              // focus
              'focus:shadow-button-important-focus focus:ring-stroke-strong-950',
            ],
            hasError && [
              // base
              'ring-error-base',
              // focus
              'focus:shadow-button-error-focus focus:ring-error-base',
            ],
            disabled && ['bg-bg-weak-50 ring-transparent'],
          ],
          !disabled && [
            // placeholder
            'placeholder:select-none placeholder:text-soft-400 placeholder:transition placeholder:duration-200 placeholder:ease-out',
            // hover placeholder
            'group-hover/textarea:placeholder:text-sub-600',
            // focus
            'focus:outline-none',
            // focus placeholder
            'focus:placeholder:text-sub-600',
          ],
          disabled && [
            // disabled
            'text-disabled-300 placeholder:text-disabled-300',
          ],
        ],
        className,
      )}
      ref={forwardedRef}
      disabled={disabled}
      {...rest}
    />

);
});
Textarea.displayName = TEXTAREA_NAME;

function ResizeHandle() {
return (

<div className='pointer-events-none size-3 cursor-s-resize'>
<svg
        width='12'
        height='12'
        viewBox='0 0 12 12'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
<path
          d='M9.11111 2L2 9.11111M10 6.44444L6.44444 10'
          className='stroke-text-soft-400'
        />
</svg>
</div>
);
}
ResizeHandle.displayName = TEXTAREA_RESIZE_HANDLE_NAME;

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
(
| {
simple: true;
children?: never;
containerClassName?: never;
hasError?: boolean;
}
| {
simple?: false;
children?: React.ReactNode;
containerClassName?: string;
hasError?: boolean;
}
);

const TextareaRoot = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
(
{ containerClassName, children, hasError, simple, ...rest },
forwardedRef,
) => {
if (simple) {
return (
<Textarea ref={forwardedRef} simple hasError={hasError} {...rest} />
);
}

    return (
      <div
        className={cn(
          [
            // base
            'group/textarea relative flex w-full flex-col rounded-xl bg-bg-white-0 pb-2.5 shadow-regular-xs',
            'ring-1 ring-inset ring-stroke-soft-200',
            'transition duration-200 ease-out',
            // hover
            'hover:[&:not(:focus-within)]:bg-bg-weak-50',
            // disabled
            'has-[[disabled]]:pointer-events-none has-[[disabled]]:bg-bg-weak-50 has-[[disabled]]:ring-transparent',
          ],
          !hasError && [
            // hover
            'hover:[&:not(:focus-within)]:ring-transparent',
            // focus
            'focus-within:shadow-button-important-focus focus-within:ring-stroke-strong-950',
          ],
          hasError && [
            // base
            'ring-error-base',
            // focus
            'focus-within:shadow-button-error-focus focus-within:ring-error-base',
          ],
          containerClassName,
        )}
      >
        <div className='grid'>
          <div className='pointer-events-none relative z-10 flex flex-col gap-2 [grid-area:1/1]'>
            <Textarea ref={forwardedRef} hasError={hasError} {...rest} />
            <div className='pointer-events-none flex items-center justify-end gap-1.5 pl-3 pr-2.5'>
              {children}
              <ResizeHandle />
            </div>
          </div>
          <div className='min-h-full resize-y overflow-hidden opacity-0 [grid-area:1/1]' />
        </div>
      </div>
    );

},
);
TextareaRoot.displayName = TEXTAREA_ROOT_NAME;

function CharCounter({
current,
max,
className,
}: {
current?: number;
max?: number;
} & React.HTMLAttributes<HTMLSpanElement>) {
if (current === undefined || max === undefined) return null;

const isError = current > max;

return (
<span
className={cn(
'text-subheading-2xs text-soft-400',
// disabled
'group-has-[[disabled]]/textarea:text-disabled-300',
{
'text-error-base': isError,
},
className,
)} >
{current}/{max}
</span>
);
}
CharCounter.displayName = TEXTAREA_COUNTER_NAME;

export { TextareaRoot as Root, CharCounter };
Update the import paths to match your project setup.
Examples
Interactive Char Counter
Preview
Code
Copy
0/200
Has Error
Preview
Code
Copy
78/200
With Label and Hint
Preview
Code
Copy
Enter Your Message

- (Optional)
  78/200
  This is a hint text to help user.
  Disabled
  Preview
  Code
  Copy
  Jot down your thoughts...
  78/200
  Simple
  A single textarea element without a custom resize handle or character counter.

Preview
Code
Copy
Simple: Resizable
Simple textarea with built-in resize handle.

Preview
Code
Copy
Simple: hasError
Simple textarea with error styles.

Preview
Code
Copy
Simple: Disabled
Simple textarea with disabled styles.

Preview
Code
Copy
Jot down your thoughts...
API Reference
Textarea.Root
This component is based on the <textarea> element and supports all of its props. And adds:

Prop Type Default
simple

boolean
hasError

boolean
containerClassName

string
containerClassName

never
children

React.ReactNode
children

never
Textarea.CharCounter
Displays the current and maximum number of characters in a textarea.

This component is based on the <span> element and supports all of its props. And adds:

Prop Type Default
current

number
max

number
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Interactive Char Counter
Has Error
With Label and Hint
Disabled
Simple
Simple: Resizable
Simple: hasError
Simple: Disabled
API Reference
Textarea.Root
Textarea.CharCounter
Textarea | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Badge
A badge is a piece of text that is visually stylized to differentiate it as contextual metadata. It can be used to add a status, category, or other metadata to a design.

@radix-ui/react-slot
Preview
Code
Copy
Badge
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a badge.tsx file and paste the following code into it.
/components/ui/badge.tsx

// AlignUI Badge v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import type { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const BADGE_ROOT_NAME = 'BadgeRoot';
const BADGE_ICON_NAME = 'BadgeIcon';
const BADGE_DOT_NAME = 'BadgeDot';

export const badgeVariants = tv({
slots: {
root: 'inline-flex items-center justify-center rounded-full leading-none transition duration-200 ease-out',
icon: 'shrink-0',
dot: [
// base
'dot',
'flex items-center justify-center',
// before
'before:size-1 before:rounded-full before:bg-current',
],
},
variants: {
size: {
small: {
root: 'h-4 gap-1.5 px-2 text-subheading-2xs uppercase has-[>.dot]:gap-2',
icon: '-mx-1 size-3',
dot: '-mx-2 size-4',
},
medium: {
root: 'h-5 gap-1.5 px-2 text-label-xs',
icon: '-mx-1 size-4',
dot: '-mx-1.5 size-4',
},
},
variant: {
filled: {
root: 'text-static-white',
},
light: {},
lighter: {},
stroke: {
root: 'ring-1 ring-inset ring-current',
},
},
color: {
gray: {},
blue: {},
orange: {},
red: {},
green: {},
yellow: {},
purple: {},
sky: {},
pink: {},
teal: {},
},
disabled: {
true: {
root: 'pointer-events-none',
},
},
square: {
true: {},
},
},
compoundVariants: [
//#region variant=filled
{
variant: 'filled',
color: 'gray',
class: {
root: 'bg-faded-base',
},
},
{
variant: 'filled',
color: 'blue',
class: {
root: 'bg-information-base',
},
},
{
variant: 'filled',
color: 'orange',
class: {
root: 'bg-warning-base',
},
},
{
variant: 'filled',
color: 'red',
class: {
root: 'bg-error-base',
},
},
{
variant: 'filled',
color: 'green',
class: {
root: 'bg-success-base',
},
},
{
variant: 'filled',
color: 'yellow',
class: {
root: 'bg-away-base',
},
},
{
variant: 'filled',
color: 'purple',
class: {
root: 'bg-feature-base',
},
},
{
variant: 'filled',
color: 'sky',
class: {
root: 'bg-verified-base',
},
},
{
variant: 'filled',
color: 'pink',
class: {
root: 'bg-highlighted-base',
},
},
{
variant: 'filled',
color: 'teal',
class: {
root: 'bg-stable-base',
},
},
// #endregion

    //#region variant=light
    {
      variant: 'light',
      color: 'gray',
      class: {
        root: 'bg-faded-light text-faded-dark',
      },
    },
    {
      variant: 'light',
      color: 'blue',
      class: {
        root: 'bg-information-light text-information-dark',
      },
    },
    {
      variant: 'light',
      color: 'orange',
      class: {
        root: 'bg-warning-light text-warning-dark',
      },
    },
    {
      variant: 'light',
      color: 'red',
      class: {
        root: 'bg-error-light text-error-dark',
      },
    },
    {
      variant: 'light',
      color: 'green',
      class: {
        root: 'bg-success-light text-success-dark',
      },
    },
    {
      variant: 'light',
      color: 'yellow',
      class: {
        root: 'bg-away-light text-away-dark',
      },
    },
    {
      variant: 'light',
      color: 'purple',
      class: {
        root: 'bg-feature-light text-feature-dark',
      },
    },
    {
      variant: 'light',
      color: 'sky',
      class: {
        root: 'bg-verified-light text-verified-dark',
      },
    },
    {
      variant: 'light',
      color: 'pink',
      class: {
        root: 'bg-highlighted-light text-highlighted-dark',
      },
    },
    {
      variant: 'light',
      color: 'teal',
      class: {
        root: 'bg-stable-light text-stable-dark',
      },
    },
    //#endregion

    //#region variant=lighter
    {
      variant: 'lighter',
      color: 'gray',
      class: {
        root: 'bg-faded-lighter text-faded-base',
      },
    },
    {
      variant: 'lighter',
      color: 'blue',
      class: {
        root: 'bg-information-lighter text-information-base',
      },
    },
    {
      variant: 'lighter',
      color: 'orange',
      class: {
        root: 'bg-warning-lighter text-warning-base',
      },
    },
    {
      variant: 'lighter',
      color: 'red',
      class: {
        root: 'bg-error-lighter text-error-base',
      },
    },
    {
      variant: 'lighter',
      color: 'green',
      class: {
        root: 'bg-success-lighter text-success-base',
      },
    },
    {
      variant: 'lighter',
      color: 'yellow',
      class: {
        root: 'bg-away-lighter text-away-base',
      },
    },
    {
      variant: 'lighter',
      color: 'purple',
      class: {
        root: 'bg-feature-lighter text-feature-base',
      },
    },
    {
      variant: 'lighter',
      color: 'sky',
      class: {
        root: 'bg-verified-lighter text-verified-base',
      },
    },
    {
      variant: 'lighter',
      color: 'pink',
      class: {
        root: 'bg-highlighted-lighter text-highlighted-base',
      },
    },
    {
      variant: 'lighter',
      color: 'teal',
      class: {
        root: 'bg-stable-lighter text-stable-base',
      },
    },
    //#endregion

    //#region variant=stroke
    {
      variant: 'stroke',
      color: 'gray',
      class: {
        root: 'text-faded-base',
      },
    },
    {
      variant: 'stroke',
      color: 'blue',
      class: {
        root: 'text-information-base',
      },
    },
    {
      variant: 'stroke',
      color: 'orange',
      class: {
        root: 'text-warning-base',
      },
    },
    {
      variant: 'stroke',
      color: 'red',
      class: {
        root: 'text-error-base',
      },
    },
    {
      variant: 'stroke',
      color: 'green',
      class: {
        root: 'text-success-base',
      },
    },
    {
      variant: 'stroke',
      color: 'yellow',
      class: {
        root: 'text-away-base',
      },
    },
    {
      variant: 'stroke',
      color: 'purple',
      class: {
        root: 'text-feature-base',
      },
    },
    {
      variant: 'stroke',
      color: 'sky',
      class: {
        root: 'text-verified-base',
      },
    },
    {
      variant: 'stroke',
      color: 'pink',
      class: {
        root: 'text-highlighted-base',
      },
    },
    {
      variant: 'stroke',
      color: 'teal',
      class: {
        root: 'text-stable-base',
      },
    },
    //#endregion

    //#region square
    {
      size: 'small',
      square: true,
      class: {
        root: 'min-w-4 px-1',
      },
    },
    {
      size: 'medium',
      square: true,
      class: {
        root: 'min-w-5 px-1',
      },
    },
    //#endregion

    //#region disabled
    {
      disabled: true,
      variant: ['stroke', 'filled', 'light', 'lighter'],
      color: [
        'red',
        'gray',
        'blue',
        'orange',
        'green',
        'yellow',
        'purple',
        'sky',
        'pink',
        'teal',
      ],
      class: {
        root: [
          'ring-1 ring-inset ring-stroke-soft-200',
          'bg-transparent text-disabled-300',
        ],
      },
    },
    //#endregion

],
defaultVariants: {
variant: 'filled',
size: 'small',
color: 'gray',
},
});

type BadgeSharedProps = VariantProps<typeof badgeVariants>;

type BadgeRootProps = VariantProps<typeof badgeVariants> &
React.HTMLAttributes<HTMLDivElement> & {
asChild?: boolean;
};

const BadgeRoot = React.forwardRef<HTMLDivElement, BadgeRootProps>(
(
{
asChild,
size,
variant,
color,
disabled,
square,
children,
className,
...rest
},
forwardedRef,
) => {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'div';
const { root } = badgeVariants({ size, variant, color, disabled, square });

    const sharedProps: BadgeSharedProps = {
      size,
      variant,
      color,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [BADGE_ICON_NAME, BADGE_DOT_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );

},
);
BadgeRoot.displayName = BADGE_ROOT_NAME;

function BadgeIcon<T extends React.ElementType>({
className,
size,
variant,
color,
as,
...rest
}: PolymorphicComponentProps<T, BadgeSharedProps>) {
const Component = as || 'div';
const { icon } = badgeVariants({ size, variant, color });

return <Component className={icon({ class: className })} {...rest} />;
}
BadgeIcon.displayName = BADGE_ICON_NAME;

type BadgeDotProps = BadgeSharedProps &
Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>;

function BadgeDot({ size, variant, color, className, ...rest }: BadgeDotProps) {
const { dot } = badgeVariants({ size, variant, color });

return <div className={dot({ class: className })} {...rest} />;
}
BadgeDot.displayName = BADGE_DOT_NAME;

export { BadgeRoot as Root, BadgeIcon as Icon, BadgeDot as Dot };
Update the import paths to match your project setup.
Examples
Filled (Default)
Preview
Code
Copy
Badge
Badge
Badge
Badge
Badge
Light
Preview
Code
Copy
Badge
Badge
Badge
Badge
Badge
Lighter
Preview
Code
Copy
Badge
Badge
Badge
Badge
Badge
Stroke
Preview
Code
Copy
Badge
Badge
Badge
Badge
Badge
Colors
Preview
Code
Copy
Badge
Badge
Badge
Badge
Badge
Badge
Badge
Badge
Badge
Badge
Size
Preview
Code
Copy
Badge
Badge
Badge
Badge
Square
Suitable to display numbers.

Preview
Code
Copy
2
5
66
789
2
5
66
789
With Icon
Preview
Code
Copy
Badge
Badge
With Dot
Preview
Code
Copy
Badge
Badge
Disabled
Preview
Code
Copy
Badge
Badge
Badge
Badge
asChild
Preview
Code
Copy
Badge
API Reference
Badge.Root
This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
variant

"filled"
|
"light"
|
"lighter"
|
"stroke"
"filled"
size

"small"
|
"medium"
"small"
color

"gray"
|
"blue"
|
"orange"
|
"red"
|
"green"
|
"yellow"
|
"purple"
|
"sky"
|
"pink"
|
"teal"
"gray"
square

boolean
asChild

boolean
Badge.Icon
The Badge.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
Badge.Dot
This component is based on the <div> element and supports all of its props. It provides a styled dot appearance and does not have any extra props.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Filled (Default)
Light
Lighter
Stroke
Colors
Size
Square
With Icon
With Dot
Disabled
asChild
API Reference
Badge.Root
Badge.Icon
Badge.Dot
Badge | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Status Badge
Allows you to visually highlight statuses or conditions within a confined screen space.

@radix-ui/react-slot
Preview
Code
Copy
Badge
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a status-badge.tsx file and paste the following code into it.
/components/ui/status-badge.tsx

// AlignUI StatusBadge v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import type { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const STATUS_BADGE_ROOT_NAME = 'StatusBadgeRoot';
const STATUS_BADGE_ICON_NAME = 'StatusBadgeIcon';
const STATUS_BADGE_DOT_NAME = 'StatusBadgeDot';

export const statusBadgeVariants = tv({
slots: {
root: [
'inline-flex h-6 items-center justify-center gap-2 whitespace-nowrap rounded-md px-2 text-label-xs',
'has-[>.dot]:gap-1.5',
],
icon: '-mx-1 size-4',
dot: [
// base
'dot -mx-1 flex size-4 items-center justify-center',
// before
'before:size-1.5 before:rounded-full before:bg-current',
],
},
variants: {
variant: {
stroke: {
root: 'bg-bg-white-0 text-sub-600 ring-1 ring-inset ring-stroke-soft-200',
},
light: {},
},
status: {
completed: {
icon: 'text-success-base',
dot: 'text-success-base',
},
pending: {
icon: 'text-warning-base',
dot: 'text-warning-base',
},
failed: {
icon: 'text-error-base',
dot: 'text-error-base',
},
disabled: {
icon: 'text-faded-base',
dot: 'text-faded-base',
},
},
},
compoundVariants: [
{
variant: 'light',
status: 'completed',
class: {
root: 'bg-success-lighter text-success-base',
},
},
{
variant: 'light',
status: 'pending',
class: {
root: 'bg-warning-lighter text-warning-base',
},
},
{
variant: 'light',
status: 'failed',
class: {
root: 'bg-error-lighter text-error-base',
},
},
{
variant: 'light',
status: 'disabled',
class: {
root: 'bg-faded-lighter text-sub-600',
},
},
],
defaultVariants: {
status: 'disabled',
variant: 'stroke',
},
});

type StatusBadgeSharedProps = VariantProps<typeof statusBadgeVariants>;

type StatusBadgeRootProps = React.HTMLAttributes<HTMLDivElement> &
VariantProps<typeof statusBadgeVariants> & {
asChild?: boolean;
};

const StatusBadgeRoot = React.forwardRef<HTMLDivElement, StatusBadgeRootProps>(
(
{ asChild, children, variant, status, className, ...rest },
forwardedRef,
) => {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'div';
const { root } = statusBadgeVariants({ variant, status });

    const sharedProps: StatusBadgeSharedProps = {
      variant,
      status,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [STATUS_BADGE_ICON_NAME, STATUS_BADGE_DOT_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );

},
);
StatusBadgeRoot.displayName = STATUS_BADGE_ROOT_NAME;

function StatusBadgeIcon<T extends React.ElementType = 'div'>({
variant,
status,
className,
as,
}: PolymorphicComponentProps<T, StatusBadgeSharedProps>) {
const Component = as || 'div';
const { icon } = statusBadgeVariants({ variant, status });

return <Component className={icon({ class: className })} />;
}
StatusBadgeIcon.displayName = STATUS_BADGE_ICON_NAME;

function StatusBadgeDot({
variant,
status,
className,
...rest
}: StatusBadgeSharedProps & React.HTMLAttributes<HTMLDivElement>) {
const { dot } = statusBadgeVariants({ variant, status });

return <div className={dot({ class: className })} {...rest} />;
}
StatusBadgeDot.displayName = STATUS_BADGE_DOT_NAME;

export {
StatusBadgeRoot as Root,
StatusBadgeIcon as Icon,
StatusBadgeDot as Dot,
};
Update the import paths to match your project setup.
Examples
Disabled (Default)
Preview
Code
Copy
Badge
Badge
Badge
Badge
Completed
Preview
Code
Copy
Badge
Badge
Badge
Badge
Failed
Preview
Code
Copy
Badge
Badge
Badge
Badge
Pending
Preview
Code
Copy
Badge
Badge
Badge
Badge
asChild
Preview
Code
Copy
Badge
API Reference
StatusBadge.Root
This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
variant

"stroke"
|
"light"
"stroke"
status

"completed"
|
"pending"
|
"failed"
|
"disabled"
"disabled"
asChild

boolean
StatusBadge.Icon
The StatusBadge.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
StatusBadge.Dot
This component is based on the <div> element and supports all of its props. It provides a styled dot appearance and does not have any extra props.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Disabled (Default)
Completed
Failed
Pending
asChild
API Reference
StatusBadge.Root
StatusBadge.Icon
StatusBadge.Dot
Status Badge | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Color Picker
Choose or create specific colors with this versatile tool for various design needs.

react-aria-components
Preview
Code
Copy

HSL

228°
100%
60%
100%
Recommended Colors
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install react-aria-components
Create a color-picker.tsx file and paste the following code into it.
/components/ui/color-picker.tsx

'use client';

import \* as React from 'react';
import {
ColorArea as AriaColorArea,
ColorAreaProps as AriaColorAreaProps,
ColorField as AriaColorField,
ColorPicker as AriaColorPicker,
ColorSlider as AriaColorSlider,
ColorSliderProps as AriaColorSliderProps,
ColorSwatch as AriaColorSwatch,
ColorSwatchPicker as AriaColorSwatchPicker,
ColorSwatchPickerItem as AriaColorSwatchPickerItem,
ColorSwatchPickerItemProps as AriaColorSwatchPickerItemProps,
ColorSwatchPickerProps as AriaColorSwatchPickerProps,
ColorSwatchProps as AriaColorSwatchProps,
ColorThumb as AriaColorThumb,
ColorThumbProps as AriaColorThumbProps,
SliderTrack as AriaSliderTrack,
SliderTrackProps as AriaSliderTrackProps,
ColorPickerStateContext,
composeRenderProps,
parseColor,
} from 'react-aria-components';

import { cn } from '@/utils/cn';

const ColorField = AriaColorField;
const ColorPicker = AriaColorPicker;

function ColorSlider({ className, ...props }: AriaColorSliderProps) {
return (
<AriaColorSlider
className={composeRenderProps(className, (className) =>
cn('py-1', className),
)}
{...props}
/>
);
}

function ColorArea({ className, ...props }: AriaColorAreaProps) {
return (
<AriaColorArea
className={composeRenderProps(className, (className) =>
cn('h-[232px] w-full rounded-lg', className),
)}
{...props}
/>
);
}

function SliderTrack({ className, style, ...props }: AriaSliderTrackProps) {
return (
<AriaSliderTrack
className={composeRenderProps(className, (className) =>
cn('h-2 w-full rounded-full', className),
)}
style={({ defaultStyle }) => ({
...style,
background: `${defaultStyle.background},
          repeating-conic-gradient(
            #fff 0 90deg,
            rgba(0,0,0,.3) 0 180deg) 
          0% -25%/6px 6px`,
})}
{...props}
/>
);
}

function ColorThumb({ className, ...props }: AriaColorThumbProps) {
return (
<AriaColorThumb
className={composeRenderProps(className, (className) =>
cn('z-50 size-3 rounded-full ring-2 ring-stroke-white-0', className),
)}
{...props}
/>
);
}

function ColorSwatchPicker({
className,
...props
}: AriaColorSwatchPickerProps) {
return (
<AriaColorSwatchPicker
className={composeRenderProps(className, (className) =>
cn('flex w-full flex-wrap gap-1', className),
)}
{...props}
/>
);
}

function ColorSwatchPickerItem({
className,
...props
}: AriaColorSwatchPickerItemProps) {
return (
<AriaColorSwatchPickerItem
className={composeRenderProps(className, (className) =>
cn(
'group/swatch-item cursor-pointer p-1 focus:outline-none',
className,
),
)}
{...props}
/>
);
}

function ColorSwatch({ className, style, ...props }: AriaColorSwatchProps) {
return (
<AriaColorSwatch
className={composeRenderProps(className, (className) =>
cn(
'size-4 rounded-full border-stroke-white-0 group-data-[selected=true]/swatch-item:border-2 group-data-[selected=true]/swatch-item:ring-[1.5px]',
className,
),
)}
style={({ defaultStyle }) => ({
...style,
background: `${defaultStyle.background},
        repeating-conic-gradient(
          #fff 0 90deg,
          rgba(0,0,0,.3) 0 180deg) 
        0% -25%/6px 6px`,
})}
{...props}
/>
);
}

const EyeDropperButton = React.forwardRef<
HTMLButtonElement,
React.HTMLAttributes<HTMLButtonElement>

> (({ ...rest }, forwardedRef) => {
> const state = React.useContext(ColorPickerStateContext)!;

// eslint-disable-next-line
// @ts-ignore
if (typeof EyeDropper === 'undefined') {
return null;
}

return (
<button
ref={forwardedRef}
aria-label='Eye dropper'
onClick={() => {
// eslint-disable-next-line
// @ts-ignore
new EyeDropper()
.open()
.then((result: { sRGBHex: string }) =>
state.setColor(parseColor(result.sRGBHex)),
);
}}
{...rest}
/>
);
});
EyeDropperButton.displayName = 'EyeDropperButton';

export {
ColorPicker as Root,
ColorField as Field,
ColorArea as Area,
ColorSlider as Slider,
SliderTrack,
ColorThumb as Thumb,
ColorSwatchPicker as SwatchPicker,
ColorSwatchPickerItem as SwatchPickerItem,
ColorSwatch as Swatch,
EyeDropperButton,
};
Examples
With Popover
Preview
Code
Copy

Pick Color
API Reference
This component is based on the React Aria Color primitives. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Examples
With Popover
API Reference
Color Picker | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Datepicker
Enabling users to choose either a single date or a range of dates.

react-day-picker
date-fns
Preview
Code
Copy

Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install react-day-picker@8.10.1 date-fns@^3
Create a datepicker.tsx file and paste the following code into it.
/components/ui/datepicker.tsx

// AlignUI Datepicker v0.0.0

'use client';

import \* as React from 'react';
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react';
import { DayPicker } from 'react-day-picker';

import { compactButtonVariants } from '@/components/ui/compact-button';
import { cn } from '@/utils/cn';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
classNames,
showOutsideDays = true,
...rest
}: CalendarProps) {
return (
<DayPicker
showOutsideDays={showOutsideDays}
classNames={{
        multiple_months: '',
        caption_start: 'p-5',
        caption_end: 'p-5',
        months: 'flex divide-x divide-stroke-soft-200',
        month: 'space-y-2',
        caption:
          'flex justify-center items-center relative rounded-lg bg-bg-weak-50 h-9',
        caption_label: 'text-label-sm text-sub-600 select-none',
        nav: 'flex items-center',
        nav_button: compactButtonVariants({
          variant: 'white',
          size: 'large',
        }).root({ class: 'absolute' }),
        nav_button_previous: 'top-1/2 -translate-y-1/2 left-1.5',
        nav_button_next: 'top-1/2 -translate-y-1/2 right-1.5',
        table: 'w-full border-collapse',
        head_row: 'flex gap-2',
        head_cell:
          'text-soft-400 text-label-sm uppercase size-10 flex items-center justify-center text-center select-none',
        row: 'grid grid-flow-col auto-cols-auto w-full mt-2 gap-2',
        cell: cn(
          // base
          'group/cell relative size-10 shrink-0 select-none p-0',
          // range
          '[&:has(.day-range-middle)]:bg-primary-alpha-10',
          'first:[&:has([aria-selected])]:rounded-l-lg last:[&:has([aria-selected])]:rounded-r-lg',
          // first range el
          '[&:not(:has(button))+:has(.day-range-middle)]:rounded-l-lg',
          // last range el
          '[&:not(:has(+_*_button))]:rounded-r-lg',
          // hide before if next sibling not selected
          '[&:not(:has(+_*_[type=button]))]:before:hidden',
          // merged bg
          'before:absolute before:inset-y-0 before:-right-2 before:hidden before:w-2 before:bg-primary-alpha-10',
          'last:[&:has(.day-range-middle)]:before:hidden',
          // middle
          '[&:has(.day-range-middle)]:before:block',
          // start
          '[&:has(.day-range-start)]:before:block [&:has(.day-range-start)]:before:w-3',
          // end
          '[&:has(.day-range-end):not(:first-child)]:before:!block [&:has(.day-range-end)]:before:left-0 [&:has(.day-range-end)]:before:right-auto',
        ),
        day: cn(
          // base
          'flex size-10 shrink-0 items-center justify-center rounded-lg text-center text-label-sm text-sub-600 outline-none',
          'transition duration-200 ease-out',
          // hover
          'hover:bg-bg-weak-50 hover:text-strong-950',
          // selected
          'aria-[selected]:bg-primary-base aria-[selected]:text-static-white',
          // focus visible
          'focus:outline-none focus-visible:bg-bg-weak-50 focus-visible:text-strong-950',
        ),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected: 'day-selected',
        day_range_middle: 'day-range-middle !text-primary-base !bg-transparent',
        day_today: 'day-today',
        day_outside:
          'day-outside !text-disabled-300 aria-[selected]:!text-static-white',
        day_disabled: 'day-disabled !text-disabled-300',
        day_hidden: 'invisible',
        ...classNames,
      }}
components={{
        IconLeft: () => <RiArrowLeftSLine className='size-5' />,
        IconRight: () => <RiArrowRightSLine className='size-5' />,
      }}
{...rest}
/>
);
}

export { Calendar };
Update the import paths to match your project setup.
Examples
Popover
Preview
Code
Copy
Select a date
Approval
Preview
Code
Copy
Select a date
Range
Preview
Code
Copy

Select a range
API Reference
This component is based on the react-day-picker package. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Popover
Approval
Range
API Reference
Datepicker | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Command Menu
Command Menu empowers users to swiftly execute searches on any page, thereby streamlining their workflow.

cmdk
@radix-ui/react-dialog
Preview
Code
Copy
Open Command Menu
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install cmdk @radix-ui/react-dialog
This component is using with the <Modal> component. Refer to the Modal documentation for setup instructions before using this component.
Create a command-menu.tsx file and paste the following code into it.
/components/ui/command-menu.tsx

// AlignUI CommandMenu v0.0.0

'use client';

import \* as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command } from 'cmdk';

import \* as Modal from '@/components/ui/modal';
import { cn } from '@/utils/cn';
import { PolymorphicComponentProps } from '@/utils/polymorphic';
import { tv, type VariantProps } from '@/utils/tv';

const CommandDialogTitle = Modal.Title;
const CommandDialogDescription = Modal.Description;

const CommandDialog = ({
children,
className,
overlayClassName,
...rest
}: DialogProps & {
className?: string;
overlayClassName?: string;
}) => {
return (
<Modal.Root {...rest}>
<Modal.Content
overlayClassName={cn('justify-start pt-20', overlayClassName)}
showClose={false}
className={cn(
'flex max-h-full max-w-[720px] flex-col overflow-hidden rounded-2xl',
className,
)} >
<Command
className={cn(
'divide-y divide-stroke-soft-200',
'grid min-h-0 auto-cols-auto grid-flow-row',
'[&>[cmdk-label]+\*]:!border-t-0',
)} >
{children}
</Command>
</Modal.Content>
</Modal.Root>
);
};

const CommandInput = React.forwardRef<
React.ComponentRef<typeof Command.Input>,
React.ComponentPropsWithoutRef<typeof Command.Input>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <Command.Input
      ref={forwardedRef}
      className={cn(
        // base
        'w-full bg-transparent text-paragraph-sm text-strong-950 outline-none',
        'transition duration-200 ease-out',
        // placeholder
        'placeholder:[transition:inherit]',
        'placeholder:text-soft-400',
        // hover
        'group-hover/cmd-input:placeholder:text-sub-600',
        // focus
        'focus:outline-none',
        className,
      )}
      {...rest}
    />

);
});
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef<
React.ComponentRef<typeof Command.List>,
React.ComponentPropsWithoutRef<typeof Command.List>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <Command.List
      ref={forwardedRef}
      className={cn(
        'flex max-h-min min-h-0 flex-1 flex-col',
        '[&>[cmdk-list-sizer]]:divide-y [&>[cmdk-list-sizer]]:divide-stroke-soft-200',
        '[&>[cmdk-list-sizer]]:overflow-auto',
        className,
      )}
      {...rest}
    />

);
});
CommandList.displayName = 'CommandList';

const CommandGroup = React.forwardRef<
React.ComponentRef<typeof Command.Group>,
React.ComponentPropsWithoutRef<typeof Command.Group>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <Command.Group
      ref={forwardedRef}
      className={cn(
        'relative px-2 py-3',
        // heading
        '[&>[cmdk-group-heading]]:text-label-xs [&>[cmdk-group-heading]]:text-sub-600',
        '[&>[cmdk-group-heading]]:mb-2 [&>[cmdk-group-heading]]:px-3 [&>[cmdk-group-heading]]:pt-1',
        className,
      )}
      {...rest}
    />

);
});
CommandGroup.displayName = 'CommandGroup';

const commandItemVariants = tv({
base: [
'flex items-center gap-3 rounded-10 bg-bg-white-0',
'cursor-pointer text-paragraph-sm text-strong-950',
'transition duration-200 ease-out',
// hover/selected
'data-[selected=true]:bg-bg-weak-50',
],
variants: {
size: {
small: 'px-3 py-2.5',
medium: 'px-3 py-3',
},
},
defaultVariants: {
size: 'small',
},
});

type CommandItemProps = VariantProps<typeof commandItemVariants> &
React.ComponentPropsWithoutRef<typeof Command.Item>;

const CommandItem = React.forwardRef<
React.ComponentRef<typeof Command.Item>,
CommandItemProps

> (({ className, size, ...rest }, forwardedRef) => {
> return (

    <Command.Item
      ref={forwardedRef}
      className={commandItemVariants({ size, class: className })}
      {...rest}
    />

);
});
CommandItem.displayName = 'CommandItem';

function CommandItemIcon<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || 'div';

return (
<Component
className={cn('size-5 shrink-0 text-sub-600', className)}
{...rest}
/>
);
}

function CommandFooter({
className,
...rest
}: React.HTMLAttributes<HTMLDivElement>) {
return (

<div
className={cn(
'flex h-12 items-center justify-between gap-3 px-5',
className,
)}
{...rest}
/>
);
}

function CommandFooterKeyBox({
className,
...rest
}: React.HTMLAttributes<HTMLDivElement>) {
return (

<div
className={cn(
'flex size-5 shrink-0 items-center justify-center rounded bg-bg-weak-50 text-sub-600 ring-1 ring-inset ring-stroke-soft-200',
className,
)}
{...rest}
/>
);
}

export {
CommandDialog as Dialog,
CommandDialogTitle as DialogTitle,
CommandDialogDescription as DialogDescription,
CommandInput as Input,
CommandList as List,
CommandGroup as Group,
CommandItem as Item,
CommandItemIcon as ItemIcon,
CommandFooter as Footer,
CommandFooterKeyBox as FooterKeyBox,
};
Update the import paths to match your project setup.
API Reference
This component is based on the cmdk package. Refer to their documentation for the API reference.

CommandMenu.Dialog
The CommandMenu.Dialog component is based on cmdk Command primitive. Wrapped by Modal Content.

CommandMenu.Input
The CommandMenu.Input component is based on cmdk Input primitive.

CommandMenu.Group
The CommandMenu.Group component is based on cmdk Group primitive.

CommandMenu.List
The CommandMenu.List component is based on cmdk List primitive.

CommandMenu.Item
The CommandMenu.Item component is based on cmdk Item primitive. And adds:

Prop Type Default
size

"small"
|
"medium"
"small"
CommandMenu.ItemIcon
The CommandMenu.ItemIcon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
CommandMenu.Footer
A footer section for the command dialog. This component is based on the <div> element and supports all of its props.

CommandMenu.FooterKeyBox
Used within the CommandMenu.Footer to display key information or buttons. This component is based on the <div> element and supports all of its props.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
API Reference
CommandMenu.Dialog
CommandMenu.Input
CommandMenu.Group
CommandMenu.List
CommandMenu.Item
CommandMenu.ItemIcon
CommandMenu.Footer
CommandMenu.FooterKeyBox
Command Menu | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Drawer
A panel which slides out from the edge of the screen.

@radix-ui/react-dialog
Preview
Code
Copy
Open Drawer
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-dialog
Create a drawer.tsx file and paste the following code into it.
/components/ui/drawer.tsx

// AlignUI Drawer v0.0.0

'use client';

import _ as React from 'react';
import _ as DialogPrimitive from '@radix-ui/react-dialog';
import { RiCloseLine } from '@remixicon/react';

import \* as CompactButton from '@/components/ui/compact-button';
import { cn } from '@/utils/cn';

const DrawerRoot = DialogPrimitive.Root;
DrawerRoot.displayName = 'Drawer';

const DrawerTrigger = DialogPrimitive.Trigger;
DrawerTrigger.displayName = 'DrawerTrigger';

const DrawerClose = DialogPrimitive.Close;
DrawerClose.displayName = 'DrawerClose';

const DrawerPortal = DialogPrimitive.Portal;
DrawerPortal.displayName = 'DrawerPortal';

const DrawerOverlay = React.forwardRef<
React.ComponentRef<typeof DialogPrimitive.Overlay>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <DialogPrimitive.Overlay
      ref={forwardedRef}
      className={cn(
        // base
        'fixed inset-0 z-50 grid grid-cols-1 place-items-end overflow-hidden bg-overlay backdrop-blur-[10px]',
        // animation
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...rest}
    />

);
});
DrawerOverlay.displayName = 'DrawerOverlay';

const DrawerContent = React.forwardRef<
React.ComponentRef<typeof DialogPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>

> (({ className, children, ...rest }, forwardedRef) => {
> return (

    <DrawerPortal>
      <DrawerOverlay>
        <DialogPrimitive.Content
          ref={forwardedRef}
          className={cn(
            // base
            'size-full max-w-[400px] overflow-y-auto',
            'border-l border-stroke-soft-200 bg-bg-white-0',
            // animation
            'data-[state=open]:duration-200 data-[state=open]:ease-out data-[state=open]:animate-in',
            'data-[state=closed]:duration-200 data-[state=closed]:ease-in data-[state=closed]:animate-out',
            'data-[state=open]:slide-in-from-right-full',
            'data-[state=closed]:slide-out-to-right-full',
            className,
          )}
          {...rest}
        >
          <div className='relative flex size-full flex-col'>{children}</div>
        </DialogPrimitive.Content>
      </DrawerOverlay>
    </DrawerPortal>

);
});
DrawerContent.displayName = 'DrawerContent';

function DrawerHeader({
className,
children,
showCloseButton = true,
...rest
}: React.HTMLAttributes<HTMLDivElement> & {
showCloseButton?: boolean;
}) {
return (

<div
className={cn(
'flex items-center gap-3 border-stroke-soft-200 p-5',
className,
)}
{...rest} >
{children}

      {showCloseButton && (
        <DrawerClose asChild>
          <CompactButton.Root variant='ghost' size='large'>
            <CompactButton.Icon as={RiCloseLine} />
          </CompactButton.Root>
        </DrawerClose>
      )}
    </div>

);
}
DrawerHeader.displayName = 'DrawerHeader';

const DrawerTitle = React.forwardRef<
React.ComponentRef<typeof DialogPrimitive.Title>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <DialogPrimitive.Title
      ref={forwardedRef}
      className={cn('flex-1 text-label-lg text-strong-950', className)}
      {...rest}
    />

);
});
DrawerTitle.displayName = 'DrawerTitle';

function DrawerBody({
className,
children,
...rest
}: React.HTMLAttributes<HTMLDivElement>) {
return (

<div className={cn('flex-1', className)} {...rest}>
{children}
</div>
);
}
DrawerBody.displayName = 'DrawerBody';

function DrawerFooter({
className,
...rest
}: React.HTMLAttributes<HTMLDivElement>) {
return (

<div
className={cn(
'flex items-center gap-4 border-stroke-soft-200 p-5',
className,
)}
{...rest}
/>
);
}
DrawerFooter.displayName = 'DrawerFooter';

export {
DrawerRoot as Root,
DrawerTrigger as Trigger,
DrawerClose as Close,
DrawerContent as Content,
DrawerHeader as Header,
DrawerTitle as Title,
DrawerBody as Body,
DrawerFooter as Footer,
};
Check the import paths to ensure they match your project setup.
Examples
Basic
Preview
Code
Copy
Open Drawer
API Reference
This component is based on the Radix UI Dialog primitives. Refer to their documentation for the API reference.

Drawer.Root
This component is based on the Dialog.Root primitive.

Drawer.Trigger
This component is based on the Dialog.Trigger primitive.

Drawer.Close
This component is based on the Dialog.Close primitive.

Drawer.Content
This component is based on the Dialog.Content primitive. Wrapped by Portal and Overlay.

Drawer.Header
This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
showCloseButton

boolean
true
Drawer.Title
This component is based on the Dialog.Title primitive.

Drawer.Body
This component is based on the <div> element and supports all of its props.

Drawer.Footer
This component is based on the <div> element and supports all of its props.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Basic
API Reference
Drawer.Root
Drawer.Trigger
Drawer.Close
Drawer.Content
Drawer.Header
Drawer.Title
Drawer.Body
Drawer.Footer
Drawer | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Dropdown
Displays a menu to the user—such as a set of actions or functions—triggered by a button.

@radix-ui/react-dropdown-menu
Preview
Code
Copy
Open Dropdown
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-dropdown-menu
Create a dropdown.tsx file and paste the following code into it.
/components/ui/dropdown.tsx

// AlignUI Dropdown v0.0.0

'use client';

import _ as React from 'react';
import _ as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { RiArrowRightSLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import { PolymorphicComponentProps } from '@/utils/polymorphic';

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuCheckboxItem = DropdownMenuPrimitive.CheckboxItem;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
const DropdownMenuRadioItem = DropdownMenuPrimitive.RadioItem;
const DropdownMenuSeparator = DropdownMenuPrimitive.Separator;
const DropdownMenuArrow = DropdownMenuPrimitive.Arrow;

const DropdownMenuContent = React.forwardRef<
React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>

> (({ className, sideOffset = 8, ...rest }, forwardedRef) => (
> <DropdownMenuPrimitive.Portal>

    <DropdownMenuPrimitive.Content
      ref={forwardedRef}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-[300px] overflow-hidden rounded-2xl bg-bg-white-0 p-2 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200',
        'flex flex-col gap-1',
        // origin
        'data-[side=bottom]:origin-top data-[side=left]:origin-right data-[side=right]:origin-left data-[side=top]:origin-bottom',
        // animation
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...rest}
    />

</DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

const DropdownMenuItem = React.forwardRef<
React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
inset?: boolean;
}

> (({ className, inset, ...rest }, forwardedRef) => (
> <DropdownMenuPrimitive.Item

    ref={forwardedRef}
    className={cn(
      // base
      'group/item relative cursor-pointer select-none rounded-lg p-2 text-paragraph-sm text-strong-950 outline-none',
      'flex items-center gap-2',
      'transition duration-200 ease-out',
      // hover
      'data-[highlighted]:bg-bg-weak-50',
      // focus
      'focus:outline-none',
      // disabled
      'data-[disabled]:text-disabled-300',
      inset && 'pl-9',
      className,
    )}
    {...rest}

/>
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

function DropdownItemIcon<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || 'div';

return (
<Component
className={cn(
// base
'size-5 text-sub-600',
// disabled
'group-has-[[data-disabled]]:text-disabled-300',
className,
)}
{...rest}
/>
);
}
DropdownItemIcon.displayName = 'DropdownItemIcon';

const DropdownMenuGroup = React.forwardRef<
React.ComponentRef<typeof DropdownMenuPrimitive.Group>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Group>

> (({ className, ...rest }, forwardedRef) => (
> <DropdownMenuPrimitive.Group

    ref={forwardedRef}
    className={cn('flex flex-col gap-1', className)}
    {...rest}

/>
));
DropdownMenuGroup.displayName = 'DropdownMenuGroup';

const DropdownMenuLabel = React.forwardRef<
React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>

> (({ className, ...rest }, forwardedRef) => (
> <DropdownMenuPrimitive.Label

    ref={forwardedRef}
    className={cn(
      'px-2 py-1 text-subheading-xs uppercase text-soft-400',
      className,
    )}
    {...rest}

/>
));
DropdownMenuLabel.displayName = 'DropdownMenuLabel';

const DropdownMenuSubTrigger = React.forwardRef<
React.ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
inset?: boolean;
}

> (({ className, inset, children, ...rest }, forwardedRef) => (
> <DropdownMenuPrimitive.SubTrigger

    ref={forwardedRef}
    className={cn(
      // base
      'group/item relative cursor-pointer select-none rounded-lg p-2 text-paragraph-sm text-strong-950 outline-0',
      'flex items-center gap-2',
      'transition duration-200 ease-out',
      // hover
      'data-[highlighted]:bg-bg-weak-50',
      // disabled
      'data-[disabled]:text-disabled-300',
      inset && 'pl-9',
      className,
    )}
    {...rest}

>

    {children}
    <span className='flex-1' />
    <DropdownItemIcon as={RiArrowRightSLine} />

</DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

const DropdownMenuSubContent = React.forwardRef<
React.ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>

> (({ className, ...rest }, forwardedRef) => (
> <DropdownMenuPrimitive.SubContent

    ref={forwardedRef}
    className={cn(
      'z-50 w-max overflow-hidden rounded-2xl bg-bg-white-0 p-2 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200',
      'flex flex-col gap-1',
      // animation
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...rest}

/>
));
DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

export {
DropdownMenu as Root,
DropdownMenuPortal as Portal,
DropdownMenuTrigger as Trigger,
DropdownMenuContent as Content,
DropdownMenuItem as Item,
DropdownItemIcon as ItemIcon,
DropdownMenuGroup as Group,
DropdownMenuLabel as Label,
DropdownMenuSub as MenuSub,
DropdownMenuSubTrigger as MenuSubTrigger,
DropdownMenuSubContent as MenuSubContent,
DropdownMenuCheckboxItem as CheckboxItem,
DropdownMenuRadioGroup as RadioGroup,
DropdownMenuRadioItem as RadioItem,
DropdownMenuSeparator as Separator,
DropdownMenuArrow as Arrow,
};
Update the import paths to match your project setup.
Examples
Sub Menu
Preview
Code
Copy
Open
API Reference
This component is based on the Radix UI Dropdown primitives. Refer to their documentation for the API reference.

Dropdown.Item
This component is based on the Dropdown.Item primitive. And adds:

Prop Type Default
inset

boolean
Dropdown.ItemIcon
The Dropdown.ItemIcon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Sub Menu
API Reference
Dropdown.Item
Dropdown.ItemIcon
Dropdown | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Modal
Modal is a floating surface used to display transient content such as confirmation actions, selection options, and more.

@radix-ui/react-dialog
Preview
Code
Copy
Click to open
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-dialog
Create a modal.tsx file and paste the following code into it.
/components/ui/modal.tsx

// AlignUI Modal v0.0.0

import _ as React from 'react';
import _ as DialogPrimitive from '@radix-ui/react-dialog';
import { RiCloseLine, type RemixiconComponentType } from '@remixicon/react';

import \* as CompactButton from '@/components/ui/compact-button';
import { cn } from '@/utils/cn';

const ModalRoot = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;
const ModalPortal = DialogPrimitive.Portal;

const ModalOverlay = React.forwardRef<
React.ComponentRef<typeof DialogPrimitive.Overlay>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <DialogPrimitive.Overlay
      ref={forwardedRef}
      className={cn(
        // base
        'fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-overlay p-4 backdrop-blur-[10px]',
        // animation
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className,
      )}
      {...rest}
    />

);
});
ModalOverlay.displayName = 'ModalOverlay';

const ModalContent = React.forwardRef<
React.ComponentRef<typeof DialogPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
overlayClassName?: string;
showClose?: boolean;
}

> (
> (

    { className, overlayClassName, children, showClose = true, ...rest },
    forwardedRef,

) => {
return (
<ModalPortal>
<ModalOverlay className={overlayClassName}>
<DialogPrimitive.Content
ref={forwardedRef}
className={cn(
// base
'relative w-full max-w-[400px]',
'rounded-20 bg-bg-white-0 shadow-regular-md',
// focus
'focus:outline-none',
// animation
'data-[state=open]:animate-in data-[state=closed]:animate-out',
'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
className,
)}
{...rest} >
{children}
{showClose && (
<ModalClose asChild>
<CompactButton.Root
variant='ghost'
size='large'
className='absolute right-4 top-4' >
<CompactButton.Icon as={RiCloseLine} />
</CompactButton.Root>
</ModalClose>
)}
</DialogPrimitive.Content>
</ModalOverlay>
</ModalPortal>
);
},
);
ModalContent.displayName = 'ModalContent';

function ModalHeader({
className,
children,
icon: Icon,
title,
description,
...rest
}: React.HTMLAttributes<HTMLDivElement> & {
icon?: RemixiconComponentType;
title?: string;
description?: string;
}) {
return (

<div
className={cn(
'relative flex items-start gap-3.5 py-4 pl-5 pr-14 before:absolute before:inset-x-0 before:bottom-0 before:border-b before:border-stroke-soft-200',
className,
)}
{...rest} >
{children || (
<>
{Icon && (
<div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
<Icon className='size-5 text-sub-600' />
</div>
)}
{(title || description) && (
<div className='flex-1 space-y-1'>
{title && <ModalTitle>{title}</ModalTitle>}
{description && (
<ModalDescription>{description}</ModalDescription>
)}
</div>
)}
</>
)}
</div>
);
}
ModalHeader.displayName = 'ModalHeader';

const ModalTitle = React.forwardRef<
React.ComponentRef<typeof DialogPrimitive.Title>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <DialogPrimitive.Title
      ref={forwardedRef}
      className={cn('text-label-sm text-strong-950', className)}
      {...rest}
    />

);
});
ModalTitle.displayName = 'ModalTitle';

const ModalDescription = React.forwardRef<
React.ComponentRef<typeof DialogPrimitive.Description>,
React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <DialogPrimitive.Description
      ref={forwardedRef}
      className={cn('text-paragraph-xs text-sub-600', className)}
      {...rest}
    />

);
});
ModalDescription.displayName = 'ModalDescription';

function ModalBody({
className,
...rest
}: React.HTMLAttributes<HTMLDivElement>) {
return <div className={cn('p-5', className)} {...rest} />;
}
ModalBody.displayName = 'ModalBody';

function ModalFooter({
className,
...rest
}: React.HTMLAttributes<HTMLDivElement>) {
return (

<div
className={cn(
'flex items-center justify-between gap-3 border-t border-stroke-soft-200 px-5 py-4',
className,
)}
{...rest}
/>
);
}

ModalFooter.displayName = 'ModalFooter';

export {
ModalRoot as Root,
ModalTrigger as Trigger,
ModalClose as Close,
ModalPortal as Portal,
ModalOverlay as Overlay,
ModalContent as Content,
ModalHeader as Header,
ModalTitle as Title,
ModalDescription as Description,
ModalBody as Body,
ModalFooter as Footer,
};
Update the import paths to match your project setup.
Examples
With Header
Preview
Code
Copy
Click to open
API Reference
This component is based on the Radix UI Dialog primitives. Refer to their documentation for the API reference.

Modal.Root
This component is based on the Dialog.Root primitive.

Modal.Trigger
This component is based on the Dialog.Trigger primitive.

Modal.Close
This component is based on the Dialog.Close primitive.

Modal.Portal
This component is based on the Dialog.Portal primitive.

Modal.Overlay
This component is based on the Dialog.Overlay primitive.

Modal.Content
This component is based on the Dialog.Content primitive. Wrapped by Portal and Overlay.

Modal.Header
Used to display the header section of a modal dialog. It accepts icon, title, description if children is not provided.

This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
icon

RemixiconComponentType
title

string
description

string
Modal.Title
This component is based on the Dialog.Title primitive.

Modal.Description
This component is based on the Dialog.Description primitive.

Modal.Body
Used for the main content area of a modal dialog.

This component is based on the <div> element and supports all of its props.

Modal.Footer
Used for the footer section of a modal dialog. It typically contains action buttons like "Save" or "Cancel."

This component is based on the <div> element and supports all of its props.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
With Header
API Reference
Modal.Root
Modal.Trigger
Modal.Close
Modal.Portal
Modal.Overlay
Modal.Content
Modal.Header
Modal.Title
Modal.Description
Modal.Body
Modal.Footer
Modal | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Popover
Popover is used to bring attention to specific user interface elements.

@radix-ui/react-popover
@radix-ui/react-slot
Preview
Code
Copy
Open Popover
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-popover @radix-ui/react-slot
Create a popover.tsx file and paste the following code into it.
/components/ui/popover.tsx

// AlignUI Popover v0.0.0

import _ as React from 'react';
import _ as PopoverPrimitive from '@radix-ui/react-popover';
import { Slottable } from '@radix-ui/react-slot';

import { cn } from '@/utils/cn';

const PopoverRoot = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
React.ComponentRef<typeof PopoverPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
showArrow?: boolean;
unstyled?: boolean;
}

> (
> (

    {
      children,
      className,
      align = 'center',
      sideOffset = 12,
      collisionPadding = 12,
      arrowPadding = 12,
      showArrow = true,
      unstyled,
      ...rest
    },
    forwardedRef,

) => (
<PopoverPrimitive.Portal>
<PopoverPrimitive.Content
ref={forwardedRef}
align={align}
sideOffset={sideOffset}
collisionPadding={collisionPadding}
arrowPadding={arrowPadding}
className={cn(
// base
[
!unstyled &&
'w-max rounded-2xl bg-bg-white-0 p-5 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200',
],
'z-50',
// animation
'data-[state=open]:animate-in data-[state=closed]:animate-out',
'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
className,
)}
{...rest} >
<Slottable>{children}</Slottable>
{showArrow && (
<PopoverPrimitive.Arrow asChild>

<div className='size-[11px] -translate-y-[calc(50%+1px)] -rotate-45 rounded-bl-[3px] border border-stroke-soft-200 bg-bg-white-0 [clip-path:polygon(0_100%,0_0,100%_100%)]'></div>
</PopoverPrimitive.Arrow>
)}
</PopoverPrimitive.Content>
</PopoverPrimitive.Portal>
),
);
PopoverContent.displayName = 'PopoverContent';

const PopoverClose = React.forwardRef<
React.ComponentRef<typeof PopoverPrimitive.Close>,
React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Close> & {
unstyled?: boolean;
}

> (({ className, unstyled, ...rest }, forwardedRef) => (
> <PopoverPrimitive.Close

    ref={forwardedRef}
    className={cn([!unstyled && 'absolute right-4 top-4'], className)}
    {...rest}

/>
));
PopoverClose.displayName = 'PopoverClose';

export {
PopoverRoot as Root,
PopoverAnchor as Anchor,
PopoverTrigger as Trigger,
PopoverContent as Content,
PopoverClose as Close,
};
Update the import paths to match your project setup.
Examples
Position
Preview
Code
Copy
Top
Left
Right
API Reference
This component is based on the Radix UI Popover primitives. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Position
API Reference
Popover | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Avatar
Avatar is an image that represents a user or organization.

@radix-ui/react-slot
Preview
Code
Copy
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a avatar.tsx file and paste the following code into it.
/components/ui/avatar.tsx

// AlignUI Avatar v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import {
IconEmptyCompany,
IconEmptyUser,
} from '@/components/ui/avatar-empty-icons';
import { cn } from '@/utils/cn';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

export const AVATAR_ROOT_NAME = 'AvatarRoot';
const AVATAR_IMAGE_NAME = 'AvatarImage';
const AVATAR_INDICATOR_NAME = 'AvatarIndicator';
const AVATAR_STATUS_NAME = 'AvatarStatus';
const AVATAR_BRAND_LOGO_NAME = 'AvatarBrandLogo';
const AVATAR_NOTIFICATION_NAME = 'AvatarNotification';

export const avatarVariants = tv({
slots: {
root: [
'relative flex shrink-0 items-center justify-center rounded-full',
'select-none text-center uppercase',
],
image: 'size-full rounded-full object-cover',
indicator:
'absolute flex size-8 items-center justify-center drop-shadow-[0_2px_4px_#1b1c1d0a]',
},
variants: {
size: {
'80': {
root: 'size-20 text-title-h5',
},
'72': {
root: 'size-[72px] text-title-h5',
},
'64': {
root: 'size-16 text-title-h5',
},
'56': {
root: 'size-14 text-label-lg',
},
'48': {
root: 'size-12 text-label-lg',
},
'40': {
root: 'size-10 text-label-md',
},
'32': {
root: 'size-8 text-label-sm',
},
'24': {
root: 'size-6 text-label-xs',
},
'20': {
root: 'size-5 text-label-xs',
},
},
color: {
gray: {
root: 'bg-bg-soft-200 text-static-black',
},
yellow: {
root: 'bg-yellow-200 text-yellow-950',
},
blue: {
root: 'bg-blue-200 text-blue-950',
},
sky: {
root: 'bg-sky-200 text-sky-950',
},
purple: {
root: 'bg-purple-200 text-purple-950',
},
red: {
root: 'bg-red-200 text-red-950',
},
},
},
compoundVariants: [
{
size: ['80', '72'],
class: {
indicator: '-right-2',
},
},
{
size: '64',
class: {
indicator: '-right-2 scale-[.875]',
},
},
{
size: '56',
class: {
indicator: '-right-1.5 scale-75',
},
},
{
size: '48',
class: {
indicator: '-right-1.5 scale-[.625]',
},
},
{
size: '40',
class: {
indicator: '-right-1.5 scale-[.5625]',
},
},
{
size: '32',
class: {
indicator: '-right-1.5 scale-50',
},
},
{
size: '24',
class: {
indicator: '-right-1 scale-[.375]',
},
},
{
size: '20',
class: {
indicator: '-right-1 scale-[.3125]',
},
},
],
defaultVariants: {
size: '80',
color: 'gray',
},
});

type AvatarSharedProps = VariantProps<typeof avatarVariants>;

export type AvatarRootProps = VariantProps<typeof avatarVariants> &
React.HTMLAttributes<HTMLDivElement> & {
asChild?: boolean;
placeholderType?: 'user' | 'company';
};

const AvatarRoot = React.forwardRef<HTMLDivElement, AvatarRootProps>(
(
{
asChild,
children,
size,
color,
className,
placeholderType = 'user',
...rest
},
forwardedRef,
) => {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'div';
const { root } = avatarVariants({ size, color });

    const sharedProps: AvatarSharedProps = {
      size,
      color,
    };

    // use placeholder icon if no children provided
    if (!children) {
      return (
        <div className={root({ class: className })} {...rest}>
          <AvatarImage asChild>
            {placeholderType === 'company' ? (
              <IconEmptyCompany />
            ) : (
              <IconEmptyUser />
            )}
          </AvatarImage>
        </div>
      );
    }

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [AVATAR_IMAGE_NAME, AVATAR_INDICATOR_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );

},
);
AvatarRoot.displayName = AVATAR_ROOT_NAME;

type AvatarImageProps = AvatarSharedProps &
Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'color'> & {
asChild?: boolean;
};

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
({ asChild, className, size, color, ...rest }, forwardedRef) => {
const Component = asChild ? Slot : 'img';
const { image } = avatarVariants({ size, color });

    return (
      <Component
        ref={forwardedRef}
        className={image({ class: className })}
        {...rest}
      />
    );

},
);
AvatarImage.displayName = AVATAR_IMAGE_NAME;

function AvatarIndicator({
size,
color,
className,
position = 'bottom',
...rest
}: AvatarSharedProps &
React.HTMLAttributes<HTMLDivElement> & {
position?: 'top' | 'bottom';
}) {
const { indicator } = avatarVariants({ size, color });

return (

<div
className={cn(indicator({ class: className }), {
'top-0 origin-top-right': position === 'top',
'bottom-0 origin-bottom-right': position === 'bottom',
})}
{...rest}
/>
);
}
AvatarIndicator.displayName = AVATAR_INDICATOR_NAME;

export const avatarStatusVariants = tv({
base: 'box-content size-3 rounded-full border-4 border-bg-white-0',
variants: {
status: {
online: 'bg-success-base',
offline: 'bg-faded-base',
busy: 'bg-error-base',
away: 'bg-away-base',
},
},
defaultVariants: {
status: 'online',
},
});

function AvatarStatus({
status,
className,
...rest
}: VariantProps<typeof avatarStatusVariants> &
React.HTMLAttributes<HTMLDivElement>) {
return (

<div
className={avatarStatusVariants({ status, class: className })}
{...rest}
/>
);
}
AvatarStatus.displayName = AVATAR_STATUS_NAME;

type AvatarBrandLogoProps = React.ImgHTMLAttributes<HTMLImageElement> & {
asChild?: boolean;
};

const AvatarBrandLogo = React.forwardRef<
HTMLImageElement,
AvatarBrandLogoProps

> (({ asChild, className, ...rest }, forwardedRef) => {
> const Component = asChild ? Slot : 'img';

return (
<Component
ref={forwardedRef}
className={cn(
'box-content size-6 rounded-full border-2 border-bg-white-0',
className,
)}
{...rest}
/>
);
});
AvatarBrandLogo.displayName = AVATAR_BRAND_LOGO_NAME;

function AvatarNotification({
className,
...rest
}: React.HTMLAttributes<HTMLDivElement>) {
return (

<div
className={cn(
'box-content size-3 rounded-full border-2 border-bg-white-0 bg-error-base',
className,
)}
{...rest}
/>
);
}
AvatarNotification.displayName = AVATAR_NOTIFICATION_NAME;

export {
AvatarRoot as Root,
AvatarImage as Image,
AvatarIndicator as Indicator,
AvatarStatus as Status,
AvatarBrandLogo as BrandLogo,
AvatarNotification as Notification,
};
Create a avatar-empty-icons.tsx file and paste the following code into it.
/components/ui/avatar-empty-icons.tsx

// AlignUI Avatar Empty Icons v0.0.0

'use client';

import \* as React from 'react';

export function IconEmptyUser(props: React.SVGProps<SVGSVGElement>) {
const clipPathId = React.useId();

return (
<svg
xmlns='http://www.w3.org/2000/svg'
fill='none'
viewBox='0 0 80 80'
{...props} >
<g fill='#fff' clipPath={`url(#${clipPathId})`}>
<ellipse cx={40} cy={78} fillOpacity={0.72} rx={32} ry={24} />
<circle cx={40} cy={32} r={16} opacity={0.9} />
</g>
<defs>
<clipPath id={clipPathId}>
<rect width={80} height={80} fill='#fff' rx={40} />
</clipPath>
</defs>
</svg>
);
}

export function IconEmptyCompany(props: React.SVGProps<SVGSVGElement>) {
const clipPathId = React.useId();
const filterId1 = React.useId();
const filterId2 = React.useId();

return (
<svg
xmlns='http://www.w3.org/2000/svg'
width={56}
height={56}
fill='none'
viewBox='0 0 56 56'
{...props} >
<g clipPath={`url(#${clipPathId})`}>
<rect width={56} height={56} className='fill-bg-soft-200' rx={28} />
<path className='fill-bg-soft-200' d='M0 0h56v56H0z' />
<g filter={`url(#${filterId1})`} opacity={0.48}>
<path
            fill='#fff'
            d='M7 24.9a2.8 2.8 0 012.8-2.8h21a2.8 2.8 0 012.8 2.8v49a2.8 2.8 0 01-2.8 2.8h-21A2.8 2.8 0 017 73.9v-49z'
          />
</g>
<path
          className='fill-bg-soft-200'
          d='M12.6 28.7a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2z'
        />
<g filter={`url(#${filterId2})`}>
<path
            fill='#fff'
            fillOpacity={0.8}
            d='M21 14a2.8 2.8 0 012.8-2.8h21a2.8 2.8 0 012.8 2.8v49a2.8 2.8 0 01-2.8 2.8h-21A2.8 2.8 0 0121 63V14z'
          />
</g>
<path
          className='fill-bg-soft-200'
          d='M26.6 17.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7V22a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm9.8-29.4a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7V22a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2zm0 9.8a.7.7 0 01.7-.7h4.2a.7.7 0 01.7.7v4.2a.7.7 0 01-.7.7h-4.2a.7.7 0 01-.7-.7v-4.2z'
        />
</g>
<defs>
<filter
          id={filterId1}
          width={34.6}
          height={62.6}
          x={3}
          y={18.1}
          colorInterpolationFilters='sRGB'
          filterUnits='userSpaceOnUse'
        >
<feFlood floodOpacity={0} result='BackgroundImageFix' />
<feGaussianBlur in='BackgroundImageFix' stdDeviation={2} />
<feComposite
            in2='SourceAlpha'
            operator='in'
            result='effect1_backgroundBlur_36237_4888'
          />
<feBlend
            in='SourceGraphic'
            in2='effect1_backgroundBlur_36237_4888'
            result='shape'
          />
</filter>
<filter
          id={filterId2}
          width={42.6}
          height={70.6}
          x={13}
          y={3.2}
          colorInterpolationFilters='sRGB'
          filterUnits='userSpaceOnUse'
        >
<feFlood floodOpacity={0} result='BackgroundImageFix' />
<feGaussianBlur in='BackgroundImageFix' stdDeviation={4} />
<feComposite
            in2='SourceAlpha'
            operator='in'
            result='effect1_backgroundBlur_36237_4888'
          />
<feBlend
            in='SourceGraphic'
            in2='effect1_backgroundBlur_36237_4888'
            result='shape'
          />
<feColorMatrix
            in='SourceAlpha'
            result='hardAlpha'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          />
<feOffset dy={4} />
<feGaussianBlur stdDeviation={2} />
<feComposite in2='hardAlpha' k2={-1} k3={1} operator='arithmetic' />
<feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0' />
<feBlend in2='shape' result='effect2_innerShadow_36237_4888' />
</filter>
<clipPath id={clipPathId}>
<rect width={56} height={56} fill='#fff' rx={28} />
</clipPath>
</defs>
</svg>
);
}
Update the import paths to match your project setup.
Examples
Color
Preview
Code
Copy
Size
Preview
Code
Copy
Text Content
Preview
Code
Copy
Placeholder
Displays a placeholder icon if no children provided for <Avatar.Root>.

Preview
Code
Copy
Status
Preview
Code
Copy
Notification
Preview
Code
Copy
With Brand Logo
Preview
Code
Copy
Indicator With Custom SVG
Preview
Code
Copy
As Link
Preview
Code
Copy
As "next/image"
Preview
Code
Copy
Composition
You can simplify component usage by creating a custom API that abstracts the core functionalities.

Preview
Code
Copy
API Reference
Avatar.Root
The main wrapper for the avatar component. This component is based on the <div> element and supports all of its props and adds:

Prop Type Default
size

"80"
|
"72"
|
"64"
|
"56"
|
"48"
|
"40"
|
"32"
|
"24"
|
"20"
"80"
color

"gray"
|
"yellow"
|
"blue"
|
"sky"
|
"purple"
|
"red"
placeholderType

"user"
|
"company"
"user"
asChild

boolean
Avatar.Image
This component is based on the <img> element and supports all of its props and adds:

Prop Type Default
asChild

boolean
Avatar.BrandLogo
This component is based on the <img> element and supports all of its props and adds:

Prop Type Default
asChild

boolean
Avatar.Indicator
A wrapper for absolutely positioned indicators, often used to show status or notifications. This component is based on the <div> element and supports all of its props and adds:

Prop Type Default
position

"top"
|
"bottom"
Avatar.Status
Displays a status indicator, like online or offline status. This component is based on the <div> element and supports all of its props and adds:

Prop Type Default
status

"online"
|
"offline"
|
"busy"
|
"away"
Avatar.Notification
Displays a notification badge on the avatar. This component is based on the <div> element and supports all of its props.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Color
Size
Text Content
Placeholder
Status
Notification
With Brand Logo
Indicator With Custom SVG
As Link
As "next/image"
Composition
API Reference
Avatar.Root
Avatar.Image
Avatar.BrandLogo
Avatar.Indicator
Avatar.Status
Avatar.Notification
Avatar | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Avatar Group
Avatar group displays two or more avatars in an inline stack.

Preview
Code
Copy
+9
Installation
This component is intended to be used with the <Avatar> component. Refer to the Avatar documentation for setup instructions before using this component.
Create a avatar-group.tsx file and paste the following code into it.
/components/ui/avatar-group.tsx

// AlignUI AvatarGroup v0.0.0

import \* as React from 'react';

import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

import { AVATAR_ROOT_NAME } from './avatar';

const AVATAR_GROUP_ROOT_NAME = 'AvatarGroupRoot';
const AVATAR_GROUP_OVERFLOW_NAME = 'AvatarGroupOverflow';

export const avatarGroupVariants = tv({
slots: {
root: 'flex _:ring-2 _:ring-stroke-white-0',
overflow:
'relative flex shrink-0 items-center justify-center rounded-full bg-bg-weak-50 text-center text-sub-600',
},
variants: {
size: {
'80': {
root: '-space-x-4',
overflow: 'size-20 text-title-h5',
},
'72': {
root: '-space-x-4',
overflow: 'size-[72px] text-title-h5',
},
'64': {
root: '-space-x-4',
overflow: 'size-16 text-title-h5',
},
'56': {
root: '-space-x-4',
overflow: 'size-14 text-title-h5',
},
'48': {
root: '-space-x-3',
overflow: 'size-12 text-title-h6',
},
'40': {
root: '-space-x-3',
overflow: 'size-10 text-label-md',
},
'32': {
root: '-space-x-1.5',
overflow: 'size-8 text-label-sm',
},
'24': {
root: '-space-x-1',
overflow: 'size-6 text-label-xs',
},
'20': {
root: '-space-x-1',
overflow: 'size-5 text-subheading-2xs',
},
},
},
defaultVariants: {
size: '80',
},
});

type AvatarGroupSharedProps = VariantProps<typeof avatarGroupVariants>;

type AvatarGroupRootProps = VariantProps<typeof avatarGroupVariants> &
React.HTMLAttributes<HTMLDivElement>;

function AvatarGroupRoot({
children,
size,
className,
...rest
}: AvatarGroupRootProps) {
const uniqueId = React.useId();
const { root } = avatarGroupVariants({ size });

const sharedProps: AvatarGroupSharedProps = {
size,
};

const extendedChildren = recursiveCloneChildren(
children as React.ReactElement[],
sharedProps,
[AVATAR_ROOT_NAME, AVATAR_GROUP_OVERFLOW_NAME],
uniqueId,
);

return (

<div className={root({ class: className })} {...rest}>
{extendedChildren}
</div>
);
}
AvatarGroupRoot.displayName = AVATAR_GROUP_ROOT_NAME;

function AvatarGroupOverflow({
children,
size,
className,
...rest
}: AvatarGroupSharedProps & React.HTMLAttributes<HTMLDivElement>) {
const { overflow } = avatarGroupVariants({ size });

return (

<div className={overflow({ class: className })} {...rest}>
{children}
</div>
);
}
AvatarGroupOverflow.displayName = AVATAR_GROUP_OVERFLOW_NAME;

export { AvatarGroupRoot as Root, AvatarGroupOverflow as Overflow };
Update the import paths to match your project setup.
Examples
Size
Preview
Code
Copy
+9
+9
+9
+9
+9
+9
+9
+9
+9
API Reference
AvatarGroup.Root
This component is based on the <div> element and supports all of its props and adds:

Prop Type Default
size

"80"
|
"72"
|
"64"
|
"56"
|
"48"
|
"40"
|
"32"
|
"24"
|
"20"
"80"
AvatarGroup.Overflow
Displays an overflow indicator when the number of avatars exceeds the visible space. Typically shows a count of extra avatars not displayed. This component is based on the <div> element and supports all of its props.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Size
API Reference
AvatarGroup.Root
AvatarGroup.Overflow
Avatar Group | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Avatar Group Compact
More compact version of AvatarGroup.

Preview
Code
Copy
+9
Installation
This component is intended to be used with the <Avatar> component. Refer to the Avatar documentation for setup instructions before using this component.
Create a avatar-group-compact.tsx file and paste the following code into it.
/components/ui/avatar-group-compact.tsx

// AlignUI AvatarGroupCompact v0.0.0

import \* as React from 'react';

import { AVATAR_ROOT_NAME } from '@/components/ui/avatar';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const AVATAR_GROUP_COMPACT_ROOT_NAME = 'AvatarGroupCompactRoot';
const AVATAR_GROUP_COMPACT_STACK_NAME = 'AvatarGroupCompactStack';
const AVATAR_GROUP_COMPACT_OVERFLOW_NAME = 'AvatarGroupCompactOverflow';

export const avatarGroupCompactVariants = tv({
slots: {
root: 'flex w-max items-center rounded-full bg-bg-white-0 p-0.5 shadow-regular-xs',
stack: 'flex -space-x-0.5 _:ring-2 _:ring-stroke-white-0',
overflow: 'text-sub-600',
},
variants: {
variant: {
default: {},
stroke: {
root: 'ring-1 ring-stroke-soft-200',
},
},
size: {
'40': {
overflow: 'px-2.5 text-paragraph-md',
},
'32': {
overflow: 'px-2 text-paragraph-sm',
},
'24': {
overflow: 'px-1.5 text-paragraph-xs',
},
},
},
defaultVariants: {
size: '40',
variant: 'default',
},
});

type AvatarGroupCompactSharedProps = VariantProps<
typeof avatarGroupCompactVariants

> ;

type AvatarGroupCompactRootProps = VariantProps<
typeof avatarGroupCompactVariants

> &
> React.HTMLAttributes<HTMLDivElement>;

function AvatarGroupCompactRoot({
children,
size = '40',
variant,
className,
...rest
}: AvatarGroupCompactRootProps) {
const uniqueId = React.useId();
const { root } = avatarGroupCompactVariants({ size, variant });

const sharedProps: AvatarGroupCompactSharedProps = {
size,
};

const extendedChildren = recursiveCloneChildren(
children as React.ReactElement[],
sharedProps,
[AVATAR_ROOT_NAME, AVATAR_GROUP_COMPACT_OVERFLOW_NAME],
uniqueId,
);

return (

<div className={root({ class: className })} {...rest}>
{extendedChildren}
</div>
);
}
AvatarGroupCompactRoot.displayName = AVATAR_GROUP_COMPACT_ROOT_NAME;

function AvatarGroupCompactStack({
children,
className,
...rest
}: React.HTMLAttributes<HTMLDivElement>) {
const { stack } = avatarGroupCompactVariants();

return (

<div className={stack({ class: className })} {...rest}>
{children}
</div>
);
}
AvatarGroupCompactStack.displayName = AVATAR_GROUP_COMPACT_STACK_NAME;

function AvatarGroupCompactOverflow({
children,
size,
className,
...rest
}: AvatarGroupCompactSharedProps & React.HTMLAttributes<HTMLDivElement>) {
const { overflow } = avatarGroupCompactVariants({ size });

return (

<div className={overflow({ class: className })} {...rest}>
{children}
</div>
);
}
AvatarGroupCompactOverflow.displayName = AVATAR_GROUP_COMPACT_OVERFLOW_NAME;

export {
AvatarGroupCompactRoot as Root,
AvatarGroupCompactStack as Stack,
AvatarGroupCompactOverflow as Overflow,
};
Update the import paths to match your project setup.
Examples
Stroke
Preview
Code
Copy
+9
Size
Preview
Code
Copy
+9
+9
+9
API Reference
AvatarGroupCompact.Root
This component is based on the <div> element and supports all of its props and adds:

Prop Type Default
size

"40"
|
"32"
|
"24"
"40"
variant

"default"
|
"stroke"
"default"
AvatarGroupCompact.Stack
Arranges a compact stack of avatar components, showing them with slight overlap. Use within <AvatarGroupCompact.Root> to manage the display of multiple avatars in a compact space. This component is based on the <div> element and supports all of its props.

AvatarGroupCompact.Overflow
Displays an overflow indicator when the number of avatars exceeds the visible space. Typically shows a count of extra avatars not displayed. This component is based on the <div> element and supports all of its props.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Stroke
Size
API Reference
AvatarGroupCompact.Root
AvatarGroupCompact.Stack
AvatarGroupCompact.Overflow
Avatar Group Compact | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Data Table
Data table is a 2-dimensional data structure where each row is an item, and each column is a data point about the item.

Installation
Create a table.tsx file and paste the following code into it.
/components/ui/table.tsx

// AlignUI Table v0.0.0

import \* as React from 'react';

import \* as Divider from '@/components/ui/divider';
import { cn } from '@/utils/cn';

const Table = React.forwardRef<
HTMLTableElement,
React.TableHTMLAttributes<HTMLTableElement>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <div className={cn('w-full overflow-x-auto', className)}>
      <table ref={forwardedRef} className='w-full' {...rest} />
    </div>

);
});
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
HTMLTableSectionElement,
React.HTMLAttributes<HTMLTableSectionElement>

> (({ ...rest }, forwardedRef) => {
> return <thead ref={forwardedRef} {...rest} />;
> });
> TableHeader.displayName = 'TableHeader';

const TableHead = React.forwardRef<
HTMLTableCellElement,
React.ThHTMLAttributes<HTMLTableCellElement>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <th
      ref={forwardedRef}
      className={cn(
        'bg-bg-weak-50 px-3 py-2 text-left text-paragraph-sm text-sub-600 first:rounded-l-lg last:rounded-r-lg',
        className,
      )}
      {...rest}
    />

);
});
TableHead.displayName = 'TableHead';

const TableBody = React.forwardRef<
HTMLTableSectionElement,
React.HTMLAttributes<HTMLTableSectionElement> & {
spacing?: number;
}

> (({ spacing = 8, ...rest }, forwardedRef) => {
> return (

    <>
      {/* to have space between thead and tbody */}
      <tbody
        aria-hidden='true'
        className='table-row'
        style={{
          height: spacing,
        }}
      />

      <tbody ref={forwardedRef} {...rest} />
    </>

);
});
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<
HTMLTableRowElement,
React.HTMLAttributes<HTMLTableRowElement>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <tr ref={forwardedRef} className={cn('group/row', className)} {...rest} />

);
});
TableRow.displayName = 'TableRow';

function TableRowDivider({
className,
dividerClassName,
...rest
}: React.ComponentPropsWithoutRef<typeof Divider.Root> & {
dividerClassName?: string;
}) {
return (

<tr aria-hidden='true' className={className}>
<td colSpan={999} className='py-1'>
<Divider.Root
variant='line-spacing'
className={dividerClassName}
{...rest}
/>
</td>
</tr>
);
}
TableRowDivider.displayName = 'TableRowDivider';

const TableCell = React.forwardRef<
HTMLTableCellElement,
React.TdHTMLAttributes<HTMLTableCellElement>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <td
      ref={forwardedRef}
      className={cn(
        'h-16 px-3 transition duration-200 ease-out first:rounded-l-xl last:rounded-r-xl group-hover/row:bg-bg-weak-50',
        className,
      )}
      {...rest}
    />

);
});
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
HTMLTableCaptionElement,
React.HTMLAttributes<HTMLTableCaptionElement>

> (({ className, ...rest }, forwardedRef) => (

  <caption
    ref={forwardedRef}
    className={cn('mt-4 text-paragraph-sm text-sub-600', className)}
    {...rest}
  />
));
TableCaption.displayName = 'TableCaption';
 
export {
  Table as Root,
  TableHeader as Header,
  TableBody as Body,
  TableHead as Head,
  TableRow as Row,
  TableRowDivider as RowDivider,
  TableCell as Cell,
  TableCaption as Caption,
};
Update the import paths to match your project setup.
Examples
We will give you examples on how to create complex Data Tables with @tanstack/react-table using our Table primitives. Let's start by installing the package:

npm
pnpm
yarn
terminal

npm install @tanstack/react-table
Row Selection
Preview
Code
Copy

Member Name
Title
Projects
Member Documents
Status

James Brown
james@alignui.com
Marketing Manager
Since Aug, 2021
Monday.com
Campaign Strategy Brainstorming
PDF
brown-james.pdf
2.4 MB
Active

Sophia Williams
sophia@alignui.com
HR Assistant
Since Aug, 2021
Notion
Employee Engagement Survey
PDF
williams-sophia.pdf
2.4 MB
Active

Arthur Taylor
arthur@alignui.com
Entrepreneur / CEO
Since May, 2022
Spotify
Vision and Goal Setting Session
PDF
taylor-arthur.pdf
2.4 MB
Absent

Emma Wright
emma@alignui.com
Front-end Developer
Since Sep, 2022
Formcarry
User Feedback Analysis
PDF
wright-emma.pdf
1.9 MB
Active

Matthew Johnson
matthew@alignui.com
Data Software Engineer
Since Feb, 2022
Loom
Data Analysis Methodology
PDF
johnson-matthew.pdf
2.9 MB
Active

Laura Perez
laura@alignui.com
Fashion Designer
Since Mar, 2022
Tidal
Design Trends and Inspirations
PDF
perez-laura.pdf
2.5 MB
Absent

Wei Chen
wei@alignui.com
Operations Manager
Since July, 2021
Dropbox
Process Optimization Brainstorming
PDF
chen-wei.pdf
2.6 MB
Active
API Reference
These examples are based on the Tanstack Table package. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Row Selection
API Reference
Data Table | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Divider
A versatile divider component used to create visual separation between content.

Preview
Code
Copy
Create a divider.tsx file and paste the following code into it.
/components/ui/divider.tsx

// AlignUI Divider v0.0.0

import { tv, type VariantProps } from '@/utils/tv';

const DIVIDER_ROOT_NAME = 'DividerRoot';

export const dividerVariants = tv({
base: 'relative flex w-full items-center',
variants: {
variant: {
line: 'h-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:-translate-y-1/2 before:bg-stroke-soft-200',
'line-spacing': [
// base
'h-1',
// before
'before:absolute before:left-0 before:top-1/2 before:h-px before:w-full before:-translate-y-1/2 before:bg-stroke-soft-200',
],
'line-text': [
// base
'gap-2.5',
'text-subheading-2xs text-soft-400',
// before
'before:h-px before:w-full before:flex-1 before:bg-stroke-soft-200',
// after
'after:h-px after:w-full after:flex-1 after:bg-stroke-soft-200',
],
content: [
// base
'gap-2.5',
// before
'before:h-px before:w-full before:flex-1 before:bg-stroke-soft-200',
// after
'after:h-px after:w-full after:flex-1 after:bg-stroke-soft-200',
],
text: [
// base
'px-2 py-1',
'text-subheading-xs text-soft-400',
],
'solid-text': [
// base
'bg-bg-weak-50 px-5 py-1.5 uppercase',
'text-subheading-xs text-soft-400',
],
},
},
defaultVariants: {
variant: 'line',
},
});

function Divider({
className,
variant,
...rest
}: React.HTMLAttributes<HTMLDivElement> &
VariantProps<typeof dividerVariants>) {
return (

<div
role='separator'
className={dividerVariants({ variant, class: className })}
{...rest}
/>
);
}
Divider.displayName = DIVIDER_ROOT_NAME;

export { Divider as Root };
Update the import paths to match your project setup.
Examples
Line (Default)
A simple horizontal line.

Preview
Code
Copy
Line Spacing
A line with spacing.

Preview
Code
Copy
Line Text
A line with text in between.

Preview
Code
Copy
OR
Text
Text only divider.

Preview
Code
Copy
OR
Solid Text
A solid background with text. Often used in modals.

Preview
Code
Copy
Amount & Account
Content
A line with content on center.

Preview
Code
Copy

API Reference
Divider.Root
This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
variant

"line"
|
"line-spacing"
|
"line-text"
|
"content"
|
"text"
|
"solid-text"
'line'
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Examples
Line (Default)
Line Spacing
Line Text
Text
Solid Text
Content
API Reference
Divider.Root
Divider | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Tag
Efficient tool for categorizing and labeling content within your application.

@radix-ui/react-slot
Preview
Code
Copy
Tag
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a tag.tsx file and paste the following code into it.
/components/ui/tag.tsx

// AlignUI Tag v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { RiCloseFill } from '@remixicon/react';

import { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const TAG_ROOT_NAME = 'TagRoot';
const TAG_ICON_NAME = 'TagIcon';
const TAG_DISMISS_BUTTON_NAME = 'TagDismissButton';
const TAG_DISMISS_ICON_NAME = 'TagDismissIcon';

export const tagVariants = tv({
slots: {
root: [
'group/tag inline-flex h-6 items-center gap-2 rounded-md px-2 text-label-xs text-sub-600',
'transition duration-200 ease-out',
'ring-1 ring-inset',
],
icon: [
// base
'-mx-1 size-4 shrink-0 text-soft-400 transition duration-200 ease-out',
// hover
'group-hover/tag:text-sub-600',
],
dismissButton: [
// base
'group/dismiss-button -ml-1.5 -mr-1 size-4 shrink-0',
// focus
'focus:outline-none',
],
dismissIcon: 'size-4 text-soft-400 transition duration-200 ease-out',
},
variants: {
variant: {
stroke: {
root: [
// base
'bg-bg-white-0 ring-stroke-soft-200',
// hover
'hover:bg-bg-weak-50 hover:ring-transparent',
// focus-within
'focus-within:bg-bg-weak-50 focus-within:ring-transparent',
],
dismissIcon: [
// hover
'group-hover/dismiss-button:text-sub-600',
// focus
'group-focus/dismiss-button:text-sub-600',
],
},
gray: {
root: [
// base
'bg-bg-weak-50 ring-transparent',
// hover
'hover:bg-bg-white-0 hover:ring-stroke-soft-200',
],
},
},
disabled: {
true: {
root: 'pointer-events-none bg-bg-weak-50 text-disabled-300 ring-transparent',
icon: 'text-disabled-300 [&:not(.remixicon)]:opacity-[.48]',
dismissIcon: 'text-disabled-300',
},
},
},
defaultVariants: {
variant: 'stroke',
},
});

type TagSharedProps = VariantProps<typeof tagVariants>;

type TagProps = VariantProps<typeof tagVariants> &
React.HTMLAttributes<HTMLDivElement> & {
asChild?: boolean;
};

const TagRoot = React.forwardRef<HTMLDivElement, TagProps>(
(
{ asChild, children, variant, disabled, className, ...rest },
forwardedRef,
) => {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'div';
const { root } = tagVariants({ variant, disabled });

    const sharedProps: TagSharedProps = {
      variant,
      disabled,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [TAG_ICON_NAME, TAG_DISMISS_BUTTON_NAME, TAG_DISMISS_ICON_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        aria-disabled={disabled}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );

},
);
TagRoot.displayName = TAG_ROOT_NAME;

function TagIcon<T extends React.ElementType>({
className,
variant,
disabled,
as,
...rest
}: PolymorphicComponentProps<T, TagSharedProps>) {
const Component = as || 'div';
const { icon } = tagVariants({ variant, disabled });

return <Component className={icon({ class: className })} {...rest} />;
}
TagIcon.displayName = TAG_ICON_NAME;

type TagDismissButtonProps = TagSharedProps &
React.ButtonHTMLAttributes<HTMLButtonElement> & {
asChild?: boolean;
};

const TagDismissButton = React.forwardRef<
HTMLButtonElement,
TagDismissButtonProps

> (
> (

    { asChild, children, className, variant, disabled, ...rest },
    forwardedRef,

) => {
const Component = asChild ? Slot : 'button';
const { dismissButton } = tagVariants({ variant, disabled });

    return (
      <Component
        ref={forwardedRef}
        className={dismissButton({ class: className })}
        {...rest}
      >
        {children ?? (
          <TagDismissIcon
            variant={variant}
            disabled={disabled}
            as={RiCloseFill}
          />
        )}
      </Component>
    );

},
);
TagDismissButton.displayName = TAG_DISMISS_BUTTON_NAME;

function TagDismissIcon<T extends React.ElementType>({
className,
variant,
disabled,
as,
...rest
}: PolymorphicComponentProps<T, TagSharedProps>) {
const Component = as || 'div';
const { dismissIcon } = tagVariants({ variant, disabled });

return <Component className={dismissIcon({ class: className })} {...rest} />;
}
TagDismissIcon.displayName = TAG_DISMISS_ICON_NAME;

export {
TagRoot as Root,
TagIcon as Icon,
TagDismissButton as DismissButton,
TagDismissIcon as DismissIcon,
};
Update the import paths to match your project setup.
Examples
Stroke (Default)
Preview
Code
Copy
Tag
Customer
Gray
Preview
Code
Copy
Tag
Customer
Disabled
Preview
Code
Copy
Tag
Customer
Tag
Customer
With Image
Preview
Code
Copy
Apex
Figma
With Avatar
Preview
Code
Copy
James Brown
Dismissable
Preview
Code
Copy
Tag
Customer
Tag
Customer
API Reference
Tag.Root
This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
variant

"stroke"
|
"gray"
"stroke"
disabled

boolean
asChild

boolean
Tag.Icon
The Tag.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
Tag.DismissButton
This component is based on the <button> element and supports all of its props. And adds:

Prop Type Default
asChild

boolean
Tag.DismissIcon
The Tag.DismissIcon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Stroke (Default)
Gray
Disabled
With Image
With Avatar
Dismissable
API Reference
Tag.Root
Tag.Icon
Tag.DismissButton
Tag.DismissIcon
Tag | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Tooltip
Tooltips add additional context to interactive UI elements and appear on mouse hover or keyboard focus.

@radix-ui/react-tooltip
Preview
Code
Copy
Hover or focus
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-tooltip
Create a tooltip.tsx file and paste the following code into it.
/components/ui/tooltip.tsx

// AlignUI Tooltip v0.0.0

'use client';

import _ as React from 'react';
import _ as TooltipPrimitive from '@radix-ui/react-tooltip';

import { tv, type VariantProps } from '@/utils/tv';

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

export const tooltipVariants = tv({
slots: {
content: [
'z-50 shadow-tooltip',
'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
],
arrow:
'-translate-y-1/2 -rotate-45 border [clip-path:polygon(0_100%,0_0,100%_100%)]',
},
variants: {
size: {
xsmall: {
content: 'rounded px-1.5 py-0.5 text-paragraph-xs',
arrow: 'rounded-bl-sm',
},
small: {
content: 'rounded-md px-2.5 py-1 text-paragraph-sm',
arrow: 'rounded-bl-[3px]',
},
medium: {
content: 'rounded-xl p-3 text-label-sm',
arrow: 'rounded-bl-sm',
},
},
variant: {
dark: {
content: 'bg-bg-strong-950 text-white-0',
arrow: 'border-stroke-strong-950 bg-bg-strong-950',
},
light: {
content:
'bg-bg-white-0 text-strong-950 ring-1 ring-stroke-soft-200',
arrow: 'border-stroke-soft-200 bg-bg-white-0',
},
},
},
compoundVariants: [
{
size: 'xsmall',
variant: 'dark',
class: {
arrow: 'size-1.5',
},
},
{
size: 'xsmall',
variant: 'light',
class: {
arrow: 'size-2',
},
},
{
size: ['small', 'medium'],
variant: 'dark',
class: {
arrow: 'size-2',
},
},
{
size: ['small', 'medium'],
variant: 'light',
class: {
arrow: 'size-2.5',
},
},
],
defaultVariants: {
size: 'small',
variant: 'dark',
},
});

const TooltipContent = React.forwardRef<
React.ComponentRef<typeof TooltipPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
VariantProps<typeof tooltipVariants>

> (
> (

    { size, variant, className, children, sideOffset = 4, ...rest },
    forwardedRef,

) => {
const { content, arrow } = tooltipVariants({
size,
variant,
});

    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={forwardedRef}
          sideOffset={sideOffset}
          className={content({ class: className })}
          {...rest}
        >
          {children}
          <TooltipPrimitive.Arrow asChild>
            <div className={arrow()} />
          </TooltipPrimitive.Arrow>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );

},
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
TooltipProvider as Provider,
TooltipRoot as Root,
TooltipTrigger as Trigger,
TooltipContent as Content,
};
Update the import paths to match your project setup.
Examples
Light
Preview
Code
Copy
Hover or focus
Size
Preview
Code
Copy
Medium
Small (default)
XSmall
Position
Preview
Code
Copy
Left
Top
Bottom
Right
HTML Content
Preview
Code
Copy
Hover or focus
API Reference
This component is based on the Radix UI Tooltip primitives. Refer to their documentation for the API reference.

Tooltip.Root
Supports all of Radix Tooltip Root props and adds:

Prop Type Default
variant

"dark"
|
"light"
"dark"
size

"medium"
|
"small"
|
"xsmall"
"small"
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Examples
Light
Size
Position
HTML Content
API Reference
Tooltip.Root
Tooltip | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Breadcrumb
Guiding users by displaying their path within an app or website.

@radix-ui/react-slot
Preview
Code
Copy
Blogs
The Power of Minimalism in Design
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a breadcrumb.tsx file and paste the following code into it.
/components/ui/breadcrumb.tsx

// AlignUI Breadcrumb v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/utils/cn';
import { PolymorphicComponentProps } from '@/utils/polymorphic';

const BREADCRUMB_ROOT_NAME = 'BreadcrumbRoot';
const BREADCRUMB_ITEM_NAME = 'BreadcrumbItem';
const BREADCRUMB_ICON_NAME = 'BreadcrumbIcon';
const BREADCRUMB_ARROW_NAME = 'BreadcrumbArrow';

type BreadcrumbRootProps = React.HTMLAttributes<HTMLDivElement> & {
asChild?: boolean;
};

function BreadcrumbRoot({
asChild,
children,
className,
...rest
}: BreadcrumbRootProps) {
const Component = asChild ? Slot : 'div';

return (
<Component className={cn('flex flex-wrap gap-1.5', className)} {...rest}>
{children}
</Component>
);
}
BreadcrumbRoot.displayName = BREADCRUMB_ROOT_NAME;

type BreadcrumbItemProps = React.HTMLAttributes<HTMLDivElement> & {
asChild?: boolean;
active?: boolean;
};

const BreadcrumbItem = React.forwardRef<HTMLDivElement, BreadcrumbItemProps>(
({ asChild, children, className, active, ...rest }, forwardedRef) => {
const Component = asChild ? Slot : 'div';

    return (
      <Component
        ref={forwardedRef}
        className={cn(
          // base
          'flex items-center gap-1.5 transition-colors duration-200 ease-out',
          'text-label-sm text-sub-600',
          {
            // not active
            'underline decoration-transparent': !active,
            // hover
            'hover:text-strong-950 hover:decoration-current': !active,
            // active
            'text-strong-950': active,
          },
          className,
        )}
        {...rest}
      >
        {children}
      </Component>
    );

},
);
BreadcrumbItem.displayName = BREADCRUMB_ITEM_NAME;

function BreadcrumbItemIcon<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || 'div';

return <Component className={cn('size-5', className)} {...rest} />;
}
BreadcrumbItemIcon.displayName = BREADCRUMB_ICON_NAME;

function BreadcrumbItemArrowIcon<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || 'div';

return (
<Component
className={cn(
'flex size-5 select-none items-center justify-center text-disabled-300',
className,
)}
{...rest}
/>
);
}
BreadcrumbItemArrowIcon.displayName = BREADCRUMB_ARROW_NAME;

export {
BreadcrumbRoot as Root,
BreadcrumbItem as Item,
BreadcrumbItemIcon as Icon,
BreadcrumbItemArrowIcon as ArrowIcon,
};
Update the import paths to match your project setup.
Examples
As Link
Preview
Code
Copy
Settings
Notifications
Email Notifications
Slash Separator
Preview
Code
Copy
Settings
Notifications
Email Notifications
API Reference
Breadcrumb.Root
This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
asChild

boolean
Breadcrumb.Item
Individual breadcrumb item. This component is based on the <div> element initially and supports all of its props. And adds:

Prop Type Default
active

boolean
asChild

boolean
Breadcrumb.Icon
Icon used within a breadcrumb item. The Breadcrumb.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
Breadcrumb.ArrowIcon
Icon used to separate breadcrumb items, usually an arrow. The Breadcrumb.ArrowIcon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
As Link
Slash Separator
API Reference
Breadcrumb.Root
Breadcrumb.Item
Breadcrumb.Icon
Breadcrumb.ArrowIcon
Breadcrumb | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Pagination
Pagination is a horizontal set of links to navigate paginated content.

@radix-ui/react-slot
Preview
Code
Copy

1
2
3
4
5
...
16

Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a pagination.tsx file and paste the following code into it.
/components/ui/pagination.tsx

// AlignUI Pagination v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/utils/cn';
import type { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const PAGINATION_ROOT_NAME = 'PaginationRoot';
const PAGINATION_ITEM_NAME = 'PaginationItem';
const PAGINATION_NAV_BUTTON_NAME = 'PaginationNavButton';
const PAGINATION_NAV_ICON_NAME = 'PaginationNavIcon';

const paginationVariants = tv({
slots: {
root: 'flex flex-wrap items-center justify-center',
item: 'flex items-center justify-center text-center text-label-sm text-sub-600 transition duration-200 ease-out',
navButton:
'flex items-center justify-center text-sub-600 transition duration-200 ease-out',
navIcon: 'size-5',
},
variants: {
variant: {
basic: {
root: 'gap-2',
item: [
// base
'h-8 min-w-8 rounded-lg px-1.5 ring-1 ring-inset ring-stroke-soft-200',
// hover
'hover:bg-bg-weak-50 hover:ring-transparent',
],
navButton: [
// base
'size-8 rounded-lg',
// hover
'hover:bg-bg-weak-50',
],
},
rounded: {
root: 'gap-2',
item: [
// base
'h-8 min-w-8 rounded-full px-1.5 ring-1 ring-inset ring-stroke-soft-200',
// hover
'hover:bg-bg-weak-50 hover:ring-transparent',
],
navButton: [
// base
'size-8 rounded-full',
// hover
'hover:bg-bg-weak-50',
],
},
group: {
root: 'divide-x divide-stroke-soft-200 overflow-hidden rounded-lg border border-stroke-soft-200',
item: [
// base
'h-8 min-w-10 px-1.5',
// hover
'hover:bg-bg-weak-50',
],
navButton: [
// base
'h-8 w-10 px-1.5',
// hover
'hover:bg-bg-weak-50',
],
},
},
},
defaultVariants: {
variant: 'basic',
},
});

type PaginationSharedProps = VariantProps<typeof paginationVariants>;

type PaginationRootProps = React.HTMLAttributes<HTMLDivElement> &
VariantProps<typeof paginationVariants> & {
asChild?: boolean;
};

function PaginationRoot({
asChild,
children,
className,
variant,
...rest
}: PaginationRootProps) {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'div';
const { root } = paginationVariants({ variant });

const sharedProps: PaginationSharedProps = {
variant,
};

const extendedChildren = recursiveCloneChildren(
children as React.ReactElement[],
sharedProps,
[
PAGINATION_ITEM_NAME,
PAGINATION_NAV_BUTTON_NAME,
PAGINATION_NAV_ICON_NAME,
],
uniqueId,
asChild,
);

return (
<Component className={root({ class: className })} {...rest}>
{extendedChildren}
</Component>
);
}
PaginationRoot.displayName = PAGINATION_ROOT_NAME;

type PaginationItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
PaginationSharedProps & {
asChild?: boolean;
current?: boolean;
};

const PaginationItem = React.forwardRef<HTMLButtonElement, PaginationItemProps>(
(
{ asChild, children, className, variant, current, ...rest },
forwardedRef,
) => {
const Component = asChild ? Slot : 'button';
const { item } = paginationVariants({ variant });

    return (
      <Component
        ref={forwardedRef}
        className={cn(item({ class: className }), {
          'text-strong-950': current,
        })}
        {...rest}
      >
        {children}
      </Component>
    );

},
);
PaginationItem.displayName = PAGINATION_ITEM_NAME;

type PaginationNavButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
PaginationSharedProps & {
asChild?: boolean;
};

const PaginationNavButton = React.forwardRef<
HTMLButtonElement,
PaginationNavButtonProps

> (({ asChild, children, className, variant, ...rest }, forwardedRef) => {
> const Component = asChild ? Slot : 'button';
> const { navButton } = paginationVariants({ variant });

return (
<Component
ref={forwardedRef}
className={navButton({ class: className })}
{...rest} >
{children}
</Component>
);
});
PaginationNavButton.displayName = PAGINATION_NAV_BUTTON_NAME;

function PaginationNavIcon<T extends React.ElementType>({
variant,
className,
as,
...rest
}: PolymorphicComponentProps<T, PaginationSharedProps>) {
const Component = as || 'div';
const { navIcon } = paginationVariants({ variant });

return <Component className={navIcon({ class: className })} {...rest} />;
}
PaginationNavIcon.displayName = PAGINATION_NAV_ICON_NAME;

export {
PaginationRoot as Root,
PaginationItem as Item,
PaginationNavButton as NavButton,
PaginationNavIcon as NavIcon,
};
Check the import paths to ensure they match your project setup.
Examples
variant="rounded"
Preview
Code
Copy

1
2
3
4
5
...
16

variant="group"
Preview
Code
Copy

1
2
3
4
5
...
16

As Link
Preview
Code
Copy
1
2
3
4
5
...
16
API Reference
Pagination.Root
The root component for pagination. Wraps around pagination items and navigation buttons. This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
variant

"basic"
|
"rounded"
|
"group"
'basic'
asChild

boolean
Pagination.Item
An individual pagination item, typically a link. This component is based on the <button> element and supports all of its props. And adds:

Prop Type Default
current

boolean
asChild

boolean
Pagination.NavButton
A navigation button for pagination, such as "previous" or "next". This component is based on the <button> element and supports all of its props. And adds:

Prop Type Default
asChild

boolean
Pagination.NavIcon
An icon used inside navigation buttons for pagination. This component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
variant="rounded"
variant="group"
As Link
API Reference
Pagination.Root
Pagination.Item
Pagination.NavButton
Pagination.NavIcon
Pagination | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Alert
Alerts often appear between inputs or around the important UI elements to convey critical information, such as an incorrect password during login attempts.

Preview
Code
Copy
Insert your alert title here!Upgrade

Create a alert.tsx file and paste the following code into it.
/components/ui/alert.tsx

// AlignUI Alert v0.0.0

import \* as React from 'react';
import { RiCloseLine } from '@remixicon/react';

import type { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import {
tv,
type ClassValue,
type VariantProps,
} from '@/utils/tv';

const ALERT_ROOT_NAME = 'AlertRoot';
const ALERT_ICON_NAME = 'AlertIcon';
const ALERT_CLOSE_ICON_NAME = 'AlertCloseIcon';

export const alertVariants = tv({
slots: {
root: 'w-full',
wrapper: [
'grid w-full auto-cols-auto grid-flow-col grid-cols-1 items-start has-[>svg:first-child]:grid-cols-[auto,minmax(0,1fr)]',
'transition duration-200 ease-out group-data-[expanded=false]/toast:group-data-[front=false]/toast:opacity-0',
],
icon: 'shrink-0',
closeIcon: '',
},
variants: {
variant: {
filled: {
root: 'text-static-white',
closeIcon: 'text-static-white opacity-[.72]',
},
light: {
root: 'text-strong-950',
closeIcon: 'text-strong-950 opacity-40',
},
lighter: {
root: 'text-strong-950',
closeIcon: 'text-strong-950 opacity-40',
},
stroke: {
root: 'bg-bg-white-0 text-strong-950 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200',
closeIcon: 'text-strong-950 opacity-40',
},
},
status: {
error: {},
warning: {},
success: {},
information: {},
feature: {},
},
size: {
xsmall: {
root: 'rounded-lg p-2 text-paragraph-xs',
wrapper: 'gap-2',
icon: 'size-4',
closeIcon: 'size-4',
},
small: {
root: 'rounded-lg px-2.5 py-2 text-paragraph-sm',
wrapper: 'gap-2',
icon: 'size-5',
closeIcon: 'size-5',
},
large: {
root: 'rounded-xl p-3.5 pb-4 text-paragraph-sm',
wrapper: 'items-start gap-3',
icon: 'size-5',
closeIcon: 'size-5',
},
},
},
compoundVariants: [
//#region filled
{
variant: 'filled',
status: 'error',
class: {
root: 'bg-error-base',
},
},
{
variant: 'filled',
status: 'warning',
class: {
root: 'bg-warning-base',
},
},
{
variant: 'filled',
status: 'success',
class: {
root: 'bg-success-base',
},
},
{
variant: 'filled',
status: 'information',
class: {
root: 'bg-information-base',
},
},
{
variant: 'filled',
status: 'feature',
class: {
root: 'bg-faded-base',
},
},
//#endregion

    //#region light
    {
      variant: 'light',
      status: 'error',
      class: {
        root: 'bg-error-light',
      },
    },
    {
      variant: 'light',
      status: 'warning',
      class: {
        root: 'bg-warning-light',
      },
    },
    {
      variant: 'light',
      status: 'success',
      class: {
        root: 'bg-success-light',
      },
    },
    {
      variant: 'light',
      status: 'information',
      class: {
        root: 'bg-information-light',
      },
    },
    {
      variant: 'light',
      status: 'feature',
      class: {
        root: 'bg-faded-light',
      },
    },
    //#endregion

    //#region lighter
    {
      variant: 'lighter',
      status: 'error',
      class: {
        root: 'bg-error-lighter',
      },
    },
    {
      variant: 'lighter',
      status: 'warning',
      class: {
        root: 'bg-warning-lighter',
      },
    },
    {
      variant: 'lighter',
      status: 'success',
      class: {
        root: 'bg-success-lighter',
      },
    },
    {
      variant: 'lighter',
      status: 'information',
      class: {
        root: 'bg-information-lighter',
      },
    },
    {
      variant: 'lighter',
      status: 'feature',
      class: {
        root: 'bg-faded-lighter',
      },
    },
    //#endregion

    //#region light, lighter, stroke
    {
      variant: ['light', 'lighter', 'stroke'],
      status: 'error',
      class: {
        icon: 'text-error-base',
      },
    },
    {
      variant: ['light', 'lighter', 'stroke'],
      status: 'warning',
      class: {
        icon: 'text-warning-base',
      },
    },
    {
      variant: ['light', 'lighter', 'stroke'],
      status: 'success',
      class: {
        icon: 'text-success-base',
      },
    },
    {
      variant: ['light', 'lighter', 'stroke'],
      status: 'information',
      class: {
        icon: 'text-information-base',
      },
    },
    {
      variant: ['light', 'lighter', 'stroke'],
      status: 'feature',
      class: {
        icon: 'text-faded-base',
      },
    },
    //#endregion

],
defaultVariants: {
size: 'small',
variant: 'filled',
status: 'information',
},
});

type AlertSharedProps = VariantProps<typeof alertVariants>;

export type AlertProps = VariantProps<typeof alertVariants> &
React.HTMLAttributes<HTMLDivElement> & {
wrapperClassName?: ClassValue;
};

const AlertRoot = React.forwardRef<HTMLDivElement, AlertProps>(
(
{ children, className, wrapperClassName, size, variant, status, ...rest },
forwardedRef,
) => {
const uniqueId = React.useId();
const { root, wrapper } = alertVariants({ size, variant, status });

    const sharedProps: AlertSharedProps = {
      size,
      variant,
      status,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [ALERT_ICON_NAME, ALERT_CLOSE_ICON_NAME],
      uniqueId,
    );

    return (
      <div ref={forwardedRef} className={root({ class: className })} {...rest}>
        <div className={wrapper({ class: wrapperClassName })}>
          {extendedChildren}
        </div>
      </div>
    );

},
);
AlertRoot.displayName = ALERT_ROOT_NAME;

function AlertIcon<T extends React.ElementType>({
size,
variant,
status,
className,
as,
}: PolymorphicComponentProps<T, AlertSharedProps>) {
const Component = as || 'div';
const { icon } = alertVariants({ size, variant, status });

return <Component className={icon({ class: className })} />;
}
AlertIcon.displayName = ALERT_ICON_NAME;

function AlertCloseIcon<T extends React.ElementType>({
size,
variant,
status,
className,
as,
}: PolymorphicComponentProps<T, AlertSharedProps>) {
const Component = as || RiCloseLine;
const { closeIcon } = alertVariants({ size, variant, status });

return <Component className={closeIcon({ class: className })} />;
}
AlertCloseIcon.displayName = ALERT_CLOSE_ICON_NAME;

export { AlertRoot as Root, AlertIcon as Icon, AlertCloseIcon as CloseIcon };
Update the import paths to match your project setup.
Examples
Variants
filled (Default)
Preview
Code
Copy
Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

light
Preview
Code
Copy
Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

lighter
Preview
Code
Copy
Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

stroke
Preview
Code
Copy
Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Size
xsmall
Preview
Code
Copy
Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

small (Default)
Preview
Code
Copy
Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

Insert your alert title here!Upgrade

large
Preview
Code
Copy
Insert your alert title here!
Insert the alert description here. It would look better as two lines of text.
Upgrade
∙
Learn More
Insert your alert title here!
Insert the alert description here. It would look better as two lines of text.
Upgrade
∙
Learn More
Insert your alert title here!
Insert the alert description here. It would look better as two lines of text.
Upgrade
∙
Learn More
Insert your alert title here!
Insert the alert description here. It would look better as two lines of text.
Upgrade
∙
Learn More
API Reference
Alert.Root
This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
variant

"filled"
|
"light"
|
"lighter"
|
"stroke"
"filled"
size

"xsmall"
|
"small"
|
"large"
"small"
status

"error"
|
"warning"
|
"success"
|
"information"
|
"feature"
"information"
wrapperClassName

string
Alert.Icon
The Alert.Icon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
Alert.CloseIcon
The Alert.CloseIcon component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
RiCloseLine
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Examples
Variants
filled (Default)
light
lighter
stroke
Size
xsmall
small (Default)
large
API Reference
Alert.Root
Alert.Icon
Alert.CloseIcon
Alert | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Kbd
A very simple component for displaying keyboard key styling.

Preview
Code
Copy
+K
Create a kbd.tsx file and paste the following code into it.
/components/ui/kbd.tsx

// AlignUI Kbd v0.0.0

import \* as React from 'react';

import { cn } from '@/utils/cn';

function Kbd({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
return (

<div
className={cn(
'flex h-5 items-center gap-0.5 whitespace-nowrap rounded bg-bg-white-0 px-1.5 text-subheading-xs text-soft-400 ring-1 ring-inset ring-stroke-soft-200',
className,
)}
{...rest}
/>
);
}

export { Kbd as Root };
Update the import paths to match your project setup.
API Reference
Kbd.Root
This component is based on the <div> element and supports all of its props.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
API Reference
Kbd.Root
Kbd | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Notification
Notifications typically appear temporarily in corners, conveying information like payment and update notifications.

@radix-ui/react-toast
Preview
Code
Copy
Notification
This component is intended to be used with the <Alert> component. Refer to the Alert documentation for setup instructions before using this component.
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-toast
Create a notification.tsx file and paste the following code into it.
/components/ui/notification.tsx

// AlignUI Notification v0.0.0

import _ as React from 'react';
import _ as NotificationPrimitives from '@radix-ui/react-toast';
import {
RiAlertFill,
RiCheckboxCircleFill,
RiErrorWarningFill,
RiInformationFill,
RiMagicFill,
} from '@remixicon/react';

import \* as Alert from '@/components/ui/alert';
import { cn } from '@/utils/cn';

const NotificationProvider = NotificationPrimitives.Provider;
const NotificationAction = NotificationPrimitives.Action;

const NotificationViewport = React.forwardRef<
React.ComponentRef<typeof NotificationPrimitives.Viewport>,
React.ComponentPropsWithoutRef<typeof NotificationPrimitives.Viewport>

> (({ className, ...rest }, forwardedRef) => (
> <NotificationPrimitives.Viewport

    ref={forwardedRef}
    className={cn(
      'fixed left-0 top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-5 p-4 sm:bottom-0 sm:left-auto sm:right-0 sm:top-auto sm:max-w-[438px] sm:flex-col sm:p-6',
      className,
    )}
    {...rest}

/>
));
NotificationViewport.displayName = 'NotificationViewport';

type NotificationProps = React.ComponentPropsWithoutRef<
typeof NotificationPrimitives.Root

> &
> Pick<

    React.ComponentPropsWithoutRef<typeof Alert.Root>,
    'status' | 'variant'

> & {

    title?: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
    disableDismiss?: boolean;

};

const Notification = React.forwardRef<
React.ComponentRef<typeof NotificationPrimitives.Root>,
NotificationProps

> (
> (

    {
      className,
      status,
      variant = 'filled',
      title,
      description,
      action,
      disableDismiss = false,
      ...rest
    }: NotificationProps,
    forwardedRef,

) => {
let Icon: React.ElementType;

    switch (status) {
      case 'success':
        Icon = RiCheckboxCircleFill;
        break;
      case 'warning':
        Icon = RiAlertFill;
        break;
      case 'error':
        Icon = RiErrorWarningFill;
        break;
      case 'information':
        Icon = RiInformationFill;
        break;
      case 'feature':
        Icon = RiMagicFill;
        break;
      default:
        Icon = RiErrorWarningFill;
        break;
    }

    return (
      <NotificationPrimitives.Root
        ref={forwardedRef}
        className={cn(
          // open
          'data-[state=open]:animate-in data-[state=open]:max-[639px]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-right-full',
          // close
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:max-[639px]:slide-out-to-top-full data-[state=closed]:sm:slide-out-to-right-full',
          // swipe
          'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[swipe=end]:animate-out',
          className,
        )}
        asChild
        {...rest}
      >
        <Alert.Root variant={variant} status={status} size='large'>
          <Alert.Icon as={Icon} aria-hidden='true' />
          <div className='flex w-full flex-col gap-2.5'>
            <div className='flex w-full flex-col gap-1'>
              {title && (
                <NotificationPrimitives.Title className='text-label-sm'>
                  {title}
                </NotificationPrimitives.Title>
              )}
              {description && (
                <NotificationPrimitives.Description>
                  {description}
                </NotificationPrimitives.Description>
              )}
            </div>
            {action && <div className='flex items-center gap-2'>{action}</div>}
          </div>
          {!disableDismiss && (
            <NotificationPrimitives.Close aria-label='Close'>
              <Alert.CloseIcon />
            </NotificationPrimitives.Close>
          )}
        </Alert.Root>
      </NotificationPrimitives.Root>
    );

},
);
Notification.displayName = 'Notification';

export {
Notification as Root,
NotificationProvider as Provider,
NotificationAction as Action,
NotificationViewport as Viewport,
type NotificationProps,
};
Create a notification-provider.tsx file and paste the following code into it.
/components/ui/notification-provider.tsx

'use client';

import \* as Notification from '@/components/ui/notification';
import { useNotification } from '@/hooks/use-notification';

const NotificationProvider = () => {
const { notifications } = useNotification();

return (
<Notification.Provider>
{notifications.map(({ id, ...rest }) => {
return <Notification.Root key={id} {...rest} />;
})}
<Notification.Viewport />
</Notification.Provider>
);
};

export { NotificationProvider };
Create a use-notification.ts file and paste the following code into it.
/hooks/use-notification.ts

'use client';

import \* as React from 'react';

import type { NotificationProps } from '@/components/ui/notification';

const NOTIFICATION_LIMIT = 1;
const NOTIFICATION_REMOVE_DELAY = 1000000;

type NotificationPropsWithId = NotificationProps & {
id: string;
};

const actionTypes = {
ADD_NOTIFICATION: 'ADD_NOTIFICATION',
UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
} as const;

let count = 0;

function genId() {
count = (count + 1) % Number.MAX_SAFE_INTEGER;
return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
| {
type: ActionType['ADD_NOTIFICATION'];
notification: NotificationPropsWithId;
}
| {
type: ActionType['UPDATE_NOTIFICATION'];
notification: Partial<NotificationPropsWithId>;
}
| {
type: ActionType['DISMISS_NOTIFICATION'];
notificationId?: NotificationPropsWithId['id'];
}
| {
type: ActionType['REMOVE_NOTIFICATION'];
notificationId?: NotificationPropsWithId['id'];
};

interface State {
notifications: NotificationPropsWithId[];
}

const notificationTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (notificationId: string) => {
if (notificationTimeouts.has(notificationId)) {
return;
}

const timeout = setTimeout(() => {
notificationTimeouts.delete(notificationId);
dispatch({
type: 'REMOVE_NOTIFICATION',
notificationId: notificationId,
});
}, NOTIFICATION_REMOVE_DELAY);

notificationTimeouts.set(notificationId, timeout);
};

export const reducer = (state: State, action: Action): State => {
switch (action.type) {
case 'ADD_NOTIFICATION':
return {
...state,
notifications: [action.notification, ...state.notifications].slice(
0,
NOTIFICATION_LIMIT,
),
};

    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map((t) =>
          t.id === action.notification.id
            ? { ...t, ...action.notification }
            : t,
        ),
      };

    case 'DISMISS_NOTIFICATION': {
      const { notificationId } = action;

      if (notificationId) {
        addToRemoveQueue(notificationId);
      } else {
        state.notifications.forEach((notification) => {
          addToRemoveQueue(notification.id);
        });
      }

      return {
        ...state,
        notifications: state.notifications.map((t) =>
          t.id === notificationId || notificationId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case 'REMOVE_NOTIFICATION':
      if (action.notificationId === undefined) {
        return {
          ...state,
          notifications: [],
        };
      }
      return {
        ...state,
        notifications: state.notifications.filter(
          (t) => t.id !== action.notificationId,
        ),
      };

}
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { notifications: [] };

function dispatch(action: Action) {
if (action.type === 'ADD_NOTIFICATION') {
const notificationExists = memoryState.notifications.some(
(t) => t.id === action.notification.id,
);
if (notificationExists) {
return;
}
}
memoryState = reducer(memoryState, action);
listeners.forEach((listener) => {
listener(memoryState);
});
}

type Notification = Omit<NotificationPropsWithId, 'id'>;

function notification({ ...props }: Notification & { id?: string }) {
const id = props?.id || genId();

const update = (props: Notification) =>
dispatch({
type: 'UPDATE_NOTIFICATION',
notification: { ...props, id },
});
const dismiss = () =>
dispatch({ type: 'DISMISS_NOTIFICATION', notificationId: id });

dispatch({
type: 'ADD_NOTIFICATION',
notification: {
...props,
id,
open: true,
onOpenChange: (open: boolean) => {
if (!open) dismiss();
},
},
});

return {
id: id,
dismiss,
update,
};
}

function useNotification() {
const [state, setState] = React.useState<State>(memoryState);

React.useEffect(() => {
listeners.push(setState);
return () => {
const index = listeners.indexOf(setState);
if (index > -1) {
listeners.splice(index, 1);
}
};
}, [state]);

return {
...state,
notification,
dismiss: (notificationId?: string) =>
dispatch({ type: 'DISMISS_NOTIFICATION', notificationId }),
};
}

export { notification, useNotification };
Add the NotificationProvider component in layout.tsx:
/app/layout.tsx

import { NotificationProvider } from '@/components/ui/notification-provider';

export default function RootLayout({ children }) {
return (

<html lang='en'>
<head />
<body>
<main>{children}</main>
<NotificationProvider />
</body>
</html>
);
}
Update the import paths to match your project setup.
Examples
Variants
Preview
Code
Copy
Filled & Error
Light & Warning
Lighter & Information
Stroke & Success
With Action
Preview
Code
Copy
With onClick action
With Link
Preview
Code
Copy
With Link
With Secondary Action
Preview
Code
Copy
With Secondary Action
API Reference
This component is based on the Radix UI Toast primitives. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Examples
Variants
With Action
With Link
With Secondary Action
API Reference
Notification | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Progress Bar
A progress bar is a simple chart that can be used to show how complete something is.

Preview
Code
Copy
Create a progress-bar.tsx file and paste the following code into it.
/components/ui/progress-bar.tsx

// AlignUI ProgressBar v0.0.0

import \* as React from 'react';

import { tv, type VariantProps } from '@/utils/tv';

export const progressBarVariants = tv({
slots: {
root: 'h-1.5 w-full rounded-full bg-bg-soft-200',
progress: 'h-full rounded-full transition-all duration-300 ease-out',
},
variants: {
color: {
blue: {
progress: 'bg-information-base',
},
red: {
progress: 'bg-error-base',
},
orange: {
progress: 'bg-warning-base',
},
green: {
progress: 'bg-success-base',
},
},
},
defaultVariants: {
color: 'blue',
},
});

type ProgressBarRootProps = React.HTMLAttributes<HTMLDivElement> &
VariantProps<typeof progressBarVariants> & {
value?: number;
max?: number;
};

const ProgressBarRoot = React.forwardRef<HTMLDivElement, ProgressBarRootProps>(
({ className, color, value = 0, max = 100, ...rest }, forwardedRef) => {
const { root, progress } = progressBarVariants({ color });
const safeValue = Math.min(max, Math.max(value, 0));

    return (
      <div ref={forwardedRef} className={root({ class: className })} {...rest}>
        <div
          className={progress()}
          style={{
            width: `${(safeValue / max) * 100}%`,
          }}
          aria-valuenow={value}
          aria-valuemax={max}
          role='progressbar'
        />
      </div>
    );

},
);
ProgressBarRoot.displayName = 'ProgressBarRoot';

export { ProgressBarRoot as Root };
Update the import paths to match your project setup.
Examples
Color
Preview
Code
Copy
With Label
Preview
Code
Copy
80%
Advanced
Preview
Code
Copy
Data Storage
80%
Upgrade to unlock unlimited date storage.
API Reference
ProgressBar.Root
The main component of the ProgressBar. It displays the progress with a colored bar inside a container. This component is based on the <div> element and supports all of its props and adds:

Prop Type Default
color

"blue"
|
"red"
|
"orange"
|
"green"
"blue"
value

number
max

number
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Examples
Color
With Label
Advanced
API Reference
ProgressBar.Root
Progress Bar | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Progress Circle
A progress circle is a simple chart that can be used to show how complete something is.

Preview
Code
Copy
import \* as ProgressCircle from '@/components/ui/progress-circle';

export function ProgressCircleDemo() {
return <ProgressCircle.Root value={50}>50%</ProgressCircle.Root>;
}
Create a progress-circle.tsx file and paste the following code into it.
/components/ui/progress-circle.tsx

// AlignUI ProgressCircle v0.0.0

import \* as React from 'react';

import { cn } from '@/utils/cn';
import { tv, type VariantProps } from '@/utils/tv';

export const progressCircleVariants = tv({
slots: {
text: '',
},
variants: {
size: {
'80': { text: 'text-label-sm' },
'72': { text: 'text-label-sm' },
'64': { text: 'text-label-sm' },
'56': { text: 'text-label-xs' },
'48': { text: 'text-label-xs' },
'44': { text: 'text-label-xs' },
},
},
defaultVariants: {
size: '80',
},
});

function getSizes({
size,
}: Pick<VariantProps<typeof progressCircleVariants>, 'size'>) {
switch (size) {
case '80':
return {
strokeWidth: 6.4,
radius: 40,
};
case '72':
return {
strokeWidth: 5.75,
radius: 36,
};
case '64':
return {
strokeWidth: 5.1,
radius: 32,
};
case '56':
return {
strokeWidth: 4.5,
radius: 28,
};
case '48':
return {
strokeWidth: 6.7,
radius: 24,
};
case '44':
return {
strokeWidth: 5.5,
radius: 22,
};
default:
return {
strokeWidth: 6.4,
radius: 40,
};
}
}

type ProgressCircleRootProps = Omit<React.SVGProps<SVGSVGElement>, 'value'> &
VariantProps<typeof progressCircleVariants> & {
value?: number;
max?: number;
children?: React.ReactNode;
color?: string;
};

const ProgressCircleRoot = React.forwardRef<
SVGSVGElement,
ProgressCircleRootProps

> (
> (

    {
      value = 0,
      max = 100,
      size,
      className,
      children,
      color = 'stroke-primary-base',
      ...rest
    }: ProgressCircleRootProps,
    forwardedRef,

) => {
const { text } = progressCircleVariants({ size });
const { strokeWidth, radius } = getSizes({ size });
const safeValue = Math.min(max, Math.max(value, 0));
const normalizedRadius = radius - strokeWidth / 2;
const circumference = normalizedRadius _ 2 _ Math.PI;
const offset = circumference - (safeValue / max) \* circumference;

    return (
      <>
        <div className={cn('relative', className)}>
          <svg
            ref={forwardedRef}
            width={radius * 2}
            height={radius * 2}
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            className='-rotate-90'
            role='progressbar'
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            {...rest}
          >
            <circle
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeWidth={strokeWidth}
              fill='none'
              className='stroke-bg-soft-200'
            />
            {safeValue >= 0 && (
              <circle
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={offset}
                fill='none'
                className={`${color} transition-all duration-300 ease-out`}
              />
            )}
          </svg>
          {children && (
            <div
              className={text({
                class:
                  'absolute inset-0 flex items-center justify-center text-center',
              })}
            >
              {children}
            </div>
          )}
        </div>
      </>
    );

},
);
ProgressCircleRoot.displayName = 'ProgressCircleRoot';

export { ProgressCircleRoot as Root };
Update the import paths to match your project setup.
Examples
Size
Preview
Code
Copy
0%
25%
50%
75%
100%
0%
25%
50%
75%
100%
0%
25%
50%
75%
100%
0%
25%
50%
75%
100%
API Reference
ProgressCircle.Root
The main component of the ProgressCircle. It displays a circular progress indicator with a customizable size and color. This component is based on the <svg> element and supports all of its props and adds:

Prop Type Default
size

"80"
|
"72"
|
"64"
|
"56"
|
"48"
"80"
value

number
max

number
100
children

React.ReactNode
undefined
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Examples
Size
API Reference
ProgressCircle.Root
Progress Circle | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Rating
The Rating Component offers a dynamic and visually engaging way for users to express their opinions.

We have a wide variety of rating component designs. Each has unique requirements. So it doesn't make sense to provide a single, all-encompassing rating component. Each rating system behaves differently and has specific styling and interaction needs.

Creating a single, all-encompassing rating component would reduce the flexibility. Instead, we've chosen to provide examples to help you build your own custom rating components to suit your specific needs.

Include these SVG icons before getting started:

/components/ui/svg-rating-icons.tsx

/\*_ ======== STAR ======== _/
export function SVGStarFill(props: React.SVGProps<SVGSVGElement>) {
return (
<svg
viewBox='0 0 20 20'
fill='none'
xmlns='http://www.w3.org/2000/svg'
{...props} >
<path
        d='M18.75 7.69221L12.5925 6.95272L9.99671 1.25L7.40096 6.95272L1.25 7.69221L5.7975 11.9626L4.59491 18.125L9.99671 15.0538L15.4051 18.125L14.2025 11.9626L18.75 7.69221Z'
        fill='currentColor'
      />
</svg>
);
}

export function SVGStarHalf(props: React.SVGProps<SVGSVGElement>) {
return (
<svg
viewBox='0 0 20 20'
fill='none'
xmlns='http://www.w3.org/2000/svg'
{...props} >
<path
        d='M18.75 7.69476L12.5925 6.95497L9.99671 1.25L7.40096 6.95497L1.25 7.69476L5.7975 11.9602L4.58834 18.125L9.99671 15.0526L15.4051 18.125L14.1959 11.9602L18.7434 7.69476H18.75ZM10.0033 13.533V4.43572L11.7119 8.19461L15.7665 8.68113L12.7699 11.4936L13.5651 15.5524L10.0033 13.533Z'
        fill='currentColor'
      />
</svg>
);
}

export function SVGStarLine(props: React.SVGProps<SVGSVGElement>) {
return (
<svg
viewBox='0 0 20 20'
fill='none'
xmlns='http://www.w3.org/2000/svg'
{...props} >
<path
        d='M15.4117 18.125L10.0033 15.0526L4.59491 18.125L5.80407 11.9602L1.25 7.69476L7.40096 6.95498L9.99671 1.25L12.5925 6.95498L18.75 7.69476L14.2025 11.9602L15.4117 18.125ZM10.0033 13.5264L13.5651 15.5458L12.7699 11.487L15.7665 8.67447L11.7119 8.18794L10.0033 4.42906L8.29469 8.18794L4.24005 8.67447L7.23667 11.487L6.44151 15.5458L10.0033 13.5264Z'
        fill='currentColor'
      />
</svg>
);
}

export function StarRating({ rating }: { rating: number }) {
const getStarIcon = (i: number) => {
if (rating >= i + 1) {
return <SVGStarFill className='size-5 text-yellow-500' key={i} />;
} else if (rating >= i + 0.5) {
return <SVGStarHalf className='size-5 text-yellow-500' key={i} />;
}
return <SVGStarLine className='size-5 text-stroke-sub-300' key={i} />;
};

return (

<div className='flex gap-0.5'>
{Array.from({ length: 5 }, (\_, i) => getStarIcon(i))}
</div>
);
}

/\*_ ======== HEART ======== _/
export function SVGHeartFill(props: React.SVGProps<SVGSVGElement>) {
return (
<svg
viewBox='0 0 20 20'
fill='none'
xmlns='http://www.w3.org/2000/svg'
{...props} >
<path
        d='M13.375 3.125C15.6535 3.125 17.5 4.98311 17.5 7.58446C17.5 12.7872 11.875 15.7601 10 16.875C8.125 15.7601 2.5 12.7872 2.5 7.58446C2.5 4.98311 4.375 3.125 6.625 3.125C8.02 3.125 9.25 3.86824 10 4.61149C10.75 3.86824 11.98 3.125 13.375 3.125Z'
        fill='currentColor'
      />
</svg>
);
}

export function SVGHeartHalf(props: React.SVGProps<SVGSVGElement>) {
return (
<svg
viewBox='0 0 20 20'
fill='none'
xmlns='http://www.w3.org/2000/svg'
{...props} >
<path
        d='M13.375 3.125C12.2 3.125 10.9438 3.68226 10.0063 4.61521C9.06875 3.68226 7.8 3.125 6.625 3.125C4.3125 3.125 2.5 5.08481 2.5 7.59563C2.5 9.81216 3.525 11.8909 5.55 13.7881C7 15.1469 8.5875 16.0798 9.6875 16.7185L10.0437 16.875L10.3562 16.6934C11.3438 16.1174 13 15.1469 14.45 13.7881C16.475 11.8972 17.5 9.81216 17.5 7.59563C17.5 5.04724 15.725 3.125 13.375 3.125ZM13.6 12.8677C12.4 13.9948 11.0312 14.815 10.0063 15.4224C10.0438 13.688 10.0312 8.6538 10.0063 6.36214L10.8813 5.50433C11.15 5.24135 12.1125 4.37728 13.375 4.37728C15.0125 4.37728 16.25 5.76104 16.25 7.59563C16.25 9.43021 15.3562 11.221 13.6 12.8677Z'
        fill='currentColor'
      />
</svg>
);
}

export function SVGHeartLine(props: React.SVGProps<SVGSVGElement>) {
return (
<svg
viewBox='0 0 20 20'
fill='none'
xmlns='http://www.w3.org/2000/svg'
{...props} >
<path
        d='M10.0437 16.875L9.6875 16.7185C8.5875 16.0735 7 15.1406 5.55 13.7881C3.525 11.8909 2.5 9.8059 2.5 7.59563C2.5 5.08481 4.3125 3.125 6.625 3.125C7.8 3.125 9.0625 3.68226 10 4.61521C10.9375 3.68226 12.2 3.125 13.375 3.125C15.725 3.125 17.5 5.04724 17.5 7.59563C17.5 9.81216 16.475 11.8909 14.45 13.7881C13 15.1469 11.3438 16.1174 10.3562 16.6934L10.0437 16.875ZM6.625 4.37728C4.9875 4.37728 3.75 5.76104 3.75 7.59563C3.75 9.43021 4.64375 11.221 6.4 12.8677C7.63125 14.0198 9.00625 14.8651 10 15.4474C11.0312 14.8401 12.3813 14.0073 13.6 12.8677C15.3562 11.221 16.25 9.449 16.25 7.59563C16.25 5.74226 15.0125 4.37728 13.375 4.37728C12.1125 4.37728 11.1438 5.24135 10.8813 5.50433L10 6.37466L9.11875 5.50433C8.85 5.24135 7.8875 4.37728 6.625 4.37728Z'
        fill='currentColor'
      />
</svg>
);
}
Examples
Rating Review
Preview
Code
Copy
Rating Review With Label
Preview
Code
Copy
0.5 ∙ 5.2K Ratings
18 reviews
4.5 ∙ 5.2K Ratings
18 reviews
Rating Cell
Preview
Code
Copy

Rating Bar Star
Preview
Code
Copy

Rating Bar Heart
Preview
Code
Copy

Rating Bar Single Selectable
Preview
Code
Copy
😔
😕
😐
🙂
😄
1
2
3
4
5
Rating Bar With Textarea
Preview
Code
Copy
1
2
3
4
5
Tell us why
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Examples
Rating Review
Rating Review With Label
Rating Cell
Rating Bar Star
Rating Bar Heart
Rating Bar Single Selectable
Rating Bar With Textarea
Rating | AlignUI Documentation

|

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Toast
Multiple notifications may stack up as Toasts, delivering brief feedback in a compact size.

sonner
Preview
Code
Copy
Render Toast
This component is intended to be used with the <Alert> component. Refer to the Alert documentation for setup instructions before using this component.
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install sonner
Create a toast.tsx file and paste the following code into it.
/components/ui/toast.tsx

// AlignUI Toast v0.0.0

import { toast as sonnerToast, Toaster, type ToasterProps } from 'sonner';

const defaultOptions: ToasterProps = {
className: 'group/toast',
position: 'bottom-center',
};

const customToast = (
renderFunc: (t: string | number) => React.ReactElement,
options: ToasterProps = {},
) => {
const mergedOptions = { ...defaultOptions, ...options };
return sonnerToast.custom(renderFunc, mergedOptions);
};

const toast = {
...sonnerToast,
custom: customToast,
};

export { toast, Toaster };
Create a components/ui/toast-alert.tsx file and paste the following code into it.

import \* as React from 'react';
import {
RiAlertFill,
RiCheckboxCircleFill,
RiErrorWarningFill,
RiInformationFill,
RiMagicFill,
} from '@remixicon/react';

import \* as Alert from '@/components/ui/alert';
import { toast } from '@/components/ui/toast';

type AlertToastProps = {
t: string | number;
status?: React.ComponentPropsWithoutRef<typeof Alert.Root>['status'];
variant?: React.ComponentPropsWithoutRef<typeof Alert.Root>['variant'];
message: string;
dismissable?: boolean;
icon?: React.ElementType;
};

const AlertToast = React.forwardRef<
React.ComponentRef<typeof Alert.Root>,
AlertToastProps

> (
> (

    {
      t,
      status = 'feature',
      variant = 'stroke',
      message,
      dismissable = true,
      icon,
    },
    forwardedRef,

) => {
let Icon: React.ElementType;

    if (icon) {
      Icon = icon;
    } else {
      switch (status) {
        case 'success':
          Icon = RiCheckboxCircleFill;
          break;
        case 'warning':
          Icon = RiAlertFill;
          break;
        case 'error':
          Icon = RiErrorWarningFill;
          break;
        case 'information':
          Icon = RiInformationFill;
          break;
        case 'feature':
          Icon = RiMagicFill;
          break;
        default:
          Icon = RiErrorWarningFill;
          break;
      }
    }

    return (
      <Alert.Root
        ref={forwardedRef}
        status={status}
        variant={variant}
        size='small'
        className='w-[360px]'
      >
        <Alert.Icon as={Icon} />
        {message}
        {dismissable && (
          <button type='button' onClick={() => toast.dismiss(t)}>
            <Alert.CloseIcon />
          </button>
        )}
      </Alert.Root>
    );

},
);
AlertToast.displayName = 'AlertToast';

export { AlertToast as Root };
Add the Toaster component in layout.tsx:
/app/layout.tsx

import { Toaster } from '@/components/ui/toast';

export default function RootLayout({ children }) {
return (

<html lang='en'>
<head />
<body>
<main>{children}</main>
<Toaster />
</body>
</html>
);
}
Update the import paths to match your project setup.
Examples
Non-dismissable
Preview
Code
Copy
Render Toast
Sonner Options
Preview
Code
Copy
top-center
bottom-right
API Reference
This component is based on the Sonner package. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Examples
Non-dismissable
Sonner Options
API Reference
Toast | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Accordion
Allows you to display content in a collapsible manner, making it easy for users to access information while conserving screen space.

@radix-ui/react-accordion
Preview
Code
Copy
How do I update my account information?
What payment methods are accepted?
How can I track my order?
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-accordion
Create a accordion.tsx file and paste the following code into it.
/components/ui/accordion.tsx

// AlignUI Accordion v0.0.0

'use client';

import _ as React from 'react';
import _ as AccordionPrimitive from '@radix-ui/react-accordion';
import { RiAddLine, RiSubtractLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import type { PolymorphicComponentProps } from '@/utils/polymorphic';

const ACCORDION_ITEM_NAME = 'AccordionItem';
const ACCORDION_ICON_NAME = 'AccordionIcon';
const ACCORDION_ARROW_NAME = 'AccordionArrow';
const ACCORDION_TRIGGER_NAME = 'AccordionTrigger';
const ACCORDION_CONTENT_NAME = 'AccordionContent';

const AccordionRoot = AccordionPrimitive.Root;
const AccordionHeader = AccordionPrimitive.Header;

const AccordionItem = React.forwardRef<
React.ComponentRef<typeof AccordionPrimitive.Item>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <AccordionPrimitive.Item
      ref={forwardedRef}
      className={cn(
        // base
        'group/accordion',
        'rounded-10 bg-bg-white-0 p-3.5 ring-1 ring-inset ring-stroke-soft-200',
        'transition duration-200 ease-out',
        // hover
        'hover:bg-bg-weak-50 hover:ring-transparent',
        // has-focus-visible
        'has-[:focus-visible]:bg-bg-weak-50 has-[:focus-visible]:ring-transparent',
        // open
        'data-[state=open]:bg-bg-weak-50 data-[state=open]:ring-transparent',
        className,
      )}
      {...rest}
    />

);
});
AccordionItem.displayName = ACCORDION_ITEM_NAME;

const AccordionTrigger = React.forwardRef<
React.ComponentRef<typeof AccordionPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>

> (({ children, className, ...rest }, forwardedRef) => {
> return (

    <AccordionPrimitive.Trigger
      ref={forwardedRef}
      className={cn(
        // base
        'w-[calc(100%+theme(space.7))] text-left text-label-sm text-strong-950',
        'grid auto-cols-auto grid-flow-col grid-cols-[auto,minmax(0,1fr)] items-center gap-2.5',
        '-m-3.5 p-3.5 outline-none',
        // focus
        'focus:outline-none',
        className,
      )}
      {...rest}
    >
      {children}
    </AccordionPrimitive.Trigger>

);
});
AccordionTrigger.displayName = ACCORDION_TRIGGER_NAME;

function AccordionIcon<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || 'div';

return (
<Component
className={cn('size-5 text-sub-600', className)}
{...rest}
/>
);
}
AccordionIcon.displayName = ACCORDION_ICON_NAME;

type AccordionArrowProps = React.HTMLAttributes<HTMLDivElement> & {
openIcon?: React.ElementType;
closeIcon?: React.ElementType;
};

// open/close
function AccordionArrow({
className,
openIcon: OpenIcon = RiAddLine,
closeIcon: CloseIcon = RiSubtractLine,
...rest
}: AccordionArrowProps) {
return (
<>
<OpenIcon
className={cn(
'size-5 text-soft-400',
'transition duration-200 ease-out',
// hover
'group-hover/accordion:text-sub-600',
// open
'group-data-[state=open]/accordion:hidden',
className,
)}
{...rest}
/>
<CloseIcon
className={cn(
'size-5 text-sub-600',
// close
'hidden group-data-[state=open]/accordion:block',
className,
)}
{...rest}
/>
</>
);
}
AccordionArrow.displayName = ACCORDION_ARROW_NAME;

const AccordionContent = React.forwardRef<
React.ComponentRef<typeof AccordionPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>

> (({ children, className, ...rest }, forwardedRef) => {
> return (

    <AccordionPrimitive.Content
      ref={forwardedRef}
      className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'
      {...rest}
    >
      <div
        className={cn('pt-1.5 text-paragraph-sm text-sub-600', className)}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>

);
});
AccordionContent.displayName = ACCORDION_CONTENT_NAME;

export {
AccordionRoot as Root,
AccordionHeader as Header,
AccordionItem as Item,
AccordionTrigger as Trigger,
AccordionIcon as Icon,
AccordionArrow as Arrow,
AccordionContent as Content,
};
Update the import paths to match your project setup.
Examples
Arrow Position
Preview
Code
Copy
Insert your accordion title here
Insert your accordion title here
Insert your accordion title here
API Reference
This component is based on the Radix UI Accordion primitives. Refer to their documentation for the API reference.

Accordion.Root
This component is based on the Accordion.Root primitive.

Accordion.Item
This component is based on the Accordion.Item primitive.

Accordion.Header
This component is based on the Accordion.Header primitive.

Accordion.Trigger
This component is based on the Accordion.Trigger primitive.

Accordion.Content
This component is based on the Accordion.Content primitive.

Accordion.Icon
This component is polymorphic, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
div
Accordion.Arrow
The Accordion.Arrow component displays an icon that toggles between an open and closed state based on the accordion's state.

Prop Type Default
openIcon

React.ElementType
RiAddLine
closeIcon

React.ElementType
RiSubtractLine
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Examples
Arrow Position
API Reference
Accordion.Root
Accordion.Item
Accordion.Header
Accordion.Trigger
Accordion.Content
Accordion.Icon
Accordion.Arrow
Accordion | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Tab Menu Horizontal
Provides a linear layout for making it easy to switch between sections or categories.

@radix-ui/react-tabs
Preview
Code
Copy
Overview
Dashboard
Settings
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-tabs
Create a use-tab-observer.ts file and paste the following code into it.
/hooks/use-tab-observer.ts

// AlignUI useTabObserver v0.0.0

import \* as React from 'react';

interface TabObserverOptions {
onActiveTabChange?: (index: number, element: HTMLElement) => void;
}

export function useTabObserver({ onActiveTabChange }: TabObserverOptions = {}) {
const [mounted, setMounted] = React.useState(false);
const listRef = React.useRef<HTMLDivElement>(null);
const onActiveTabChangeRef = React.useRef(onActiveTabChange);

React.useEffect(() => {
onActiveTabChangeRef.current = onActiveTabChange;
}, [onActiveTabChange]);

const handleUpdate = React.useCallback(() => {
if (listRef.current) {
const tabs = listRef.current.querySelectorAll('[role="tab"]');
tabs.forEach((el, i) => {
if (el.getAttribute('data-state') === 'active') {
onActiveTabChangeRef.current?.(i, el as HTMLElement);
}
});
}
}, []);

React.useEffect(() => {
setMounted(true);

    const resizeObserver = new ResizeObserver(handleUpdate);
    const mutationObserver = new MutationObserver(handleUpdate);

    if (listRef.current) {
      resizeObserver.observe(listRef.current);
      mutationObserver.observe(listRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    handleUpdate();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };

}, []);

return { mounted, listRef };
}
Create a tab-menu-horizontal.tsx file and paste the following code into it.
/components/ui/tab-menu-horizontal.tsx

// AlignUI TabMenuHorizontal v0.0.0

'use client';

import _ as React from 'react';
import { Slottable } from '@radix-ui/react-slot';
import _ as TabsPrimitive from '@radix-ui/react-tabs';
import mergeRefs from 'merge-refs';

import { useTabObserver } from '@/hooks/use-tab-observer';
import { cn } from '@/utils/cn';
import type { PolymorphicComponentProps } from '@/utils/polymorphic';

const TabMenuHorizontalContent = TabsPrimitive.Content;
TabMenuHorizontalContent.displayName = 'TabMenuHorizontalContent';

const TabMenuHorizontalRoot = React.forwardRef<
React.ComponentRef<typeof TabsPrimitive.Root>,
Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, 'orientation'>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <TabsPrimitive.Root
      ref={forwardedRef}
      orientation='horizontal'
      className={cn('w-full', className)}
      {...rest}
    />

);
});
TabMenuHorizontalRoot.displayName = 'TabMenuHorizontalRoot';

const TabMenuHorizontalList = React.forwardRef<
React.ComponentRef<typeof TabsPrimitive.List>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
wrapperClassName?: string;
}

> (({ children, className, wrapperClassName, ...rest }, forwardedRef) => {
> const [lineStyle, setLineStyle] = React.useState({ width: 0, left: 0 });
> const listWrapperRef = React.useRef<HTMLDivElement>(null);

const { mounted, listRef } = useTabObserver({
onActiveTabChange: (\_, activeTab) => {
const { offsetWidth: width, offsetLeft: left } = activeTab;
setLineStyle({ width, left });

      const listWrapper = listWrapperRef.current;
      if (listWrapper) {
        const containerWidth = listWrapper.clientWidth;
        const scrollPosition = left - containerWidth / 2 + width / 2;

        listWrapper.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    },

});

return (

<div
ref={listWrapperRef}
className={cn(
'relative grid overflow-x-auto overflow-y-hidden overscroll-contain',
wrapperClassName,
)} >
<TabsPrimitive.List
ref={mergeRefs(forwardedRef, listRef)}
className={cn(
'group/tab-list relative flex h-12 items-center gap-6 whitespace-nowrap border-y border-stroke-soft-200',
className,
)}
{...rest} >
<Slottable>{children}</Slottable>

        {/* Floating Bg */}
        <div
          className={cn(
            'absolute -bottom-px left-0 h-0.5 bg-primary-base opacity-0 transition-all duration-300 group-has-[[data-state=active]]/tab-list:opacity-100',
            {
              hidden: !mounted,
            },
          )}
          style={{
            transform: `translate3d(${lineStyle.left}px, 0, 0)`,
            width: `${lineStyle.width}px`,
            transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
          }}
          aria-hidden='true'
        />
      </TabsPrimitive.List>
    </div>

);
});
TabMenuHorizontalList.displayName = 'TabMenuHorizontalList';

const TabMenuHorizontalTrigger = React.forwardRef<
React.ComponentRef<typeof TabsPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <TabsPrimitive.Trigger
      ref={forwardedRef}
      className={cn(
        // base
        'group/tab-item h-12 py-3.5 text-label-sm text-sub-600 outline-none',
        'flex items-center justify-center gap-1.5',
        'transition duration-200 ease-out',
        // focus
        'focus:outline-none',
        // active
        'data-[state=active]:text-strong-950',
        className,
      )}
      {...rest}
    />

);
});
TabMenuHorizontalTrigger.displayName = 'TabMenuHorizontalTrigger';

function TabMenuHorizontalIcon<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || 'div';

return (
<Component
className={cn(
// base
'size-5 text-sub-600',
'transition duration-200 ease-out',
// active
'group-data-[state=active]/tab-item:text-primary-base',
className,
)}
{...rest}
/>
);
}
TabMenuHorizontalIcon.displayName = 'TabsHorizontalIcon';

function TabMenuHorizontalArrowIcon<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T, React.HTMLAttributes<HTMLDivElement>>) {
const Component = as || 'div';

return (
<Component
className={cn('size-5 text-sub-600', className)}
{...rest}
/>
);
}
TabMenuHorizontalArrowIcon.displayName = 'TabsHorizontalArrow';

export {
TabMenuHorizontalRoot as Root,
TabMenuHorizontalList as List,
TabMenuHorizontalTrigger as Trigger,
TabMenuHorizontalIcon as Icon,
TabMenuHorizontalArrowIcon as ArrowIcon,
TabMenuHorizontalContent as Content,
};
Update the import paths to match your project setup.
Examples
Overflowing Tabs
Preview
Code
Copy
Profile
Company
Notifications
Team
Privacy & Security
Integrations
Localization
API Reference
This component is based on the Radix UI Tabs primitives. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Overflowing Tabs
API Reference
Tab Menu Horizontal | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Tab Menu Vertical
Provides a stacked layout for making it easy to switch between sections or categories.

@radix-ui/react-tabs
Preview
Code
Copy
Profile Settings
Contact Information
Social Links
Export Data
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-tabs
Create a tab-menu-vertical.tsx file and paste the following code into it.
/components/ui/tab-menu-vertical.tsx

'use client';

import _ as React from 'react';
import _ as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/utils/cn';
import { PolymorphicComponentProps } from '@/utils/polymorphic';

const TabMenuVerticalContent = TabsPrimitive.Content;
TabMenuVerticalContent.displayName = 'TabMenuVerticalContent';

type TabMenuVerticalRootProps = Omit<
React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
'orientation'

> ;

const TabMenuVerticalRoot = React.forwardRef<
React.ComponentRef<typeof TabsPrimitive.Root>,
TabMenuVerticalRootProps

> (({ ...rest }, forwardedRef) => {
> return (

    <TabsPrimitive.Root ref={forwardedRef} orientation='vertical' {...rest} />

);
});
TabMenuVerticalRoot.displayName = 'TabMenuVerticalRoot';

const TabMenuVerticalList = React.forwardRef<
React.ComponentRef<typeof TabsPrimitive.List>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <TabsPrimitive.List
      ref={forwardedRef}
      className={cn('w-full space-y-2', className)}
      {...rest}
    />

);
});
TabMenuVerticalList.displayName = 'TabMenuVerticalList';

const TabMenuVerticalTrigger = React.forwardRef<
React.ComponentRef<typeof TabsPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <TabsPrimitive.Trigger
      ref={forwardedRef}
      className={cn(
        // base
        'group/tab-item w-full rounded-lg p-2 text-left text-label-sm text-sub-600 outline-none',
        'grid auto-cols-auto grid-flow-col grid-cols-[auto,minmax(0,1fr)] items-center gap-1.5',
        'transition duration-200 ease-out',
        // hover
        'hover:bg-bg-weak-50',
        // focus
        'focus:outline-none',
        // active
        'data-[state=active]:bg-bg-weak-50 data-[state=active]:text-strong-950',
        className,
      )}
      {...rest}
    />

);
});
TabMenuVerticalTrigger.displayName = 'TabMenuVerticalTrigger';

function TabMenuVerticalIcon<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || 'div';

return (
<Component
className={cn(
// base
'size-5 text-sub-600',
'transition duration-200 ease-out',
// active
'group-data-[state=active]/tab-item:text-primary-base',
className,
)}
{...rest}
/>
);
}
TabMenuVerticalIcon.displayName = 'TabsVerticalIcon';

function TabMenuVerticalArrowIcon<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || 'div';

return (
<Component
className={cn(
// base
'size-5 p-px text-sub-600',
'rounded-full bg-bg-white-0 opacity-0 shadow-regular-xs',
'scale-75 transition ease-out',
// active
'group-data-[state=active]/tab-item:scale-100 group-data-[state=active]/tab-item:opacity-100',
className,
)}
{...rest}
/>
);
}
TabMenuVerticalArrowIcon.displayName = 'TabMenuVerticalArrowIcon';

export {
TabMenuVerticalRoot as Root,
TabMenuVerticalList as List,
TabMenuVerticalTrigger as Trigger,
TabMenuVerticalIcon as Icon,
TabMenuVerticalArrowIcon as ArrowIcon,
TabMenuVerticalContent as Content,
};
Update the import paths to match your project setup.
Examples
With Heading
Preview
Code
Copy
Settings
Profile Settings
Contact Information
Social Links
Export Data
Styled Container
Preview
Code
Copy
Settings
Profile Settings
Contact Information
Social Links
Export Data
API Reference
This component is based on the Radix UI Tabs primitives. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
With Heading
Styled Container
API Reference
Tab Menu Vertical | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Segmented Control
Segmented control is used to pick one choice from a linear set of closely related choices, and immediately apply that selection.

@radix-ui/react-tabs
Preview
Code
Copy
Light
Dark
System
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-tabs
Create a use-tab-observer.ts file and paste the following code into it.
/hooks/use-tab-observer.ts

// AlignUI useTabObserver v0.0.0

import \* as React from 'react';

interface TabObserverOptions {
onActiveTabChange?: (index: number, element: HTMLElement) => void;
}

export function useTabObserver({ onActiveTabChange }: TabObserverOptions = {}) {
const [mounted, setMounted] = React.useState(false);
const listRef = React.useRef<HTMLDivElement>(null);
const onActiveTabChangeRef = React.useRef(onActiveTabChange);

React.useEffect(() => {
onActiveTabChangeRef.current = onActiveTabChange;
}, [onActiveTabChange]);

const handleUpdate = React.useCallback(() => {
if (listRef.current) {
const tabs = listRef.current.querySelectorAll('[role="tab"]');
tabs.forEach((el, i) => {
if (el.getAttribute('data-state') === 'active') {
onActiveTabChangeRef.current?.(i, el as HTMLElement);
}
});
}
}, []);

React.useEffect(() => {
setMounted(true);

    const resizeObserver = new ResizeObserver(handleUpdate);
    const mutationObserver = new MutationObserver(handleUpdate);

    if (listRef.current) {
      resizeObserver.observe(listRef.current);
      mutationObserver.observe(listRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    handleUpdate();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };

}, []);

return { mounted, listRef };
}
Create a segmented-control.tsx file and paste the following code into it.
/components/ui/segmented-control.tsx

// AlignUI SegmentedControl v0.0.0

'use client';

import _ as React from 'react';
import { Slottable } from '@radix-ui/react-slot';
import _ as TabsPrimitive from '@radix-ui/react-tabs';
import mergeRefs from 'merge-refs';

import { useTabObserver } from '@/hooks/use-tab-observer';
import { cn } from '@/utils/cn';

const SegmentedControlRoot = TabsPrimitive.Root;
SegmentedControlRoot.displayName = 'SegmentedControlRoot';

const SegmentedControlList = React.forwardRef<
React.ComponentRef<typeof TabsPrimitive.List>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
floatingBgClassName?: string;
}

> (({ children, className, floatingBgClassName, ...rest }, forwardedRef) => {
> const [lineStyle, setLineStyle] = React.useState({ width: 0, left: 0 });

const { mounted, listRef } = useTabObserver({
onActiveTabChange: (\_, activeTab) => {
const { offsetWidth: width, offsetLeft: left } = activeTab;
setLineStyle({ width, left });
},
});

return (
<TabsPrimitive.List
ref={mergeRefs(forwardedRef, listRef)}
className={cn(
'relative isolate grid w-full auto-cols-fr grid-flow-col gap-1 rounded-10 bg-bg-weak-50 p-1',
className,
)}
{...rest} >
<Slottable>{children}</Slottable>

      {/* floating bg */}
      <div
        className={cn(
          'absolute inset-y-1 left-0 -z-10 rounded-md bg-bg-white-0 shadow-toggle-switch transition-transform duration-300',
          {
            hidden: !mounted,
          },
          floatingBgClassName,
        )}
        style={{
          transform: `translate3d(${lineStyle.left}px, 0, 0)`,
          width: `${lineStyle.width}px`,
          transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
        }}
        aria-hidden='true'
      />
    </TabsPrimitive.List>

);
});
SegmentedControlList.displayName = 'SegmentedControlList';

const SegmentedControlTrigger = React.forwardRef<
React.ComponentRef<typeof TabsPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>

> (({ className, ...rest }, forwardedRef) => {
> return (

    <TabsPrimitive.Trigger
      ref={forwardedRef}
      className={cn(
        // base
        'peer',
        'relative z-10 h-7 whitespace-nowrap rounded-md px-1 text-label-sm text-soft-400 outline-none',
        'flex items-center justify-center gap-1.5',
        'transition duration-300 ease-out',
        // focus
        'focus:outline-none',
        // active
        'data-[state=active]:text-strong-950',
        className,
      )}
      {...rest}
    />

);
});
SegmentedControlTrigger.displayName = 'SegmentedControlTrigger';

const SegmentedControlContent = React.forwardRef<
React.ComponentRef<typeof TabsPrimitive.Content>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>

> (({ ...rest }, forwardedRef) => {
> return <TabsPrimitive.Content ref={forwardedRef} {...rest} />;
> });
> SegmentedControlContent.displayName = 'SegmentedControlContent';

export {
SegmentedControlRoot as Root,
SegmentedControlList as List,
SegmentedControlTrigger as Trigger,
SegmentedControlContent as Content,
};
Update the import paths to match your project setup.
Examples
Rounded
Preview
Code
Copy

API Reference
This component is based on the Radix UI Tabs primitives. Refer to their documentation for the API reference.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Rounded
API Reference
Segmented Control | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Dot Stepper
Very minimal stepper. Often used as carousel dots.

@radix-ui/react-slot
Preview
Code
Copy

Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a dot-stepper.tsx file and paste the following code into it.
/components/ui/dot-stepper.tsx

// AlignUI DotStepper v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/utils/cn';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const DOT_STEPPER_ROOT_NAME = 'DotStepperRoot';
const DOT_STEPPER_ITEM_NAME = 'DotStepperItem';

export const dotStepperVariants = tv({
slots: {
root: 'flex flex-wrap',
item: [
// base
'shrink-0 rounded-full bg-bg-soft-200 outline-none transition duration-200 ease-out',
// focus
'focus:outline-none',
'focus-visible:ring-2 focus-visible:ring-stroke-strong-950',
],
},
variants: {
size: {
small: {
root: 'gap-2.5',
item: 'size-2',
},
xsmall: {
root: 'gap-1.5',
item: 'size-1',
},
},
},
defaultVariants: {
size: 'small',
},
});

type DotStepperSharedProps = VariantProps<typeof dotStepperVariants>;

type DotStepperRootProps = React.HTMLAttributes<HTMLDivElement> &
VariantProps<typeof dotStepperVariants> & {
asChild?: boolean;
};

function DotStepperRoot({
asChild,
children,
size,
className,
...rest
}: DotStepperRootProps) {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'div';
const { root } = dotStepperVariants({ size });

const sharedProps: DotStepperSharedProps = {
size,
};

const extendedChildren = recursiveCloneChildren(
children as React.ReactElement[],
sharedProps,
[DOT_STEPPER_ITEM_NAME],
uniqueId,
asChild,
);

return (
<Component className={root({ class: className })} {...rest}>
{extendedChildren}
</Component>
);
}
DotStepperRoot.displayName = DOT_STEPPER_ROOT_NAME;

type DotStepperItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
DotStepperSharedProps & {
asChild?: boolean;
active?: boolean;
};

const DotStepperItem = React.forwardRef<HTMLButtonElement, DotStepperItemProps>(
({ asChild, size, className, active, ...rest }, forwardedRef) => {
const Component = asChild ? Slot : 'button';
const { item } = dotStepperVariants({ size });

    return (
      <Component
        ref={forwardedRef}
        className={cn(item({ class: className }), {
          'bg-primary-base': active,
        })}
        {...rest}
      />
    );

},
);
DotStepperItem.displayName = DOT_STEPPER_ITEM_NAME;

export { DotStepperRoot as Root, DotStepperItem as Item };
Update the import paths to match your project setup.
Examples
Size
Preview
Code
Copy

With Radix Tabs
Preview
Code
Copy

content 1
API Reference
DotStepper.Root
This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
size

"small"
|
"xsmall"
"small"
asChild

boolean
DotStepper.Item
This component is based on the <button> element and supports all of its props. And adds:

Prop Type Default
active

boolean
asChild

boolean
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Size
With Radix Tabs
API Reference
DotStepper.Root
DotStepper.Item
Dot Stepper | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Horizontal Stepper
A versatile horizontal step indicator providing a clear visual guide through sequential processes.

@radix-ui/react-slot
Preview
Code
Copy

1
Personal

2
Role

3
Position
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a horizontal-stepper.tsx file and paste the following code into it.
/components/ui/horizontal-stepper.tsx

// AlignUI HorizontalStepper v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { RiArrowRightSLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import type { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const HORIZONTAL_STEPPER_ROOT_NAME = 'HorizontalStepperRoot';
const HORIZONTAL_STEPPER_SEPARATOR_NAME = 'HorizontalStepperSeparator';
const HORIZONTAL_STEPPER_ITEM_NAME = 'HorizontalStepperItem';
const HORIZONTAL_STEPPER_ITEM_INDICATOR_NAME = 'HorizontalStepperItemIndicator';

function HorizontalStepperRoot({
asChild,
children,
className,
...rest
}: React.HTMLAttributes<HTMLDivElement> & {
asChild?: boolean;
}) {
const Component = asChild ? Slot : 'div';

return (
<Component
className={cn('flex flex-wrap justify-center gap-4', className)}
{...rest} >
{children}
</Component>
);
}
HorizontalStepperRoot.displayName = HORIZONTAL_STEPPER_ROOT_NAME;

function HorizontalStepperSeparatorIcon<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || RiArrowRightSLine;

return (
<Component
className={cn('size-5 shrink-0 text-soft-400', className)}
{...rest}
/>
);
}
HorizontalStepperSeparatorIcon.displayName = HORIZONTAL_STEPPER_SEPARATOR_NAME;

const horizontalStepperItemVariants = tv({
slots: {
root: [
// base
'flex items-center gap-2 text-paragraph-sm',
],
indicator: [
// base
'flex size-5 shrink-0 items-center justify-center rounded-full text-label-xs',
],
},
variants: {
state: {
completed: {
root: 'text-strong-950',
indicator: 'bg-success-base text-static-white',
},
active: {
root: 'text-strong-950',
indicator: 'bg-primary-base text-static-white',
},
default: {
root: 'text-sub-600',
indicator:
'bg-bg-white-0 text-sub-600 ring-1 ring-inset ring-stroke-soft-200',
},
},
},
defaultVariants: {
state: 'default',
},
});

type HorizontalStepperItemSharedProps = VariantProps<
typeof horizontalStepperItemVariants

> ;

type HorizontalStepperItemProps =
React.ButtonHTMLAttributes<HTMLButtonElement> &
VariantProps<typeof horizontalStepperItemVariants> & {
asChild?: boolean;
};

const HorizontalStepperItem = React.forwardRef<
HTMLButtonElement,
HorizontalStepperItemProps

> (({ asChild, children, state, className, ...rest }, forwardedRef) => {
> const uniqueId = React.useId();
> const Component = asChild ? Slot : 'button';
> const { root } = horizontalStepperItemVariants({ state });

const sharedProps: HorizontalStepperItemSharedProps = {
state,
};

const extendedChildren = recursiveCloneChildren(
children as React.ReactElement[],
sharedProps,
[HORIZONTAL_STEPPER_ITEM_INDICATOR_NAME],
uniqueId,
asChild,
);

return (
<Component
ref={forwardedRef}
className={root({ class: className })}
{...rest} >
{extendedChildren}
</Component>
);
});
HorizontalStepperItem.displayName = HORIZONTAL_STEPPER_ITEM_NAME;

function HorizontalStepperItemIndicator({
state,
className,
children,
...rest
}: React.HTMLAttributes<HTMLDivElement> & HorizontalStepperItemSharedProps) {
const { indicator } = horizontalStepperItemVariants({ state });

if (state === 'completed') {
return (

<div className={indicator({ class: className })} {...rest}>
<svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='none'>
<path
            fill='currentColor'
            d='M15.1 7.453 8.726 13.82 4.9 10l1.275-1.274 2.55 2.548 5.1-5.094L15.1 7.453Z'
          />
</svg>
</div>
);
}

return (

<div className={indicator({ class: className })} {...rest}>
{children}
</div>
);
}
HorizontalStepperItemIndicator.displayName =
HORIZONTAL_STEPPER_ITEM_INDICATOR_NAME;

export {
HorizontalStepperRoot as Root,
HorizontalStepperSeparatorIcon as SeparatorIcon,
HorizontalStepperItem as Item,
HorizontalStepperItemIndicator as ItemIndicator,
};
Update the import paths to match your project setup.
Examples
With Radix Tabs
Preview
Code
Copy

1
Personal

2
Role

3
Position

4
Password

5
Summary
API Reference
HorizontalStepper.Root
Outer container that holds the stepper items and separator icons. This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
asChild

boolean
HorizontalStepper.SeparatorIcon
Icon used as a separator between stepper items. A polymorphic component, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
<RiArrowRightSLine />
HorizontalStepper.Item
Individual stepper item which can indicate the state of the step. This component is based on the <button> element and supports all of its props. And adds:

Prop Type Default
asChild

boolean
state

"default"
|
"active"
|
"completed"
"default"
HorizontalStepper.ItemIndicator
This component is based on the <div> element and supports all of its props.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
With Radix Tabs
API Reference
HorizontalStepper.Root
HorizontalStepper.SeparatorIcon
HorizontalStepper.Item
HorizontalStepper.ItemIndicator
Horizontal Stepper | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Base Components

Vertical Stepper
An adaptable vertical step indicator offering an intuitive progression representation for diverse layouts.

@radix-ui/react-slot
Preview
Code
Copy

1
Personal

2
Role

3
Position
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install @radix-ui/react-slot
Create a vertical-stepper.tsx file and paste the following code into it.
/components/ui/vertical-stepper.tsx

// AlignUI VerticalStepper v0.0.0

import \* as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { RiArrowRightSLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import type { PolymorphicComponentProps } from '@/utils/polymorphic';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import { tv, type VariantProps } from '@/utils/tv';

const VERTICAL_STEPPER_ROOT_NAME = 'VerticalStepperRoot';
const VERTICAL_STEPPER_ARROW_NAME = 'VerticalStepperArrow';
const VERTICAL_STEPPER_ITEM_NAME = 'VerticalStepperItem';
const VERTICAL_STEPPER_ITEM_INDICATOR_NAME = 'VerticalStepperItemIndicator';

function VerticalStepperRoot({
asChild,
children,
className,
...rest
}: React.HTMLAttributes<HTMLDivElement> & {
asChild?: boolean;
}) {
const Component = asChild ? Slot : 'div';
return (
<Component className={cn('w-full space-y-2', className)} {...rest}>
{children}
</Component>
);
}
VerticalStepperRoot.displayName = VERTICAL_STEPPER_ROOT_NAME;

function VerticalStepperArrow<T extends React.ElementType>({
className,
as,
...rest
}: PolymorphicComponentProps<T>) {
const Component = as || RiArrowRightSLine;

return (
<Component
className={cn('size-5 shrink-0 text-sub-600', className)}
{...rest}
/>
);
}
VerticalStepperArrow.displayName = VERTICAL_STEPPER_ARROW_NAME;

const verticalStepperItemVariants = tv({
slots: {
root: [
// base
'grid w-full auto-cols-auto grid-flow-col grid-cols-[auto,minmax(0,1fr)] items-center gap-2.5 rounded-10 p-2 text-left text-paragraph-sm',
],
indicator: [
// base
'flex size-5 shrink-0 items-center justify-center rounded-full text-label-xs',
],
},
variants: {
state: {
completed: {
root: 'bg-bg-weak-50 text-sub-600',
indicator: 'bg-success-base text-static-white',
},
active: {
root: 'bg-bg-white-0 text-strong-950 shadow-regular-xs',
indicator: 'bg-primary-base text-static-white',
},
default: {
root: 'bg-bg-weak-50 text-sub-600',
indicator: 'bg-bg-white-0 text-sub-600 shadow-regular-xs',
},
},
},
defaultVariants: {
state: 'default',
},
});

type VerticalStepperItemSharedProps = VariantProps<
typeof verticalStepperItemVariants

> ;

type VerticalStepperItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
VariantProps<typeof verticalStepperItemVariants> & {
asChild?: boolean;
};

const VerticalStepperItem = React.forwardRef<
HTMLButtonElement,
VerticalStepperItemProps

> (({ asChild, children, state, className, ...rest }, forwardedRef) => {
> const uniqueId = React.useId();
> const Component = asChild ? Slot : 'button';
> const { root } = verticalStepperItemVariants({ state });

const sharedProps: VerticalStepperItemSharedProps = {
state,
};

const extendedChildren = recursiveCloneChildren(
children as React.ReactElement[],
sharedProps,
[VERTICAL_STEPPER_ITEM_INDICATOR_NAME],
uniqueId,
asChild,
);

return (
<Component
ref={forwardedRef}
className={root({ class: className })}
{...rest} >
{extendedChildren}
</Component>
);
});
VerticalStepperItem.displayName = VERTICAL_STEPPER_ITEM_NAME;

function VerticalStepperItemIndicator({
state,
className,
children,
...rest
}: React.HTMLAttributes<HTMLDivElement> & VerticalStepperItemSharedProps) {
const { indicator } = verticalStepperItemVariants({ state });

if (state === 'completed') {
return (

<div className={indicator({ class: className })} {...rest}>
<svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' fill='none'>
<path
            fill='currentColor'
            d='M15.1 7.453 8.726 13.82 4.9 10l1.275-1.274 2.55 2.548 5.1-5.094L15.1 7.453Z'
          />
</svg>
</div>
);
}

return (

<div className={indicator({ class: className })} {...rest}>
{children}
</div>
);
}
VerticalStepperItemIndicator.displayName = VERTICAL_STEPPER_ITEM_INDICATOR_NAME;

export {
VerticalStepperRoot as Root,
VerticalStepperArrow as Arrow,
VerticalStepperItem as Item,
VerticalStepperItemIndicator as ItemIndicator,
};
Update the import paths to match your project setup.
Examples
With Radix Tabs
Preview
Code
Copy

1
Personal

2
Role

3
Position

4
Password

5
Summary
API Reference
VerticalStepper.Root
Outer container that holds the stepper items and separator icons. This component is based on the <div> element and supports all of its props. And adds:

Prop Type Default
asChild

boolean
VerticalStepper.Arrow
Arrow icon used to indicate active step item. A polymorphic component, allowing you to change the underlying HTML element using the as prop.

Prop Type Default
as

React.ElementType
<RiArrowRightSLine />
VerticalStepper.Item
Individual stepper item which can indicate the state of the step. This component is based on the <button> element and supports all of its props. And adds:

Prop Type Default
asChild

boolean
state

"default"
|
"active"
|
"completed"
"default"
VerticalStepper.ItemIndicator
This component is based on the <div> element and supports all of its props.

© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
With Radix Tabs
API Reference
VerticalStepper.Root
VerticalStepper.Arrow
VerticalStepper.Item
VerticalStepper.ItemIndicator
Vertical Stepper | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
cn
Utilities for combining classNames with or without custom tailwind configurations to manage style conflicts.

clsx
tailwind-merge
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install clsx tailwind-merge@^2
Create a utils/cn.ts file and paste the following code into it.
/utils/cn.ts

import { borderRadii, shadows, texts } from '@/tailwind.config';
import clsx, { type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

export { type ClassValue } from 'clsx';

export const twMergeConfig = {
extend: {
classGroups: {
'font-size': [
{
text: Object.keys(texts),
},
],
shadow: [
{
shadow: Object.keys(shadows),
},
],
rounded: [
{
rounded: Object.keys(borderRadii),
},
],
},
},
};

const customTwMerge = extendTailwindMerge(twMergeConfig);

/\*\*

- Utilizes `clsx` with `tailwind-merge`, use in cases of possible class conflicts.
  \*/
  export function cn(...classes: ClassValue[]) {
  return customTwMerge(clsx(...classes));
  }
  IntelliSense setup (optional)
  If you are using VSCode and the TailwindCSS IntelliSense Extension, you have to add the following to your .vscode/settings.json file to enable Intellisense features for cn and tv functions.

.vscode/settings.json

"tailwindCSS.experimental.classRegex": [
["([\"'`][^\"'`]_._?[\"'`])", "[\"'`]([^"'`]*).\*?[\"'`]"]
]
Prettier setup (optional)
If you're using prettier-plugin-tailwindcss, you can include cn in the functions list to ensure it gets sorted as well.

prettier.config.mjs

const config = {
// ...
plugins: ['prettier-plugin-tailwindcss'],
tailwindFunctions: ['cn'],
};

export default config;
Examples
cn
In this example, cn is used to merge Tailwind classes and conditionally apply styles based on the isActive prop while managing potential class conflicts.

/examples/cn-ext.ts

import { cn } from '@/utils/cn';

function MyComponent({
className,
isActive,
...rest
}: React.HTMLAttributes<HTMLDivElement> & {
isActive?: boolean;
}) {
return (

<div
className={cn(
'text-strong-950 bg-bg-white-0 size-3',
{
'text-white-0 bg-bg-strong-950': isActive,
},
className,
)}
{...rest}
/>
);
}
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
cn
cn | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
tv
An instance of tailwind-variants extended with AlignUI classes.

tailwind-variants
Installation
Install the following dependencies:
npm
pnpm
yarn
terminal

npm install tailwind-variants
Include the cn utility by referring to the cn page to set it up before adding tv.
Create a utils/tv.ts file and paste the following code into it.
/utils/tv.ts

import { createTV } from 'tailwind-variants';

import { twMergeConfig } from '@/utils/cn';

export type { VariantProps, ClassValue } from 'tailwind-variants';

export const tv = createTV({
twMergeConfig,
});
IntelliSense setup (optional)
If you are using VSCode and the TailwindCSS IntelliSense Extension, you have to add the following to your .vscode/settings.json file to enable Intellisense features for cn and tv functions.

.vscode/settings.json

"tailwindCSS.experimental.classRegex": [
["([\"'`][^\"'`]_._?[\"'`])", "[\"'`]([^"'`]*).\*?[\"'`]"]
]
Prettier setup (optional)
If you're using prettier-plugin-tailwindcss, you can include tv in the functions list to ensure it gets sorted as well.

prettier.config.mjs

const config = {
// ...
plugins: ['prettier-plugin-tailwindcss'],
tailwindFunctions: ['tv'],
};

export default config;
Examples
For examples and detailed usage, refer to tailwind-variants documentation.

All you need to do here is use the tv function from @/utils/tv instead of tailwind-variants package.

import { tv } from '@/utils/tv';
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
tv | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
recursiveCloneChildren
Recursively clones children, adding additional props to components with matched display names.

Installation
Create a utils/recursive-clone-children.tsx file and paste the following code into it.
/utils/recursive-clone-children.tsx

import \* as React from 'react';

/\*\*

- Recursively clones React children, adding additional props to components with matched display names.
-
- @param children - The node(s) to be cloned.
- @param additionalProps - The props to add to the matched components.
- @param displayNames - An array of display names to match components against.
- @param uniqueId - A unique ID prefix from the parent component to generate stable keys.
- @param asChild - Indicates whether the parent component uses the Slot component.
-
- @returns The cloned node(s) with the additional props applied to the matched components.
  \*/
  export function recursiveCloneChildren(
  children: React.ReactNode,
  additionalProps: any,
  displayNames: string[],
  uniqueId: string,
  asChild?: boolean,
  ): React.ReactNode | React.ReactNode[] {
  const mappedChildren = React.Children.map(
  children,
  (child: React.ReactNode, index) => {
  if (!React.isValidElement(child)) {
  return child;
  }
  const displayName =
  (child.type as React.ComponentType)?.displayName || '';
  const newProps = displayNames.includes(displayName)
  ? additionalProps
  : {};

        const childProps = (child as React.ReactElement<any>).props;

        return React.cloneElement(
          child,
          { ...newProps, key: `${uniqueId}-${index}` },
          recursiveCloneChildren(
            childProps?.children,
            additionalProps,
            displayNames,
            uniqueId,
            childProps?.asChild,
          ),
        );
      },

  );

return asChild ? mappedChildren?.[0] : mappedChildren;
}
Examples
Without asChild
If the component doesn't use Slot from @radix-ui/react-slot, you don't need to worry about the last parameter of the recursiveCloneChildren function.

Here is an example without asChild:

/demo-recursive-clone-children.tsx

import \* as React from 'react';
import { cn } from '@/utils/cn';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';

const BOX_ROOT_NAME = 'BoxRoot';
const BOX_ICON_NAME = 'BoxIcon';

type BoxProps = {
size?: 'large' | 'medium';
} & React.HTMLAttributes<HTMLDivElement>;

type SharedProps = Pick<BoxProps, 'size'>;

function Box({ children, className, size = 'large', ...rest }: BoxProps) {
const uniqueId = React.useId();
const sharedProps: SharedProps = {
size,
};

const extendedChildren = recursiveCloneChildren(
children as React.ReactElement[],
sharedProps,
[BOX_ICON_NAME],
uniqueId,
);

return (

<div
className={cn(
{
'px-4 py-3': size === 'large',
'px-3 py-2': size === 'medium',
},
className,
)}
{...rest} >
{extendedChildren}
</div>
);
}
Box.displayName = BOX_ROOT_NAME;

function BoxIcon({
size,
className,
...rest
}: SharedProps & React.HTMLAttributes<HTMLDivElement>) {
return (
<RiInformationLine
className={cn(
{
'size-5': size === 'large',
'size-4': size === 'medium',
},
className,
)}
{...rest}
/>
);
}
BoxIcon.displayName = BOX_ICON_NAME;

export { Box as Root, BoxIcon as Icon };
Here is how to use Box component:

/demo-recursive-clone-children.tsx

import \* as Box from '@/components/box';

export function BoxExample() {
return (
<Box.Root size='medium'>
Some content
<Box.Icon />{' '}
{/_ size prop will be passed down to the Icon from the Root _/}
</Box.Root>
);
}
With asChild
Let's consider the example above with asChild.

Here are the lines to add:

/demo-recursive-clone-children.tsx

import { Slot } from '@radix-ui/react-slot';

// ...

type BoxProps = {
size?: 'large' | 'medium';
asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

// ...

function Box({
// ...
asChild,
...rest
}: BoxProps) {
const uniqueId = React.useId();
const Component = asChild ? Slot : 'div';

// ...

const extendedChildren = recursiveCloneChildren(
children as React.ReactElement[],
sharedProps,
[BOX_ICON_NAME],
uniqueId,
asChild,
);

return (
<Component
// ... >
{extendedChildren}
</Component>
);
}
// ...
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Without asChild
With asChild
recursiveCloneChildren | AlignUI Documentation

V1.1

Getting Started
Introduction
Installation

All Products
Base Components
FREE
Components & Blocks
PRO
Sectoral Templates
PRO
Figma File
PRO

Foundations
Color
Typography

All Components
Actions
Button
Button Group
Compact Button
Fancy Button
Link Button
Social Button
Form Elements
Checkbox
Digit Input
File Upload
Hint
Input
Label
Radio
Select
Slider
NEW
Switch
Textarea
Indicators
Badge
Status Badge
Pickers
Color Picker
NEW
Date Picker
NEW
Time Picker
SOON
Overlay
Banner
SOON
Command Menu
Drawer
NEW
Dropdown
Modal
Popover
NEW
Data Display
Activity Feed
SOON
Avatar
Avatar Group
Avatar Group Compact
Data Table
NEW
Divider
Tag
Tooltip
Navigation
Breadcrumb
Pagination
Scroll
SOON
Feedback
Alert
Kbd
Notification
Progress Bar
Progress Circle
Rating
Toast
NEW
Panel
Accordion
Tab Menu Horizontal
Tab Menu Vertical
Segmented Control
Stepper Dot
Stepper Horizontal
Stepper Vertical
Utils
cn
tv
recursiveCloneChildren
Polymorphic

Quick search...
/
Polymorphic
Utility types for creating strongly typed polymorphic components.

An alternative to asChild prop. Usually used for Icon components. It is preferred over asChild to shorten the code and avoid unnecessary cloning.

Provides autocomplete and type checking for the given component. It's only necessary if you're using TypeScript.

Installation
Create a utils/polymorphic.ts file and paste the following code into it.

/utils/polymorphic.ts

type AsProp<T extends React.ElementType> = {
as?: T;
};

type PropsToOmit<T extends React.ElementType, P> = keyof (AsProp<T> & P);

type PolymorphicComponentProp<
T extends React.ElementType,
Props = {},

> = React.PropsWithChildren<Props & AsProp<T>> &
> Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T, Props>>;

export type PolymorphicRef<T extends React.ElementType> =
React.ComponentPropsWithRef<T>['ref'];

type PolymorphicComponentPropWithRef<
T extends React.ElementType,
Props = {},

> = PolymorphicComponentProp<T, Props> & { ref?: PolymorphicRef<T> };

export type PolymorphicComponentPropsWithRef<
T extends React.ElementType,
P = {},

> = PolymorphicComponentPropWithRef<T, P>;

export type PolymorphicComponentProps<
T extends React.ElementType,
P = {},

> = PolymorphicComponentProp<T, P>;

export type PolymorphicComponent<P> = {
<T extends React.ElementType>(
props: PolymorphicComponentPropsWithRef<T, P>,
): React.ReactNode;
};
Examples
Without forwardRef
In this example, we're using Ri24HoursFill icon by default for <Icon> if as prop is not specified.

/demo-polymorphic-without-forwardref.tsx

import { PolymorphicComponentProps } from '@/utils/polymorphic';
import { cn } from '@/utils/cn';
import { type RemixiconComponentType, Ri24HoursFill } from '@remixicon/react';

function Icon<T extends RemixiconComponentType>({
as,
className,
...rest
}: PolymorphicComponentProps<T, {}>) {
const Component = as || Ri24HoursFill;

return <Component className={cn('size-4', className)} {...rest} />;
}

// How to use:
function Example() {
return (
<>
<Icon />
<Icon as={RiInformationLine} />
</>
);
}
With forwardRef
Never used with forwardRef in AlignUI, but here's how to use it if needed.

/demo-polymorphic-with-forwardref.tsx

import \* as React from 'react';

import {
PolymorphicComponent,
PolymorphicComponentPropsWithRef,
PolymorphicRef,
} from '@/utils/polymorphic';
import { cn } from '@/utils/cn';

type ButtonOwnProps = {
size?: 'large' | 'medium';
};

const Button: PolymorphicComponent<ButtonOwnProps> = React.forwardRef(
<T extends React.ElementType = 'button'>(
{
as,
className,
size = 'large',
...rest
}: PolymorphicComponentPropsWithRef<T, ButtonOwnProps>,
forwardedRef?: PolymorphicRef<T>,
) => {
const Component = as || 'button';

    return (
      <Component
        ref={forwardedRef}
        className={cn(
          {
            'h-12 px-4': size === 'large',
            'h-9 px-3': size === 'medium',
          },
          className,
        )}
        {...rest}
      />
    );

},
);
© 2024 AlignUI Design System. All rights reserved.
ON THIS PAGE
Installation
Examples
Without forwardRef
With forwardRef
Polymorphic | AlignUI Documentation
