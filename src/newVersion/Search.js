import React from 'react';
import SideBar from './searchComp/SideBar';
import CourseList from './searchComp/CourseList';
import DetailInfo from './searchComp/DetailInfo';
import './newVersion.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseSelected: -1
    };
  }

  handleFilterCourses(keywordList, mode) {
    const { allCourses, updateFilteredCourses } = this.props
    let filteredCourses = []

    if (!keywordList.length || !Object.values(allCourses).length) { 
      updateFilteredCourses(allCourses) 
      this.setState({ courseSelected: -1 })
      return;
    }

    Object.values(allCourses).map( (course, index) => {
      let courseKeywords = []
      course.keywords.map(item=>courseKeywords.push(item))
      courseKeywords.push(course.name, course.number)

      if (mode === 'intersection') {  // intersection of keywords
        let flag = true  // flag indicate whether currently all keywords are matched
        for (const keyword of keywordList) {  // user entered keywords
          let match = false // matchFlag indicator whether user entered keyword matches
          for (const courseKeyword of courseKeywords) { // course keywords
            if (courseKeyword.indexOf(keyword) !== -1) {  // if match at least one keyword
              match = true;
              break;
            }
          }
          if (!match) {  // if some user entered keywords are not matched
            flag = false  // becaue filter mode is "intersection", this couse doesn't meet condition
            break;
          }
        }
        if (flag) { filteredCourses.push(course) }  // if all user entered keywords are matched, add to list
      
      } else {  // union of keywords
        for (const keyword of keywordList) {  // user entered keywords
          let match = false // match flag
          for (const courseKeyword of courseKeywords) { // course keywords
            if (courseKeyword.indexOf(keyword) !== -1) {  // if match at least one keyword
              filteredCourses.push(course)  //  push the course into the filtered course list
              match = true
              break;  // because filter mode is "union", no need to check other keywords
            }
          }
          if (match) { break; } // because filter mode is "union", no need to check other keywords
        }
      }
    })

    updateFilteredCourses(filteredCourses)
    this.setState({ courseSelected: -1 })
  }


  handleSelectCourse(index) {
    const { courseSelected } = this.state
    const newIndex = courseSelected === index ? -1 : index
    this.setState({ courseSelected: newIndex })
  }

  handleFindRequisite(requisiteList) {
    const { allCourses } = this.props
    console.log('list',requisiteList)
    const classList = []
    requisiteList.map( requisite => {
      requisite.map( item => {
        classList.push(allCourses[item].number )
      })
    })
    return classList
  }

  render() {

    const { filteredCourses } = this.props
    const { courseSelected } = this.state

    return <>
      <SideBar filterCourse={ (keywordList, mode) => this.handleFilterCourses(keywordList, mode) } />
      <CourseList 
        filteredCourses={filteredCourses} 
        courseSelected={courseSelected} 
        selectCourse={ (index) => this.handleSelectCourse(index) } />
      <DetailInfo 
        courseInfo={ courseSelected < 0 ? {} : Object.values(filteredCourses)[courseSelected] }
        findRequisite={ (requisiteList)=>this.handleFindRequisite(requisiteList) } />
    </>
  }
}

export default Search;