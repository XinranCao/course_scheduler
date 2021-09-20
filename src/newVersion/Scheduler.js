import React, { useState, useEffect } from 'react';
import FavList from './schedulerComp/FavList'
import Schedule from './schedulerComp/Schedule'
import './newVersion.css';

function Scheduler (props) {

  const { favList, modifyFavList } = props
  const [selectedCourseList, setselectedCourseList] = useState({})

  useEffect(()=> {
    let newList = JSON.parse(JSON.stringify(selectedCourseList))

    Object.entries(selectedCourseList).map( ([selectedCourse, courseInfo]) => {
      if( Object.keys(favList).includes(selectedCourse) ) {
        Object.entries(courseInfo.sections).map(([ selectedSec, sectionInfo ])=>{
          if(Object.keys(favList[selectedCourse].sections).includes(selectedSec)) {
            Object.entries(sectionInfo.subsections).map(([ selectedSubSec ])=>{
              if(!Object.keys(favList[selectedCourse].sections[selectedSec].subsections).includes(selectedSubSec)) {
                delete newList[selectedCourse].sections[selectedSec].subsections[selectedSubSec]
              }
              return null
            })
          } else {
            delete newList[selectedCourse].sections[selectedSec]
          }
          return null
        })
      } else {
        delete newList[selectedCourse]
      }
      return null
    })
    setselectedCourseList(newList)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[favList])

  const handleModifyAllSelected = (operation) => {
    let newList = {}
    if (operation === 'add') {
      newList = JSON.parse(JSON.stringify(favList))
    }
    setselectedCourseList(newList)
  }

  const handleModifySelectedCourseList = (operation, key, course, sectionNum, subSectionNum) => {

    const courseInfo = JSON.parse(JSON.stringify(course))
    const newList = JSON.parse(JSON.stringify(selectedCourseList))

    if (operation === 'remove') {
      if (key === 'all') {
        // delete whole course
        delete newList[courseInfo.number];
      } else if (key === 'section') {
        // delete section
        delete newList[courseInfo.number].sections[sectionNum];
        var sectionObj = newList[courseInfo.number].sections;
        // when all sections are deleted, delete the course
        if (Object.entries(sectionObj).length === 0 && sectionObj.constructor === Object) {
          delete newList[courseInfo.number];
        }
      } else {
        // delete subsection
        delete newList[courseInfo.number].sections[sectionNum].subsections[subSectionNum];
        var subsectionObj = newList[courseInfo.number].sections[sectionNum].subsections;
        // when all subsections are deleted, delete the section
        if (Object.entries(subsectionObj).length === 0 && subsectionObj.constructor === Object) {
          delete newList[courseInfo.number].sections[sectionNum];
          let sectionObj = newList[courseInfo.number].sections;
          // when all ections a deleted, delete the course
          if (Object.entries(sectionObj).length === 0 && sectionObj.constructor === Object)
            delete newList[courseInfo.number];
        }
      }
      setselectedCourseList(newList)
      return
    }

    if (key === 'all') {
      newList[courseInfo.number] = {...courseInfo}
    } else if (key === 'section') {
      // check if the course is already in schedule
      if (newList[courseInfo.number]) {
          (newList[courseInfo.number].sections)[sectionNum] = courseInfo.sections[sectionNum]
      } else {
        newList[courseInfo.number] = {
          ...courseInfo,
          "sections": { [sectionNum]: courseInfo.sections[sectionNum] }
        }
      }
    } else {
      // check if the course is already in schedule
      if (newList[courseInfo.number]) {
        let sections = newList[courseInfo.number].sections;
        //check if the section is already in schedule
        if (sections[sectionNum]) {
          sections[sectionNum].subsections[subSectionNum] = courseInfo.sections[sectionNum].subsections[subSectionNum];
        }
        else {
          sections[sectionNum] = {
            ...courseInfo.sections[sectionNum],
            "subsections": { [subSectionNum]: courseInfo.sections[sectionNum].subsections[subSectionNum] }
          }
        }
      } else {
        newList[courseInfo.number] =
        {
          ...courseInfo,
          "sections": {
            [sectionNum]: {
              ...courseInfo.sections[sectionNum],
              "subsections": { [subSectionNum]: courseInfo.sections[sectionNum].subsections[subSectionNum] }
            }
          }
        }
      }
    }
    setselectedCourseList(newList)
  }

  return <>
    <FavList
      favList = {favList} 
      modifyFavList = {modifyFavList}      
      selectedCourseList={selectedCourseList}
      modifyAllSelected={handleModifyAllSelected}
      modifySelectedCourseList={ (operation, key, course, sectionNum, subSectionNum) => handleModifySelectedCourseList(operation, key, course, sectionNum, subSectionNum) } />
    <Schedule selectedCourseList={selectedCourseList} />
  </>
}

export default Scheduler;