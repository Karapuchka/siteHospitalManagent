const formLogin = document.forms.login;
const errMessange = document.getElementById('error-messange');

formLogin.elements.loginBtnSub.onclick = (e)=>{

    let errMes = '';

    for (let i = 0; i < formLogin.elements.length - 1; i++) {
        if(formLogin.elements[i].value == ''){
            e.preventDefault();

            formLogin.elements[i].style.background = 'rgba(255, 0, 0, 0.3)';

            errMes = 'Заполните все поля!';
        }      
    }

    errMessange.innerText = errMes;
};

formLogin.onclick = (e)=>{
    if(e.target.id != 'btnSub'){
        e.target.style.background = 'none'
    }
};
