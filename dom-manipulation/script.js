// Array of quote objects, each with text and category
let quotes = [];

// Function to save quotes to local storage
function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotesFromLocalStorage() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // If no quotes in storage, initialize with default quotes
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Motivation" },
      { text: "Believe you can and you're halfway there.", category: "Inspiration" },
      { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" }
    ];
  }
}

// Function to export quotes to JSON file
function exportQuotesToJSON() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importQuotesFromJSON(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes = importedQuotes;
          saveQuotesToLocalStorage();
          alert('Quotes imported successfully!');
          showRandomQuote(); // Refresh the display
        } else {
          alert('Invalid JSON format. Please select a valid quotes JSON file.');
        }
      } catch (error) {
        alert('Error reading the file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  }
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>Category: ${quote.category}</em></p>`;
}

// Function to set up the add quote form (now static in HTML)
function setupAddQuoteForm() {
  const form = document.getElementById('addQuoteForm');

  // Event listener for form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    const textArea = document.getElementById('quoteText');
    const categoryInput = document.getElementById('quoteCategory');
    const newQuoteText = textArea.value.trim();
    const newQuoteCategory = categoryInput.value.trim();
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      saveQuotesToLocalStorage(); // Save to local storage after adding
      textArea.value = '';
      categoryInput.value = '';
      alert('Quote added successfully!');
    }
  });

  // Set up export button
  const exportButton = document.getElementById('exportQuotes');
  exportButton.addEventListener('click', exportQuotesToJSON);

  // Set up import input
  const importInput = document.getElementById('importQuotes');
  importInput.addEventListener('change', importQuotesFromJSON);
}

// Event listener for the newQuote button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  loadQuotesFromLocalStorage(); // Load quotes from local storage on initialization
  setupAddQuoteForm();
  showRandomQuote(); // Show an initial random quote
});
