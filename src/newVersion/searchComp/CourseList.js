import React, { useEffect, useRef }  from 'react';
import '../newVersion.css';

function CourseList(props) {

  const { filteredCourses, courseSelected, selectCourse } = props
  const resultNum = Object.keys(filteredCourses).length
  const courseList = useRef(null)

  useEffect(()=>{
    if (courseList.current) {
      const courseInfo = [...document.getElementsByClassName('courseInfo'), ...document.getElementsByClassName('courseSelected')]
      let totalHeight = 0
      for ( const course of courseInfo ) {
        totalHeight += course.clientHeight
      }
      if ( totalHeight > courseList.current.clientHeight ) {
        courseList.current.style.boxShadow = 'inset 0 -10px 10px -8px #646569'
      } else {
        courseList.current.style.boxShadow = 'none'
      }
    }
  },[filteredCourses])

  const courseListScroll = (e) => {
    const courseInfo = [...document.getElementsByClassName('courseInfo'), ...document.getElementsByClassName('courseSelected')]
    let totalHeight = 0
    for ( const course of courseInfo) {
      totalHeight += course.clientHeight + 1
    }
    if ( totalHeight > (e.target.scrollTop + courseList.current.clientHeight) && e.target.scrollTop > 0 ) {
      courseList.current.style.boxShadow = 'inset 0 -10px 10px -8px #646569, inset 0px 10px 12px -8px #646569'
    } else if ( totalHeight > (e.target.scrollTop + courseList.current.clientHeight) ) {
      courseList.current.style.boxShadow = 'inset 0 -10px 10px -8px #646569'
    } else if ( e.target.scrollTop > 0 ) {
      courseList.current.style.boxShadow = 'inset 0 10px 10px -8px #646569'
    } else {
      courseList.current.style.boxShadow = 'none'
    }
  }
    
  return <div className='courseListSec'>
      <div className='sectionTitle'> {`${resultNum} result${resultNum>1?'s':''}`}</div>
      <div className='courseList' ref={courseList} onScroll={courseListScroll}>
        {
          Object.values(filteredCourses).map((course, index) => (
            <div 
              key={course.number}
              className={ courseSelected === index ? 'courseSelected' : 'courseInfo' }
              onClick={ () => selectCourse(index) }>
              <div className='number'>{course.number}</div>
              <div className='name'>{course.name}</div>
              <div className='credits'>
                <span className='creditNum'>{course.credits}</span>
                {` credit${course.credits>1?'s':''}`}
              </div>
            </div>
          ))
        }
      </div>
  </div>
}

export default CourseList;