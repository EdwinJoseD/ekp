// import { Users } from 'src/users/entity';
// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   JoinColumn,
//   ManyToOne,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from 'typeorm';

// @Entity('GCMROLPERMISO')
// export class GcmRolPermiso {
//   @PrimaryGeneratedColumn({ name: 'OID' })
//   id: number;

//   @Column({ name: 'GENROL' })
//   idRol: number;

//   @Column({ name: 'GCMPERMISO' })
//   idPermiso: number;

//   @Column({ name: 'ACTIVO' })
//   activo: number;

//   @ManyToOne(() => Users, (user) => user.RegRolPermiso, { eager: true })
//   @JoinColumn({ name: 'GENUSUREG' })
//   userRegRolPermiso: Users;

//   @CreateDateColumn({ name: 'FECHORREG', type: 'timestamp' })
//   fechaRegRolPermiso: Date;

//   @ManyToOne(() => Users, (user) => user.ActRolPermiso, { eager: true })
//   @JoinColumn({ name: 'GENUSUACT' })
//   userActRolPermiso: Users;

//   @UpdateDateColumn({ name: 'FECHORACT', type: 'timestamp' })
//   fechaActRolPermiso: Date;
// }
