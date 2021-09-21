import React, { useState, useEffect } from 'react';
import '../newVersion.css';

function FavList(props) {  

  const { favList, modifyFavList } = props

  const [state, setState] = useState({
    showSecList: [],
    showSubSecList: [],
    selectedCourseList: {}
  })

  useEffect(()=>{
    let newShowSecList = []
    let newShowSubSecList = []

    state.showSecList.map( course => {
      if (Object.keys(favList).includes(course)) {
        newShowSecList = [...state.showSecList]
        state.showSubSecList.map( course_sec => {
          if (!Object.keys(favList[course].sections).includes(course_sec.split('-')[1])) {
            newShowSubSecList = state.showSubSecList.filter( e => e !== course_sec )
          } else {
            newShowSubSecList = [...state.showSubSecList]
          }
          return null
        })
      } else {
        newShowSecList = state.showSecList.filter( e => e !== course )
        newShowSubSecList = state.showSubSecList.filter( e => e.indexOf(course) < 0 )
      }
      return null
    })

    let newSelectedCourseList = JSON.parse(JSON.stringify(state.selectedCourseList))

    Object.entries(state.selectedCourseList).map( ([selectedCourse, courseInfo]) => {
      if( Object.keys(favList).includes(selectedCourse) ) {
        Object.entries(courseInfo.sections).map(([ selectedSec, sectionInfo ])=>{
          if(Object.keys(favList[selectedCourse].sections).includes(selectedSec)) {
            Object.entries(sectionInfo.subsections).map(([ selectedSubSec ])=>{
              if(!Object.keys(favList[selectedCourse].sections[selectedSec].subsections).includes(selectedSubSec)) {
                delete newSelectedCourseList[selectedCourse].sections[selectedSec].subsections[selectedSubSec]
              }
              return null
            })
          } else {
            delete newSelectedCourseList[selectedCourse].sections[selectedSec]
          }
          return null
        })
      } else {
        delete newSelectedCourseList[selectedCourse]
      }
      return null
    })

    setState({ 
      showSecList: newShowSecList,
      showSubSecList: newShowSubSecList,
      selectedCourseList: newSelectedCourseList
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favList])

  const modifyAllSelected = (operation) => {
    let newList = {}
    if (operation === 'add') {
      newList = JSON.parse(JSON.stringify(favList))
    }
    setState({ ...state, selectedCourseList: newList })
  }

  const toggleShowSecList = (course) => {
    if( state.showSecList.indexOf(course) < 0 ) {
      setState({
        ...state,
        showSecList: [...state.showSecList, course]
      })
    } else {
      setState({
        ...state,
        showSecList: state.showSecList.filter( e => e !== course ),
        showSubSecList: state.showSubSecList.filter( e => e.indexOf(course) < 0 )
      })
    }
  }

  const toggleShowSubSecList = (course, section) => {
    const course_sec = course + '-' + section
    if( state.showSubSecList.indexOf(course_sec) < 0 ) {
      setState({
        ...state,
        showSubSecList: [...state.showSubSecList, course_sec]
      })
    } else {
      setState({
        ...state,
        showSubSecList: state.showSubSecList.filter( e => e !== course_sec )
      })
    }
  }
    
  const getDay = (day) => {
    const dayMap = {
      'monday': 'Mon ',
      'tuesday': 'Tue ',
      'wednesday': 'Wed ',
      'thursday': 'Thu ',
      'friday': 'Fri ',
      'Saturday': 'Sat ',
      'Sunday': 'Sun '
    }
    return dayMap[day.toLowerCase()]
  }

  const toggleAllCourses = (operation) => {
    modifyAllSelected(operation)
  }

  const checkAllCoursesSelected = () => {
    let flag = true
    for (const [course, courseInfo] of Object.entries(favList) ) {
      const courseSelected = state.selectedCourseList[course]
      if (!courseSelected) {
        flag = false
        return
      }
      for (const [section, sectionInfo] of Object.entries(courseInfo.sections)) {
        if (!state.selectedCourseList[course].sections[section]) {
          flag = false
          return
        }
        for (const [subsection] of Object.entries(sectionInfo.subsections)) {
          if (!state.selectedCourseList[course].sections[section].subsections[subsection]) {
            flag = false
            return
          }
        }
      }
    }
    return flag
  }

  const modifySelectedCourseList = (operation, key, course, sectionNum, subSectionNum) => {

    const courseInfo = JSON.parse(JSON.stringify(course))
    const newList = JSON.parse(JSON.stringify(state.selectedCourseList))

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
      setState({ ...state, selectedCourseList: newList })
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
    setState({ ...state, selectedCourseList: newList })
  }

  const getTotalCredits = () => {
    let totalCretis = 0
    Object.values(state.selectedCourseList).map(courseInfo => {
      totalCretis += courseInfo.credits
      return null
    })
    return totalCretis
  }

  return <div className='favListSec'>
    <div className='sectionTitle'>Favorite List</div> 
    { 
      Object.values(favList).length ? 
        checkAllCoursesSelected()
          ? <div className='selectAll' onClick={ () => toggleAllCourses('remove') }>
              <div className='checkBtn_checked'> ✓ </div>
              <span>Unselect all</span>
          </div>
          : <div className='selectAll' onClick={ () => toggleAllCourses('add') }>
              <div className='checkBtn'/>
              <span>Select all</span>
          </div> 
      : <div className='selectAll' />
    }
    <div className='favList'>
      {
        Object.values(favList).length
          ? null
          : <span className='noCourseTip'>Currently no course in list</span>
      }
      {
        Object.values(favList).map( course => {
          const courseSelected = state.selectedCourseList[course.number]
          return <React.Fragment key={course.number}>
            <div className='favCourse'>
              <div 
                className={ courseSelected ? 'checkBtn_checked' : 'checkBtn' }  
                onClick={ () => modifySelectedCourseList( courseSelected ? 'remove' : 'add', 'all', course, null, null) }>
                  {courseSelected ? '✓' : ''}
              </div>
              {console.log('state',state)}
              <div 
                className={ state.showSecList.includes(course.number) ? 'showSectionBtn' : 'showSectionBtn_active' }
                onClick={()=>toggleShowSecList(course.number)}>
                  {state.showSecList.includes(course.number) ? 'Hide sections' : 'Show sections'}
              </div>
              <div className='number'>{course.number}</div>
              <div className='credits'>
                <span className='creditNum'>{course.credits}</span>
                {` credit${course.credits>1?'s':''}`}
              </div>
              <div 
                className='removeBtn' 
                onClick={()=>{
                  modifyFavList( 'remove', 'all', course, null, null);
                } }>Remove</div>
            </div>
            {
              state.showSecList.includes(course.number) ? 
                Object.entries(course.sections).map(([section,sectionInfo]) => (
                  <React.Fragment key={section}>
                    <div className='favSecInfo' >
                      {
                        courseSelected && courseSelected.sections[section]
                        ? <div 
                          className='checkBtn_checked'
                          onClick={ () => modifySelectedCourseList( 'remove', 'section', course, section, null) }> ✓ </div>
                        : <div 
                          className='checkBtn'
                          onClick={ () => modifySelectedCourseList( 'add', 'section', course, section, null) }/>
                      }
                      {
                        Object.keys(sectionInfo.subsections).length !== 0
                        ? <div 
                            className={ state.showSubSecList.includes(course.number + '-' + section) ? 'showSectionBtn' : 'showSectionBtn_active' }
                            onClick={()=>toggleShowSubSecList(course.number, section)}>
                              {state.showSubSecList.includes(course.number + '-' + section) ? 'Hide subsections' : 'Show subsections'}
                          </div>
                        : null
                      }
                      <div className='number'>{section}</div>
                      <div className='timeArea'>
                        {
                          Object.entries(sectionInfo.time).map(([day,time]) => (
                            <span className='time' key={day+time}>{getDay(day)}{time}</span>
                          ))
                        }
                      </div>
                      <div 
                        className='removeBtn' 
                        onClick={()=>{
                          modifyFavList( 'remove', 'section', course, section, null);
                        }}>Remove</div>
                    </div>
                    {
                      state.showSubSecList.includes(course.number + '-' + section) ? 
                        Object.entries(sectionInfo.subsections).map(([subsection,subsectionInfo]) => (
                          <div className='favSubSecInfo' key={subsection}>
                            {
                              courseSelected 
                              && courseSelected.sections[section]
                              && courseSelected.sections[section].subsections[subsection]
                              ? <div 
                                className='checkBtn_checked'
                                onClick={ () => modifySelectedCourseList( 'remove', 'subsection', course, section, subsection) }> ✓ </div>
                              : <div 
                                className='checkBtn'
                                onClick={ () => modifySelectedCourseList( 'add', 'subsection', course, section, subsection) }/>
                            }
                            <div className='number'>{subsection}</div>
                            <div className='timeArea'>
                              {
                                Object.entries(subsectionInfo.time).map(([day,time]) => (
                                  <span className='time' key={day+time}>{getDay(day)}{time}</span>
                                ))
                              }
                            </div>
                            <div 
                              className='removeBtn' 
                              onClick={()=>{
                                modifyFavList( 'remove', 'subsection', course, section, subsection);
                              } }>Remove</div>
                          </div>
                        )) : null
                    }
                  </React.Fragment>
                )) : null
              }
          </React.Fragment>
        })
      }
    </div>
    <div className='footer'>
      <div className='info'>
        <div>Selected <span>{Object.values(state.selectedCourseList).length}</span> classes</div>
        <div>Total credits: <span>{getTotalCredits()}</span></div>
      </div>
      <div className='settingBtn'></div>
      <div
        className = { Object.values(state.selectedCourseList).length ? 'generateBtn' : 'generateBtn_disabled' }
        onClick={ ()=>{Object.values(state.selectedCourseList).length ? console.log('a') : console.log('b')}}>
        Generate Schedule
      </div>
    </div>
  </div>
}

export default FavList;