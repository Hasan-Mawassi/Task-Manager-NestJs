import { Task } from "src/tasks/entities/task.entity";
import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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
}
