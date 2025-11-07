import { Task } from "src/tasks/entities/task.entity";
import { User } from "src/users/entities/user.entity";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity()
@Unique(["name", "userId"])
export class Label {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 70,
    nullable: false,
    unique: true,
  })
  @Index({ unique: true })
  name: string;

  @ManyToMany(() => Task, (task) => task.labels)
  tasks: Task[];

  @ManyToOne(() => User, (user) => user.labels, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({
    nullable: true,
  })
  userId: string;
}
