const btnFilter = document.getElementById('js-filter');
const listPatient = document.querySelector('.patient-list');

btnFilter.onclick = (e)=>{

    if(!btnFilter.children[1].classList.contains('patient-filter__checked--active')){
        btnFilter.children[1].classList.add('patient-filter__checked--active');

        for (let i = 0; i < listPatient.children.length; i++) {
            if(!Number(listPatient.children[i].dataset.status)){
                listPatient.children[i].style.display = 'none';
            }        
        }
    } else {

        btnFilter.children[1].classList.remove('patient-filter__checked--active');

        for (let i = 0; i < listPatient.children.length; i++) {
            if(!Number(listPatient.children[i].dataset.status)){
                listPatient.children[i].style.display = 'block';
            }        
        }

    }
};