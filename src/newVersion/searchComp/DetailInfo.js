import React, { useState, useEffect, useRef } from "react";
import '../newVersion.css';

function DetailInfo (props) {

  const [showSections, setShowSections] = useState(false)
  const { courseInfo, favList, modifyFavList, findRequisite } = props

  const sectionTbody = useRef(null)
  const basicInfo = useRef(null)

  useEffect(()=>{
    initBasicInfoShadow()
    setShowSections(false)
  },[courseInfo])
  
  useEffect(()=>{
    if (sectionTbody.current) {
      const thead = document.getElementById('sectionThead')
      const trList = document.getElementsByClassName('sectionTbodyTr')

      let totalHeight = 0
      for ( const tr of trList) {
        totalHeight += tr.clientHeight
      }

      if (totalHeight + thead.clientHeight > sectionTbody.current.clientHeight  ) {
        sectionTbody.current.style.boxShadow = 'inset 0 -6px 10px -8px #646569'
      } else {
        sectionTbody.current.style.boxShadow = 'none'
      }
    }
    initBasicInfoShadow()

  },[showSections])

  const tableScoll = (e) => {
    const tbody = document.getElementById('sectionTbody')
    const thead = document.getElementById('sectionThead')
    const trList = document.getElementsByClassName('sectionTbodyTr')
    
    let totalHeight = 0
    for ( const tr of trList) {
      totalHeight += tr.clientHeight
    }

    if (totalHeight - tbody.clientHeight + thead.clientHeight - e.target.scrollTop > 5 ) {
      tbody.style.boxShadow = 'inset 0 -6px 10px -8px #646569'
    } else {
      tbody.style.boxShadow = 'none'
    }
    
    if (e.target.scrollTop > 0) {
      thead.style.boxShadow = '0px 6px 12px -8px #646569'
    } else {
      thead.style.boxShadow = 'none'
    }
  }

  const initBasicInfoShadow = () => {
    if (basicInfo.current) {
      const description = document.getElementById('description')
      const requisites = document.getElementById('requisites')
      const keywords = document.getElementById('keywords')
      const requisitesHeight = requisites ? requisites.clientHeight + 32 : 0
      const contentHeight = description.clientHeight + requisitesHeight + keywords.clientHeight + 32

      if ( contentHeight > basicInfo.current.clientHeight ) {
        basicInfo.current.style.boxShadow = 'inset 0 -6px 10px -8px #646569'
      } else {
        basicInfo.current.style.boxShadow = 'none'
      }
    }
  }

  const basicInfoScroll = (e) => {
    const basicInfoBox = document.getElementById('basicInfo')
    const description = document.getElementById('description')
    const requisites = document.getElementById('requisites')
    const keywords = document.getElementById('keywords')
    const requisitesHeight = requisites ? requisites.clientHeight + 32 : 0
    const height = description.clientHeight + requisitesHeight + keywords.clientHeight + 32 - basicInfoBox.clientHeight

    if ( height - e.target.scrollTop > 0 && e.target.scrollTop > 0) {
      basicInfoBox.style.boxShadow = 'inset 0 -6px 10px -8px #646569, inset 0px 6px 12px -8px #646569'
    } else if (height - e.target.scrollTop > 0) {
      basicInfoBox.style.boxShadow = 'inset 0 -6px 10px -8px #646569'
    } else if (e.target.scrollTop > 0) {
      basicInfoBox.style.boxShadow = 'inset 0 6px 10px -8px #646569'
    } else {
      basicInfoBox.style.boxShadow = 'none'
    }
  }

  const getRequisiteDiv = (requisites) => {
    const requisiteList = findRequisite(requisites)
    const requisiteDiv = (<div id='requisites' className='requisites'>
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

  const getTimeSpan = (day, time) => {
    const dayMap = {
      'monday': 'Mon ',
      'tuesday': 'Tue ',
      'wednesday': 'Wed ',
      'thursday': 'Thu ',
      'friday': 'Fri ',
    }
    const daySpan = dayMap[day.toLowerCase()]

    return <>
      <span>{daySpan}</span>
      <span>{time.split('-')[0]}</span>
      <span>-</span>
      <span>{time.split('-')[1]}</span>
    </>
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
          <div className='titleArea'>
            <div className='name'>
              {courseInfo.name}
              <div 
                className={ courseAdded ? 'favHeart_checked' : 'favHeart' }
                onClick={ () => modifyFavList( courseAdded ? 'remove' : 'add', 'all', courseInfo, null, null) }/>
            </div>
            <div className='btns'>
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
          </div>
          <div className='sectionInfo' style={{ display: showSections?'flex':'none'}}>
            <table className="sectionTable" cellSpacing='0' width="100%">
              <tbody id='sectionTbody' ref={sectionTbody} onScroll={tableScoll} >
                <tr id='sectionThead'>
                  <td className='sectionTh'>Favorite</td>
                  <td  className='sectionTh'>Sections</td>
                  <td   className='sectionTh'>Time</td>
                  <td className='sectionTh'>Instructor</td>
                  <td  className='sectionTh'>Location</td>
                </tr>
                {
                  Object.entries(courseInfo.sections).map(([section,sectionInfo]) => (
                    <React.Fragment key={section}>
                      <tr className='sectionTbodyTr'>
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
                              <div className='timeTd' key={day+time}>
                                {getTimeSpan(day, time)}
                              </div>
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
                            <tr key={subsection} className='sectionTbodyTr'>
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
                                      <div className='timeTd' key={day+time}>
                                        {getTimeSpan(day, time)}
                                      </div>
                                  ))
                                }
                              </td>
                              <td className='sectionTd'></td>
                              <td className='sectionTd'>{subsectionInfo.location}</td>
                            </tr>
                          ))
                      }
                    </React.Fragment>
                  ))
                }
              </tbody>
            </table>
          </div>
          <div id='basicInfo' ref={basicInfo} className='basicInfo' onScroll={basicInfoScroll} style={{ display: showSections?'none':'block'}}>
            <div id='description' className='description'>{courseInfo.description}</div>
            { getRequisiteDiv(courseInfo.requisites) }
            <div id='keywords' className='keywords'>
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
          </div>
        </div>
      : null
    }
  </div>
}

export default DetailInfo;