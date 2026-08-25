const slugify = require("slugify");

// PRODUCT SKU

const generateProductSku = (title) => {
  const base = slugify(title, {
    lower: true,
    strict: true,
  }).slice(0, 10);

  const rand = Math.floor(10000 + Math.random() * 90000);

  return `PROD-${base}-${rand}`;
};

// FORMAT VALUE

const formatValue = (value) => {
  return (
    String(value)
      // remove spaces & symbols
      .replace(/[^a-zA-Z0-9]/g, "")

      // uppercase
      .toUpperCase()

      // limit length
      .slice(0, 4)
  );
};

// FORMAT KEY

const formatKey = (key) => {
  return (
    String(key)
      // remove spaces & symbols
      .replace(/[^a-zA-Z]/g, "")

      // uppercase
      .toUpperCase()

      // first 3 chars
      .slice(0, 3)
  );
};

// VARIANT SKU

const generateVariantSku = (title, attributes = {}) => {
  // PRODUCT BASE

  const base = slugify(title, {
    lower: false,
    strict: true,
  })
    .replace(/-/g, "")

    .slice(0, 4)

    .toUpperCase();

  // SORT ATTRIBUTES
  // for same SKU order

  const sortedAttributes = Object.entries(attributes)

    .filter(([key, value]) => key && value)

    // alphabetical sorting
    .sort(([a], [b]) => a.localeCompare(b));

  const attributePart = sortedAttributes

    .map(([key, value]) => {
      const keyPart = formatKey(key);

      const valuePart = formatValue(value);

      return `${keyPart}${valuePart}`;
    })

    .join("-");

  const rand = Math.floor(1000 + Math.random() * 9000);

  return `${base}-${attributePart}-${rand}`;
};

module.exports = {
  generateProductSku,
  generateVariantSku,
};
