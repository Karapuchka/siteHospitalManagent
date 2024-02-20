const btnModalAddingExit = document.getElementById('js-modal-adding-btn-exit');
const btnModalActive = document.getElementById('js-active-modal');
const modalAdding = document.getElementById('js-moda-adding');
const listCards = document.getElementById('js-cards-list');

const modalOpen = document.getElementById('js-moda-open');
const btnModalOpenExit = document.getElementById('js-modal-open-btn-exit');
const spanDoctor = document.getElementById('js-moda-open-doctor');
const spanDiagnonis = document.getElementById('js-moda-open-diagnonis');
const spanDate = document.getElementById('js-moda-open-date');
const spanMedicines = document.getElementById('js-moda-open-medicines');
const spanRecommend = document.getElementById('js-moda-open-recommend');

btnModalAddingExit.onclick = ()=>{
    modalAdding.style.opacity = '0';
    setTimeout(()=>{
        modalAdding.style.display = 'none';
    }, 100);
};

btnModalOpenExit.onclick = ()=>{
    modalOpen.style.opacity = '0';
    setTimeout(()=>{
        modalOpen.style.display = 'none';
    }, 100);
};

btnModalActive.addEventListener('click', ()=>{
    modalAdding.style.opacity = 1;
    modalAdding.style.display = 'flex';
});

listCards.onclick = async (e)=>{
    if(e.target.classList.contains('cards-list__item__btn')){

        const res = await fetch('/openConslusion', {
            headers: {"Content-Type": "application/json"},
            method: 'POST',
            body: JSON.stringify({
                idConclusion: +e.target.id,
            })
        });
    
        let result = await res.text();

        let conclusion = JSON.parse(result);

        modalOpen.style.opacity = 1;
        modalOpen.style.display = 'flex';

        console.log(JSON.parse(conclusion.listMedicine));

        let date = `${conclusion.date.split('-')[2].split('T')[0]}.${conclusion.date.split('-')[1]}.${conclusion.date.split('-')[0]}`;

        let listMedicine = JSON.parse(conclusion.listMedicine).map(item => ' ' + item);

        spanDoctor.innerText = conclusion.doctor;
        spanDiagnonis.innerText = conclusion.diagnosis;
        spanDate.innerText = date;
        spanMedicines.innerText = listMedicine;
        spanRecommend.innerText = conclusion.doctorRecommends;
    }
};

async function addingConclusion(){
    const res = await fetch('/addingConclusion', {
        headers: {"Content-Type": "application/json"},
        method: 'POST',
        body: JSON.stringify({
            idDoctor: '',
            idPatient: '',
        }),
    });
};