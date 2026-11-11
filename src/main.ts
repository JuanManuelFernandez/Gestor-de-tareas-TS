import './style.css'

//La interfaz describe la estructura de un objeto Task
interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = 'tasks-manager-key' //Clave para almacenar las tareas en el localStorage

const loadTasks = (): Task[] => {
  const savedTasks = localStorage.getItem(STORAGE_KEY) //Obtiene las tareas guardadas en el localStorage

  if (savedTasks === null) {
    return [] //Si no hay tareas guardadas, devuelve un array vacío
  }

  return JSON.parse(savedTasks) as Task[] //Convierte la cadena JSON en un array de tareas
}

const tasks: Task[] = loadTasks() //Carga las tareas guardadas al iniciar la aplicación

const saveTasks = (): void => {
  const tasksAsText = JSON.stringify(tasks) //Convierte el array de tareas en una cadena JSON
  localStorage.setItem(STORAGE_KEY, tasksAsText) //Guarda la cadena JSON en el localStorage
}

const taskForm = document.querySelector<HTMLFormElement>('#task-form')

const taskInput = document.querySelector<HTMLInputElement>('#task-input')

const taskList = document.querySelector<HTMLUListElement>('#task-list')

const emptyMessage = document.querySelector<HTMLParagraphElement>('#empty-message')

const taskCounter = document.querySelector<HTMLParagraphElement>('#task-counter')

if(!taskForm || !taskInput || !taskList || !emptyMessage || !taskCounter) {
  throw new Error('No se pudo encontrar el formulario o el input de tarea');
}

const updateCounter = (): void => {
  const pendingTasks = tasks.filter((task) => !task.completed)

  const pendingCount = pendingTasks.length

  if(pendingCount === 1) {
    taskCounter.textContent = `1 tarea pendiente`
  } else {
    taskCounter.textContent = `${pendingCount} tareas pendientes`
  }

  taskCounter.hidden = tasks.length === 0 //Oculta el contador si no hay tareas
}

const renderTask = (): void => {
  taskList.innerHTML = ''//Limpia la lista de tareas antes de renderizar

  emptyMessage.hidden = tasks.length > 0 //Muestra u oculta el mensaje de "No hay tareas pendientes" según la cantidad de tareas

  updateCounter() //Actualiza el contador de tareas pendientes
  
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
      saveTasks() //Guarda las tareas actualizadas en el localStorage
      renderTask() //Renderiza la lista de tareas actualizada
    })

    const checkbox = document.createElement('input') //Crea un checkbox para marcar la tarea como completada
    checkbox.type = 'checkbox'
    checkbox.checked = task.completed //Marca el checkbox si la tarea está completada
    checkbox.setAttribute('aria-label', `Marcar tarea como completada: ${task.text}`) //Agrega un atributo aria-label para accesibilidad

    checkbox.addEventListener('change', () => { //Evento para marcar la tarea como completada
      task.completed = checkbox.checked //Actualiza el estado de completado de la tarea
      saveTasks() //Guarda las tareas actualizadas en el localStorage
      renderTask() //Renderiza la lista de tareas actualizada
    })

    listItem.classList.toggle('completed', task.completed) //Agrega o quita la clase 'completed' según el estado de la tarea

    listItem.append(checkbox, taskText, deleteButton)
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
  saveTasks() //Guarda las tareas actualizadas en el localStorage
  renderTask() //Renderiza la lista de tareas actualizada

  console.log(tasks)
  
  taskInput.value = '' //Limpia el input después de agregar la tarea
})




