import React, { useEffect, useState, useRef } from 'react';
import '../newVersion.css';

function Schedule(props) {

  const [state, setState] = useState({
    scheduleList: [],
    currSchedule: 0
  })

  const { selectedCourseList } = props
  const { scheduleList, currSchedule } = state
  const keyword = useRef(null)
  let myFormRef = useRef(null)
  // const timeLine = ['7:00', '8:00', '9:00', '10:00', '11:00', '12:00', 
  //                   '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

  useEffect(()=>{
    let tempList = []

    for ( const [course, courseInfo] of Object.entries(selectedCourseList) ) {

      if (!tempList.length) {
        tempList.push({
          'monday': {},
          'tuesday': {},
          'wednesday': {},
          'thursday': {},
          'friday': {},
        })
      }
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
        return null
      })
      tempList = [...newList]
    }
    console.log(tempList)

    if (myFormRef.current !== null) {
      myFormRef.current.reset() 
      console.log('myFormRef',myFormRef)
    }  else {
    }
    // const pageForm = document.getElementById('pageForm').reset()
    setState({
      scheduleList: tempList,
      currSchedule: 0
    }) 
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

  const getDay = (day) => {
    const dayMap = {
      'monday': 'Mon. ',
      'tuesday': 'Tue. ',
      'wednesday': 'Wed. ',
      'thursday': 'Thu. ',
      'friday': 'Fri. ',
    }
    return dayMap[day.toLowerCase()]
  }

  const getCourseBlock = (weekday) => {
    let components = []
    if (!scheduleList.length){ return null}
    const dayList = scheduleList[currSchedule][weekday]
   

    for ( const [number, classInfo] of Object.entries(dayList)) {
      const classNum = number.split('-')
      components.push(
        <div key={number} className='classCard'>
          {number}
        </div>
      )
      if (classNum.length === 2) {

      } else {

      }
    }
    console.log('components',components)

    return components
  }

  const handleSetCurrSchedule = (operation, number) => {
    if (operation === 'jump') {
      document.getElementById('pageNum').blur()
      setState({
        ...state,
        currSchedule: parseInt(number) - 1
      })
    }
  }

    console.log('currSchedule',currSchedule)
  return <div className='scheduleSec'>
    <div className='sectionTitle'>Schedules
    {
      Object.keys(selectedCourseList).length
        ? scheduleList.length
          ? <div className='pagination'>
            <div 
              className={ currSchedule ? 'controlBtn' : 'controlBtn_disabled' }
              onClick={()=>handleSetCurrSchedule('prev', null)}>{'<'}</div>
            <div className='pageNum'>
              <form id='pageForm' onSubmit={(e) => { e.preventDefault(); handleSetCurrSchedule('jump', keyword.current.value) }} ref={myFormRef}>
                <input id='pageNum' type='text' defaultValue={currSchedule + 1} ref={keyword} autoComplete="off"/>
              </form>
              {'/'}
              <span>{scheduleList.length}</span>
            </div>
            <div 
              className={ currSchedule <= scheduleList.length ? 'controlBtn' : 'controlBtn_disabled' }
              onClick={()=>handleSetCurrSchedule('next', null)}>{'>'}</div>
          </div>
          : <span>No possible schedule</span>
        : null
    }

    </div>
    <div className='control'></div>
    {
      scheduleList.length 
      ?     <div className='calendar'>
      {
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map( weekday => (
          <div className='weekdayArea' key={weekday}>

            <span>{getDay(weekday)}</span>
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
      : null
    }

  </div>
}

export default Schedule;