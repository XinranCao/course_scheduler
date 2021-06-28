import React from 'react';
import './oldVersion.css';
import Cart from './Cart';
import Calendar from './Calendar';

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.argList = [];
        this.state = {
            courseList: [],
            // generating: false
        }
    }

    callBackFromCart(selectedCourses) {
        let newList = [];
        Object.keys(selectedCourses).forEach(courseNum => {
            let courseKey = [];
            Object.keys(selectedCourses[courseNum].sections).forEach(sectionNum => {

                if (Object.entries(selectedCourses[courseNum].sections[sectionNum].subsections).length === 0) {
                    courseKey.push([courseNum, sectionNum, selectedCourses[courseNum].sections[sectionNum].time]);
                } else {
                    Object.keys(selectedCourses[courseNum].sections[sectionNum].subsections).forEach(subsectionNum => {
                        courseKey.push([courseNum, sectionNum, subsectionNum, selectedCourses[courseNum].sections[sectionNum].subsections[subsectionNum].time]);
                    });
                }
            });
            newList.push(courseKey);
        });
        this.setState({
            courseList: newList
        });
        this.argList = JSON.parse(JSON.stringify(newList));
    }

    render() {

        return (
            <>
                <Cart data={this.props.data}
                    callBackCartToApp={this.props.callBackSchedule}
                    callBackCartToSchedule={(selectedCourses) => this.callBackFromCart(selectedCourses)} />
                {/* {console.log(this.props.filteredCourses)} */}
                {/* {console.log(this.props.data)} */}
                <Calendar data={this.props.data} filteredCourses={this.props.filteredCourses} courseList={this.argList} />
            </>
        )
    }
}

export default Schedule;


