export interface TodosList {
  [x: string]: TodoItem[]
};

export type TodoItem = {
  id: string,
  text: string,
  complete: string,
};