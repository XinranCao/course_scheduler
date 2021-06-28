import React from 'react';
import './oldVersion.css';
import Card from 'react-bootstrap/Card';

class Course extends React.Component {
  render() {
    return (
      <Card style={{ width: '33%', marginTop: '5px', marginBottom: '5px' }}
        onClick={() => this.props.chooseCourse(this.props.data)}>
        <Card.Body>
          <Card.Title>{this.props.data.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
        </Card.Body>
      </Card>
    )
  }

  getCredits() {
    if (this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }
}

export default Course;
