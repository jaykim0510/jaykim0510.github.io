document.addEventListener("DOMContentLoaded", function() {
    'use strict';
  
    const sidebarMajorItems = document.getElementsByClassName('sidebar-major-item');
    

    for (let sidebarMajorItem of sidebarMajorItems) {
        const accordionImg = sidebarMajorItem.lastElementChild
        const subContainer = sidebarMajorItem.nextElementSibling
        const subList = subContainer.firstElementChild
        sidebarMajorItem.addEventListener("click", () => {
            if (accordionImg.getAttribute('isOpen') == 'true') {
                // 아코디언 닫는 로직
                accordionImg.style.transform = 'rotate(0)'
                subContainer.style.height = 0
                accordionImg.setAttribute('isOpen', 'false')
                
            } else {
                // 아코디언 여는 로직
                accordionImg.style.transform = 'rotate(90deg)'
                subContainer.style.height = `${subList.offsetHeight || 0}px`
                accordionImg.setAttribute('isOpen', 'true')
                
            }
        });
    }
  
  
    /* =======================================================
    // Menu + Search + Theme Switcher
    ======================================================= */
});