interface Teacher {
  age: number;
  sex: string;
  yearsOfExperience: number;
  canTeachSubjects?: Array<LessonTypes>;
  name: string;
}

interface Lesson {
  teacher_id: number;
  classRoom_id: number;
  day: string;
  time: string;
  lessonName: string;
  classGroup: number;
}

interface ClassRoom {
  classRoomNumber: number;
}

enum LessonTypes {
  MATHEMATICS = 'Mathematics',
  HISTORY = 'History',
  PHYSICS = 'Physics',
  ENGLISH = 'English',
  CHEMISTRY = 'Chemistry',
  PHYLOSOPHY = 'Phylosophy',
}

export {
  Teacher, LessonTypes, ClassRoom, Lesson,
};
