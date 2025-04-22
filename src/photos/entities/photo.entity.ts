import { Category } from "src/categories/entities/categories.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";

@Entity()
export class Photo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  url: string;

  @ManyToMany(() => Category, category => category.photos, {cascade: true})
  @JoinTable()
  categories: Category[];
}