const burgerBtnExit = document.getElementById('js-burger-btn-exit');
const burgerBtnOpen = document.getElementById('jd-burger-btn');
const menu = document.getElementById('burder');

if(!Boolean(menu.dataset.hidden)) {
    burgerBtnOpen.style.opacity = '0';
    burgerBtnOpen.style.transform = 'translateX(-20%)';
}

burgerBtnExit.onclick = () => {

    asideClouse(menu);

    setTimeout(()=>{
        burgerBtnOpen.style.opacity = '1';
    }, 700);
};

burgerBtnOpen.onclick = () => {

    asideClouse(menu);

    setTimeout(()=>{
        burgerBtnOpen.style.opacity = '0';
    }, 400);
};

function asideClouse(aside){
    if(!Boolean(aside.dataset.hidden)){

        menu.style.transform = 'translateX(-150%)';

        aside.setAttribute('data-hidden', '1');

        return;

    }  
    
    menu.style.transform = 'translateX(0)';
    aside.setAttribute('data-hidden', '')
}