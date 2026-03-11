import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly COURSES_KEY = 'lms_courses';

  private getCourses(): Course[] {
    const data = localStorage.getItem(this.COURSES_KEY);
    if (data) return JSON.parse(data);
    // Seed sample courses
    const seed: Course[] = [
      {
        id: '1', courseName: 'Angular Complete Developer Course', courseDuration: 40,
        courseDescription: 'Learn Angular from scratch including components, directives, pipes, routing, services, RxJS, forms, and state management with NgRx. This comprehensive course covers all aspects of Angular development.',
        technology: 'Angular', launchUrl: 'https://angular.io', approvalStatus: 'Admin Approved',
        addedBy: 'user-1', createdAt: new Date('2025-01-10')
      },
      {
        id: '2', courseName: 'React JS Masterclass for Beginners and Advanced', courseDuration: 35,
        courseDescription: 'Master React JS with hooks, context API, Redux, React Router, and modern patterns. Build real-world applications and learn best practices for scalable React development.',
        technology: 'React', launchUrl: 'https://reactjs.org', approvalStatus: 'Admin Approved',
        addedBy: 'user-1', createdAt: new Date('2025-02-15')
      },
      {
        id: '3', courseName: 'Spring Boot Microservices with Docker and Kubernetes', courseDuration: 50,
        courseDescription: 'Deep dive into Spring Boot microservices architecture, REST APIs, Docker containerization, Kubernetes orchestration. Learn to build production-ready microservices with security and monitoring.',
        technology: 'Java', launchUrl: 'https://spring.io', approvalStatus: 'Admin Approved',
        addedBy: 'user-2', createdAt: new Date('2025-03-01')
      },
      {
        id: '4', courseName: 'Python Data Science and Machine Learning Bootcamp', courseDuration: 60,
        courseDescription: 'Comprehensive Python for Data Science covering NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow. Learn machine learning algorithms, data visualization, and model deployment.',
        technology: 'Python', launchUrl: 'https://python.org', approvalStatus: 'Lead Approved',
        addedBy: 'user-3', createdAt: new Date('2025-03-10')
      },
      {
        id: '5', courseName: 'TypeScript Advanced Concepts and Design Patterns', courseDuration: 20,
        courseDescription: 'Master TypeScript advanced types, generics, decorators, and design patterns. Learn how to write type-safe enterprise-grade applications with TypeScript and modern tooling.',
        technology: 'TypeScript', launchUrl: 'https://typescriptlang.org', approvalStatus: 'Pending',
        addedBy: 'user-4', createdAt: new Date('2025-03-15')
      }
    ];
    this.saveCourses(seed);
    return seed;
  }

  private saveCourses(courses: Course[]): void {
    localStorage.setItem(this.COURSES_KEY, JSON.stringify(courses));
  }

  getAllCourses(): Course[] {
    return this.getCourses();
  }

  getApprovedCourses(): Course[] {
    return this.getCourses().filter(c => c.approvalStatus === 'Admin Approved');
  }

  getCoursesByTechnology(tech: string): Course[] {
    return this.getApprovedCourses().filter(c =>
      c.technology.toLowerCase().includes(tech.toLowerCase())
    );
  }

  getCoursesByTechnologyAndDuration(tech: string, minDuration: number, maxDuration: number): Course[] {
    return this.getApprovedCourses().filter(c =>
      c.technology.toLowerCase().includes(tech.toLowerCase()) &&
      c.courseDuration >= minDuration && c.courseDuration <= maxDuration
    );
  }

  addCourse(course: Omit<Course, 'id' | 'approvalStatus' | 'createdAt'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      approvalStatus: 'Pending',
      createdAt: new Date()
    };
    courses.push(newCourse);
    this.saveCourses(courses);
    return newCourse;
  }

  updateCourseStatus(id: string, status: Course['approvalStatus'], approverField?: string, approverName?: string): boolean {
    const courses = this.getCourses();
    const idx = courses.findIndex(c => c.id === id);
    if (idx === -1) return false;
    courses[idx].approvalStatus = status;
    if (approverField && approverName) {
      (courses[idx] as any)[approverField] = approverName;
    }
    this.saveCourses(courses);
    return true;
  }

  deleteCourse(id: string): boolean {
    const courses = this.getCourses();
    const filtered = courses.filter(c => c.id !== id);
    if (filtered.length === courses.length) return false;
    this.saveCourses(filtered);
    return true;
  }

  getUniqueTechnologies(): string[] {
    const courses = this.getApprovedCourses();
    return [...new Set(courses.map(c => c.technology))];
  }
}
