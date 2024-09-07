import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { ICategory, IDetail, ILesson, IPrice } from "../@types/course";
import { Course } from "./Course";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 254, nullable: false })
  title: string;

  @Column({ length: 254, nullable: false })
  color: string;

  @Column({ length: 254, nullable: true })
  description: string;
  
  @Column({ length: 254, nullable: true })
  icon: string;

  @ManyToMany(() => Course, (course) => course.categories)
  courses: Course[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
