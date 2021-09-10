import React from 'react';
import SideBar from './searchComp/SideBar';
import CourseList from './searchComp/CourseList';
import './newVersion.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
  }


  render() {
     
    return <>
      <SideBar/>

      <CourseList/>
      
      <div className='detailInfoSec'></div>
    </>
  }
}

export default Search;