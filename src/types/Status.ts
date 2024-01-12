import { TodoItem } from './TodoItem'
export interface Status {
  id: string
  title: string
  todoList: TodoItem[]
}
