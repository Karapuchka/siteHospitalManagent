const btnsDel = document.querySelectorAll('.list-projects__item__list-projects__item__btn__icon');

const listStarted = document.getElementById('list-started');
const listWork = document.getElementById('list-work');
const listFinished = document.getElementById('list-finished');
const temaplet = document.getElementById('layout-item');

async function viewProject(id, status){
    const res = await fetch('/delProject', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({'id': id, 'status': status}),
    });

    let newList = await res.text();
    newList = JSON.parse(newList);

    switch (status) {
        case 'Планируется':
            listStarted.innerText = '';
            break;

        case 'В работе':
            listWork.innerText = '';
            break;

        case 'Завершён':
            listFinished.innerText = '';
            break;
    }

        for (let i = 0; i < newList.length; i++) {

        let newItem = temaplet.content.firstElementChild.cloneNode(true);
        let btn = newItem.querySelector('img');
        let title = newItem.querySelector('.list-projects__item__list-projects__item__title');
        let titleBtn = newItem.querySelector('.list-projects__item__list-projects__item__title__btn');
    
        btn.setAttribute('data-id', newList[i].id);
        btn.setAttribute('data-status', newList[i].status);

        title.setAttribute('action', `/getProjet/${newList[i].id}`);

        titleBtn.innerText = newList[i].title;

        switch (status) {
            case 'Планируется':
                newItem.classList.add('list-projects__item__list-projects__item--blue');
                listStarted.appendChild(newItem);
                break;

            case 'В работе':
                newItem.classList.add('list-projects__item__list-projects__item--green');
                listWork.appendChild(newItem);
                break;

            case 'Завершён':
                newItem.classList.add('list-projects__item__list-projects__item--red');
                listFinished.appendChild(newItem);
                break;
        }
    }
};

for (let i = 0; i < btnsDel.length; i++) {
    btnsDel[i].onclick = (e)=>{
        if(e.target.dataset.command == 'del'){
            viewProject(e.target.dataset.id, e.target.dataset.status);
        };  
    }
}