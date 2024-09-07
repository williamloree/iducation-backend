import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.tokens, { onDelete: "CASCADE" })
  user: User;

  @Column({ length: 254 })
  token: string;

  @Column({ length: 254, nullable: true })
  refreshToken: string;

  @Column({ type: "timestamptz", nullable: true })
  lastUsedAt?: Date;

  @Column({ type: "timestamptz", nullable: true })
  tokenRevokedAt: Date;

  @Column({ type: "timestamptz", nullable: true })
  refreshRevokedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @AfterLoad()
  updateLastUsed() {
    this.lastUsedAt = new Date();
  }

  isValid() {
    return this.tokenRevokedAt > new Date();
  }
}
