import React from 'react';
import './style.css';

class CourseList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const { filteredCourses, courseSelected, selectCourse } = this.props
    const resultNum = Object.keys(filteredCourses).length
     
    return <div className='courseListSec'>
        <div className='sectionTitle'> {`${resultNum} result${resultNum>1?'s':''}`}</div>
        <div className='courseList'>
          {
            Object.values(filteredCourses).map((course, index) => (
              <div 
                key={course.number}
                className={ courseSelected === index ? 'courseSelected' : 'courseInfo' }
                onClick={()=>selectCourse(index)}>
                <div className='number'>{course.number}</div>
                <div className='name'>{course.name}</div>
                <div className='credits'>
                  <span className='creditNum'>{course.credits}</span>
                  {` credit${course.credits>1?'s':''}`}
                </div>
              </div>
            ))
          }
        </div>
    </div>
  }
}

export default CourseList;