import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import SearchAndFilter from './SearchAndFilter';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.searchAndFilter = new SearchAndFilter();
    this.search = React.createRef();
    this.filter = React.createRef();
    this.tags = [];
  }

  updateCourses() {
    this.props.setCourses(this.searchAndFilter.searchAndFilter(this.props.courses, this.tags, this.filter.current.value,));
  }

  addTag() {
    let curr = this.search.current.value;
    if (curr.length === 0) { }
    else if (this.tags.includes(curr)) { }
    else {
      this.tags.push(curr);
      this.updateCourses();
    }
    this.myFormRef.reset();
  }

  removeTag(num) {
    this.tags.splice(num, 1);
    this.updateCourses();
  }

  render() {
    return (
      <>
        <Card style={{ width: 'calc(20vw - 5px)', height: 'calc(100vh - 7vh)', position: 'fixed' }}>
          <Card.Body>
            <Card.Title>Search and Filter</Card.Title>
            <Form onSubmit={(e) => { e.preventDefault(); this.addTag(); }} ref={(ele) => this.myFormRef = ele}>
              <Form.Group controlId="formKeywords" style={{ width: '100%' }}>
                <Form.Label>Search by tags </Form.Label>
                <Form.Control type="text" placeholder="keywards" autoComplete="off" ref={this.search} />
              </Form.Group>
            </Form>

            <div>
              <ul style={{ flexWrap: 'wrap', padding: '0px', width: '100%' }}>
                {this.tags.map((tag, i) => (
                  <li key={tag} style={{ display: 'inline-block', margin: '5px', backgroundColor: "#f0f0f0", padding: '5px 10px' }}>
                    <Button variant='outline-danger' size='sm' onClick={() => { this.removeTag(i); }} style={{ border: 'none' }}>
                      X</Button>
                    {tag}</li>
                ))}
              </ul>
            </div>


            <Form.Group controlId="formFilter">
              <Form.Control as="select" ref={this.filter} onChange={() => this.updateCourses()} size="sm">
                <option key="intersection">intersection of tags</option>
                <option key="union">union of tags</option>
              </Form.Control>
            </Form.Group>
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default Sidebar;