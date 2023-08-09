  // Get the current URL path
  const currentPath = window.location.pathname;

  // Get all tab links
  const tabLinks = document.querySelectorAll('.nav-links');

  // Iterate through tab links and add 'active' class to the matching tab
  tabLinks.forEach(tabLink => {
    if (tabLink.getAttribute('href') === currentPath) {
      tabLink.classList.add('active');
    }
  });
