import React, { useState, useEffect } from 'react';
import FavList from './schedulerComp/FavList'
import Schedule from './schedulerComp/Schedule'
import './newVersion.css';

function Scheduler (props) {

  const { favList, modifyFavList } = props

  return <>
    <FavList
      favList = {favList} 
      modifyFavList = {modifyFavList} />
    <Schedule />
  </>
}

export default Scheduler;