/**
 * TabSelector - динамическое изменение табов и добавление контента для табов
 * @class
 * @param {array} arrDomElements массив DOM-узлов табов
 * @method changeContent принимает массив DOM-узлов для смены контента табов
 */

 class TabSelector {
    activeTab = 0

    setEvents = () => {
        this.arrDomElements.forEach((el, i) => {
            el.onclick = () => {
                this.arrDomElements.forEach(element => {
                    element.classList.remove("active");
                })

                this.activeTab = i;
                el.classList.add("active");
            }
        })
    }
    
    changeContent = () => {
        this.arrDomElements.forEach((el, i) => {
            el.addEventListener("click", () => {
                this.DOMcontents.forEach((node, index) => {
                    if(i === index) node.classList.add("active");
                    else node.classList.remove("active");
                })
            })
        })
    }

    renderPage = () => {
        this.arrDomElements.forEach((el, i) => {
            if(i === this.activeTab) {
                el.classList.add("active");
                this.DOMcontents[i].classList.add("active");
            } else {
                el.classList.remove("active");
                this.DOMcontents[i].classList.remove("active");
            }
        })
    }

    changePage = () => {
        this.buttons.forEach((but, i) => { 
            but.onclick = (e) => {
                ++this.activeTab;
                this.renderPage();
                e.preventDefault();
            }
        })
    }

    setPage = (num) => {
        this.activeTab = num;
        this.renderPage();
    }

    constructor(arrDomElements, DOMcontents, buttons) {
        this.arrDomElements = arrDomElements;
        this.DOMcontents = DOMcontents;
        this.buttons = buttons;
        this.setEvents();
        this.changeContent();
        this.changePage();
    }
}

const tabs = document.querySelectorAll('.tab-content');
const tabContents = document.querySelectorAll('.tab-main_content');
const nextButtons = document.querySelectorAll('.next');

let tabSelector = new TabSelector(tabs, tabContents, nextButtons);