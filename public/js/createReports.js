const countActiveOrders = document.getElementById('active-order');

const btnAddingOrder = document.getElementById('btn-adding-order');
const btnSaveReport = document.getElementById('btn-save-reports');

const layoutOrder = document.getElementById('layout');
const listOrders = document.getElementById('list-orders');

const inputPatient = document.getElementById('form-patient');
const inputDoctor = document.getElementById('form-doctor');
const inputDiagnosis = document.getElementById('form-diagnosis');

let countActiveOrder = 0;

btnAddingOrder.onclick = ()=>{

    let valid = true;

    if (inputDiagnosis.value == '') {

        inputDiagnosis.style.borderBottom = '1px solid red';

        inputDiagnosis.setAttribute('placeholder', 'Поле пустое');

        valid = false;
    };

    if(valid){

        let item = layoutOrder.content.cloneNode(true);
        let number = item.getElementById('layout-number');
        let patient = item.getElementById('layout-patient');
        let doctor = item.getElementById('layout-doctor');
        let diagnosis = item.getElementById('layout-diagnosis');

        ++countActiveOrder;

        number.innerText = countActiveOrder;
        patient.innerText = inputPatient.value;
        doctor.innerText = inputDoctor.value;
        diagnosis.innerText = inputDiagnosis.value;

        countActiveOrders.innerText = countActiveOrder;

        return listOrders.appendChild(item);
    };
};

inputPatient.onclick = ()=>{

    inputPatient.style.borderBottom = '1px solid black';

    inputPatient.setAttribute('placeholder', 'Введите текст');

};

inputDoctor.onclick = ()=>{

    inputDoctor.style.borderBottom = '1px solid black';

    inputDoctor.setAttribute('placeholder', 'Введите текст');

};

inputDiagnosis.onclick = ()=>{

    inputDiagnosis.style.borderBottom = '1px solid black';

    inputDiagnosis.setAttribute('placeholder', 'Введите текст');

};

btnSaveReport.onclick = async ()=>{

    let orders = [];

    for (let i = 1; i < listOrders.children.length; i++) {
        orders.push({
            'patient': listOrders.children[i].children[1].innerText,
            'doctor': listOrders.children[i].children[2].innerText,
            'diagnosis': listOrders.children[i].children[3].innerText,
        });      
    };

    const res = await fetch('/save-report', {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            'orders': orders, 
            'countActiveOrders': orders.length,
            'author': document.getElementById('js-author').value,
            'date': document.getElementById('js-date').value,
            'jobTitle': document.getElementById('js-jobTitle').value,
        })
    });

    let text = await res.text();
    let answer = JSON.parse(text);
    alert(answer);
};