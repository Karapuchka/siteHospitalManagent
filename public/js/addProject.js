const btnTask = document.getElementById('btn-task');
const listTasks = document.getElementById('list-tasks');
const template = document.getElementById('template');

let taskCount = 0;

btnTask.onclick = ()=>{
    let copy = template.content.firstElementChild.cloneNode(true);

    let input = copy.querySelector('input');

    input.setAttribute('name', `task${taskCount}`);
    copy.setAttribute('data-id', taskCount);

    taskCount++;

    listTasks.appendChild(copy);
};

listTasks.onclick = (e)=>{
    if(e.target.className == 'adding-project__tasks-list__item__del'){

        let newList = [];

        for (let i = 0; i < listTasks.children.length; i++) {
            if(e.target.parentNode.dataset.id != listTasks.children[i].dataset.id)  newList.push(listTasks.children[i]);          
        }

        listTasks.innerText = '';

        for (let i = 0; i < newList.length; i++) {
            listTasks.appendChild(newList[i]);
        }
    }
};