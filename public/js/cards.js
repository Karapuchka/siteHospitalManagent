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

const btnSetStatus = document.getElementById('js-btn-set-status');
const labelCardStatus = document.getElementById('js-card-status');

const btnReception = document.getElementById('btn-reception');
const modalReception = document.getElementById('js-moda-reception');
const btnOpenReception = document.getElementById('js-reception-modal');
const btnExitReception = document.getElementById('btn-exit-reception');
const receptionDoctor = document.getElementById('js-moda-reception-doctor');
const receptionDate = document.getElementById('js-moda-reception-date');
const receptionlabelDoctor = document.getElementById('patient-doctor');
const receptionlabelDate = document.getElementById('patient-reception');

/* btnExitReception.onclick = ()=>{
    modalReception.style.opacity = '0';
    setTimeout(()=>{
        modalReception.style.display = 'none';
    }, 100);
}; */

btnOpenReception.addEventListener('click', ()=>{
    console.log(1);
    console.log(modalReception.style.opacity);
    modalReception.style.opacity = 1;
    modalReception.style.display = 'flex';
});

btnReception.onclick = async (e)=>{
    let res = await fetch('/adding-reception', {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({'idPatien': patietnId.dataset.id, 'receptionInfo': `${receptionDate.value}, ${receptionDoctor.value}`}),
    });

    let text = await res.text();

    let result = JSON.parse(text);

    receptionlabelDate.innerText = result[0];
    receptionlabelDoctor.innerText = result[1];

    modalReception.style.opacity = '0';
    setTimeout(()=>{
        modalReception.style.display = 'none';
    }, 100);
};  

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

btnSetStatus.onclick = async ()=>{

    let choice = confirm('Подтвердите изменение статуса');

    console.log(btnSetStatus.dataset.status);

    if(choice){
        const res = await fetch('/setStatusCard', {
            headers: {"Content-Type": "application/json"},
            method: 'POST',
            body: JSON.stringify({'status': btnSetStatus.dataset.status, 'id': btnSetStatus.dataset.idcard}),
        });
    
        let text = await res.text();
        let valid = JSON.parse(text);
    
        if(valid){
            btnSetStatus.innerText = 'Перевести в статус «Закрыт»';
    
            labelCardStatus.innerText = 'Статус заявки: Активный';
            labelCardStatus.classList.remove('cards-info__list__item--red');
            labelCardStatus.classList.add('cards-info__list__item--green');

            btnSetStatus.setAttribute('data-status', '1');
        } else {
            btnSetStatus.innerText = 'Перевести в статус «Активный»';
    
            labelCardStatus.innerText = 'Статус заявки: «Закрыт»';
            labelCardStatus.classList.remove('cards-info__list__item--green');
            labelCardStatus.classList.add('cards-info__list__item--red');

            btnSetStatus.setAttribute('data-status', '0');
        }
    }
};