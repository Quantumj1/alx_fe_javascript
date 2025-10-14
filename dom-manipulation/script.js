// Array of quote objects, each with text and category
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Believe you can and you're halfway there.", category: "Inspiration" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>Category: ${quote.category}</em></p>`;
}

// Function to create and append the add quote form
function createAddQuoteForm() {
  const form = document.createElement('form');
  form.id = 'addQuoteForm';

  const textLabel = document.createElement('label');
  textLabel.textContent = 'Quote Text:';
  const textArea = document.createElement('textarea');
  textArea.id = 'quoteText';
  textArea.required = true;

  const categoryLabel = document.createElement('label');
  categoryLabel.textContent = 'Category:';
  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'quoteCategory';
  categoryInput.required = true;

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Quote';

  form.appendChild(textLabel);
  form.appendChild(textArea);
  form.appendChild(categoryLabel);
  form.appendChild(categoryInput);
  form.appendChild(submitButton);

  // Event listener for form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const newQuoteText = textArea.value.trim();
    const newQuoteCategory = categoryInput.value.trim();
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      textArea.value = '';
      categoryInput.value = '';
      alert('Quote added successfully!');
    }
  });

  // Append the form after the newQuote button
  const newQuoteButton = document.getElementById('newQuote');
  newQuoteButton.parentNode.insertBefore(form, newQuoteButton.nextSibling);
}

// Event listener for the newQuote button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  createAddQuoteForm();
  showRandomQuote(); // Show an initial random quote
});
