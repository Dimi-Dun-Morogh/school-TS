import mysql from 'mysql';
import config from './config';
import { logger, fixBracketsJSON } from './utils';
import { LessonCreator, TeacherCreator } from './models';

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

const CreateItem = async (table: string, itemObj: object): Promise<any> => {
  const keys = `(${Object.keys(itemObj).join(', ')})`;
  let values = Object.values(itemObj).reduce(
    (acc, item) => `${acc}"${Array.isArray(item) ? JSON.stringify(item) : item}", `,
    '',
  );
  values = fixBracketsJSON(values);
  const query = `INSERT INTO ${table} ${keys} VALUES (${values.slice(0, -2)})`;
  try {
    const connection = await ConnectDb();
    const newItem = await Query(connection, query);
    logger.info(NAMESPACE, `creating item for table ${table}`, itemObj);
    connection.end();
    return newItem;
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

const UpdateItem = async (
  table: string,
  id: string | number,
  itemObj: object,
) => {
  try {
    const query = Object.entries(itemObj).reduce(
      (acc, [key, value]) => `${acc}${key} = "${value}", `,
      '',
    );
    const connection = await ConnectDb();
    await Query(
      connection,
      `UPDATE ${table} SET ${query.slice(0, -2)} WHERE id = "${id}"`,
    );
    logger.info(NAMESPACE, `update item ${table}`, itemObj);
    const updated = await Query(
      connection,
      `SELECT  * FROM ${table} WHERE id = ${id}`,
    );
    logger.info(NAMESPACE, 'item updated', JSON.stringify(updated));
    connection.end();
  } catch (error) {
    logger.info(NAMESPACE, error.message, error);
  }
};

const DeleteItem = async (table: string, id: string | number) => {
  try {
    const connection = await ConnectDb();
    const deleted = await Query(
      connection,
      `DELETE from ${table} WHERE id = ${id}`,
    );
    logger.info(NAMESPACE, `deleting id ${id} from ${table}`);
    connection.end();
    logger.info(NAMESPACE, 'delete', deleted);
  } catch (error) {
    logger.info(NAMESPACE, error.message, error);
  }
};

const CreateLesson: LessonCreator = async (lesson: Object) => {
  const createdLesson = await CreateItem('lesson', lesson);
  return createdLesson;
};

const CreateTeacher: TeacherCreator = async (teacher: Object) => {
  const newTeacher = await CreateItem('teacher', teacher);
  return newTeacher;
};

const getAllTeachers = () => {
  logger.info(NAMESPACE, 'getAllTeachers');
  ReadItems('teacher');
};

export {
  ConnectDb,
  CreateItem,
  ReadItems,
  UpdateItem,
  DeleteItem,
  CreateLesson,
  CreateTeacher,
  getAllTeachers,
};
