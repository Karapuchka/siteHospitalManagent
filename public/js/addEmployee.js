const form = document.forms.employee;

form.onclick = (e)=>{

    if(e.target.name == 'btn'){
        let err = false;
        for (let i = 0; i < form.elements.length - 1; i++) {
            if(form.elements[i].value == ''){
                form.elements[i].classList.add('add-employee__input--error');
                form.elements[i].setAttribute('placeholder', 'Добавьте значение!');
    
                err = true;
            }        
        }
    
        if(err){
            e.preventDefault();
            return alert('Не все поля заполнены!');
        }
    }

    if(e.target.classList.contains('add-employee__input')){
        e.target.classList.remove('add-employee__input--error');
        e.target.setAttribute('placeholder', '');
    }
}