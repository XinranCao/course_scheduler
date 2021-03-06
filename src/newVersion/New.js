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
        favList: {},
        subjects: [],
        schedule: {}
    };
  }

  componentDidMount() {
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

  handleModifyFavList(operation, key, course, sectionNum, subSectionNum) {
    const { favList } = this.state

    const courseInfo = JSON.parse(JSON.stringify(course))
    const newList = JSON.parse(JSON.stringify(favList))

    if (operation === 'remove') {
      if (key === 'all') {
        // delete whole course
        delete newList[courseInfo.number];
      } else if (key === 'section') {
        // delete section
        delete newList[courseInfo.number].sections[sectionNum];
        var sectionObj = newList[courseInfo.number].sections;
        // when all sections are deleted, delete the course
        if (Object.entries(sectionObj).length === 0 && sectionObj.constructor === Object) {
          delete newList[courseInfo.number];
        }
      } else {
        // delete subsection
        delete newList[courseInfo.number].sections[sectionNum].subsections[subSectionNum];
        var subsectionObj = newList[courseInfo.number].sections[sectionNum].subsections;
        // when all subsections are deleted, delete the section
        if (Object.entries(subsectionObj).length === 0 && subsectionObj.constructor === Object) {
          delete newList[courseInfo.number].sections[sectionNum];
          let sectionObj = newList[courseInfo.number].sections;
          // when all ections a deleted, delete the course
          if (Object.entries(sectionObj).length === 0 && sectionObj.constructor === Object)
            delete newList[courseInfo.number];
        }
      }
      this.setState({ favList: newList })
      return
    }

    if (key === 'all') {
      newList[courseInfo.number] = {...courseInfo}
    } else if (key === 'section') {
      // check if the course is already in schedule
      if (newList[courseInfo.number]) {
          newList[courseInfo.number].sections[sectionNum] = courseInfo.sections[sectionNum]
      } else {
        newList[courseInfo.number] = {
          ...courseInfo,
          "sections": { [sectionNum]: courseInfo.sections[sectionNum] }
        }
      }
    } else {
      // check if the course is already in schedule
      if (newList[courseInfo.number]) {
        let sections = newList[courseInfo.number].sections;
        //check if the section is already in schedule
        if (sections[sectionNum]) {
          sections[sectionNum].subsections[subSectionNum] = courseInfo.sections[sectionNum].subsections[subSectionNum];
        }
        else {
          sections[sectionNum] = {
            ...courseInfo.sections[sectionNum],
            "subsections": { [subSectionNum]: courseInfo.sections[sectionNum].subsections[subSectionNum] }
          }
        }
      } else {
        newList[courseInfo.number] =
        {
          ...courseInfo,
          "sections": {
            [sectionNum]: {
              ...courseInfo.sections[sectionNum],
              "subsections": { [subSectionNum]: courseInfo.sections[sectionNum].subsections[subSectionNum] }
            }
          }
        }
      }
    }
    this.setState({ favList: newList })
  }

  render() {
    const { navKey, allCourses, filteredCourses, favList } = this.state
    return <div className='page'>
      <div className='navBar'>
        <img src={require('../img/logo3.svg')} height='80%' alt='logo'/>
          <span className='navTitle'>{'Course Scheduler'}</span>
          {
              ['Search','Schedule'].map(item => (
                  <div 
                      key={item}
                      className= { navKey === item ? 'tabActive': 'tab' }
                      onClick={()=>this.setState({ navKey: item })}>
                          {item}
                  </div>
              ))
          }
      </div>
      { 
        <div className='mainContent' style={{zIndex: navKey === 'Search' ? '100' : '0'}}>
          <Search 
            favList = {favList}
            allCourses ={allCourses}
            filteredCourses={filteredCourses} 
            updateFilteredCourses={ (filteredCourses) => this.setState({ filteredCourses }) }
            modifyFavList={ (operation, key, course, sectionNum, subSectionNum) => this.handleModifyFavList(operation, key, course, sectionNum, subSectionNum)} />  
        </div>
      }

      { 
        <div className='mainContent' style={{zIndex: navKey === 'Schedule' ? '100' : '0'}}>
          <Scheduler 
            favList={favList}
            modifyFavList={ (operation, key, course, sectionNum, subSectionNum) => this.handleModifyFavList(operation, key, course, sectionNum, subSectionNum)}/> 
        </div>
      }
    </div>
  }
}

export default New;