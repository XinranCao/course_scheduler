import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Schedule from './Schedule';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import ClassInfo from '../ClassInfo.json'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: {},
      filteredCourses: {},
      subjects: [],
      schedule: {}
    };
  }

  componentDidMount() {
    // fetch('https://mysqlcs639.cs.wisc.edu:5000/classes').then(
    //   res => res.json()
    // ).then(data => this.setState({ allCourses: data, filteredCourses: data, subjects: this.getSubjects(data) }));
    console.log('==', ClassInfo)
    this.setState({ allCourses: ClassInfo, filteredCourses: ClassInfo, subjects: this.getSubjects(ClassInfo) })
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (const course of Object.values(data)) {
      if (subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({ filteredCourses: courses })
  }

  setSchedule(key, course, sectionNum, subSectionNum) {
    this.setState((prevState) => ({
      schedule: this.addToSchedule(prevState.schedule, key, course, sectionNum, subSectionNum),
    }))
  }

  addToSchedule(currSchedule, key, course, sectionNum, subSectionNum) {

    var newSchedule = Object.assign({}, currSchedule);

    // when "add all" button is clicked
    if (key === 'all') {
      newSchedule[course.number] =
      {
        "name": course.name,
        "credit": course.credits,
        "number": course.number,
        "sections": course.sections
      };

      // when user choose to add sections to schedule
    } else if (key === 'sections') {

      // check if the course is already in schedule
      if (newSchedule[course.number]) {
        // check if the section is already in schedule
        if (!(newSchedule[course.number].sections)[sectionNum]) {
          (newSchedule[course.number].sections)[sectionNum] = course.sections[sectionNum];
        }
      } else {
        newSchedule[course.number] =
        {
          "name": course.name,
          "credit": course.credits,
          "number": course.number,
          "sections": { [sectionNum]: course.sections[sectionNum] }
        };
      }

      // when user choose to add subsections to schedule
    } else if (key === 'subSections') {

      // check if the course is already in schedule
      if (newSchedule[course.number]) {
        var sections = newSchedule[course.number].sections;

        //check if the section is already in schedule
        if (Object.keys(sections).includes(sectionNum)) {
          sections[sectionNum].subsections[subSectionNum] = course.sections[sectionNum].subsections[subSectionNum];
        }
        else {
          sections[sectionNum] = {
            "time": course.sections[sectionNum].time,
            "subsections": { [subSectionNum]: course.sections[sectionNum].subsections[subSectionNum] }
          }
        }

      } else {
        newSchedule[course.number] =
        {
          "name": course.name,
          "credit": course.credits,
          "number": course.number,
          "sections": {
            [sectionNum]: {
              "time": course.sections[sectionNum].time,
              "subsections": { [subSectionNum]: course.sections[sectionNum].subsections[subSectionNum] }
            }
          }
        };
      }
    }
    return newSchedule;
  }

  callBackSchedule(key, course, sectionNum, subSectionNum) {
    this.setState((prevState) => ({
      schedule: this.removeFromSchedule(prevState.schedule, key, course, sectionNum, subSectionNum)
    }))
  }

  removeFromSchedule(currSchedule, key, course, sectionNum, subSectionNum) {
    var newSchedule = Object.assign({}, currSchedule);

    if (key === 'all') {
      // delete whole course
      delete newSchedule[course.number];
    } else if (key === 'sections') {
      // delete section
      delete newSchedule[course.number].sections[sectionNum];
      var item = newSchedule[course.number].sections;
      // when all sections are deleted, delete the course
      if (Object.entries(item).length === 0 && item.constructor === Object) {
        delete newSchedule[course.number];
      }
    } else if (key === 'subSections') {
      // delete subsection
      delete newSchedule[course.number].sections[sectionNum].subsections[subSectionNum];
      var item1 = newSchedule[course.number].sections[sectionNum].subsections;
      // when all subsections are deleted, delete the section
      if (Object.entries(item1).length === 0 && item1.constructor === Object) {
        delete newSchedule[course.number].sections[sectionNum];
        let item2 = newSchedule[course.number].sections;
        // when all ections a deleted, delete the course
        if (Object.entries(item2).length === 0 && item2.constructor === Object)
          delete newSchedule[course.number];
      }
    }
    return newSchedule;
  }

  render() {

    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="Search">
          <Tab eventKey="Search" title="Search">
            <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects} />
            <div style={{ marginLeft: '20vw' }}>
              <CourseArea callBackCourseArea={(key, course, sectionNum, subSectionNum) => this.setSchedule(key, course, sectionNum, subSectionNum)} data={this.state.filteredCourses} />
            </div>
          </Tab>
          <Tab eventKey="Schedule" title="Schedule">
            <div>
              <Schedule callBackSchedule={(key, course, sectionNum, subSectionNum) => this.callBackSchedule(key, course, sectionNum, subSectionNum)} data={this.state.schedule} filteredCourses={this.state.filteredCourses} />
            </div>
          </Tab>
        </Tabs>
      </>
    )
  }
}

export default App;