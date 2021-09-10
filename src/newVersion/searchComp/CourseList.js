import React from 'react';
import './style.css';

class CourseList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }


  renderCourseList() {
    return
  }

  render() {

    const { filteredCourses } = this.props

    const resultNum = Object.keys(filteredCourses).length
     
    return <div className='courseListSec'>
        <div className='searchTitle'> {`${resultNum} result${resultNum>1?'s':''}`}</div>
        <div className='courseList'>
          {
            Object.values(filteredCourses).map( course => (
              <div className='courseInfo' key={course.number}>
                <span className='number'>{course.number}</span>
                <span className='name'>{course.name}</span>
                <span className='credits'>{course.credits}</span>
              </div>
            ))
          }
        </div>
    </div>
  }
}

export default CourseList;