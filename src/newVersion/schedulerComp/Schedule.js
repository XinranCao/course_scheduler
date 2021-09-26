import React, { useEffect, useState, useRef } from 'react';
import '../newVersion.css';

function Schedule(props) {

  const [state, setState] = useState({
    scheduleList: [],
    currSchedule: 0,
    boxHeight: 0
  })

  const { selectedCourseList } = props
  const { scheduleList, currSchedule, boxHeight } = state
  const keyword = useRef(null)
  let myFormRef = useRef(null)
  const timeLine = ['8:00 am', '9:00 am', '10:00 am', '11:00 am', '12:00 pm', 
                    '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm']

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

    if (myFormRef.current !== null) {
      myFormRef.current.reset() 
    }  else {
    }
    // const pageForm = document.getElementById('pageForm').reset()
    setState({
      scheduleList: tempList,
      currSchedule: 0,
      boxHeight: document.getElementsByClassName('scheduleSec')[0].clientHeight - 80
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

  const convertTime = (time) => {
    let hour = Number(time.split(':')[0])
    if (time.includes('pm') && (hour !== 12)) {
      hour += 12;
    }
    let minute = Number(time.split(':')[1].trim().slice(0, -2));
    return hour + minute / 60;
  }

  const getDistance = (start, end) => {

    const top = 12 + boxHeight * ((convertTime(start) - convertTime('7:30am')) / (convertTime('5:30pm') - convertTime('7:30am')))
    const bottom = 12 + boxHeight * ((convertTime(end) - convertTime('7:30am')) / (convertTime('5:30pm') - convertTime('7:30am')))
    return [top, bottom]
  }

  const getCourseBlock = (weekday) => {
    let components = []
    if (!scheduleList.length){ return null}
    const dayList = scheduleList[currSchedule][weekday]

    for ( const [number, classInfo] of Object.entries(dayList)) {
      const classNum = number.split('-')
      const distances = getDistance(classInfo.time.start, classInfo.time.end)
      components.push(
        <div 
          key={number} 
          className='classCard' 
          style={{ 
            height: `${distances[1] - distances[0]}px`, 
            top: `${distances[0]}px`
          }}>
          <span>{`${classNum[0]}`}</span>
          <span>{`${classNum[classNum.length - 1]}`}</span>
          <span>{`${classInfo.time.start} - ${classInfo.time.end}`}</span>
        </div>
      )
    }

    return components
  }

  const handleSetCurrSchedule = (operation, number) => {
    let nextSchedule = -1

    if (operation === 'jump') {

      document.getElementById('pageNum').blur()
      myFormRef.current.reset() 

      if (!/^[0-9]*$/.test(number)) {
        console.log('not number', number)
        return
      }

      if (number <= scheduleList.length) { 
        nextSchedule =  parseInt(number) - 1 
      }
      
    } else if (operation === 'prev') {
      if (currSchedule > 0) { 
        myFormRef.current.reset()
        nextSchedule = currSchedule - 1 ;
      }
    } else if (operation === 'next') {
      if (currSchedule < scheduleList.length - 1) { 
        myFormRef.current.reset()
        nextSchedule = currSchedule + 1 ;
      }
    } else {
      return 
    }

    // console.log('nextSchedule',nextSchedule)
    if (nextSchedule < 0) { return }
    setState({
      ...state,
      currSchedule: nextSchedule
    })
  }

    // console.log('currSchedule',currSchedule)
  return <div className='scheduleSec'>
    <div className='sectionTitle'>Schedules
    {
      Object.keys(selectedCourseList).length
        ? scheduleList.length
          ? <div className='pagination'>
            <div 
              id = 'prevbtn'
              className={ currSchedule > 0 ? 'controlBtn' : 'controlBtn_disabled' }
              onClick={()=>handleSetCurrSchedule('prev', null)}>{'<'}</div>
            <div className='pageNum'>
              <form id='pageForm' onSubmit={(e) => { e.preventDefault(); handleSetCurrSchedule('jump', keyword.current.value) }} ref={myFormRef}>
                <input id='pageNum' type='text' size='3' defaultValue={currSchedule + 1} ref={keyword} autoComplete="off"/>
              </form>
              {'/ '}
              <span>{scheduleList.length}</span>
            </div>
            <div 
              id = 'nextbtn'
              className={ currSchedule < scheduleList.length - 1 ? 'controlBtn' : 'controlBtn_disabled' }
              onClick={()=>handleSetCurrSchedule('next', null)}>{'>'}</div>
          </div>
          : <div className='pagination'>No possible schedule</div>
        : null
    }

    </div>
    {
      scheduleList.length 
        ? <div className='calendar'>
          {
            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map( weekday => (
              <div className='weekdayArea' key={weekday}>
                <span className='weekday'>{getDay(weekday)}</span>
                { getCourseBlock(weekday) }
              </div>
            ))
          }
          {
            timeLine.map( item => {
              const top = getDistance(item, item)[0]
              return <React.Fragment key={item}>
                <span className='timeTip' style={{ top: `${top - 10}px`}}>{item}</span>
                <div  className='timeLine' style={{ top: `${top}px`}}/>
              </React.Fragment>
            })
          }
        </div> : null
    }

  </div>
}

export default Schedule;