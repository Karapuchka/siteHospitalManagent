const formTask = document.forms.tasksList;
const formStatusProject = document.forms.getStatusProject;
const statusProject = document.getElementById('js-header-project').dataset.status;

let listStatus = {
    'Планируемые': formStatusProject.elements[0],
    'В работе': formStatusProject.elements[1],
    'Завершён': formStatusProject.elements[2],
}

listStatus[statusProject].style.display = 'none';

// Отправка задач на сервер
for (let i = 0; i < formTask.elements.length; i++) {
    formTask.elements[i].onclick = async ()=>{

        if(formTask.elements[i].dataset.value == 0) formTask.elements[i].dataset.value = 1;
        else formTask.elements[i].dataset.value = 0;

        let id = +formTask.elements[i].id.split('-')[1];
        let value = +formTask.elements[i].dataset.value;
     
         const res = await fetch('/setTask', {
             method: 'POST',
             headers: {'Content-Type': 'application/json'},
             body: JSON.stringify({'listTasks': {'id': id, 'value': value}}),
         }); 
     };
};

formStatusProject.onclick = async (e)=>{
    if(e.target.id == 'btn-fishined' || e.target.id == 'btn-started' || e.target.id == 'btn-work'){

        let btnClick = {
            'btn-started': 'Планируемые',
            'btn-work': 'В работе',
            'btn-fishined': 'Завершён',
        };

        let userDecision = confirm(`Изменить статус проекта на "${btnClick[e.target.id]}"`);

        if(userDecision){

            setTimeout(()=>{
                location.reload();
            }, 100);

            const res = await fetch('/getStatusProject', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({'status': btnClick[e.target.id]}),
            });
        }  
    };
};