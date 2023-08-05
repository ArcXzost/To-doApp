const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

displayTodos("http://localhost/to-doList/backend/index.php/");


// Function to render the todos
function renderTodos(data) {
    // Clear the todo list
    todoList.innerHTML = "";

    // Render each todo item
    for(var i=0; i<data.length; i++){
    const todoItem = document.createElement("card");
    const checkList = document.createElement("input");
    checkList.type = "checkbox";
    checkList.className = "w-4 h-4";
    checkList.index = parseInt(data[i].id);
    todoItem.className = "todoItem flex items-center p-1 border-b-4 border-orange-500 h-16 bg-slate-200 mb-2 rounded-xl hover:bg-amber-100 duration-500";
    // todoItem.type = "checkbox";
    

    const todo_table = document.createElement("card");
    todo_table.className = "todos px-4 font-mono font-bold text-xl grow";
    var temp=data[i].name;
    // const todoText = document.createElement("span");
    // todoText.className = "todoText";
    todo_table.innerHTML = temp;
    checkList.addEventListener('change', function(event){
        if(this.checked){
            todo_table.style="text-decoration: line-through";
            document.getElementById("doneAlert").style = "display: flex";
            updateStatus("http://localhost/to-doList/backend/index.php/todo/updateStat/",1,event.currentTarget.index);
        }
        else
        {
            todo_table.style="text-decoration: none";
            updateStatus("http://localhost/to-doList/backend/index.php/todo/updateStat/",0,event.currentTarget.index);
            document.getElementById("undoneAlert").style = "display: flex";
        }
    })

    const deleteButton = document.createElement("button");
    deleteButton.className = "text-xl w-20 m-2 bg-red-500 hover:bg-red-600 text-white font-bold border-b-4 border-r-2 border-slate-700 hover:border-slate-800 rounded";
    deleteButton.innerText = "Delete";
    deleteButton.index = parseInt(data[i].id);
    deleteButton.addEventListener("click", (event) => {
        deleteTodo("http://localhost/to-doList/backend/index.php/todo/delete/",event.currentTarget.index);
        document.getElementById("deleteAlert").style = "display: flex";
    });

    const updateButton = document.createElement("button");
    updateButton.className = "text-xl w-20 m-2 bg-orange-500 hover:bg-orange-600 text-white font-bold border-b-4 border-r-2 border-slate-700 hover:border-slate-800 rounded";
    updateButton.innerText = "Update";
    updateButton.index = parseInt(data[i].id);
    updateButton.addEventListener("click", (event) => {
        updateTodo("http://localhost/to-doList/backend/index.php/todo/update/",event.currentTarget.index);
        document.getElementById("updateAlert").style = "display: flex";
    });

    if(data[i].status == 1)
    {
        todo_table.style="text-decoration: line-through";
        checkList.checked = true;
        deleteButton.disabled = true;
        updateButton.disabled = true;
    }
    else
    {
        deleteButton.disabled = false;
        updateButton.disabled = false;
    }
    todoItem.appendChild(checkList);
    todoItem.appendChild(todo_table);
    todoItem.appendChild(deleteButton);
    todoItem.appendChild(updateButton);
    todoList.appendChild(todoItem);
    };
}

async function displayTodos(url){
    const response = await fetch(url);
    const data= await response.json();
    if (data == "")
        document.getElementById("folder").style = "display: flex";
    else{
        renderTodos(data);
        document.getElementById("folder").style = "display: none";
    }

}

// Function to add a new todo
async function addTodo(url) {
    const todoText = todoInput.value.trim();
    if (todoText !== "") {
    const response = await fetch(url+todoText);
    const data= await response.json();
    todoInput.value="";
    renderTodos(data);
    }
}

// Function to delete a todo
async function deleteTodo(url,index) {
    const response = await fetch(url+index);
    const data= await response.json();
    renderTodos(data);
}

// Function to update a todo
async function updateTodo(url,index) {
    const newTodoText = prompt("Enter a new todo:");
    if (newTodoText !== null) {
        const response = await fetch(url+index+"/"+newTodoText);
        const data= await response.json();
        renderTodos(data);
    }
}

// Function to update status
async function updateStatus(url,status,index){
    const response = await fetch(url+status+"/"+index);
    const data= await response.json();
    renderTodos(data);
}
// Event listener for adding a todo
todoInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
    addTodo("http://localhost/to-doList/backend/index.php/todo/insert/");
    document.getElementById("addAlert").style = "display: flex";
    }
});

document.getElementById("close1").addEventListener("click",() =>{
    document.getElementById("addAlert").style = "display: none";
});
document.getElementById("close2").addEventListener("click",() =>{
    document.getElementById("deleteAlert").style = "display: none";
});
document.getElementById("close3").addEventListener("click",() =>{
    document.getElementById("updateAlert").style = "display: none";
});
document.getElementById("close4").addEventListener("click",() =>{
    document.getElementById("doneAlert").style = "display: none";
});
document.getElementById("close5").addEventListener("click",() =>{
    document.getElementById("undoneAlert").style = "display: none";
});