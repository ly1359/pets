import React from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseAsync('pets.db');

const getPetIdByName = async (name) => {
  const statement = await (await db).prepareAsync('SELECT id FROM pets WHERE name = ?;');
  const result = await statement.executeAsync([name]);
  const row = await result.getAllAsync();
  await statement.finalizeAsync();

  return row.length > 0 ? row[0].id : null;
};

export const setupDatabase = async () => {
  const statement = await (await db).prepareAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name TEXT, 
      type TEXT, 
      otherType TEXT, 
      bDate TEXT, 
      image TEXT
    );
  `);
  await statement.executeAsync();
  await statement.finalizeAsync();

  const statementVaccines = await (await db).prepareAsync(`
    CREATE TABLE IF NOT EXISTS vaccines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      petId INTEGER,
      vaccineName TEXT,
      vaccineDate TEXT,
      FOREIGN KEY (petId) REFERENCES pets(id)
    );
  `);
  await statementVaccines.executeAsync();
  await statementVaccines.finalizeAsync();

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
  //  else {
  //   clearDatabase();
  // }

  const checkStatementVaccines = await (await db).prepareAsync('SELECT * FROM vaccines;');
  const resultVaccines = await checkStatementVaccines.executeAsync();
  const rowsVaccines = await resultVaccines.getAllAsync()
  await checkStatementVaccines.finalizeAsync();

  if(rowsVaccines.length === 0){

    const pokanId = await getPetIdByName('Pokan');
    const madaId =  await getPetIdByName('Mada');

    const insertVaccines = await (await db).prepareAsync (`
      INSERT INTO vaccines (vaccineName, vaccineDate, petId) 
      VALUES (?, ?, ?),  (?, ?, ?), (?, ?, ?);
    `);

    await insertVaccines.executeAsync([
      'Raiva', '2024-08-21', pokanId,
      'Antirrábica', '2021-1-17', pokanId,
      'Parvovirose','2024-08-21', madaId
    ]);

    await insertVaccines.finalizeAsync();
    
  }
 
};

// const clearDatabase = async () => {
//   const tables = ['pets', 'vaccines'];

//   for (const table of tables) {
//     const deleteStatement = await (await db).prepareAsync (`DELETE FROM ${table};`);
//     await deleteStatement.executeAsync();
//     await deleteStatement.finalizeAsync();
//   }

//   const vacuumStatement = await (await db).prepareAsync ('VACUUM;');
//   await vacuumStatement.executeAsync();
//   await vacuumStatement.finalizeAsync();

//   console.log('Banco de dados limpo com sucesso!');
//   };


export const getDatabase = () => {
  return db;
};


export default db;
