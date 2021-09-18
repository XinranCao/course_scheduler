import React, { useState, useRef } from 'react';
import '../newVersion.css';

function SideBar (props) {

  const [filterMode, setFilterMode] = useState('intersection')
  const [keywordList, setKeywordList] = useState([])
  const[alertMsg, setAlertMsg] = useState('')
  const mode = useRef(null);
  const keyword = useRef(null);
  let myFormRef = useRef(null)

  const addKeyword = () => {
    const curr = keyword.current.value;
    let newMsg = ''

    if (curr.match(/^\s+$/) || curr.length === 0 ) {
      newMsg = 'Please enter a keyword!'
    } else if (keywordList.includes(curr)) {
      newMsg = 'Keyword already added!'
    } else if (curr.length > 15) {
      newMsg = 'Please enter less than 16 characters!'
    } else {
      keywordList.push(curr);
      setKeywordList(keywordList)
      myFormRef.reset(); 
      props.filterCourse(keywordList, filterMode)
    }
    setAlertMsg(newMsg)
  }

  const removeKeyword = (index) => {
    keywordList.splice(index, 1);
    setKeywordList(keywordList)
    props.filterCourse(keywordList, filterMode)
  }
     
    return <div className='searchToolSec'>
        <div className='sectionTitle'>Search for courses</div>
        <div className='searchSetting'>
          <div className='tagSetting'>
            <span className='settingText'>Search mode</span>
              <select 
                id='modeSelect' 
                ref={mode} 
                onChange={ () => {
                  setFilterMode(mode.current.value);
                  props.filterCourse(keywordList, mode.current.value)
                }}>
                <option key="intersection" value='intersection'>Intersection of tags</option>
                <option key="union" value='union'>Union of tags</option>
              </select>
          </div>
          <div className='tagInput'>
            <span className='settingText'>Keyword</span>
            <span 
                className='alert' 
                style={{ visibility: alertMsg.length ? "visible" : 'hidden' }} 
                onClick={ () => setAlertMsg('') } >
                    {alertMsg}
            </span>
            <form onSubmit={(e) => { e.preventDefault(); addKeyword() }} ref={(ele) => myFormRef = ele}>
              <input id='keywordInput' type='text' placeholder="Enter keyword" ref={keyword} autoComplete="off"/>
            </form>
          </div>
          <div className='chosenTags'>
            {
              keywordList.length !== 0 
                ? <>
                    <span className='settingText'>Current keywords</span>
                    <div className='keywordList'>
                      {
                        keywordList.slice().reverse().map((item,index)=>(
                          <div className='currentKeyword' key={item}>
                            {item}
                            <div 
                              className='removeBtn' 
                              onClick={ ()=>removeKeyword(keywordList.length-index-1)} >
                                {`\u2715`}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                </>
                : null
            }
          </div>
        </div>
      </div>
}

export default SideBar;