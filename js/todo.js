(()=>{

const BASE_URL = 'http://127.0.0.1:3000/tasks/';
const BASE_CLASS_TAB = 'showlist-item_';

const {_} = window;
const addTaskBtn = document.querySelector('.add_todo_form-submit'); // btn "add" todos
const addTaskInput = document.querySelector('[name = "text_todo"]'); // input for todos
const allLiTaskContains = document.querySelector('.check_todo-dl');//area renderTasks
const checkboxCheckedAll = document.querySelector('.checkboxall');
const btnAll = document.querySelector(`#${BASE_CLASS_TAB}All`);
const btnActive = document.querySelector(`#${BASE_CLASS_TAB}Active`);
const btnCompleted = document.querySelector(`#${BASE_CLASS_TAB}Completed`);
const btnRemoveAllChecked = document.querySelector('.remove_todo-btn-all');
const showlist = document.querySelector('.check_todo-showlist');
const areaBtnPage = document.querySelector('.App-pagination');
const keyEnter = 'Enter';
const keyEscape = 'Escape';

let BtnTAB = 'All';
let currentSelectedPage = 1


async function AsycnRenderTask(currentPage = currentSelectedPage){
    try {
        const url = `${BASE_URL}${BtnTAB}/${currentPage}`
        const response = await(await fetch(url)).json()

        allLiTaskContains.innerHTML = ''
        response.tasks.map((item, index)=>{
            renderLi(item,index,allLiTaskContains)        
        })
        checkboxCheckedAll.checked = response.statusCheckbox
        renderStyledTabBtn(BtnTAB, response.len)
        renderAddBtnPagination(response.countPage, areaBtnPage)
        const activebtnPage = document.querySelector(`.App-pagination_btn-${response.ActivePage}`);
        activebtnPage.classList.add('App-pagination_btn-active');
    }
    catch(error){
        console.error(error)
    }
}
async function AsyncCreateTask(objTask){
    try {
        await fetch(BASE_URL,{
            method:'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(objTask),
        })
        AsycnRenderTask(Infinity)
    }
    catch(error){
        console.error(error)
    }
}
async function AsyncDeleteTask(id){
    try {
        const url = `${BASE_URL}+${BtnTAB}+/${id}`
        const response = await fetch(url,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;',
            }
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        AsycnRenderTask()
    }
    catch(error){
        console.error(error)
    }
}
async function AsyncEditTask(objTask){
    try {
        const url = `${BASE_URL}${BtnTAB}/${objTask.id}`
        await fetch(url,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(objTask),
        })
        AsycnRenderTask()
    }
    catch(error){
        console.error(error)
    }
}
async function AsyncRemoveAllComletedTask(){
    try {
        const url = `${BASE_URL}${BtnTAB}`
        await fetch(url,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
              },
        })
        AsycnRenderTask()
    }
    catch(error){
        console.error(error)
    }
}
async function AsyncCheckAll(objTask){
    try {
        const url = `${BASE_URL}${BtnTAB}`;
        console.log(url)
        await fetch(url,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objTask)
        })
        AsycnRenderTask()
    }
    catch(error){
        console.error(error)
    }
}


function renderLi (itemLi, index, parentRender) {
    const newTask = document.createElement('li');
    newTask.classList.add('check_todo_line');
    newTask.id = `${itemLi.id}_check_todo_line`;
    newTask.innerHTML = `<div class="check_todo_line-checkbox">
                               <input type="checkbox" name="" id="${itemLi.id}_check_todo_line-checkboxid" class = "check_todo_line-checkbox form-check-input" ${itemLi.status? 'checked': ''}>
                              </div>
                                <div class="check_todo_line-text" id="${itemLi.id}_check_todo_line-text">
                                    <div class="text-index">${itemLi.index}.</div>
                                    <div class="text-text">${_.escape(String(itemLi.text))}</div>
                                </div>
                                <div class="check_todo_line-delbtn" id = "${itemLi.id}_check_todo_line-delbtn">
                                   <button class="remove_btn btn btn-danger">X</button>
                                 </div>`;
    parentRender.append(newTask);    
}

function renderStyledTabBtn (classBtn, Olength) {
    const btn = document.querySelector(`#${BASE_CLASS_TAB}${classBtn}`)
    btnAll.textContent = `All(${Olength.AllTask})`;
    btnActive.textContent = `Active(${Olength.ActiveTask})`;
    btnCompleted.textContent = `Completed(${Olength.CompletedTask})`;

    btnAll.classList.remove('Active');
    btnActive.classList.remove('Active');
    btnCompleted.classList.remove('Active');
    btn.classList.add('Active');
}

function tabulation (event) {
    tabulationRender(event.target);
}

function tabulationRender (btnTab = btnAll) {

    switch (btnTab){
        case (btnAll) :
            BtnTAB = 'All';
            break;
        case (btnActive) :
            BtnTAB = 'Active';
            break;
        case (btnCompleted) :
            BtnTAB = 'Completed';
            break;
        default:
            BtnTAB = 'All';
            break;
    }
    AsycnRenderTask()
}

function addNewTask (ev) {
    ev.preventDefault()
    if ((!addTaskInput.value)||(addTaskInput.value.replace(/ {2,}/g, " ") === ' ')){
        return;
    }
    const textFromInput = addTaskInput.value.slice(0,200);
    const newTask = {
        text: textFromInput.replace(/ {2,}/g, " "),
    }

    addTaskInput.value = '';
    AsyncCreateTask(newTask)
};


function removeTask (event){
    if ( !event.target.classList.contains('remove_btn') ) {
        return;
    }
    const idTask = parseInt(event.target.parentElement.id,10) 

    AsyncDeleteTask(idTask)
    AsycnRenderTask()
}

function editCheckbox (event) {
    if (!event.target.classList.contains('check_todo_line-checkbox')) {
        return;
    }
    event.preventDefault()
    const idTask = parseInt(event.target.id,10) 
    const statusCheckbox = event.target.checked

    const objTask = {
        id:idTask,
        status:statusCheckbox,
    }
    AsyncEditTask(objTask)
    
}

function removeAllCompleted () {
    AsyncRemoveAllComletedTask()
}

function checkall (event) {
    const targetStatus = event.target.checked;
    const objForCheck = {
        status: targetStatus,
    }
    AsyncCheckAll(objForCheck)
}

function CreateInputForInputTask (event) {
    if ( !event.target.classList.contains('text-text') ) {
        return;
    }
    const selectedTask = event.target;
    const input = document.createElement('input');
    const initialText =  selectedTask.textContent;
    const idtask = parseInt(selectedTask.parentElement.id,10)

    input.classList.add('check_todo_line-text_input');
    input.id = idtask;
    input.value = initialText;
    selectedTask.textContent = '';
    selectedTask.replaceWith(input);
    input.focus();
}

function inputEvent (ev) {
    const input = document.querySelector('.check_todo_line-text_input');
    const idTask = parseInt(input.id,10);
    const objTask = {
        id:null,
        text:null,
    }
    switch (ev.key){
        case keyEnter:
            objTask.id = idTask;
            objTask.text = input.value
            AsyncEditTask(objTask)
            input.blur();
            break;
        case keyEscape:
            input.blur();
            break;
        default:
            break;
    }
}
function InputBlurEvent () {
    AsycnRenderTask()
}
function renderAddBtnPagination (quantityPg,parentRender) {
    parentRender.innerHTML = ''
    for (let currentPage=1; currentPage<=quantityPg ; currentPage++) {
        const btnPage = document.createElement('button');
        btnPage.textContent = currentPage;
        btnPage.value = currentPage;
        btnPage.classList.add('App-pagination_btn');
        btnPage.classList.add(`App-pagination_btn-${currentPage}`);
        btnPage.classList.add('btn');
        btnPage.classList.add('btn-secondary');
        parentRender.append(btnPage);
    }
}
function pagination (event) {
    currentSelectedPage = event.target.value;
    AsycnRenderTask()
}

AsycnRenderTask()
addTaskBtn.addEventListener("click",addNewTask);
allLiTaskContains.addEventListener('dblclick',CreateInputForInputTask);
allLiTaskContains.addEventListener('keyup',inputEvent)
allLiTaskContains.addEventListener('focusout',InputBlurEvent)

allLiTaskContains.addEventListener('click',editCheckbox);
checkboxCheckedAll.addEventListener('click', checkall);

btnRemoveAllChecked.addEventListener('click', removeAllCompleted);
allLiTaskContains.addEventListener('click',removeTask);

showlist.addEventListener('click', tabulation);
areaBtnPage.addEventListener('click', pagination);
})()