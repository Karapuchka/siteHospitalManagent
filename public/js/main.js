const burgerBtnExit = document.getElementById('js-burger-btn-exit');
const burgerBtnOpen = document.getElementById('jd-burger-btn');
const burger = document.getElementById('burder');
const slider = document.getElementById('js-slider');
const sliderLine = document.getElementById('js-slider-line');
const sliderItems = document.getElementsByClassName('slider__line__item');
const menu = document.getElementById('js-menu-list');

let activeItem = menu.children[0];

activeItem.classList.add('menu__list__item--acrive');

if(!Boolean(burger.dataset.hidden)) {
    burgerBtnOpen.style.opacity = '0';
    burgerBtnOpen.style.transform = 'translateX(-20%)';
};

burger.style.height = window.innerHeight + 'px';

burgerBtnExit.onclick = () => {

    asideClouse(burger);

    setTimeout(()=>{
        burgerBtnOpen.style.opacity = '1';
    }, 700);
};

burgerBtnOpen.onclick = () => {

    asideClouse(burger);

    setTimeout(()=>{
        burgerBtnOpen.style.opacity = '0';
    }, 400);
};

function asideClouse(aside){
    if(!Boolean(aside.dataset.hidden)){

        burger.style.transform = 'translateX(-150%)';

        aside.setAttribute('data-hidden', '1');

        return;

    }  
    
    burger.style.transform = 'translateX(0)';
    aside.setAttribute('data-hidden', '')
};

for (let i = 0; i < sliderItems.length; i++) {
    sliderItems[i].style.width = slider.offsetWidth + 'px';
    sliderItems[i].children[0].style.width = slider.offsetWidth + 'px';
};

menu.onclick = (e)=>{

    if(e.target.classList.contains('menu__list__item') && !e.target.classList.contains('menu__list__item--acrive')){
        let show = -(+sliderItems[0].offsetWidth * +e.target.dataset.show) + 'px';

        sliderLine.style.transform = `translateX(${show})`;

        activeItem.classList.remove('menu__list__item--acrive');

        e.target.classList.add('menu__list__item--acrive');

        activeItem = e.target;
    }
};