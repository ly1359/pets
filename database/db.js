import React from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('pets.db');

export const setupDatabase = async () => {
  const statement = await (await db).prepareAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT, 
      type TEXT, 
      otherType TEXT, 
      bDate TEXT, 
      vaccines TEXT, 
      image TEXT
    );
  `);
  await statement.executeAsync();
  await statement.finalizeAsync();

  const checkStatement = await (await db).prepareAsync('SELECT * FROM pets;');
  const result = await checkStatement.executeAsync();
  const rows = await result.getAllAsync();
  await checkStatement.finalizeAsync();

  if (rows.length === 0) {
    const insertStatement = await (await db).prepareAsync (`
      INSERT INTO pets (name, type, otherType, bDate, vaccines, image) 
      VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?);
    `);
    await insertStatement.executeAsync([
      'Pokan', 'Gato', '', '2020-01-01', 'Não informado', 'https://via.placeholder.com/100',
      'Mada', 'Cachorro', '', '2019-05-05', 'Não informado', 'https://via.placeholder.com/100'
    ]);
    await insertStatement.finalizeAsync();
  } 
//   else {
//     clearDatabase();
//   }
};

// const clearDatabase = async () => {
//     const tables = ['pets']; 

//     for (const table of tables) {
//       const deleteStatement = await (await db).prepareAsync (`DELETE FROM ${table};`);
//       await deleteStatement.executeAsync();
//       await deleteStatement.finalizeAsync();
//     }

//     const vacuumStatement = await (await db).prepareAsync ('VACUUM;');
//     await vacuumStatement.executeAsync();
//     await vacuumStatement.finalizeAsync();

//     console.log('Banco de dados limpo com sucesso!');
//   };


export const getDatabase = () => {
  return db;
};


export default db;
