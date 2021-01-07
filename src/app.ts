import {
  CreateItem, ReadItems, UpdateItem, DeleteItem,
} from './db';

const param = {
  teacher_id: 2,
  classRoom_id: 3,
  day: 'Tuesday',
  time: '13:30',
  lessonName: 'Physical Education',
};
// CreateItem('lesson', param);
// ReadItems('teacher')
const teacherObj = {
  age: 18,
  sex: 'female',
  yearsOfExperience: 2,
  name: 'Daenerys Targaryen',
};
// UpdateItem('teacher', 1, teacherObj);

DeleteItem('lesson', 31);
