import React, { useState } from 'react';
import FavList from './schedulerComp/FavList'
import Schedule from './schedulerComp/Schedule'
import './newVersion.css';

function Scheduler (props) {

  const [selectedCourseList, setselectedCourseList] = useState([])

  const { favList, modifyFavList } = props

  const handleSelectCourse = (newList) => {
    setselectedCourseList(newList)
  }

  return <>
    <FavList
      favList = {favList} 
      modifyFavList = {modifyFavList}      
      selectedCourseList={selectedCourseList} 
      setselectedCourseList={ list => handleSelectCourse(list) } />
    <Schedule selectedCourseList={selectedCourseList} />
  </>
}

export default Scheduler;