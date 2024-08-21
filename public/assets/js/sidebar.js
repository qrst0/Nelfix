'use strict';

const addEventOnElements = function (elements, eventType, callback) {
    for(const elem of elements) elem.addEventListener(eventType, callback);
}

const toggleSidebar = function(sidebar) {
    const sidebarBtn = document.querySelector("[menu-btn]");
    const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
    const sidebarClose = document.querySelectorAll("[menu-close]");
    const overlay = document.querySelector("[overlay]");
    addEventOnElements(sidebarTogglers, "click", function() {
        sidebar.classList.toggle("active");
        sidebarBtn.classList.toggle("active");
        overlay.classList.toggle("active");
    });
    addEventOnElements(sidebarClose, "click", function() {
        sidebar.classList.remove("active");
        sidebarBtn.classList.remove("active");
        overlay.classList.remove("active");
    });
}

export function sidebar() {
    const sidebar = document.querySelector("[sidebar]");
    toggleSidebar(sidebar);

}
