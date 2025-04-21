// postcss.config.js
// Using dynamic import() for ESM compatibility

export default {
    plugins: [
      // 1. Run Tailwind first to generate utilities and process directives
      (await import('tailwindcss')).default,
  
      // 2. Run Autoprefixer (common practice after Tailwind)
      (await import('autoprefixer')).default,
  
      // 3. Run the Prefix Selector LAST to scope everything generated above
      (await import('postcss-prefix-selector')).default({
        prefix: '#chatbot-widget', // Your widget's container ID
        // Include the transform function to avoid prefixing 'html', 'body', etc.
        // This is important because Tailwind's Preflight might target them.
        transform(prefix, selector, prefixedSelector, filePath, rule) {
          // List of selectors NOT to prefix (adjust if needed)
          const JEST_REGEX = /^(?:html|body|:root)$/;
          if (JEST_REGEX.test(selector)) {
            return selector; // Return original selector
          }
  
          // Handle ::backdrop pseudo-element if needed (sometimes problematic)
          // if (selector.includes('::backdrop')) { return selector; }
  
          // Handle keyframes correctly
          if (rule.parent?.type === 'atrule' && rule.parent.name.includes('keyframes')) {
              return selector; // Don't prefix animation names
          }
  
          return prefixedSelector; // Default prefixing behavior
        },
      }),
    ],
  };