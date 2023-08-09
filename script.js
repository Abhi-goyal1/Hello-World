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
