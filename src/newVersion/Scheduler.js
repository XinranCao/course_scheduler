import React, { useState } from 'react';
import FavList from './schedulerComp/FavList'
import Schedule from './schedulerComp/Schedule'
import './newVersion.css';

function Scheduler (props) {

  const { favList, modifyFavList } = props

  const [selectedCourseList, setSelectedCourseList] = useState({})

  return <>
    <FavList
      favList = {favList} 
      modifyFavList = {modifyFavList}
      generateSchedule = {setSelectedCourseList} />
    <Schedule selectedCourseList={selectedCourseList}/>
  </>
}

export default Scheduler;