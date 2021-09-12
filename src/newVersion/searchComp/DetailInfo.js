import React from 'react';
import './style.css';

class DetailInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSections: false
    }
  }

  getRequisiteDiv(requisites) {
    const { findRequisite } = this.props
    const requisiteList = findRequisite(requisites)
    const requisiteDiv = (<div className='requisites'>
      <span style={{ marginRight: '8px' }}> Pre-requisite:</span>
      <div>
        {
          requisiteList.map( (item, index) => (
            <span className='requisite' key={item}>
              {index ? `, ${item}` : item}
            </span>
          ))
        }
        { '.' }
      </div>
    </div>
    )
    return requisiteList.length ? requisiteDiv : null
  }

  getSectionNum(number) {
    
  }

  getDay(day) {
    const dayMap = {
      'monday': 'Mon.',
      'tuesday': 'Tue.',
      'wednesday': 'Wed.',
      'thursday': 'Thu.',
      'friday': 'Fri.',
      'Saturday': 'Sat.',
      'Sunday': 'Sun.'
    }
    return dayMap[day.toLowerCase()]
  }

  render() {
    const { courseInfo } = this.props
    const { showSections } = this.state
    console.log('courseInfo', courseInfo)
    return <div className='detailInfoSec'>
      <div className='sectionTitle'>{courseInfo.number}</div>
      {
        Object.keys(courseInfo).length 
        ? <div className='detailInfo'>
            <div className='name'>
              {courseInfo.name}
              <div 
                className={showSections?'secHideBtn':'secShowBtn'} 
                onClick={()=>this.setState({showSections:!showSections})}>
                  {showSections?'Hide sections':'Show sections'}
                </div>
            </div>
            {
              showSections
                ? <div className='sectionInfo'>
                  <table className="sectionTable" width="100%" border="0" cellSpacing="1" cellPadding="4">
                  <tbody>
                    <tr>
                      <td width='20%' className='sectionTh'>Sections</td>
                      <td width='25%' className='sectionTh'>Time</td>
                      <td width='15%' className='sectionTh'>Instructor</td>
                      <td width='30%' className='sectionTh'>Location</td>
                      <td width='10%' className='sectionTh'></td>

                      {/* <td className='sectionTh'>Sections</td>
                      <td className='sectionTh'>Time</td>
                      <td className='sectionTh'>Instructor</td>
                      <td className='sectionTh'>Location</td>
                      <td className='sectionTh'></td> */}
                    </tr>
                    {
                      Object.entries(courseInfo.sections).map(([section,sectionInfo]) => {
                        return <React.Fragment key={section}>
                          <tr>
                            <td className='sectionTd'>{section.replace("_", " ")}</td>
                            <td className='sectionTd timeTd'>
                              {
                                Object.entries(sectionInfo.time).map(([day,time]) => (
                                  <span key={day+time}>{this.getDay(day)}{time}</span>
                                ))
                              }
                            </td>
                            <td className='sectionTd'>{sectionInfo.instructor}</td>
                            <td className='sectionTd'>{sectionInfo.location}</td>
                            <td className='sectionTd'><div>a</div></td>
                          </tr>
                          {
                            Object.keys(sectionInfo.subsections).length === 0
                              ? null
                              : Object.entries(sectionInfo.subsections).map(([subsection,subsectionInfo]) => (
                                <tr key={subsection}>
                                  <td className='sectionTd'>{subsection.replace("_", " ")}</td>
                                  <td className='sectionTd' timeTd>
                                    {
                                      Object.entries(subsectionInfo.time).map(([day,time]) => (
                                          <span key={day+time}>{this.getDay(day)}{time}</span>
                                      ))
                                    }
                                  </td>
                                  <td className='sectionTd'></td>
                                  <td className='sectionTd'>{subsectionInfo.location}</td>
                                  <td className='sectionTd'><div>a</div></td>
                                </tr>
                              ))
                          }
                        </React.Fragment>
                      })
                    }
                    </tbody>
                  </table>

                </div>
                : <>
                    <div className='description'>{courseInfo.description}</div>
                    { this.getRequisiteDiv(courseInfo.requisites) }
                    <div className='keywords'>
                      <span style={{ marginRight: '8px' }}>Keywords:</span>
                      <div>
                        {
                          courseInfo.keywords.map((item, index) => (
                            <span className='keyword' key={item}>
                              {index ? `, ${item}` : item}
                            </span>
                          ))
                        }
                        {"."}
                      </div>
                    </div>
                    <div className='requisite'>{courseInfo.requisite}</div>
                </>
            }
          </div>
        : null
      }

    </div>
  }
}

export default DetailInfo;