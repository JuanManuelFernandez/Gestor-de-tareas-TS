import './style.css'

//La interfaz describe la estructura de un objeto Task
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const tasks: Task[] = []; //Array para almacenar las tareas

const taskForm = document.querySelector<HTMLFormElement>('#task-form')

const taskInput = document.querySelector<HTMLInputElement>('#task-input')

const taskList = document.querySelector<HTMLUListElement>('#task-list')

const emptyMessage = document.querySelector<HTMLParagraphElement>('#empty-message')

if(!taskForm || !taskInput || !taskList || !emptyMessage) {
  throw new Error('No se pudo encontrar el formulario o el input de tarea');
}

const renderTask = (): void => {
  taskList.innerHTML = ''//Limpia la lista de tareas antes de renderizar

  emptyMessage.hidden = tasks.length > 0 //Muestra u oculta el mensaje de "No hay tareas pendientes" según la cantidad de tareas

  tasks.forEach((task) => {
    const listItem = document.createElement('li') //Crea un elemento de lista para cada tarea

    const taskText = document.createElement('span')
    taskText.textContent = task.text //Agrega el texto de la tarea al span

    const deleteButton = document.createElement('button') //Crea un botón para eliminar la tarea
    deleteButton.type = 'button' //Evita que el botón envíe el formulario al hacer clic
    deleteButton.textContent = '🗑️'
    deleteButton.setAttribute('aria-label', `Eliminar tarea: ${task.text}`) //Agrega un atributo aria-label para accesibilidad

    deleteButton.addEventListener('click', () => { //Evento para eliminar la tarea
      const taskIndex = tasks.findIndex((currentTask) => currentTask.id === task.id) //Encuentra el índice de la tarea en el array

      if(taskIndex === -1) {
        return //Si no se encuentra la tarea, no hace nada
      }

      tasks.splice(taskIndex, 1) //Elimina la tarea del array
      renderTask() //Renderiza la lista de tareas actualizada
    })

    listItem.append(taskText, deleteButton)
    taskList.append(listItem) //Agrega el elemento de lista a la lista de tareas
  })
}

renderTask() //Renderiza la lista de tareas al cargar la página

taskForm.addEventListener('submit', (event) => { //Evento para subir la agregar la tarea
  event.preventDefault(); //Evita que el formulario se envíe y recargue la página

  const text = taskInput.value.trim()

  if (text === '') {
    return
  }

  const newTask: Task = {
    id: Date.now(),
    text: text,
    completed: false,
  }

  tasks.push(newTask) //Agrega la nueva tarea al array de tareas
  renderTask() //Renderiza la lista de tareas actualizada

  console.log(tasks)

  taskInput.value = '' //Limpia el input después de agregar la tarea
})




