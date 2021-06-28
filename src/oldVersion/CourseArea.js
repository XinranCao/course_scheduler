import React from 'react';
import './App.css';
import Course from './Course';
import Sections from './Sections';

class CourseArea extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      courseData: {}
    }
  }

  getCourses() {
    let courses = [];
    for (const course of Object.entries(this.props.data)) {
      courses.push(
        <Course chooseCourse={(info) => this.setInfo(info)} key={course[0]} data={course[1]} />
      )
    }
    return courses;
  }

  setInfo(info) {
    this.setState({ courseData: info });
  }

  render() {
    return (
      <>
        <div style={{ margin: '5px' }}>
          {this.getCourses()}
        </div>
        <Sections data={this.state.courseData} callBackSections={this.props.callBackCourseArea} />
      </>
    )
  }
}

export default CourseArea;
