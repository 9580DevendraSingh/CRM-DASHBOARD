// Helper functions

// Generate random color for avatars
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format date
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

// Get initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

// Pagination helper
const getPagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const offset = (currentPage - 1) * limit;

  return {
    currentPage,
    totalPages,
    offset,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

module.exports = {
  generateRandomColor,
  formatCurrency,
  formatDate,
  getInitials,
  getPagination
};