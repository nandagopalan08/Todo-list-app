document.addEventListener("DOMContentLoaded", function () {
  const todoinput = document.getElementById("todoinput");
  const todolist = document.getElementById("todolist");
  const addtodobutton = document.getElementById("addtodobutton");
  let currentFilter = "all";
  let todos = JSON.parse(localStorage.getItem("todos")) || [];

  function rendertodos() {
    todolist.innerHTML = "";
    let filteredTodos = todos;
    if (currentFilter === "active") {
      filteredTodos = todos.filter((t) => !t.completed);
    } else if (currentFilter === "completed") {
      filteredTodos = todos.filter((t) => t.completed);
    }

    if (filteredTodos.length === 0) {
      todolist.innerHTML =
        '<li class="list-group-item text-center text-muted">No tasks here</li>';
      updateCounter();
      return;
    }

    filteredTodos.forEach((todo) => {
      const index = todos.indexOf(todo);
      const listItem = document.createElement("li");
      listItem.className =
        "list-group-item d-flex justify-content-between align-items-center";

      if (todo.completed) {
        listItem.classList.add("completed");
      }
      listItem.textContent = todo.text;

      const editButton = document.createElement("button");
      editButton.className = "btn btn-primary btn-sm me-1";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", (e) => {
        e.stopPropagation();
        const newText = prompt("Edit task:", todo.text);
        if (newText !== null && newText.trim() !== "") {
          todos[index].text = newText.trim();
          savetodos();
          rendertodos();
        }
      });

      const deleteButton = document.createElement("button");
      deleteButton.className = "btn btn-danger btn-sm";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        deletetodo(index);
      });
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "form-check-input me-2";
      checkbox.checked = todo.completed;
      checkbox.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleTodoComplete(index);
      });

      listItem.prepend(checkbox);
      listItem.appendChild(editButton);
      listItem.appendChild(deleteButton);

      listItem.addEventListener("click", () => {
        toggleTodoComplete(index);
      });

      todolist.appendChild(listItem);
    });

    function updateCounter() {
      const remaining = todos.filter((t) => !t.completed).length;
      document.getElementById("task-counter").textContent =
        `${remaining} task(s) remaining`;
    }
  }

  function deletetodo(index) {
    todos.splice(index, 1);
    savetodos();
    rendertodos();
  }

  function toggleTodoComplete(index) {
    todos[index].completed = !todos[index].completed;
    savetodos();
    rendertodos();
  }
  function addtodo() {
    const taskText = todoinput.value.trim();
    if (taskText == "") return;
    todos.push({ text: taskText, completed: false });
    todoinput.value = "";
    savetodos();
    rendertodos();
  }

  function savetodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  addtodobutton.addEventListener("click", addtodo);

  todoinput.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
      addtodo();
    }
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      rendertodos();
    });
  });

  rendertodos();
});
