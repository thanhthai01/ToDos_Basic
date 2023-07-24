let todoList = [];
let category__item;

const list = document.querySelector('.js-todo-list');

// Hàm hiển thị danh sách công việc
function renderTodoList() {

    // Lưu danh sách công việc vào localStorage
    localStorage.setItem( 'todoList', JSON.stringify(todoList) );

    // Lấy chỉ số danh mục công việc
    category__item = localStorage.getItem('categoryIndex');

    // Cập nhật số lượng công việc
    countTodoItem();

    // Hiển thị danh sách công việc
    if (todoList.length === 0) {
        list.innerHTML = `<div class="empty-state">
        <h2 class="empty-state__title">Add your first todo</h2>
        <p class="empty-state__description">What do you want to get done today?</p>
    </div>`;
        return;
    }
    if(category__item == 0){
            list.innerHTML = todoList.map(todo => `
    <li class="todo-item ${todo.checked ? "done" : ""}" data-key="${todo.id}">
        <input id="${todo.id}" type="checkbox"/>
        <label for="${todo.id}" class="tick js-tick"></label>
        <span>${todo.text}</span>
        <img class="delete-todo js-delete-todo"  src="storage/images/delete.png" alt="">
       <img class="update-todo js-update-todo" src="storage/images/Edit.png" alt="">
    </li>
    `).join('');
    }
    if(category__item == 1){
            list.innerHTML = todoList.filter(item => item.checked === false ).map(todo => `
            <li class="todo-item ${todo.checked ? "done" : ""}" data-key="${todo.id}">
                <input id="${todo.id}" type="checkbox"/>
                <label for="${todo.id}" class="tick js-tick"></label>
                <span>${todo.text}</span>
                <img class="delete-todo js-delete-todo"  src="storage/images/delete.png" alt="">
               <img class="update-todo js-update-todo" src="storage/images/Edit.png" alt="">
            </li>
            `).join('');
    }
    if (category__item == 2)  {
        list.innerHTML = todoList.filter(item => item.checked === true ).map(todo => `
        <li class="todo-item ${todo.checked ? "done" : ""}" data-key="${todo.id}">
            <input id="${todo.id}" type="checkbox"/>
            <label for="${todo.id}" class="tick js-tick"></label>
            <span>${todo.text}</span>
            <img class="delete-todo js-delete-todo"  src="storage/images/delete.png" alt="">
           <img class="update-todo js-update-todo" src="storage/images/Edit.png" alt="">
        </li>
        `).join('');
    }
}

// Hàm thêm công việc mới hoặc cập nhật công việc
function addTodo(id, text) {
    if (id) {
        todoList[id].text = text;
        renderTodoList();
        btnSubmit.removeAttribute('id');
    } else {
        const todo = {
            text,
            checked: false,
            id: Date.now(),
        };
        todoList.push(todo);
        renderTodoList();

        // Cuộn đến cuối trang
        list.scrollTop = list.scrollHeight;
    }
}

// Hàm đánh dấu công việc đã hoàn thành
function toggleDone(key){
    const index = todoList.findIndex(item => item.id === Number(key));
    todoList[index].checked = !todoList[index].checked;
    renderTodoList();
}

// Hàm xóa công việc
function deleteTodoItem(key){
    todoList = todoList.filter(item => item.id !== Number(key));
    renderTodoList();
}

// Hàm chỉnh sửa công việc
function editTodoItem(key){
    const index = todoList.findIndex(item => item.id === Number(key));
    const editTodo = document.querySelector('.js-todo-input');
    btnSubmit.setAttribute('id', index);
    editTodo.value = todoList[index].text;
    input.focus();
}

// Hàm đếm số lượng công việc
function countTodoItem(){
    const countAll = document.querySelector('.js-todo-list-category__item-countAll');
    const countUnchecked = document.querySelector('.js-todo-list-category__item-countUnchecked');
    const countChecked = document.querySelector('.js-todo-list-category__item-countChecked');
    const ref = localStorage.getItem('todoList');
    if(ref){
        const todoList = JSON.parse(ref);
        countAll.innerHTML = todoList.length;
        countUnchecked.innerHTML = todoList.filter(item => item.checked === false).length;
        countChecked.innerHTML = todoList.filter(item => item.checked === true).length;
    }
};

// Lắng nghe sự kiện click trên danh sách công việc
list.addEventListener('click', event => {
    if (event.target.classList.contains('js-tick')) {
        const itemKey = event.target.parentElement.dataset.key;
        toggleDone(itemKey);
    }
    if (event.target.classList.contains('js-delete-todo')) {
        const itemKey = event.target.parentElement.dataset.key;
        deleteTodoItem(itemKey);
    }
    if (event.target.classList.contains('js-update-todo')) {
        const itemKey = event.target.parentElement.dataset.key;
        editTodoItem(itemKey);
    }
});

// Lắng nghe sự kiện submit của form thêm công việc
const form = document.querySelector('.js-form');
const btnSubmit = document.querySelector('.js-btnSubmit');
const input = document.querySelector('.js-todo-input');
form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    const indexItem = btnSubmit.getAttribute('id')
    if(text !== '' && text !== null){
        addTodo(indexItem,text);
        input.value = '';
        input.focus();
    }
});

// Lắng nghe sự kiện click trên danh mục công việc
const category = document.querySelector('.todo-list-category');
const categoryItems = document.querySelectorAll('.todo-list-category__item');

categoryItems.forEach((item,index) => {
    item.onclick = function (){
        localStorage.setItem('categoryIndex', index);
        document.querySelector('.todo-list-category__item.active').classList.remove('active');
        this.classList.add('active');
        renderTodoList();
    }
});

// Sự kiện DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('todoList');
    categoryItems[localStorage.getItem('categoryIndex')].classList.add('active');
    if (ref) {
        todoList = JSON.parse(ref);
        renderTodoList();
    }
});
