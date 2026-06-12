/**
 * Normalizes a Pakistani phone number to the format 923XXXXXXXXX
 * @param {string} phone - The phone number to normalize
 * @returns {string} - The normalized phone number
 */
const normalizePhone = (phone) => {
  if (!phone) return phone;

  // 1. Remove all spaces, dashes, and the "+" sign
  let normalized = phone.replace(/[\s\-+]/g, "");

  // 2. Convert numbers starting with "0" to "92"
  if (normalized.startsWith("0")) {
    normalized = "92" + normalized.substring(1);
  }

  // 3. If it starts with 3, assume it's missing 92 or 0 and add 92 (optional but good for robustness)
  // Actually, the regex ensures it starts with +92, 92, or 0, so this might not be needed if validated first.
  
  return normalized;
};

const phoneRegex = /^(?:\+92|92|0)?3\d{2}[- ]?\d{7}$/;

module.exports = {
  normalizePhone,
  phoneRegex,
};
