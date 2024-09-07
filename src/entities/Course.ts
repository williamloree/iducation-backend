import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
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
import { Category } from "./Category";
import { Tag } from "./Tag";

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ nullable: false })
  titre: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  pub: boolean;

  @Column({ nullable: true })
  publish: boolean;

  @Column({ nullable: true })
  intro: string;

  @Column({ nullable: true })
  inscrits: number;

  @Column({ nullable: false })
  slug: string;

  @Column({ type: "jsonb", nullable: true, default: "{}" })
  price: IPrice;

  @Column({ type: "jsonb", nullable: true, default: "{}" })
  details: IDetail;

  // @Column({ type: "jsonb", nullable: true, default: "[]" })
  // categories: ICategory[];

  @ManyToMany(() => Category, (category) => category.courses, { eager: true })
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.courses, { eager: true })
  @JoinTable()
  tags: Tag[];

  @Column({ type: "jsonb", nullable: true, default: "[]" })
  lessons: ILesson[];

  @ManyToOne(() => User, (user) => user.courses, {
    eager: true,
    nullable: false,
  })
  teacher: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  magicString: string = "";

  @AfterLoad()
  setMagicString() {
    const temp = [this.titre];
    for (const category of this.categories) {
      temp.push(category.title);
    }
    for (const tag of this.tags) {
      temp.push(tag.title);
    }
    temp.push(this.details.skill);
    temp.push(this.price.free ? "gratuit" : "payant");
    this.magicString = temp.join(" ").toUpperCase();
  }

  @BeforeInsert()
  async setSlug() {
    this.slug = this.titre.toLowerCase().replace(/^\s+|\s+$/g, "");
    this.slug = this.slug
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
}
