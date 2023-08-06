let links = document.querySelectorAll(".tech-sectionl a");
let bodyId = document.querySelector("html").id;
 
for(let link of links){
    if(link.dataset.active == bodyId){
        link.classList.add("active");
    }
}