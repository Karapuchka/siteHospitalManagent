const burgerBtnExit = document.getElementById('js-burger-btn-exit');
const burgerBtnOpen = document.getElementById('jd-burger-btn');
const burger = document.getElementById('burder');


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