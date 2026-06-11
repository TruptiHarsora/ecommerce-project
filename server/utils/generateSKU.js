// utils/generateSku.js

const slugify = require("slugify");


// ========================================
// PRODUCT SKU
// ========================================

const generateProductSku = (title) => {

   const base =
      slugify(title, {
         lower: true,
         strict: true,
      }).slice(0, 10);

   const rand =
      Math.floor(
         10000 + Math.random() * 90000
      );

   return `PROD-${base}-${rand}`;
};


// ========================================
// FORMAT VALUE
// ========================================

const formatValue = (value) => {

   return String(value)

      // remove spaces & symbols
      .replace(/[^a-zA-Z0-9]/g, "")

      // uppercase
      .toUpperCase()

      // limit length
      .slice(0, 4);
};


// ========================================
// FORMAT KEY
// ========================================

const formatKey = (key) => {

   return String(key)

      // remove spaces & symbols
      .replace(/[^a-zA-Z]/g, "")

      // uppercase
      .toUpperCase()

      // first 3 chars
      .slice(0, 3);
};


// ========================================
// VARIANT SKU
// ========================================

const generateVariantSku = (
   title,
   attributes = {}
) => {

   // =========================
   // PRODUCT BASE
   // =========================

   const base =
      slugify(title, {
         lower: false,
         strict: true,
      })

         .replace(/-/g, "")

         .slice(0, 4)

         .toUpperCase();


   // =========================
   // SORT ATTRIBUTES
   // IMPORTANT:
   // ensures same SKU order
   // =========================

   const sortedAttributes =
      Object.entries(attributes)

         .filter(([key, value]) =>
            key && value
         )

         // alphabetical sorting
         .sort(([a], [b]) =>
            a.localeCompare(b)
         );


   // =========================
   // ATTRIBUTE PART
   // =========================

   const attributePart =
      sortedAttributes

         .map(([key, value]) => {

            const keyPart =
               formatKey(key);

            const valuePart =
               formatValue(value);

            return `${keyPart}${valuePart}`;

         })

         .join("-");


   // =========================
   // RANDOM NUMBER
   // =========================

   const rand =
      Math.floor(
         1000 + Math.random() * 9000
      );


   // =========================
   // FINAL SKU
   // =========================

   return `${base}-${attributePart}-${rand}`;
};


module.exports = {
   generateProductSku,
   generateVariantSku,
};





// const slugify = require("slugify");

// const generateProductSku = (title) => {

//    const base =
//       slugify(title, {
//          lower: true,
//          strict: true,
//       }).slice(0, 10);

//    const rand =
//       Math.floor(
//          10000 + Math.random() * 90000
//       );

//    return `PROD-${base}-${rand}`;
// };


// const attributeShortMap = {
//    color: "CLR",
//    size: "SIZ",
//    storage: "STG",
//    ram: "RAM",
//    material: "MAT",
//    weight: "WGT",
//    style: "STY",
//    flavor: "FLV",
//    pattern: "PTR",
// };


// const formatValue = (value) => {

//    return String(value)
//       .replace(/[^a-zA-Z0-9]/g, "")
//       .toUpperCase()
//       .slice(0, 4);
// };

// const generateVariantSku = (
//    title,
//    attributes = {}
// ) => {

//    const base =
//       slugify(title, {
//          lower: false,
//          strict: true,
//       })
//          .replace(/-/g, "")
//          .slice(0, 6)
//          .toUpperCase();


//    const attributeEntries =
//       Object.entries(attributes);

 

//    const attributePart =
//       attributeEntries
//          .filter(([key, value]) =>
//             key && value
//          )

//          .map(([key, value]) => {

//             const normalizedKey =
//                key.toLowerCase().trim();

//             const shortKey =
//                attributeShortMap[normalizedKey]
//                || normalizedKey
//                   .slice(0, 3)
//                   .toUpperCase();

//             const formattedValue =
//                formatValue(value);

//             // COLOR → COB
//             if (normalizedKey === "color") {

//                return formattedValue
//                   .slice(0, 3);
//             }

//             // SIZE → XL
//             if (normalizedKey === "size") {

//                return formattedValue;
//             }

//             // STORAGE → 256
//             if (normalizedKey === "storage") {

//                return formattedValue
//                   .replace(/GB|TB/gi, "");
//             }

//             return `${shortKey}${formattedValue}`;

//          })

//          .join("-");


//    const rand =
//       Math.floor(
//          1000 + Math.random() * 9000
//       );

   
//    return `${base}-${attributePart}-${rand}`;
// };


// module.exports = {
//    generateProductSku,
//    generateVariantSku,
// };









// const slugify = require("slugify");

// const generateProductSku = (title) => {
//     const base = slugify(title, { lower: true, strict: true }).slice(0, 10);
//     const rand = Math.floor(10000 + Math.random() * 90000);

//     return `PROD-${base}-${rand}`;
// };

// // const generateVariantSku = (title, attributes = {}) => {
// //     const base = slugify(title, { lower: true, strict: true }).slice(0, 8);

// //     const color = attributes.color
// //         ? attributes.color.toLowerCase()
// //         : "na";

// //     const size = attributes.size
// //         ? attributes.size.replace(/[^0-9]/g, "")
// //         : "0";

// //     const rand = Math.floor(100 + Math.random() * 900);

// //     return `VAR-${base}-${color}-${size}-${rand}`;
// // };




// const attributeShortMap = {
//     color: "CLR",
//     size: "SIZ",
//     storage: "STG",
//     ram: "RAM",
//     material: "MAT",
//     weight: "WGT",
//     style: "STY",
//     flavor: "FLV",
//     pattern: "PTR",
// };

// const formatValue = (value) => {
//     return String(value)
//         .replace(/[^a-zA-Z0-9]/g, "")
//         .toUpperCase()
//         .slice(0, 4);
// };


// const generateVariantSku = (title, attributes = []) => {

//     const base = slugify(title, { lower: false, strict: true, })
//         .replace(/-/g, "")
//         .slice(0, 6)
//         .toUpperCase();


//     const attributePart = attributes
//         .filter((attr) => attr?.key && attr?.value)
//         .map((attr) => {
//             const key = attr.key.toLowerCase().trim();

//             const shortKey = attributeShortMap[key] || key.slice(0, 3).toUpperCase();

//             const value = formatValue(attr.value);

//             // COLOR → BLK
//             if (key === "color") {
//                 return value.slice(0, 3);
//             }

//             // SIZE → XL
//             if (key === "size") {
//                 return value;
//             }

//             // STORAGE → 256
//             if (key === "storage") {
//                 return value.replace(/GB|TB/gi, "");
//             }

//             return `${shortKey}${value}`;
//         }).join("-");


//     const rand = Math.floor(1000 + Math.random() * 9000);


//     return `${base}-${attributePart}-${rand}`;
// };


// module.exports = {
//     generateProductSku,
//     generateVariantSku
// };