import React from 'react';
import Alert from 'react-bootstrap/Alert'
import './newVersion.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.mode = React.createRef();
    this.keyword = React.createRef();
    this.state = {
      keywordList: [],
    };
  }

  componentDidMount() {
  }

  addKeyword() {
    const { keywordList } = this.state
    const curr = this.keyword.current.value;

    if (curr.length === 0 || keywordList.includes(curr)) { }
    else {
      keywordList.push(curr);
      this.setState({ keywordList });
    }

    this.myFormRef.reset(); 
  }


  render() {

    const { keywordList } = this.state
     
    return <>
      <div className='searchToolSec'>
        <div className='searchTitle'>Search for courses</div>
        <div className='searchSetting'>
          <div className='tagSetting'>
            <span className='settingText'>Search mode</span>
              <select id='modeSelect' ref={this.mode} onChange={() => console.log(this.mode.current.value)}>
                <option key="intersection" value='intersection'>Intersection of tags</option>
                <option key="union" value='union'>Union of tags</option>
              </select>
          </div>
          <div className='tagInput'>
            <span className='settingText'>Keyword</span>

            <form onSubmit={(e) => { e.preventDefault(); this.addKeyword() }} ref={(ele) => this.myFormRef = ele}>
              <input id='keywordInput' type='text' placeholder="Enter keyword" ref={this.keyword} autoComplete="off"/>
            </form>
          </div>
          <div className='chosenTags'>
            {
              keywordList.length !== 0 
                ? <div className='keywordList'>
                  <span className='settingText'>Current keywords</span>
                  {
                    keywordList.map((item,index)=>(
                      <div className='currentKeyword' key={item}>{item}</div>
                    ))
                  }
                </div>
                : null
            }
          </div>
        </div>
      </div>

      <div className='courseListSec'></div>
      
      <div className='detailInfoSec'></div>
    </>
  }
}

export default Search;