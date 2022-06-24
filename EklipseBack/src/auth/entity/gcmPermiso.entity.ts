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

// @Entity('GCMPERMISO')
// export class GcmPermiso {
//   @PrimaryGeneratedColumn({ name: 'OID' })
//   id: number;

//   @Column({ name: 'NOMBRE' })
//   rol: string;

//   @Column({ name: 'CLAVE' })
//   clave: number;

//   @Column({ name: 'MODULO' })
//   modulo: number;

//   @ManyToOne(() => Users, (user) => user.RegPermiso, { eager: true })
//   @JoinColumn({ name: 'GENUSUREG' })
//   userRegPermiso: Users;

//   @CreateDateColumn({ name: 'FECHORREG', type: 'timestamp' })
//   fechaRegPermiso: Date;

//   @ManyToOne(() => Users, (user) => user.ActPermiso, { eager: true })
//   @JoinColumn({ name: 'GENUSUACT' })
//   userActPermiso: Users;

//   @UpdateDateColumn({ name: 'FECHORACT', type: 'timestamp' })
//   fechaActPermiso: Date;
// }
