import { BaseService } from "./base.service";
import { Todo, TodoModel } from "./todo.model";

class TodoService extends BaseService<typeof Todo> {
  Model = TodoModel;
}

export { TodoService };
