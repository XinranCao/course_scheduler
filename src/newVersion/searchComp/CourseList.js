import React from 'react';
import './style.css';

class CourseList extends React.Component {
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
  render() {

     
    return <div className='courseListSec'>

      </div>
  }
}

export default CourseList;