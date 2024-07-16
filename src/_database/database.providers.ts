import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'better-sqlite3',
        database: './database.sqlite',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        logging: true,
      });

      return dataSource.initialize();
    },
  },
];
