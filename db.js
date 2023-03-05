import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "banco.sqlite";

const SQL_CREATE_ENTRIES = [
  `CREATE TABLE IF NOT EXISTS jogos (
      id INTEGER PRIMARY KEY autoincrement,
      nome VARCHAR(30) NOT NULL,
      imagem BLOB
  )`,

  `CREATE TABLE IF NOT EXISTS conquistas (
    id INTEGER PRIMARY KEY autoincrement,
    idjogo INTEGER NOT NULL,
    nome VARCHAR(30) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    concluida INTEGER NOT NULL
  )`,  

  `CREATE TABLE IF NOT EXISTS objetivos (
    id INTEGER PRIMARY KEY autoincrement,
    idconquista INTEGER NOT NULL,
    descricao VARCHAR(30) NOT NULL,
    concluido INTEGER NOT NULL
  )`, 
];

let _db = null;

export function executeSql(query, params = []) {
  // uma função atalho para execução de SQLs
  // de apenas uma linha
  // o bom dessa função é que sempre antes de rodar a query
  // ela já ira verificar se a conexão com o banco já foi aberta
  if (!_db) {
    openDB();
  }

  return new Promise((resolve, reject) => {
    _db.transaction(tx => {
      tx.executeSql(
        query,
        params,
        (_, rs) => resolve(rs),
        (_, err) => reject(err)
      );
    });
  });
}

export default function openDB() {
  if (!_db) {
    _db = SQLite.openDatabase(DATABASE_NAME);

    // primeira vez que iremos abrir a conexão,
    // tentaremos criar nossas tabelas
    _db.transaction(
      tx => {
        // sendo um array de "create table" iremos
        // "girar" uma vez para cada table a ser criada
        SQL_CREATE_ENTRIES.map(query => {
          tx.executeSql(query);
        });
      },
      err => console.warn(err),
      () => {} //console.log(`Banco iniciado`)
    );
  }

  return _db;
}
