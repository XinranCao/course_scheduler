import React, { useState } from 'react';
import SideBar from './searchComp/SideBar';
import CourseList from './searchComp/CourseList';
import DetailInfo from './searchComp/DetailInfo';
import './newVersion.css';

function Search (props) {

  const [courseSelected, setCourseSelected] = useState(-1)

  const { favList, filteredCourses, modifyFavList, allCourses, updateFilteredCourses } = props

  const handleFilterCourses = (keywordList, mode) => {
    let filteredCourses = []

    if (!keywordList.length || !Object.values(allCourses).length) { 
      updateFilteredCourses(allCourses) 
      setCourseSelected(-1)
      return;
    }

    Object.values(allCourses).map( course => {
      let courseKeywords = []
      course.keywords.map(item=>courseKeywords.push(item.toLowerCase()))
      courseKeywords.push(course.name.toLowerCase(), course.number.toLowerCase())

      if (mode === 'intersection') {  // intersection of keywords
        let flag = true  // flag indicate whether currently all keywords are matched
        for (const keyword of keywordList) {  // user entered keywords
          let match = false // matchFlag indicator whether user entered keyword matches
          for (const courseKeyword of courseKeywords) { // course keywords
            if (courseKeyword.indexOf(keyword.toLowerCase()) !== -1) {  // if match at least one keyword
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
            if (courseKeyword.indexOf(keyword.toLowerCase()) !== -1) {  // if match at least one keyword
              filteredCourses.push(course)  //  push the course into the filtered course list
              match = true
              break;  // because filter mode is "union", no need to check other keywords
            }
          }
          if (match) { break; } // because filter mode is "union", no need to check other keywords
        }
      }
      return null
    })
    updateFilteredCourses(filteredCourses)
    setCourseSelected(-1)
  }

  const handleSelectCourse = (index) => {
    const newIndex = courseSelected === index ? -1 : index
    setCourseSelected(newIndex)
  }

  const handleFindRequisite = (requisiteList) => {
    const classList = []
    requisiteList.map( requisite => {
      requisite.map( item => {
        classList.push(allCourses[item].number ); return null
      })
      return null
    })
    return classList
  }
  return <>
    <SideBar filterCourse={ (keywordList, mode) => handleFilterCourses(keywordList, mode) } />
    <CourseList 
      filteredCourses={filteredCourses} 
      courseSelected={courseSelected} 
      selectCourse={ index => handleSelectCourse(index) } />
    <DetailInfo 
      favList = {favList}
      modifyFavList = {modifyFavList}
      courseInfo={ courseSelected < 0 ? {} : Object.values(filteredCourses)[courseSelected] }
      findRequisite={ requisiteList => handleFindRequisite(requisiteList) } />
  </>
}

export default Search;