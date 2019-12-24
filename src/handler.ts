import { TodoService } from "./todo.service";

// let todoService = new TodoService();

export async function index(event, context) {
  // let result = todoService.index();
  // return result;
  return [];
}

export async function test(event, context, callback) {
  return "hello world";
}

let hot = false;
export async function checkHot(event, context, callback) {
  console.info("checkhot");
  if (!hot) {
    return `cold start `;
  }
  hot = true;
  return `hot start `;
}
