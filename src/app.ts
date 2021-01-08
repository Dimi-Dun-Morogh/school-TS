import {
  CreateItem,
  ReadItems,
  UpdateItem,
  DeleteItem,
  CreateLesson,
  CreateTeacher,
  getAllTeachers,
} from './db';
import { LessonTypes } from './models';

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

// DeleteItem('lesson', 31);
const lesson = {
  teacher_id: 2,
  classRoom_id: 22,
  day: 'Monday',
  // time: '14:00',
  lessonName: 'Physics',
  classGroup: 222,
};
// CreateLesson(lesson);
const teacher = {
  age: 55,
  sex: 'female',
  yearsOfExperience: 33,
  //  canTeachSubjects: JSON.stringify({ somecrap: ['rrr', 'xxx'] }),
  canTeachSubjects: [LessonTypes.ENGLISH, LessonTypes.MATHEMATICS],
  name: 'Zed lady',
};

// CreateTeacher(teacher);

getAllTeachers();
