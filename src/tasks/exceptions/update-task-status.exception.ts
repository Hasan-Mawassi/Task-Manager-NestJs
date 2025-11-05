export class UpdateTaskException extends Error {
  constructor() {
    super("Failed to update task status");
    this.name = "UpdateTaskException";
  }
}
