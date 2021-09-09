import React from 'react';
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

  removeKeyword(index) {
    const { keywordList } = this.state
    keywordList.splice(index, 1);
    this.setState({ keywordList })
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
          {
            keywordList.length !== 0 
              ? <div className='chosenTags'>
                  <span className='settingText'>Current keywords</span>
                  <div className='keywordList'>
                    {
                      keywordList.map((item,index)=>(
                        <div className='currentKeyword' key={item}>
                          {item}
                          <div className='removeBtn' onClick={ ()=>this.removeKeyword(index)} >{`\u2715`}</div>
                        </div>
                      ))
                    }
                  </div>
              </div>
              : null
          }
        </div>
      </div>

      <div className='courseListSec'></div>
      
      <div className='detailInfoSec'></div>
    </>
  }
}

export default Search;