x// Array of quote objects, each with text and category
let quotes = [];
let syncInterval;

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

// Function to show notification
function showNotification(message) {
  const notificationDiv = document.getElementById('notification');
  notificationDiv.textContent = message;
  notificationDiv.style.display = 'block';
  setTimeout(() => {
    notificationDiv.style.display = 'none';
  }, 5000); // Hide after 5 seconds
}

// Function to fetch quotes from server (simulated)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    // Transform server data to match our quote format (using title as text, body as category or default)
    return serverQuotes.slice(0, 10).map(post => ({
      text: post.title,
      category: 'Server' // Default category for server quotes
    }));
  } catch (error) {
    console.error('Error fetching from server:', error);
    return [];
  }
}

// Function to post quote to server (simulated)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      }),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error posting to server:', error);
    return null;
  }
}

// Function to sync quotes with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  if (serverQuotes.length > 0) {
    // Simple conflict resolution: server data takes precedence
    // Merge server quotes with local quotes, avoiding duplicates
    const existingTexts = new Set(quotes.map(q => q.text));
    const newServerQuotes = serverQuotes.filter(q => !existingTexts.has(q.text));
    if (newServerQuotes.length > 0) {
      quotes = [...quotes, ...newServerQuotes];
      saveQuotesToLocalStorage();
      populateCategories();
      showNotification('Quotes synced with server!');
    } else {
      showNotification('Data is up to date.');
    }
  }
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
          populateCategories(); // Update the category filter with imported categories
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

// Function to get unique categories
function getUniqueCategories() {
  const categories = quotes.map(quote => quote.category);
  return [...new Set(categories)];
}

// Function to populate categories
function populateCategories() {
  const filterSelect = document.getElementById('categoryFilter');
  const categories = getUniqueCategories();

  // Clear existing options except "All Categories"
  filterSelect.innerHTML = '<option value="all">All Categories</option>';

  // Add unique categories
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    filterSelect.appendChild(option);
  });

  // Restore last selected filter
  const lastSelected = localStorage.getItem('selectedCategory');
  if (lastSelected && (lastSelected === 'all' || categories.includes(lastSelected))) {
    filterSelect.value = lastSelected;
  }
}

// Function to display a random quote
function showRandomQuote() {
  const filterSelect = document.getElementById('categoryFilter');
  const selectedCategory = filterSelect.value;

  let filteredQuotes = quotes;
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '<p>No quotes available for the selected category.</p>';
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p><em>Category: ${quote.category}</em></p>`;
}

// Function to filter quotes (called by onchange)
function filterQuotes() {
  const filterSelect = document.getElementById('categoryFilter');
  const selectedCategory = filterSelect.value;
  localStorage.setItem('selectedCategory', selectedCategory); // Save selected filter
  showRandomQuote();
}

// Function to create the add quote form dynamically
function createAddQuoteForm() {
  const form = document.createElement('form');
  form.id = 'addQuoteForm';

  // Quote Text label and textarea
  const textLabel = document.createElement('label');
  textLabel.setAttribute('for', 'quoteText');
  textLabel.textContent = 'Quote Text:';
  const textArea = document.createElement('textarea');
  textArea.id = 'quoteText';
  textArea.required = true;

  // Category label and input
  const categoryLabel = document.createElement('label');
  categoryLabel.setAttribute('for', 'quoteCategory');
  categoryLabel.textContent = 'Category:';
  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.id = 'quoteCategory';
  categoryInput.required = true;

  // Submit button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Add Quote';

  // Export button
  const exportButton = document.createElement('button');
  exportButton.type = 'button';
  exportButton.id = 'exportQuotes';
  exportButton.textContent = 'Export Quotes to JSON';

  // Import label and input
  const importLabel = document.createElement('label');
  importLabel.setAttribute('for', 'importQuotes');
  importLabel.textContent = 'Import Quotes from JSON:';
  const importInput = document.createElement('input');
  importInput.type = 'file';
  importInput.id = 'importQuotes';
  importInput.accept = '.json';

  // Sync button
  const syncButton = document.createElement('button');
  syncButton.type = 'button';
  syncButton.id = 'syncQuotes';
  syncButton.textContent = 'Sync Quotes with Server';

  // Append elements to form
  form.appendChild(textLabel);
  form.appendChild(textArea);
  form.appendChild(categoryLabel);
  form.appendChild(categoryInput);
  form.appendChild(submitButton);
  form.appendChild(exportButton);
  form.appendChild(importLabel);
  form.appendChild(importInput);
  form.appendChild(syncButton);

  // Append form to body (or a specific container)
  document.body.appendChild(form);
}

// Function to set up the add quote form
function setupAddQuoteForm() {
  const form = document.getElementById('addQuoteForm');

  // Event listener for form submission
  form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const textArea = document.getElementById('quoteText');
    const categoryInput = document.getElementById('quoteCategory');
    const newQuoteText = textArea.value.trim();
    const newQuoteCategory = categoryInput.value.trim();
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
      saveQuotesToLocalStorage(); // Save to local storage after adding
      populateCategories(); // Update the category filter with new category
      textArea.value = '';
      categoryInput.value = '';
      alert('Quote added successfully!');

      // Post to server asynchronously
      const serverResponse = await postQuoteToServer(newQuote);
      if (serverResponse) {
        showNotification('Quote synced to server.');
      } else {
        showNotification('Failed to sync quote to server.');
      }
    }
  });

  // Set up export button
  const exportButton = document.getElementById('exportQuotes');
  exportButton.addEventListener('click', exportQuotesToJSON);

  // Set up import input
  const importInput = document.getElementById('importQuotes');
  importInput.addEventListener('change', importQuotesFromJSON);

  // Set up sync button
  const syncButton = document.getElementById('syncQuotes');
  syncButton.addEventListener('click', syncQuotes);
}

// Event listener for the newQuote button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  loadQuotesFromLocalStorage(); // Load quotes from local storage on initialization
  populateCategories(); // Populate the category filter dropdown
  createAddQuoteForm(); // Create the add quote form dynamically
  setupAddQuoteForm();
  showRandomQuote(); // Show an initial random quote

  // Start periodic sync with server (every 30 seconds)
  syncInterval = setInterval(syncQuotes, 30000);
  // Initial sync
  syncQuotes();
});
