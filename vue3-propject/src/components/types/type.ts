// 菜单项中的数据类型
export interface MenuData {
  title: string
  index: string
  icon: string
  isPublic?: boolean
  children?: MenuChildrenData[]
}
export interface MenuChildrenData {
  title: string
  index: string
  icon: string
}
