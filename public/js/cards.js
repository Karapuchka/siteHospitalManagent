const btnModalExit = document.getElementById('js-modal-btn-exit');
const btnModalActive = document.getElementById('js-active-modal');
const modalRecord = document.querySelector('.modal-record');

btnModalExit.onclick = ()=>{
    modalRecord.style.opacity = '0';
    setTimeout(()=>{
        modalRecord.style.display = 'none';
    }, 100);
};

btnModalActive.addEventListener('click', ()=>{
        modalRecord.style.opacity = 1;
        modalRecord.style.display = 'flex';
});