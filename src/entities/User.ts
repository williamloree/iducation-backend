import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Token } from "./Token";
import { Course } from "./Course";
import { TRole } from "../@types/role";
import { IInformation } from "../@types/user";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ length: 254, nullable: false })
  email: string;

  @Column({ length: 254, nullable: true })
  password: string;

  @Column({ type: "varchar", length: 254, unique: false, nullable: true })
  passwordToken?: string | null;

  @CreateDateColumn({ nullable: true })
  passwordTokenExpiration?: Date;

  @OneToMany(() => Token, (token) => token.user, { eager: true })
  tokens: Token[];

  @Column({ length: 254, nullable: true, default: "user" })
  role: TRole;

  @Column({ type: "jsonb", nullable: true, default: "{}" })
  information: IInformation;
  
  @Column({ nullable: true })
  slug: string;

  @OneToMany(() => Course, (course) => course.teacher)
  courses: Course[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  lastValidToken(): Token | undefined {
    return this.tokens.find(
      (token: Token) => token.tokenRevokedAt > new Date()
    );
  }

  validRefreshToken(): Token | undefined {
    return this.tokens.find(
      (token: Token) => token.refreshRevokedAt > new Date()
    );
  }

  @BeforeInsert()
  async setSlug() {
    const concat = `${this.information.nom}-${this.information.prenom}`;
    this.slug = concat.toLowerCase().replace(/^\s+|\s+$/g, "");
  }
}
