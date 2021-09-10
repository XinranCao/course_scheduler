import React from 'react';
import Search from './Search';
import Scheduler from './Scheduler';
import './newVersion.css';
import ClassInfo from '../ClassInfo.json';

class New extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        navKey: 'Search',
        allCourses: {},
        filteredCourses: {},
        subjects: [],
        schedule: {}
    };
  }

  componentDidMount() {
    console.log('===',ClassInfo)
    this.setState({ 
      allCourses: ClassInfo, 
      filteredCourses: ClassInfo, 
      subjects: this.getSubjects(ClassInfo) 
    })
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");
    Object.values(data).map( item => (
      subjects.includes(item.subject) ? null : subjects.push(item.subject) 
    ))
    return subjects;
  }

  render() {
    const { navKey, allCourses, filteredCourses, subjects, schedule } = this.state

    return <div className='page'>
        <div className='navBar'>
          <img src={require('../img/logo3.svg')} height='75%' alt='logo'/>
            <span className='navTitle'>{'Course Scheduler'}</span>
            {
                ['Search','Schedule'].map((item,index) => (
                    <div 
                        key={item}
                        className= { navKey === item ? 'tabActive': 'tab' }
                        onClick={()=>this.setState({ navKey: item })}>
                            {item}
                    </div>
                ))
            }
        </div>

        <div className='mainContent'>
            { 
                navKey === 'Search' 
                    ? <Search 
                        allCourses ={allCourses}
                        filteredCourses={filteredCourses} 
                        updateFilteredCourses={ (filteredCourses) => this.setState({ filteredCourses }) } />  
                    : <Scheduler /> 
            }
        </div>

    </div>
  }
}

export default New;