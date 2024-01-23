const form = document.forms.changeUserInfo;
const avatar = document.getElementById('user-avatar');

form.elements.avatar.onchange = (e)=>{
    avatar.src = URL.createObjectURL(form.elements.avatar.files[0]);
};