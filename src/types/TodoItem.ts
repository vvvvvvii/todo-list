export interface TodoItem {
  id: string
  title: string
  content: string
  status: {
    id: string
    name: string
  }
  deadline: number
  isOvertime: boolean
  normalTags: string[]
  customTag: string
  tags: string[]
}
