const DOMPurify = require('isomorphic-dompurify');
console.log('Type of DOMPurify:', typeof DOMPurify);
console.log('Type of DOMPurify.sanitize:', typeof DOMPurify.sanitize);
if (DOMPurify.default) {
    console.log('Type of DOMPurify.default:', typeof DOMPurify.default);
    console.log('Type of DOMPurify.default.sanitize:', typeof DOMPurify.default.sanitize);
}
