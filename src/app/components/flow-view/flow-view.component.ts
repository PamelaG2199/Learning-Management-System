import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-flow-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flow-view.component.html',
  styleUrls: ['./flow-view.component.scss']
})
export class FlowViewComponent implements OnInit {
  courses: Course[] = [];

  pendingCourses: Course[] = [];
  leadApprovedCourses: Course[] = [];
  adminApprovedCourses: Course[] = [];
  rejectedCourses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    const all = this.courseService.getAllCourses();
    this.pendingCourses = all.filter(c => c.approvalStatus === 'Pending');
    this.leadApprovedCourses = all.filter(c => c.approvalStatus === 'Lead Approved');
    this.adminApprovedCourses = all.filter(c => c.approvalStatus === 'Admin Approved');
    this.rejectedCourses = all.filter(c => c.approvalStatus === 'Rejected');
    this.courses = all;
  }
}
