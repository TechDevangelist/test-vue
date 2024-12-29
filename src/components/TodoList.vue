<template>
  <div class="todo-list">
    <h1>Todo List</h1>
    
    <!-- Add new todo -->
    <div class="add-todo">
      <input 
        v-model="newTodo" 
        @keyup.enter="addTodo"
        placeholder="Add a new todo"
      />
      <button @click="addTodo">Add</button>
    </div>

    <!-- Todo list -->
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <div class="todo-item">
          <input 
            type="checkbox" 
            v-model="todo.completed"
            @change="saveTodos"
          />
          <input 
            v-if="todo.editing"
            type="text"
            v-model="todo.text"
            @blur="finishEditing(todo)"
            @keyup.enter="finishEditing(todo)"
            ref="editInput"
          />
          <span 
            v-else
            @dblclick="startEditing(todo)"
            :class="{ completed: todo.completed }"
          >
            {{ todo.text }}
          </span>
          <input 
            type="date" 
            v-model="todo.dueDate"
            @change="saveTodos"
          />
          <button @click="removeTodo(todo)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TodoList',
  data() {
    return {
      todos: [],
      newTodo: ''
    }
  },
  created() {
    // Load todos from localStorage
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos)
    }
  },
  methods: {
    addTodo() {
      if (!this.newTodo.trim()) return
      
      this.todos.push({
        id: Date.now(),
        text: this.newTodo.trim(),
        completed: false,
        dueDate: '',
        editing: false
      })
      
      this.newTodo = ''
      this.saveTodos()
    },
    removeTodo(todo) {
      const index = this.todos.indexOf(todo)
      this.todos.splice(index, 1)
      this.saveTodos()
    },
    startEditing(todo) {
      // First, close any other editing todos
      this.todos.forEach(t => {
        if (t !== todo) t.editing = false
      })
      todo.editing = true
      // Store the original text in case we need to cancel
      todo._originalText = todo.text
      this.$nextTick(() => {
        const inputs = this.$refs.editInput
        if (Array.isArray(inputs) && inputs.length > 0) {
          inputs[0].focus()
        }
      })
    },
    finishEditing(todo) {
      const text = todo.text.trim()
      if (!text) {
        // If empty, restore the original text or remove if it was empty
        if (todo._originalText) {
          todo.text = todo._originalText
        } else {
          this.removeTodo(todo)
          return
        }
      }
      todo.editing = false
      delete todo._originalText
      this.saveTodos()
    },
    saveTodos() {
      localStorage.setItem('todos', JSON.stringify(this.todos))
    }
  }
}
</script>

<style scoped>
.todo-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-todo input {
  flex: 1;
  padding: 8px;
}

ul {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

input[type="text"], input[type="date"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>