const main = document.querySelector('#main')
      form = document.querySelector('#form'),
      taskInput = document.querySelector('#taskInput'),
      tasksList = document.querySelector('#tasksList'),
      emptyList = document.querySelector('#emptyList'),
      filterList = document.querySelector('#filterList'),
      sortDate = document.querySelector('#sortByDate');


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


// Редактирование задач
tasksList.addEventListener('click', editTask);


// Выполненные задачи
tasksList.addEventListener('click', doneTask);


// Кнопки фильтра
filterList.addEventListener('click', selectFilter);


function addTask(e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText == '') {
        taskInput.value = '';
        return
    }

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

    let date = `${day}.${month}.${year} ${hours}:${minutes}`;

    // Создание новой задачи
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
        date: date
    };

    tasks.push(newTask);
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
          id = Number(parentNode.id);

    const index = tasks.findIndex((task) => task.id === id);
    tasks.splice(index, 1);
    saveToLocalStorage();
    parentNode.remove();
    checkEmptyList();
}


function editTask(e) {
    if (e.target.dataset.action !== 'edit') {
        return
    }

    const taskParent = e.target.closest('.task_item'),
          taskTextEl = taskParent.querySelector('.task_text'),
          parentDate = taskParent.querySelector('#date').textContent,
          parentId = Number(taskParent.id);

        document.querySelector('#saveBtn').addEventListener('click', () => {
            const taskText = taskInput.value.trim();
        
            if (taskText == '') {
                taskInput.value = '';
                btnStyles();
                return
            }

            const newTask = {
                id: parentId,
                text: taskText,
                done: false,
                date: parentDate
            };
        
            tasks.push(newTask);
            saveToLocalStorage();
            renderTask(newTask);
            taskInput.value = '';
            checkEmptyList();
            btnStyles();
        });

        document.querySelector('#cancellationBtn').addEventListener('click', () => {
            e.preventDefault();
    
            const newTask = {
                id: parentId,
                text: taskTextEl.textContent,
                done: false,
                date: parentDate
            };
        
            tasks.push(newTask);
            saveToLocalStorage();
            renderTask(newTask);
            taskInput.value = '';
            checkEmptyList();
            btnStyles();
        });

    taskInput.value = taskTextEl.textContent;
    form.querySelector('#submitBtn').classList.add('none');
    form.querySelector('#saveBtn').classList.remove('none');
    form.querySelector('#cancellationBtn').classList.remove('none');
    main.scrollIntoView({behavior: "smooth"});

    
    const index = tasks.findIndex((task) => task.id === parentId);

    tasks.splice(index, 1);
    saveToLocalStorage();
    taskParent.remove();
    checkEmptyList();
}


function btnStyles() {
    form.querySelector('#submitBtn').classList.remove('none');
    form.querySelector('#saveBtn').classList.add('none');
    form.querySelector('#cancellationBtn').classList.add('none');
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
    parentNode.querySelector('.task_delete').classList.toggle('active_delete');
    parentNode.querySelector('.task_edit').classList.toggle('active_edit');
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
        };  
    } else if (target == filterList.children[1]) {
        for (let chil of childrensTasks) {
            chil.classList.remove('none')
            if (!chil.classList.contains('completed')) {
                chil.classList.add('none');
            }
        };
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
    const taskCss = task.done ? 'task_item completed' : 'task_item',
          checkboxCss = task.done ? 'checked' : '',
          deleteCss = task.done ? 'task_delete active_delete' : 'task_delete',
          editCss = task.done ? 'task_edit active_edit' : 'task_edit';

    const taskHTML = `
        <li id="${task.id}" class="${taskCss}">
            <input class="checkbox" type="checkbox" ${checkboxCss} data-action="done">
            <div class="date" id="date">${task.date}</div>
            <p class="task_text">${task.text}</p>
            <svg class="${editCss}" data-action="edit" enable-background="new 0 0 64 64" height="64px" id="Layer_1" version="1.1" viewBox="0 0 64 64" width="64px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M55.736,13.636l-4.368-4.362c-0.451-0.451-1.044-0.677-1.636-0.677c-0.592,0-1.184,0.225-1.635,0.676l-3.494,3.484   l7.639,7.626l3.494-3.483C56.639,15.998,56.639,14.535,55.736,13.636z"/><polygon points="21.922,35.396 29.562,43.023 50.607,22.017 42.967,14.39  "/><polygon points="20.273,37.028 18.642,46.28 27.913,44.654  "/><path d="M41.393,50.403H12.587V21.597h20.329l5.01-5H10.82c-1.779,0-3.234,1.455-3.234,3.234v32.339   c0,1.779,1.455,3.234,3.234,3.234h32.339c1.779,0,3.234-1.455,3.234-3.234V29.049l-5,4.991V50.403z"/></g></svg>
            <svg class="${deleteCss}" data-action="delete" xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16"><path fill-rule="evenodd" d="M11 2H9c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1H2c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v9c0 .55.45 1 1 1h7c.55 0 1-.45 1-1V5c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 12H3V5h1v8h1V5h1v8h1V5h1v8h1V5h1v9zm1-10H2V3h9v1z"/></svg>
        </li>`
    
    tasksList.insertAdjacentHTML('afterbegin', taskHTML);
}
