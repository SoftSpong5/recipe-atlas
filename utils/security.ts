// A simple utility to sanitize HTML strings to prevent XSS attacks.
// In a real production app, consider a more robust library like DOMPurify.
export const sanitizeHTML = (str: string): string => {
  if (typeof document === 'undefined') {
    // Basic sanitization for non-browser environments if needed
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
};

// Validates password strength
export const validatePassword = (password: string) => {
  const errors = [];
  if (password.length < 8) {
    errors.push("at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("an uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("a lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("a number");
  }
  return errors;
};
