import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from '../TodoList.vue'

describe('TodoList', () => {
  let wrapper

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    wrapper = mount(TodoList)
  })

  it('adds a new todo', async () => {
    const input = wrapper.find('.add-todo input')
    await input.setValue('New Todo Item')
    await input.trigger('keyup.enter')

    const todos = wrapper.findAll('li')
    expect(todos).toHaveLength(1)
    expect(todos[0].text()).toContain('New Todo Item')
  })

  it('marks a todo as completed', async () => {
    // Add a todo first
    const input = wrapper.find('.add-todo input')
    await input.setValue('Test Todo')
    await input.trigger('keyup.enter')

    // Find and click the checkbox
    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setValue(true)

    // Check if the todo is marked as completed
    const todoText = wrapper.find('.todo-item span')
    expect(todoText.classes()).toContain('completed')
  })

  it('removes a todo', async () => {
    // Add a todo first
    const input = wrapper.find('.add-todo input')
    await input.setValue('Todo to remove')
    await input.trigger('keyup.enter')

    // Find and click delete button
    const deleteButton = wrapper.find('.todo-item button')
    await deleteButton.trigger('click')

    // Check if todo is removed
    const todos = wrapper.findAll('li')
    expect(todos).toHaveLength(0)
  })

  it('edits a todo', async () => {
    // Add a todo first
    const input = wrapper.find('.add-todo input')
    await input.setValue('Original Todo')
    await input.trigger('keyup.enter')

    // Start editing
    const todoText = wrapper.find('.todo-item span')
    await todoText.trigger('dblclick')

    // Find edit input and change value
    const editInput = wrapper.find('.todo-item input[type="text"]')
    await editInput.setValue('Edited Todo')
    await editInput.trigger('blur')

    // Check if todo is updated
    expect(wrapper.find('.todo-item span').text()).toBe('Edited Todo')
  })

  it('sets a due date on todo', async () => {
    // Add a todo first
    const input = wrapper.find('.add-todo input')
    await input.setValue('Todo with due date')
    await input.trigger('keyup.enter')

    // Set due date
    const dateInput = wrapper.find('input[type="date"]')
    const testDate = '2024-12-31'
    await dateInput.setValue(testDate)

    // Check if the date is set in localStorage
    const savedTodos = JSON.parse(localStorage.getItem('todos'))
    expect(savedTodos[0].dueDate).toBe(testDate)
  })

  it('persists todos in localStorage', async () => {
    // Add a todo
    const input = wrapper.find('.add-todo input')
    await input.setValue('Persistent Todo')
    await input.trigger('keyup.enter')

    // Check localStorage
    const savedTodos = JSON.parse(localStorage.getItem('todos'))
    expect(savedTodos).toHaveLength(1)
    expect(savedTodos[0].text).toBe('Persistent Todo')
  })
})