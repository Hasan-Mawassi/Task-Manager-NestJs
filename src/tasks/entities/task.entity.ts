import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { TaskStatus } from "../task.model";
import { Label } from "src/labels/entities/label.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: "text",
    nullable: false,
  })
  description: string;

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  // task.entity.ts
  @ManyToMany(() => Label, (label) => label.tasks, { cascade: true })
  @JoinTable({
    name: "task_labels", // optional custom join table name
    joinColumn: { name: "task_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "label_id", referencedColumnName: "id" },
  })
  labels: Label[];
}
