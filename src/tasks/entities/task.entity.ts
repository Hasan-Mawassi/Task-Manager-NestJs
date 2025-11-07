import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TaskStatus } from "../task.model";
import { Label } from "src/labels/entities/label.entity";
import { User } from "src/users/entities/user.entity";

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

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({
    nullable: true,
  })
  userId: string;
}
