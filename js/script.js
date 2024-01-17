const form = document.querySelector('#form'),
      taskInput = document.querySelector('#taskInput'),
      tasksList = document.querySelector('#tasksList'),
      emptyList = document.querySelector('#emptyList'),
      filterList = document.querySelector('#filterList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => renderTask(task));
}

checkEmptyList();

// Добавление задачи
form.addEventListener('submit', addTask)

// Удаление задачи
tasksList.addEventListener('click', deleteTask);

// Выполненные задачи
tasksList.addEventListener('click', doneTask);

// Кнопки фильтра
filterList.addEventListener('click', selectFilter);


function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value;

    // Время создания задачи
    const newDate = new Date();
    let day = newDate.getDate(),
        month = newDate.getMonth(),
        year = newDate.getFullYear(),
        hours = newDate.getHours(),
        minutes = newDate.getMinutes();


        if (day.toString().length === 1) {
            day = '0' + day
        }
        
        if (month.toString().length === 1) {
            month = '0' + (month + 1);
        }
        
        if (hours.toString().length === 1) {
            hours = '0' + hours;
        }
        
        if (minutes.toString().length === 1) {
            minutes = '0' + minutes;
        }

    let date = `${day}.${month}.${year} ${hours}:${minutes}`

    // Создание новой задачи
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
        date: date
    };

    tasks.push(newTask)
    saveToLocalStorage();
    renderTask(newTask);
    taskInput.value = '';
    checkEmptyList();
}

function deleteTask(e) {
    if (e.target.dataset.action !== 'delete') {
        return
    }

    const parentNode = e.target.closest('li'),
          id = Number(parentNode.id),
          index = tasks.findIndex((task) => task.id === id);

    tasks.splice(index, 1);
    saveToLocalStorage();
    parentNode.remove();
    checkEmptyList();
}

function doneTask(e) {
    if (e.target.dataset.action !== 'done') {
        return
    }
    
    const parentNode = e.target.closest('li'),
          id = Number(parentNode.id),
          task = tasks.find((task) => task.id === id); 

    task.done = !task.done;
    saveToLocalStorage();
    parentNode.classList.toggle('completed');
    parentNode.querySelector('.task_delete').classList.toggle('active_delete')
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<li class="no_tasks" id="emptyList">
            <img src="img/tasks_list.png" alt="Cписок задач пуст">
            <p>Список задач пуст</p>
        </li>`

        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    } 

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function selectFilter(e) {

    const target = e.target;

    if (target.dataset.action !== 'filter') {
        return
    }

    const childrens = filterList.children;

    for (let child of childrens) {
        child.classList.remove('active_filter');
    }

    const childrensTasks = tasksList.children;

    if (target == filterList.children[0]) {
        for (let chil of childrensTasks) {
            chil.classList.remove('none')
        }
    } else if (target == filterList.children[1]) {
        for (let chil of childrensTasks) {
            chil.classList.remove('none')
            if (!chil.classList.contains('completed')) {
                chil.classList.add('none');
            }
        }
    } else if (target == filterList.children[2]) {
        for (let chil of childrensTasks) {
            chil.classList.remove('none')
            if (chil.classList.contains('completed')) {
                chil.classList.add('none')
            }
        };
    }

    target.classList.add('active_filter');
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const taskCss = task.done ? 'task_item completed' : 'task_item';
    const checkboxCss = task.done ? 'checked' : '';
    const deleteCss = task.done ? 'task_delete active_delete' : 'task_delete';

    const taskHTML = `
        <li id="${task.id}" class="${taskCss}">
            <input class="checkbox" type="checkbox" ${checkboxCss} data-action="done">
            <div class="date" id="date">${task.date}</div>
            <p class="task_text">${task.text}</p>
            <svg class="${deleteCss}" data-action="delete" xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"/></svg>
        </li>`
    
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}