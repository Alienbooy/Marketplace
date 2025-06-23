
document.querySelectorAll('a[href="/login.html"], a[href="/registro.html"]').forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      document.getElementById("loginModal").style.display = "flex";
    });
});

document.querySelector(".close-modal").addEventListener("click", function() {
    document.getElementById("loginModal").style.display = "none";
});

  window.addEventListener("click", function(event) {
    const modal = document.getElementById("loginModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  document.getElementById('toggleForm').addEventListener('change', () => {

  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  
  
  document.getElementById('registro-nombre').value = '';
  document.getElementById('registro-email').value = '';
  document.getElementById('registro-password').value = '';

  
  document.querySelectorAll('.error').forEach(errorDiv => errorDiv.textContent = '');
});
