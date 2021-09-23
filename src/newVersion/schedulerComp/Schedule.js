import React, { useEffect, useState } from 'react';
import '../newVersion.css';

function Schedule(props) {

  const { selectedCourseList } = props

  const [scheduleList, setScheduleList] = useState([])
  // const timeLine = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', 
  //                   '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  useEffect(()=>{
    let tempList = [{
      'monday': {},
      'tuesday': {},
      'wednesday': {},
      'thursday': {},
      'friday': {},
    }]

    console.log('selectedCourseList',selectedCourseList)

    for ( const [course, courseInfo] of Object.entries(selectedCourseList) ) {

      let newList = []

      tempList.map( tempSchedule => {
        for ( const [section, sectionInfo] of Object.entries(courseInfo.sections) ) {

          let newSchedule = JSON.parse(JSON.stringify(tempSchedule))
          let conflict = false

          for ( const [date, hours] of Object.entries(sectionInfo.time) ) {

            let [start, end] = hours.split('-')

            if ( Object.values(newSchedule[date]).every( item => checkConflict( item, [start, end] )) ) {

              newSchedule[date][ course + '-' + section ] = {
                'instructor': sectionInfo.instructor,
                'location': sectionInfo.location,
                'time': {
                  'start': start,
                  'end': end
                }
              }
            } else {
              conflict = true
            }
          }

          if (conflict) {
            continue;
          } else if ( !Object.keys(sectionInfo.subsections).length ) {
            newList.push(newSchedule)
            continue;
          }

          for ( const [subsection, subsectionInfo] of Object.entries(sectionInfo.subsections) ) {
            let newScheduleWithSubsec = JSON.parse(JSON.stringify(newSchedule))
            for ( const [date, hours] of Object.entries(subsectionInfo.time) ) {

              let [start, end] = hours.split('-')

              if ( Object.values(newScheduleWithSubsec[date]).every( item => checkConflict( item, [start, end] )) ) {

                newScheduleWithSubsec[date][ course + '-' + section + '-' + subsection ] = {
                  'instructor': sectionInfo.instructor,
                  'location': subsectionInfo.location,
                  'time': {
                    'start': start,
                    'end': end
                  }
                }
                conflict = false
              } else {
                conflict = true
              }
            }
            if (!conflict) {
              newList.push(newScheduleWithSubsec)
            }
          }
        }
      })
      tempList = [...newList]
    }
    console.log(tempList)
    setScheduleList(tempList) 
  },[selectedCourseList])

  const checkConflict = (compareSec, [start, end]) => {

    const start_1 = new Date("01/01/2000 " + start.trim().slice(0, -2) + " " + start.trim().slice(-2)).getTime()
    const end_1 = new Date("01/01/2000 " + end.trim().slice(0, -2) + " " + end.trim().slice(-2)).getTime()

    const start_2 = new Date("01/01/2000 " + compareSec.time.start.trim().slice(0, -2) + " " + compareSec.time.start.trim().slice(-2)).getTime()
    const end_2 = new Date("01/01/2000 " + compareSec.time.end.trim().slice(0, -2) + " " + compareSec.time.end.trim().slice(-2)).getTime()

    if (end_1 < start_2 || start_1 > end_2 ) {
      return true
    }
    return false
  }

  const getCourseBlock = (weekday) => {
    let components = []

    return components
  }

    
  return <div className='scheduleSec'>
    <div className='sectionTitle'>Schedules</div>
    <div className='control'></div>
    <div className='calendar'>
      {
        ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map( weekday => (
          <div className='weekdayArea' key={weekday}>
            { getCourseBlock(weekday) }
          </div>
        ))
      }
      {
        // timeLine.map( item => (
        //   <hr/>
        // ))
      }
    </div>
  </div>
}

export default Schedule;