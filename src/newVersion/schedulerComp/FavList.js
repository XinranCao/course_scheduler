import React, { useState } from 'react';
import '../newVersion.css';

function FavList(props) {  
  
  const [showSecList, setShowSecList] = useState([])
  const [showSubSecList, setShowSubSecList] = useState([])
  const { favList, modifyFavList, selectedCourseList, modifyAllSelected, modifySelectedCourseList } = props
    
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

  const toggleShowSecList = (course) => {
    if( showSecList.indexOf(course) < 0 ) {
      setShowSecList([...showSecList, course])
    } else {
      setShowSecList(showSecList.filter( e => e !== course ))
    }
  }

  const toggleShowSubSecList = (section) => {
    if( showSubSecList.indexOf(section) < 0 ) {
      setShowSubSecList([...showSubSecList, section])
    } else {
      setShowSubSecList(showSubSecList.filter( e => e !== section ))
    }
  }

  const toggleAllCourses = (operation) => {
    modifyAllSelected(operation)
  }

  const checkAllCoursesSelected = () => {
    let flag = true
    for (const [course, courseInfo] of Object.entries(favList) ) {
      const courseSelected = selectedCourseList[course]
      if (!courseSelected) {
        flag = false
        return
      }
      for (const [section, sectionInfo] of Object.entries(courseInfo.sections)) {
        if (!selectedCourseList[course].sections[section]) {
          flag = false
          return
        }
        for (const [subsection] of Object.entries(sectionInfo.subsections)) {
          if (!selectedCourseList[course].sections[section].subsections[subsection]) {
            flag = false
            return
          }
        }
      }
    }
    return flag
  }

  const getTotalCredits = () => {
    let totalCretis = 0
    Object.values(selectedCourseList).map(courseInfo => {
      totalCretis += courseInfo.credits
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
      : null
    }
    <div className='favList'>
      {
        Object.values(favList).map( course => {
          const courseSelected = selectedCourseList[course.number]
          return <React.Fragment key={course.number}>
            <div className='favCourse'>
              <div 
                className={ courseSelected ? 'checkBtn_checked' : 'checkBtn' }  
                onClick={ () => modifySelectedCourseList( courseSelected ? 'remove' : 'add', 'all', course, null, null) }>
                  {courseSelected ? '✓' : ''}
              </div>
              <div 
                className={ showSecList.includes(course.number) ? 'showSectionBtn' : 'showSectionBtn_active' }
                onClick={()=>toggleShowSecList(course.number)}>
                  {showSecList.includes(course.number) ? 'Hide sections' : 'Show sections'}
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
                  modifySelectedCourseList( courseSelected ? 'remove' : 'add', 'all', course, null, null)
                } }>Remove</div>
            </div>
            {
              showSecList.includes(course.number) ? 
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
                            className={ showSubSecList.includes(section) ? 'showSectionBtn' : 'showSectionBtn_active' }
                            onClick={()=>toggleShowSubSecList(section)}>
                              {showSubSecList.includes(section) ? 'Hide subsections' : 'Show subsections'}
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
                          modifySelectedCourseList( 'remove', 'section', course, section, null)
                        }}>Remove</div>
                    </div>
                    {
                      showSubSecList.includes(section) ? 
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
                                modifySelectedCourseList( 'remove', 'subsection', course, section, subsection)
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
        <div>Selected <span>{Object.values(selectedCourseList).length}</span> classes</div>
        <div>Total credits: <span>{getTotalCredits()}</span></div>
      </div>
      <div className='settingBtn'></div>
      <div className='generateBtn'>Generate Schedule</div>
    </div>
  </div>
}

export default FavList;