import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Course } from '../../../models/course.model';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-courses.component.html',
  styleUrls: ['./manage-courses.component.scss']
})
export class ManageCoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  filterStatus = 'All';
  searchText = '';
  confirmDeleteId: string | null = null;
  successMessage = '';
  currentUser = this.auth.getCurrentUser();

  constructor(private courseService: CourseService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courses = this.courseService.getAllCourses();
    this.applyFilter();
  }

  applyFilter(): void {
    let result = this.courses;
    if (this.filterStatus !== 'All') {
      result = result.filter(c => c.approvalStatus === this.filterStatus);
    }
    if (this.searchText.trim()) {
      const term = this.searchText.toLowerCase();
      result = result.filter(c =>
        c.courseName.toLowerCase().includes(term) ||
        c.technology.toLowerCase().includes(term)
      );
    }
    this.filteredCourses = result;
  }

  approveCourse(course: Course): void {
    if (this.currentUser?.role === 'lead' && course.approvalStatus === 'Pending') {
      this.courseService.updateCourseStatus(course.id!, 'Lead Approved', 'leadApprovedBy', this.currentUser.username);
    } else if (this.currentUser?.role === 'admin' && (course.approvalStatus === 'Lead Approved' || course.approvalStatus === 'Pending')) {
      this.courseService.updateCourseStatus(course.id!, 'Admin Approved', 'adminApprovedBy', this.currentUser.username);
    }
    this.loadCourses();
    this.successMessage = `Course "${course.courseName}" approved!`;
    setTimeout(() => this.successMessage = '', 3000);
  }

  rejectCourse(course: Course): void {
    this.courseService.updateCourseStatus(course.id!, 'Rejected');
    this.loadCourses();
    this.successMessage = `Course "${course.courseName}" rejected.`;
    setTimeout(() => this.successMessage = '', 3000);
  }

  confirmDelete(id: string): void {
    this.confirmDeleteId = id;
  }

  deleteCourse(): void {
    if (this.confirmDeleteId) {
      this.courseService.deleteCourse(this.confirmDeleteId);
      this.confirmDeleteId = null;
      this.loadCourses();
      this.successMessage = 'Course deleted successfully.';
      setTimeout(() => this.successMessage = '', 3000);
    }
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  canApprove(course: Course): boolean {
    if (this.currentUser?.role === 'lead' && course.approvalStatus === 'Pending') return true;
    if (this.currentUser?.role === 'admin' && (course.approvalStatus === 'Lead Approved' || course.approvalStatus === 'Pending')) return true;
    return false;
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Admin Approved': return 'bg-success';
      case 'Lead Approved': return 'bg-info text-dark';
      case 'Pending': return 'bg-warning text-dark';
      case 'Rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
