import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  technologies: string[] = [];

  searchTechnology = '';
  selectedTechnology = '';
  minDuration: number | null = null;
  maxDuration: number | null = null;
  hasSearched = false;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.allCourses = this.courseService.getApprovedCourses();
    this.filteredCourses = this.allCourses;
    this.technologies = this.courseService.getUniqueTechnologies();
  }

  onSearch(): void {
    this.hasSearched = true;
    let result = this.allCourses;

    const techFilter = this.selectedTechnology || this.searchTechnology;
    if (techFilter.trim()) {
      result = result.filter(c =>
        c.technology.toLowerCase().includes(techFilter.toLowerCase()) ||
        c.courseName.toLowerCase().includes(techFilter.toLowerCase())
      );
    }

    if (this.minDuration !== null && this.minDuration > 0) {
      result = result.filter(c => c.courseDuration >= this.minDuration!);
    }
    if (this.maxDuration !== null && this.maxDuration > 0) {
      result = result.filter(c => c.courseDuration <= this.maxDuration!);
    }

    this.filteredCourses = result;
  }

  onReset(): void {
    this.searchTechnology = '';
    this.selectedTechnology = '';
    this.minDuration = null;
    this.maxDuration = null;
    this.hasSearched = false;
    this.filteredCourses = this.allCourses;
  }
}
