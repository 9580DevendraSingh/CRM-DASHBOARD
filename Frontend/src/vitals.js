const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Example function for Vercel Analytics
export const sendToVercelAnalytics = (metric) => {
  if (window.va && typeof window.va === 'function') {
    window.va('send', 'event', {
      name: metric.name,
      value: metric.value,
      category: 'Web Vitals'
    });
  }
};

export default reportWebVitals;