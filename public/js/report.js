const reportsList = document.getElementById('list-repotrs');

reportsList.onclick = async (e)=>{
    if(e.target.classList.contains('reporst-btns__btn--red')){
        let res = await fetch('/del-report', {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({'id': e.target.dataset.id}),
        });

        let text = await res.text();

        alert('Отчёт удалён');
        console.log(text);
        
        location.href = location.href;
    }
};