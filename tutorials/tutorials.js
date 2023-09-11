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





  

  let isSidebarOpen = false;
  const sidebar = document.getElementById('sidebar');
  const mainContainer = document.getElementById('main-container');

  function toggleSidebar() {
    if (isSidebarOpen) {
      sidebar.style.left = '-250px';
    } else {
      sidebar.style.left = '0';
    }
    isSidebarOpen = !isSidebarOpen;
  }

  function showContent(page) {
    let content = '';
    if (page === 'home') {
      content = '<h1>Welcome to the Home Page</h1><p>This is the main content area that will change when you click on the Home link.</p>';
    } else if (page === 'about') {
      content = '<h1>About Us</h1><p>This is the main content area that will change when you click on the About link.</p>';
    } else if (page === 'services') {
      content = '<h1>Our Services</h1><p>This is the main content area that will change when you click on the Services link.</p>';
    } else if (page === 'contact') {
      content = '<h1>Contact Us</h1><p>This is the main content area that will change when you click on the Contact link.</p>';
    }
    mainContainer.innerHTML = content;
    resetActiveLinks();
    document.getElementById(`${page}-link`).classList.add('active-link');
  }

  function resetActiveLinks() {
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => {
      link.classList.remove('active-link');
    });
  }


  function updateActiveLinkColor() {
    const iframe = document.querySelector('iframe[name="contentFrame"]');
    const page = iframe.contentWindow.location.pathname.split('/').pop().split('.')[0];
    
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === page) {
            link.classList.add('active');
        }
    });
}