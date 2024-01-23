const form = document.forms.login;

form.onclick = (e)=>{
    if(e.target.id == 'btn' && (form.elements.login.value == '' || form.elements.password.value == '')){
        e.preventDefault();

        alert('Заполните поля!');

        if(form.elements.login.value == ''){form.elements.login.classList.add('input-error')};   
        if(form.elements.password.value == ''){form.elements.password.classList.add('input-error')};   

        return;
    }

    if(e.target.id == 'login' && e.target.classList.contains('input-error')){
        form.elements.login.classList.remove('input-error');
    }

    if(e.target.id == 'password' && e.target.classList.contains('input-error')){
        form.elements.password.classList.remove('input-error');
    }
}