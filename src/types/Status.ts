import { TodoItem } from './TodoItem'
export interface Status {
  id: string
  name: string
  todoList: TodoItem[]
}
