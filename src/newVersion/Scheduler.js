import React from 'react';
import FavList from './schedulerComp/FavList'
import Schedule from './schedulerComp/Schedule'
import './newVersion.css';

function Scheduler (props) {

  return <>
  <FavList />
  <Schedule />
  </>
}

export default Scheduler;