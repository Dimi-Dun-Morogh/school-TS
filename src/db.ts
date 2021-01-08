import mysql from 'mysql';
import config from './config';
import { logger, fixBracketsJSON } from './utils';
import { Teacher, ClassRoom, Lesson } from './models';

const params = {
  user: config.mysql.user,
  password: config.mysql.password,
  host: config.mysql.host,
  database: config.mysql.database,
};

const NAMESPACE = 'db.ts';

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

const Query = async (connection: mysql.Connection, query: string) => new
Promise((resolve, reject) => {
  connection.query(query, connection, (error, result) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(result);
  });
});

const CreateItem = async (table: string, itemObj: Object) => {
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

const ReadItems = async (table: string) : Promise<any> => {
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
  itemObj: Object,
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

const DeleteItem = async (table: string, id: string | number) :Promise<any> => {
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

const CreateLesson = async (lesson:Lesson): Promise<any> => {
  const createdLesson = await CreateItem('lesson', lesson);
  return createdLesson;
};

const CreateClassRoom = async (classNumb :ClassRoom): Promise<any> => {
  const createdClassRoom = await CreateItem('classroom', classNumb);
  return createdClassRoom;
};

const CreateTeacher = async (teacher: Teacher): Promise<any> => {
  const newTeacher = await CreateItem('teacher', teacher);
  return newTeacher;
};

const getAllTeachers = ():void => {
  logger.info(NAMESPACE, 'getAllTeachers');
  ReadItems('teacher');
};

const getTargetMathTeachers = async () :Promise<void> => {
  try {
    const connection = await ConnectDb();

    const teacherIds = await Query(
      connection,
      'SELECT teacher_id FROM lesson WHERE day = "Thursday" AND lessonName = "Mathematics" AND classRoom_id = 1 AND time BETWEEN "08:30" AND "14:30"',
    ).then((res) => JSON.parse(JSON.stringify(res)));

    const stringOfIds = [...teacherIds].reduce(
      (acc, { teacher_id }) => `${acc + teacher_id},`,
      '',
    );

    const result = await Query(
      connection,
      `SELECT * FROM teacher WHERE find_in_set(id, '${stringOfIds}') AND   yearsOfExperience >= 10`,
    ).then((res) => JSON.parse(JSON.stringify(res)));
    logger.info(
      NAMESPACE,
      'SELECT teacher_id FROM lesson WHERE day = "Thursday" AND lessonName = "Mathematics" AND classRoom_id = 1 AND time BETWEEN "08:30" AND "14:30"',
    );
    logger.info(NAMESPACE, 'target math teacher ids', teacherIds);
    logger.info(NAMESPACE, 'target math  teachers, exp >=10', result);
    connection.end();
  } catch (error) {
    logger.info(NAMESPACE, error.message, error);
  }
};

export {
  ConnectDb,
  CreateItem,
  ReadItems,
  UpdateItem,
  DeleteItem,
  CreateLesson,
  CreateTeacher,
  CreateClassRoom,
  getAllTeachers,
  getTargetMathTeachers,
};
