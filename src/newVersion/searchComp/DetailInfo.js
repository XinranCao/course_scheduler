import React, { useEffect, useState } from 'react';
import './style.css';

function DetailInfo (props) {

  const [showSections, setShowSections] = useState(false)
  const { courseInfo, favList, modifyFavList, findRequisite } = props

  useEffect(()=>{
    setShowSections(false)
  },[props.courseInfo])

  console.log('courseInfo', courseInfo)
  console.log('favList',favList)

  const getRequisiteDiv = (requisites) => {
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

  const getDay = (day) => {
    const dayMap = {
      'monday': 'Mon ',
      'tuesday': 'Tue ',
      'wednesday': 'Wed ',
      'thursday': 'Thu ',
      'friday': 'Fri ',
      'Saturday': 'Sat ',
      'Sunday': 'Sun '
    }
    return dayMap[day.toLowerCase()]
  }

  const showTip = (e,text,show) => {
    const littletip = document.getElementById('addToListTip')
    littletip.style.display = show ? 'flex' : 'none'
    littletip.innerText = text === 'added' ? 'Already added to favorite list' : 'Add to favorite list'
    if (e) {
      littletip.style.left = `${e.clientX}px`
      littletip.style.top = `${e.clientY - 42}px`
    }
  }

  const courseAdded = favList[courseInfo.number]

  return <div className='detailInfoSec'>
    <div id='addToListTip' />
    <div className='sectionTitle'>{courseInfo.number}</div>
    {
      Object.keys(courseInfo).length 
      ? <div className='detailInfo'>
          <div className='name'>
            {courseInfo.name}
            <div 
              className={ showSections ? 'secHideBtn' : 'secShowBtn'} 
              onClick={ () => setShowSections(!showSections) }>
                {showSections ? 'Hide sections' : 'Show sections'}
            </div>
            <div 
              className={ courseAdded ? 'removeAll' : 'addAll' }  
              onClick={ () => modifyFavList( courseAdded ? 'remove' : 'add', 'all', courseInfo, null, null) }>
                {courseAdded ? 'Remove from favorite' : 'Add all sections to favorite'}
            </div>
          </div>
          {
            showSections
              ? <div className='sectionInfo'>
                <table className="sectionTable" cellSpacing='0' width="100%">
                  <tbody>
                    <tr>
                      <td width='75px' className='sectionTh'>Favorite</td>
                      <td width='85px' className='sectionTh'>Sections</td>
                      <td width='220px' className='sectionTh'>Time</td>
                      <td width='135px' className='sectionTh'>Instructor</td>
                      <td width='140px' className='sectionTh'>Location</td>
                    </tr>
                    {
                      Object.entries(courseInfo.sections).map(([section,sectionInfo]) => {
                        return <React.Fragment key={section}>
                          <tr>
                            {
                              courseAdded && courseAdded.sections[section]
                                ? <td 
                                  className='sectionTd fav lec' 
                                  onClick={() => {
                                    modifyFavList('remove', 'section', courseInfo, section, null);
                                    showTip(null,'notAdded',true)
                                  }}
                                  onMouseEnter={(e)=>showTip(e,'added',true)}
                                  onMouseMove={(e)=>showTip(e,'added',true)}
                                  onMouseLeave={(e)=>showTip(e,'added',false)}>
                                    <div className='favoriteBtn_checked'>✓</div>
                                </td>
                                : <td 
                                  className='sectionTd fav lec' 
                                  onClick={() => {
                                    modifyFavList('add', 'section', courseInfo, section, null);
                                    showTip(null,'added',true)
                                  }}
                                  onMouseEnter={(e)=>showTip(e,'notAdded',true)}
                                  onMouseMove={(e)=>showTip(e,'notAdded',true)}
                                  onMouseLeave={(e)=>showTip(e,'notAdded',false)}>
                                    <div className='favoriteBtn'>+</div>
                                </td>
                            }
                              
                            <td className='sectionTd lec'>{section.replace("_", " ")}</td>
                            <td className='sectionTd lec'>
                              {
                                Object.entries(sectionInfo.time).map(([day,time]) => (
                                  <span className='timeTd' key={day+time}>{getDay(day)}{time}</span>
                                ))
                              }
                            </td>
                            <td className='sectionTd lec'>{sectionInfo.instructor}</td>
                            <td className='sectionTd lec'>{sectionInfo.location}</td>
                          </tr>
                          {
                            Object.keys(sectionInfo.subsections).length === 0
                              ? null
                              : Object.entries(sectionInfo.subsections).map(([subsection,subsectionInfo]) => (
                                <tr key={subsection}>
                                  {
                                    courseAdded 
                                    && courseAdded.sections[section]
                                    && courseAdded.sections[section].subsections[subsection]
                                      ? <td 
                                        className='sectionTd fav' 
                                        onClick={()=>{
                                          modifyFavList('remove', 'subsection', courseInfo, section, subsection);
                                          showTip(null,'notAdded',true)
                                        }}
                                        onMouseEnter={(e)=>showTip(e,'added',true)}
                                        onMouseMove={(e)=>showTip(e,'added',true)}
                                        onMouseLeave={(e)=>showTip(e,'added',false)}>
                                          <div className='favoriteBtn_checked'>✓</div>
                                      </td>
                                      : <td 
                                        className='sectionTd fav' 
                                        onClick={()=>{
                                          modifyFavList('add', 'subsection', courseInfo, section, subsection);
                                          showTip(null,'added',true)
                                        }}
                                        onMouseEnter={(e)=>showTip(e,'notAdded',true)}
                                        onMouseMove={(e)=>showTip(e,'notAdded',true)}
                                        onMouseLeave={(e)=>showTip(e,'notAdded',false)}>
                                          <div className='favoriteBtn'>+</div>
                                      </td>
                                  }
                                  <td className='sectionTd'>{subsection.replace("_", " ")}</td>
                                  <td className='sectionTd'>
                                    {
                                      Object.entries(subsectionInfo.time).map(([day,time]) => (
                                          <span className='timeTd' key={day+time}>{getDay(day)}{time}</span>
                                      ))
                                    }
                                  </td>
                                  <td className='sectionTd'></td>
                                  <td className='sectionTd'>{subsectionInfo.location}</td>
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
                  { getRequisiteDiv(courseInfo.requisites) }
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

export default DetailInfo;