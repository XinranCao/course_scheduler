import React, { useState } from 'react';
import '../newVersion.css';

function FavList(props) {  
  
  const [showSecList, setShowSecList] = useState([])
  const [showSubSecList, setShowSubSecList] = useState([])
  const { favList, modifyFavList, selectedCourseList, setselectedCourseList } = props
    
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

  console.log('showSecList',showSecList)

  return <div className='favListSec'>
      <div className='sectionTitle'>Favorite List</div> 
      <div className='favList'>
        {
          Object.values(favList).map( course => (
            <React.Fragment key={course.number}>
              <div className='favCourse'>
                <div className='checkBtn' onClick={()=>{}}/>
                <div 
                  className={ showSecList.includes(course.number) ? 'showSectionBtn_active' : 'showSectionBtn' }
                  onClick={()=>toggleShowSecList(course.number)}/>
                <div className='number'>{course.number}</div>
                <div className='credits'>
                  <span className='creditNum'>{course.credits}</span>
                  {` credit${course.credits>1?'s':''}`}
                </div>
                <div className='removeBtn' onClick={()=>modifyFavList( 'remove', 'all', course, null, null) }>Remove</div>
              </div>
              {
                showSecList.includes(course.number) ? 
                  Object.entries(course.sections).map(([section,sectionInfo]) => (
                    <React.Fragment key={section}>
                      <div className='favSecInfo' >
                        <div className='checkBtn' onClick={()=>{}}/>
                        {
                          Object.keys(sectionInfo.subsections).length !== 0
                          ? <div 
                              className={ showSubSecList.includes(section) ? 'showSectionBtn_active' : 'showSectionBtn' }
                              onClick={()=>toggleShowSubSecList(section)}/>
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
                        <div className='removeBtn' onClick={()=>modifyFavList( 'remove', 'section', course, section, null) }>Remove</div>
                      </div>
                      {
                        showSubSecList.includes(section) ? 
                          Object.entries(sectionInfo.subsections).map(([subsection,subsectionInfo]) => (
                            <div className='favSubSecInfo' key={subsection}>
                              <div className='checkBtn' onClick={()=>{}}/>
                              <div className='number'>{subsection}</div>
                              <div className='timeArea'>
                                {
                                  Object.entries(subsectionInfo.time).map(([day,time]) => (
                                    <span className='time' key={day+time}>{getDay(day)}{time}</span>
                                  ))
                                }
                              </div>
                              <div className='removeBtn' onClick={()=>modifyFavList( 'remove', 'subsection', course, section, subsection) }>Remove</div>
                            </div>
                          )) : null
                      }
                    </React.Fragment>
                  )) : null
                }
            </React.Fragment>
          ))
        }
      </div>
  </div>
}

export default FavList;