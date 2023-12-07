let links = document.querySelectorAll(".nav-underline a");
let bodyId = document.querySelector("body").id;
 
for(let link of links){
    if(link.dataset.active == bodyId){
        link.classList.add("active");
    }
};



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



// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()






document.addEventListener('DOMContentLoaded', function () {
  const sidebarLinks = document.querySelectorAll('.sidebar a');

  // Function to get the value of a query parameter from the URL
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Function to set the active link based on the 'active' query parameter or localStorage
  function setActiveLink() {
    const activeQueryParam = getQueryParam('active');
    const storedActiveLink = localStorage.getItem('activeLink');

    if (activeQueryParam) {
      // Set the active link based on the 'active' query parameter
      sidebarLinks.forEach(link => {
        if (link.getAttribute('href').includes(activeQueryParam)) {
          link.classList.add('active');
          localStorage.setItem('activeLink', activeQueryParam);
        }
      });
    } else if (storedActiveLink) {
      // Set the active link based on localStorage
      sidebarLinks.forEach(link => {
        if (link.getAttribute('href').includes(storedActiveLink)) {
          link.classList.add('active');
        }
      });
    }
  }

  // Call the function to set the active link
  setActiveLink();

  // Add click event handling to toggle active class and update localStorage
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function () {
      // Remove active class from all links
      sidebarLinks.forEach(l => l.classList.remove('active'));
      // Add active class to the clicked link
      link.classList.add('active');
      // Update localStorage with the active link
      localStorage.setItem('activeLink', link.getAttribute('href'));
    });
  });
});
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const isSidebarOpen = sidebar.style.left === '0px';
  
  if (isSidebarOpen) {
    sidebar.style.left = '-250px';
    mainContent.classList.remove('content-with-sidebar');
  } else {
    sidebar.style.left = '0';
    mainContent.classList.add('content-with-sidebar');
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const sidebarLinks = document.querySelectorAll(".sidebar a");

  // Get the active tab from the query parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = urlParams.get('tab');

  // If there's an active tab, set it as active
  if (activeTab) {
    const targetTab = document.getElementById(activeTab);
    if (targetTab) {
      targetTab.classList.add('show', 'active-tab');
    }
  }

  sidebarLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      // Remove 'active' class from all sidebar links
      sidebarLinks.forEach(function (sidebarLink) {
        sidebarLink.classList.remove('active');
      });

      // Add 'active' class to the clicked sidebar link
      link.classList.add('active');

      // Remove 'show' class from all tab-panes
      document.querySelectorAll('.tab-pane').forEach(function (tabPane) {
        tabPane.classList.remove('show', 'active-tab');
      });

      // Add 'show' class to the clicked tab-pane
      const targetTabId = link.getAttribute('href').substring(1);
      const targetTab = document.getElementById(targetTabId);
      targetTab.classList.add('show', 'active-tab');

      // Update the URL with the active tab as a query parameter
      const url = new URL(window.location.href);
      url.searchParams.set("tab", targetTabId);
      window.history.replaceState({}, '', url);
    });
  });
});