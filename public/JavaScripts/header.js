document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-bar');

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `/market.html?q=${encodeURIComponent(query)}`;
        }
      } 
    });
  }
});
