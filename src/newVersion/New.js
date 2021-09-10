import React from 'react';
import Search from './Search';
import Scheduler from './Scheduler';
import './newVersion.css';
import ClassInfo from '../ClassInfo.json';

class New extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        navKey: 'Search'
    };
  }

  componentDidMount() {
    // fetch('https://mysqlcs639.cs.wisc.edu:5000/classes').then(
    //   res => res.json()
    // ).then(data => this.setState({ allCourses: data, filteredCourses: data, subjects: this.getSubjects(data) }));
    // console.log('==', ClassInfo)
    // this.setState({ allCourses: ClassInfo, filteredCourses: ClassInfo, subjects: this.getSubjects(ClassInfo) })
  }


  render() {

    const { navKey } = this.state
     
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
                    ? <Search />  
                    : <Scheduler /> 
            }
        </div>

    </div>
  }
}

export default New;