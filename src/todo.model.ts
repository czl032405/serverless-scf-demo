import { pre, prop, getModelForClass, modelOptions, Typegoose } from "@typegoose/typegoose";

@pre<Todo>("save", async function() {
  this.random = Math.floor(Math.random() * 100000) + "";
})
@modelOptions({ schemaOptions: { timestamps: true, versionKey: false } })
class Todo extends Typegoose {
  @prop()
  public name: string;

  @prop()
  public desc?: string;

  @prop()
  public type?: string;

  @prop({ default: false })
  public isFinish?: boolean;

  @prop()
  public random?: string;

  @prop()
  public createdAt: Date;

  @prop()
  public updatedAt: Date;
}

const TodoModel = getModelForClass(Todo);

let a = new TodoModel();

export { Todo, TodoModel };
