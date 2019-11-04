import React from 'react';
import './App.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

class Sections extends React.Component {

  showSections() {

    if (!Object.entries(this.props)[0][1].sections) {
      return;
    }

    var sections = Object.entries(this.props)[0][1].sections;
    var instructors = [];
    var lectures = [];
    var locations = [];
    var times = [];
    var subsections = [];

    Object.keys(sections).forEach(function(key) {
      lectures.push(key);
      instructors.push(sections[key].instructor);
      locations.push(sections[key].location);
      times.push(Object.entries(sections[key].time).join(" & "));
      subsections.push(sections[key].subsections);
     
    });
    return lectures.map((lecure, index) => {
      return (

      <tbody key = {index} style = {{fontSize: '0.8em'}}>
      <tr key = {lectures[index]} >
        <td>{lectures[index]}</td>
        <td>{instructors[index]}</td>
        <td>{locations[index]}</td>
        <td>{times[index]}</td>
        <td><Button id = "addLec" size = "sm" variant="outline-primary" style = {{fontSize: '15px'}}
        onClick = {()=>this.addToschedule('sections', lectures[index], NaN)}>Add Section</Button></td>
      </tr>
      {this.showSubSections(lectures[index], subsections[index])}
      </tbody>
      
      )
    })
  }

  showSubSections(num, subSections) {

    var sections = [];
    Object.keys(subSections).forEach(function(key) {
      sections.push(key);
    });

    return sections.map((section, index) => {
      return (
        <tr key = {section}>
          <td>{sections[index]}</td>
          <td></td>
          <td>{subSections[section].location}</td>
          <td>{Object.keys(subSections[section].time)[0]}, {Object.values(subSections[section].time)[0]}</td>
          <td><Button id = "addLec" size = "sm" variant="outline-primary" style = {{fontSize: '15px'}}
          onClick = {()=>this.addToschedule('subSections', num, sections[index])}>Add Dis</Button></td>
        </tr>
      )
    })
  }

  addToschedule(key, sections, subSections){

    if (this.props.data.sections === undefined) return;
    
    // copying the data
    var data= JSON.parse(JSON.stringify(this.props.data));
    var sectionsValue= JSON.parse(JSON.stringify(sections));
    var subSectionsValue= JSON.parse(JSON.stringify(subSections));
    this.props.callBackSections(key, data, sectionsValue, subSectionsValue);
  }

  render() {
    
    return (
      <div  id = 'Sections'>
        <Table striped bordered hover id = 'table' key = 'table' size="sm">
        <thead>
          <tr> 
            <th>Lecture</th>
            <th>Instructor</th>
            <th>Location</th>
            <th>Time</th>
            <th>
            <Button id = "showSections" style = {{float: "right", fontSize: '15px'}} size = "sm" variant="outline-primary"
            onClick = {()=>this.addToschedule('all', NaN, NaN)} 
            >Add All
            </Button>
            
            </th>
          </tr>
        </thead>
            {this.showSections()}
        </Table>
      </div>
    )
  }
}

export default Sections;