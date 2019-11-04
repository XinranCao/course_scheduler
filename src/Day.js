import React from 'react';
import Card from 'react-bootstrap/Card';

class Day extends React.Component {


    getBlocks() {
        let blockComponents = [];

        if (this.props.blocks) {
            Object.keys(this.props.blocks).forEach((course) => {

                let pxHeight = this.props.height * (this.convertTime(this.props.blocks[course].end)
                    - this.convertTime(this.props.blocks[course].start)) / (this.props.end - this.props.start);

                let pxY = this.props.height * (this.convertTime(this.props.blocks[course].start)
                    - this.props.start) / (this.props.end - this.props.start)

                blockComponents.push(<Card key={course}
                    style={{
                        fontSize: '11px',
                        height: pxHeight,
                        marginTop: pxY,
                        marginLeft: '1px',
                        backgroundColor: '#f0f6ff',
                        position: 'fixed',
                        width: 'calc(' + this.props.width + ' - 4px)'
                    }}>{course + '\n' + this.props.blocks[course].start + '-' + this.props.blocks[course].end}</Card>);
            })
        }


        return blockComponents;
    }

    render() {
        return (
            <Card style={{
                borderRadius: 0,
                width: this.props.width,
                textAlign: 'center',
                position: 'fixed',
            }}>
                <Card.Header className='square'>{this.props.title}</Card.Header>
                <Card.Body style={{ height: this.props.height, padding: 0 }}>
                    {this.getBlocks()}
                </Card.Body>
            </Card>)
    }
    convertTime(time) {
        let hour = time.split(':')[0];
        if(time.includes('pm') && (hour != 12)){
           hour = Number(hour) +  12;
        }
        let minute = Number(time.split(':')[1].trim().slice(0,-2));
        return Number(hour) + minute/60;
       }
}

export default Day; 