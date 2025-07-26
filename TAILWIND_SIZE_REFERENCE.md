# Tailwind Config Size Hierarchy Reference

## 📝 **Text Sizes**

### **Title Hierarchy** (font-weight: 500)
| Class | Size | Pixels | Use Case |
|-------|------|--------|----------|
| `text-title-h1` | 2.75rem | 44px | Largest headings |
| `text-title-h2` | 2.25rem | 36px | Main page titles |
| `text-title-h3` | 1.875rem | 30px | Section headers |
| `text-title-h4` | 1.5rem | 24px | Subsection headers |
| `text-title-h5` | 1.125rem | 18px | Card titles |
| `text-title-h6` | 1rem | 16px | Small headings |

### **Label Hierarchy** (font-weight: 500)
| Class | Size | Pixels | Use Case |
|-------|------|--------|----------|
| `text-label-xl` | 1.125rem | 18px | Large labels |
| `text-label-lg` | 0.875rem | 14px | Standard labels |
| `text-label-md` | 0.8rem | 12.8px | Medium labels |
| `text-label-sm` | 0.7rem | 11.2px | Small labels |
| `text-label-xs` | 0.625rem | 10px | Extra small labels |

### **Paragraph Hierarchy** (font-weight: 400)
| Class | Size | Pixels | Use Case |
|-------|------|--------|----------|
| `text-paragraph-xl` | 1.125rem | 18px | Large body text |
| `text-paragraph-lg` | 0.875rem | 14px | Standard body text |
| `text-paragraph-md` | 0.8rem | 12.8px | Medium body text |
| `text-paragraph-sm` | 0.7rem | 11.2px | Small body text |
| `text-paragraph-xs` | 0.625rem | 10px | Extra small body text |

### **Subheading Hierarchy** (font-weight: 500, uppercase)
| Class | Size | Pixels | Use Case |
|-------|------|--------|----------|
| `text-subheading-md` | 0.8rem | 12.8px | Medium subheadings |
| `text-subheading-sm` | 0.7rem | 11.2px | Small subheadings |
| `text-subheading-xs` | 0.6rem | 9.6px | Extra small subheadings |
| `text-subheading-2xs` | 0.55rem | 8.8px | Tiny subheadings |

### **Document Text**
| Class | Size | Pixels | Use Case |
|-------|------|--------|----------|
| `text-doc-label` | 0.875rem | 14px | Document labels |
| `text-doc-paragraph` | 0.875rem | 14px | Document body text |

---

## 🎯 **Icon Sizes**

| Class | Size | Pixels | Use Case |
|-------|------|--------|----------|
| `icon` | 1.1rem | 17.6px | Standard icons |
| `icon-sm` | 0.9rem | 14.4px | Small icons |
| `icon-xs` | 0.8rem | 12.8px | Extra small icons |
| `icon-2xs` | 0.7rem | 11.2px | Tiny icons |

---

## 📏 **Spacing & Layout Sizes**

### **Button Heights**
| Class | Size | Pixels | Use Case |
|-------|------|--------|----------|
| `h-button` | 1.875rem | 30px | Standard button height |

### **Custom Widths** (in rem)
| Class | Size | Pixels |
|-------|------|--------|
| `w-120` | 30rem | 480px |
| `w-116` | 29rem | 464px |
| `w-112` | 28rem | 448px |
| `w-108` | 27rem | 432px |
| `w-104` | 26rem | 416px |
| `w-100` | 25rem | 400px |
| `w-98` | 24.5rem | 392px |
| `w-94` | 23.5rem | 376px |
| `w-92` | 23rem | 368px |
| `w-90` | 22.5rem | 360px |
| `w-88` | 22rem | 352px |
| `w-86` | 21.5rem | 344px |
| `w-84` | 21rem | 336px |
| `w-82` | 20.5rem | 328px |
| `w-78` | 19.5rem | 312px |
| `w-76` | 19rem | 304px |
| `w-74` | 18.5rem | 296px |
| `w-70` | 17.5rem | 280px |
| `w-68` | 17rem | 272px |
| `w-66` | 16.5rem | 264px |
| `w-62` | 15.5rem | 248px |
| `w-58` | 14.5rem | 232px |
| `w-54` | 13.5rem | 216px |
| `w-50` | 12.5rem | 200px |

### **Custom Heights**
| Class | Size | Pixels |
|-------|------|--------|
| `h-30` | 7.5rem | 120px |
| `h-18` | 4.5rem | 72px |

### **Max Heights**
| Class | Size | Pixels |
|-------|------|--------|
| `max-h-8xl` | 90rem | 1440px |
| `max-h-7xl` | 80rem | 1280px |
| `max-h-6xl` | 72rem | 1152px |
| `max-h-5xl` | 64rem | 1024px |
| `max-h-4xl` | 56rem | 896px |
| `max-h-3xl` | 48rem | 768px |

### **Max Widths**
| Class | Size | Pixels |
|-------|------|--------|
| `max-w-11xl` | 120rem | 1920px |
| `max-w-10xl` | 110rem | 1760px |
| `max-w-9xl` | 100rem | 1600px |
| `max-w-8xl` | 90rem | 1440px |
| `max-w-7xl` | 80rem | 1280px |

---

## 🔄 **Border Radius**
| Class | Size | Pixels |
|-------|------|--------|
| `rounded-20` | 1.25rem | 20px |
| `rounded-10` | 0.625rem | 10px |

---

## 📱 **Breakpoints**

### **Width Breakpoints**
| Class | Size |
|-------|------|
| `mdlg` | 896px |
| `xs` | 475px |
| `2xs` | 375px |
| `3xs` | 275px |

### **Height Breakpoints**
| Class | Size |
|-------|------|
| `2xlh` | min-height: 2000px |
| `xlh` | min-height: 1400px |
| `lgh` | min-height: 1250px |
| `mdh` | min-height: 890px |
| `smh` | min-height: 610px |
| `xsh` | min-height: 480px |

---

## 💡 **Usage Guidelines**

### **Text Hierarchy Best Practices**
- **Headings**: Use `text-title-*` for page structure and navigation
- **Interactive Elements**: Use `text-label-*` for buttons, tabs, and form labels
- **Body Content**: Use `text-paragraph-*` for readable text content
- **Captions**: Use `text-subheading-*` for secondary information

### **Icon Sizing Guidelines**
- **UI Icons**: Use `icon` for standard interface icons
- **Small Actions**: Use `icon-sm` for secondary actions
- **Tiny Indicators**: Use `icon-xs` or `icon-2xs` for status indicators

### **Responsive Design**
- Combine with standard Tailwind breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- Use height breakpoints for mobile-specific layouts
- Example: `text-title-h1 md:text-title-h2 lg:text-title-h3`

### **Layout Examples**
```html
<!-- Card with proper text hierarchy -->
<div class="p-4">
  <h2 class="text-title-h4 mb-2">Card Title</h2>
  <p class="text-paragraph-md mb-3">Card description text</p>
  <button class="h-button text-label-sm">Action</button>
</div>

<!-- Icon with text -->
<div class="flex items-center gap-2">
  <Icon className="icon-sm" />
  <span class="text-label-sm">Label</span>
</div>
```

---

## 🎨 **Quick Reference**

### **Most Common Text Sizes**
- **Page Title**: `text-title-h2`
- **Section Header**: `text-title-h4`
- **Card Title**: `text-title-h5`
- **Body Text**: `text-paragraph-md`
- **Button Text**: `text-label-sm`
- **Caption**: `text-subheading-sm`

### **Most Common Icon Sizes**
- **Standard**: `icon`
- **Small**: `icon-sm`
- **Tiny**: `icon-xs`

### **Standard Button**
```html
<button class="h-button text-label-sm px-4 rounded-lg">
  Button Text
</button>
``` 