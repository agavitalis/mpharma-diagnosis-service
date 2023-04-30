import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('diagnosis')
export class Diagnosis {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'text', nullable: true })
  categoryCode: string;

  @Column({ type: 'text', nullable: true })
  diagnosisCode: string;

  @Column({ type: 'text', nullable: true })
  fullCode: string;

  @Column({ type: 'text', nullable: true })
  abbreviatedDescription: string;

  @Column({ type: 'text', nullable: true })
  fullDescription: string;

  @Column({ type: 'text', nullable: true })
  categoryTitle: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp with time zone', default: null })
  deletedAt: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
