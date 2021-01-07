import mysql from 'mysql';
import config from './config';
import { logger } from './utils';

const params = {
  user: config.mysql.user,
  password: config.mysql.password,
  host: config.mysql.host,
  database: config.mysql.database,
};

const NAMESPACE = 'DATABASE';

const ConnectDb = async () => new Promise<mysql.Connection>((resolve, reject) => {
  const connection = mysql.createConnection(params);

  connection.connect((error) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(connection);
  });
});

const Query = async (connection: mysql.Connection, query: string) => new Promise((resolve, reject) => {
  connection.query(query, connection, (error, result) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(result);
  });
});

/* const query = 'INSERT INTO lesson (teacher_id, classRoom_id, day,
   time, lessonName) VALUES ("2", "2", "friday", "17:00", "Mathematics")';
*/
const CreateItem = async (table: string, itemObj: object) => {
  const keys = `(${Object.keys(itemObj).join(', ')})`;
  const values = Object.values(itemObj).reduce(
    (acc, item) => `${acc}"${item}", `,
    '',
  );
  const query = `INSERT INTO ${table} ${keys} VALUES (${values.slice(0, -2)})`;
  try {
    const connection = await ConnectDb();
    await Query(connection, query);
    logger.info(NAMESPACE, `creating item for table ${table}`, itemObj);
    connection.end();
  } catch (error) {
    logger.info(NAMESPACE, error.message, error);
  }
};

const ReadItems = async (table: string) => {
  try {
    const connection = await ConnectDb();
    const items = await Query(connection, `SELECT * from ${table}`);
    logger.info(
      NAMESPACE,
      `reading items from ${table}`,
      JSON.parse(JSON.stringify(items)),
    );
    connection.end();
    return items;
  } catch (error) {
    logger.info(NAMESPACE, error.message, error);
  }
};

const UpdateItem = async (table: string, id: string | number, itemObj: object) => {
  try {
    const query = Object.entries(itemObj).reduce(
      (acc, [key, value]) => `${acc}${key} = "${value}", `,
      '',
    );
    const connection = await ConnectDb();
    await Query(connection, `UPDATE ${table} SET ${query.slice(0, -2)} WHERE id = "${id}"`);
    logger.info(NAMESPACE, `update item ${table}`, itemObj);
    const updated = await Query(connection, `SELECT  * FROM ${table} WHERE id = ${id}`);
    logger.info(NAMESPACE, 'item updated', JSON.stringify(updated));
    connection.end();
  } catch (error) {
    logger.info(NAMESPACE, error.message, error);
  }
};

const DeleteItem = async (table:string, id: string|number) => {
  try {
    const connection = await ConnectDb();
    const deleted = await Query(connection, `DELETE from ${table} WHERE id = ${id}`);
    logger.info(NAMESPACE, `deleting id ${id} from ${table}`);
    connection.end();
    logger.info(NAMESPACE, 'delete', deleted);
  } catch (error) {
    logger.info(NAMESPACE, error.message, error);
  }
};

export {
  ConnectDb, CreateItem, ReadItems, UpdateItem, DeleteItem,
};
