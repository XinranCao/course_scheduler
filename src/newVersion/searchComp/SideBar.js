import React from 'react';
import './style.css';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.mode = React.createRef();
    this.keyword = React.createRef();
    this.state = {
      filterMode: 'intersection',
      keywordList: [],
      alertMsg: '',
      alertShow: false,
    };
  }

  addKeyword() {
    const { keywordList, filterMode } = this.state
    const curr = this.keyword.current.value;

    if (curr.match(/^\s+$/) || curr.length === 0 ) {
        this.setState({ alertMsg: 'Please enter a keyword!' })
    } else if (keywordList.includes(curr)) {
        this.setState({ alertMsg: 'Keyword already added!' })
    } else if (curr.length > 15) {
        this.setState({ alertMsg: 'Please enter less than 16 characters!' })
    } else {
      keywordList.push(curr);
      this.setState({ keywordList, alertMsg: '' });
      this.myFormRef.reset(); 
      this.props.filterCourse(keywordList, filterMode)
    }
  }

  removeKeyword(index) {
    const { keywordList, filterMode } = this.state
    keywordList.splice(index, 1);
    this.setState({ keywordList })
    this.props.filterCourse(keywordList, filterMode)
  }

  render() {

    const { keywordList, alertMsg } = this.state
     
    return <div className='searchToolSec'>
        <div className='sectionTitle'>Search for courses</div>
        <div className='searchSetting'>
          <div className='tagSetting'>
            <span className='settingText'>Search mode</span>
              <select 
                id='modeSelect' 
                ref={this.mode} 
                onChange={ () => {
                  this.setState({ filterMode: this.mode.current.value });
                  this.props.filterCourse(keywordList, this.mode.current.value)
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
                onClick={ () => this.setState({ alertMsg: '' }) } >
                    {alertMsg}
            </span>
            <form onSubmit={(e) => { e.preventDefault(); this.addKeyword() }} ref={(ele) => this.myFormRef = ele}>
              <input id='keywordInput' type='text' placeholder="Enter keyword" ref={this.keyword} autoComplete="off"/>
            </form>
          </div>
          {
            keywordList.length !== 0 
              ? <div className='chosenTags'>
                  <span className='settingText'>Current keywords</span>
                  <div className='keywordList'>
                    {
                      keywordList.slice().reverse().map((item,index)=>(
                        <div className='currentKeyword' key={item}>
                          {item}
                          <div 
                            className='removeBtn' 
                            onClick={ ()=>this.removeKeyword(keywordList.length-index-1)} >
                              {`\u2715`}
                          </div>
                        </div>
                      ))
                    }
                  </div>
              </div>
              : null
          }
        </div>
      </div>
  }
}

export default SideBar;