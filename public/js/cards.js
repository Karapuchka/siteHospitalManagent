const listCards = document.getElementById('js-cards-list');
const patietnId = document.getElementById('patient-id');

const modalOpen = document.getElementById('js-moda-open');
const btnModalOpenExit = document.getElementById('js-modal-open-btn-exit');
const spanDoctor = document.getElementById('js-moda-open-doctor');
const spanDiagnonis = document.getElementById('js-moda-open-diagnonis');
const spanDate = document.getElementById('js-moda-open-date');
const spanMedicines = document.getElementById('js-moda-open-medicines');
const spanRecommend = document.getElementById('js-moda-open-recommend');

const modalAdding = document.getElementById('js-moda-adding');
const btnModalAddingExit = document.getElementById('js-modal-adding-btn-exit');
const btnModalActive = document.getElementById('js-active-modal');
const btnAddingConclusion = document.getElementById('createRecord');
const formAddimgRecord = document.forms.recordAdding;

const templateRecord = document.getElementById('template-record');

btnModalAddingExit.onclick = ()=>{
    modalAdding.style.opacity = '0';
    setTimeout(()=>{
        modalAdding.style.display = 'none';
    }, 100);
};

btnModalActive.addEventListener('click', ()=>{
    modalAdding.style.opacity = 1;
    modalAdding.style.display = 'flex';
});

btnAddingConclusion.onclick = async ()=>{
    const res = await fetch('/addingConslusion', {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            'doctor': formAddimgRecord.elements.recordAddingDoctor.value,
            'diagnosis': formAddimgRecord.elements.recordAddingDiagmosis.value,
            'date': formAddimgRecord.elements.recordAddingDate.value,
            'medicines': formAddimgRecord.elements.recordAddingMedicines.value,
            'recommend': formAddimgRecord.elements.recordAddingRecommend.value,
            'idPatient': patietnId.dataset.id,
        }),
    });

    let resText = await res.text();

    let result = JSON.parse(resText);

    alert(result.resultOperation);

    for (let i = 0; i < result.cardsList.length; i++) {
        
        let item = templateRecord.content.firstElementChild.cloneNode(true);
        let btn = item.querySelector('div');
        let text = item.querySelector('span');

        btn.setAttribute('id', result.cardsList.id);
        item.setAttribute('id', result.cardsList.id);
        text.innerText = result.cardsList.diagnosis;

        console.log(item);

        listCards.appendChild(item);
    }

    modalAdding.style.opacity = '0';
    setTimeout(()=>{
        modalAdding.style.display = 'none';
    }, 100);
};

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

        let date = `${conclusion.date.split('-')[2].split('T')[0]}.${conclusion.date.split('-')[1]}.${conclusion.date.split('-')[0]}`;

        let listMedicine = JSON.parse(conclusion.listMedicine).map(item => ' ' + item);

        spanDoctor.innerText = conclusion.doctor;
        spanDiagnonis.innerText = conclusion.diagnosis;
        spanDate.innerText = date;
        spanMedicines.innerText = listMedicine;
        spanRecommend.innerText = conclusion.doctorRecommends;
    }
};

btnModalOpenExit.onclick = ()=>{
    modalOpen.style.opacity = '0';
    setTimeout(()=>{
        modalOpen.style.display = 'none';
    }, 100);
};