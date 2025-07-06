export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const pageview = (url) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}

export const event = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Helper functions for common tracking events
export const trackButtonClick = (buttonName, location) => {
  event({
    action: 'click',
    category: 'button',
    label: `${buttonName} - ${location}`,
  })
}

export const trackPageSection = (sectionName, action = 'view') => {
  event({
    action: action,
    category: 'page_section',
    label: sectionName,
  })
}

export const trackUserAction = (actionName, details = '') => {
  event({
    action: actionName,
    category: 'user_action',
    label: details,
  })
} 