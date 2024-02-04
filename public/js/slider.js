const slider = document.getElementById('js-slider');
const sliderLine = document.getElementById('js-slider-line');
const sliderItems = document.getElementsByClassName('slider__line__item');
const menu = document.getElementById('js-menu-list');

let activeItem = menu.children[0];

activeItem.classList.add('menu__list__item--acrive');

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
