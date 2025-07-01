type TodoType = {
    id: string;
    title: string;
}

let todos: TodoType[] = [];

export function getTodos() {
    return todos;
}

export function addTodo(title: string) {
    const newTodo = { id: Date.now().toString(), title };

    return todos.push(newTodo);
}

export function deleteTodo(id: string) {
  todos = todos.filter((todo) => todo.id !== id);
}