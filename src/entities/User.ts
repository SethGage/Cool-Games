import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userID: string;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ unique: true })
  passwordHash: string;
}
