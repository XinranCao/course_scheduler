import React from 'react';
import Day from './Day';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class Calendar extends React.Component {

    constructor(props) {
        super(props);
        this.scheduleList = [];
        this.state = {
            currNum: 0
        }

    }

    initializeScheduleList(course, newScheduleList) {
        
        for (const section of course) {
            console.log(section);
            var [mon, tue, wed, thu, fri] = [{}, {}, {}, {}, {}];

            if (section.length !== 3) {
                let lec = (section[0] + "\n" + section[1]);
                let lecTime = this.props.data[section[0]].sections[section[1]].time;

                //eslint-disable-next-line
                Object.keys(lecTime).forEach(date => {
                    let start = lecTime[date].split('-')[0];
                    let end = lecTime[date].split('-')[1];

                    switch (date) {
                        case 'monday':
                            mon[lec] = { "start": start, "end": end };
                            break;
                        case 'tuesday':
                            tue[lec] = { "start": start, "end": end };
                            break;
                        case 'wednesday':
                            wed[lec] = { "start": start, "end": end };
                            break;
                        case 'thursday':
                            thu[lec] = { "start": start, "end": end };
                            break;
                        case 'friday':
                            fri[lec] = { "start": start, "end": end };
                            break;
                        default:
                            console.log("time slot error");
                    }
                });
            }

            var sec = '';
            let secTime = '';
            if (section.length === 3) {
                secTime = this.props.data[section[0]].sections[section[1]].time;
                sec = section[0] + "\n" + section[1];
            } else {
                secTime = this.props.data[section[0]].sections[section[1]].subsections[section[2]].time;
                sec = section[0] + "\n" + section[1] + " " + section[2];
            }
            //eslint-disable-next-line
            Object.keys(secTime).forEach(date => {
                let start = secTime[date].split('-')[0];
                let end = secTime[date].split('-')[1];

                switch (date) {
                    case 'monday':
                        mon[sec] = { "start": start, "end": end };
                        break;
                    case 'tuesday':
                        tue[sec] = { "start": start, "end": end };
                        break;
                    case 'wednesday':
                        wed[sec] = { "start": start, "end": end };
                        break;
                    case 'thursday':
                        thu[sec] = { "start": start, "end": end };
                        break;
                    case 'friday':
                        fri[sec] = { "start": start, "end": end };
                        break;
                    default:
                        console.log("time slot error");
                }
            });

            let schedule = {
                'mon': mon,
                'tue': tue,
                'wed': wed,
                'thu': thu,
                'fri': fri
            }
            newScheduleList.push(schedule);
        }
        return newScheduleList;
    }

    generateSchedule() {
        var newScheduleList = [];
        for (const course of this.props.courseList) {
            var newList = [];
            if (newScheduleList.length === 0) {
                newList = this.initializeScheduleList(course, newScheduleList);
            } else {
                for (const schedule of newScheduleList) {
                    for (const section of course) {
                        // console.log(section);

                        let newSchedule = JSON.parse(JSON.stringify(schedule));
                        let conflicted = false;

                        if (section.length !== 3) {
                            let lec = (section[0] + "\n" + section[1]);
                            let lecTime = this.props.data[section[0]].sections[section[1]].time;
                            //eslint-disable-next-line
                            Object.keys(lecTime).forEach(date => {
                                let start = lecTime[date].split('-')[0];
                                let end = lecTime[date].split('-')[1];

                                switch (date) {
                                    case 'monday':
                                        // console.log(start);
                                        if (!Object.values(schedule.mon).every((item) => this.checkConflict(item.start, end) || this.checkConflict(start, item.end))) { conflicted = true; }
                                        else newSchedule.mon[lec] = { "start": start, "end": end };
                                        break;
                                    case 'tuesday':
                                        // console.log(start);
                                        if (!Object.values(schedule.tue).every((item) => this.checkConflict(item.start, end) || this.checkConflict(start, item.end))) { conflicted = true; }
                                        else newSchedule.tue[lec] = { "start": start, "end": end };
                                        break;
                                    case 'wednesday':
                                        // console.log(start);
                                        if (!Object.values(schedule.wed).every((item) => this.checkConflict(item.start, end) || this.checkConflict(start, item.end))) { conflicted = true; }
                                        else newSchedule.wed[lec] = { "start": start, "end": end };
                                        break;
                                    case 'thursday':
                                        // console.log(start);
                                        if (!Object.values(schedule.thu).every((item) => this.checkConflict(item.start, end) || this.checkConflict(start, item.end))) { conflicted = true; }
                                        else newSchedule.thu[lec] = { "start": start, "end": end };
                                        break;
                                    case 'friday':
                                        // console.log(start);
                                        if (!Object.values(schedule.fri).every((item) => this.checkConflict(item.start, end) || this.checkConflict(start, item.end))) { conflicted = true; }
                                        else newSchedule.fri[lec] = { "start": start, "end": end };
                                        break;
                                    default:
                                        console.log("time slot error");
                                }
                            });
                        }
                        if (conflicted) { continue; }

                        var sec = '';
                        let secTime = '';
                        if (section.length === 3) {
                            secTime = this.props.data[section[0]].sections[section[1]].time;
                            sec = section[0] + "\n" + section[1];
                        } else {
                            secTime = this.props.data[section[0]].sections[section[1]].subsections[section[2]].time;
                            sec = section[0] + "\n" + section[1] + " " + section[2];
                        }
                        //eslint-disable-next-line
                        Object.keys(secTime).forEach(date => {
                            let start = secTime[date].split('-')[0];
                            let end = secTime[date].split('-')[1];

                            switch (date) {
                                case 'monday':
                                    if (!Object.values(schedule.mon).every((item) => this.checkConflict(item.start, end) || this.checkConflict(start, item.end))) conflicted = true;
                                    else newSchedule.mon[sec] = { "start": start, "end": end };
                                    break;
                                case 'tuesday':
                                    if (!Object.values(schedule.tue).every((item) => this.checkConflict(item.start, end) || this.checkConflict(start, item.end))) conflicted = true;
                                    else newSchedule.tue[sec] = { "start": start, "end": end };
                                    break;
                                case 'wednesday':
                                    if (!Object.values(schedule.wed).every((item) => this.checkConflict(item.start, end) || this.checkConflict(start, item.end))) conflicted = true;
                                    else newSchedule.wed[sec] = { "start": start, "end": end };
                                    break;
                                case 'thursday':
                                    if (!Object.values(schedule.thu).every((item) => this.checkConflict(item.start, end) || this.checkConflict(start, item.end))) conflicted = true;
                                    else newSchedule.thu[sec] = { "start": start, "end": end };
                                    break;
                                case 'friday':
                                    if (!Object.values(schedule.fri).every((item) => this.checkConflict(item.start, end) || this.checkConflict(start, item.end))) conflicted = true;
                                    else newSchedule.fri[sec] = { "start": start, "end": end };
                                    break;
                                default:
                                    console.log("time slot error");
                            }
                        });
                        if (!conflicted) { newList.push(newSchedule); }
                    }
                }
            }
            newScheduleList = newList;
        }

        this.scheduleList = newScheduleList;
    }

    checkConflict(t1, t2) {

        t1 = t1.trim().slice(0, -2) + " " + t1.trim().slice(-2);
        t2 = t2.trim().slice(0, -2) + " " + t2.trim().slice(-2);
        let d1 = new Date("11/11/2019 " + t1).getTime();
        let d2 = new Date("11/11/2019 " + t2).getTime();
        if (d1 > d2) { return true; }
        return false;
    }

    updateCurrNum(option) {
        if (option === "left") {
            if (this.state.currNum > 0) {
                this.setState((prevState) => ({ currNum: prevState.currNum - 1 }));
            }
        } else {
            if (this.state.currNum < this.scheduleList.length - 1) {
                this.setState((prevState) => ({ currNum: prevState.currNum + 1 }));
            }
        }
    }

    render() {
        this.generateSchedule();
        return (
            <>
                <Card style={{ width: 'calc(70vw - 3px)', height: 'calc(100vh - 7vh)', marginTop: '5px', float: 'right' }}>
                    <div style={{ fontSize: '30px', textAlign: 'center', padding: '10px' }}>
                        <Button variant="outline-secondary" style={{ fontSize: '25px' }} onClick={() => { this.updateCurrNum("left") }}>{"<"}
                        </Button>
                        {'\xa0\xa0\xa0\xa0'}Schedule {this.scheduleList.length === 0 ? 0 : this.state.currNum + 1}/{this.scheduleList.length}{'\xa0\xa0\xa0\xa0'}
                        <Button variant="outline-secondary" style={{ fontSize: '25px' }} onClick={() => { this.updateCurrNum("right") }}>{">"}
                        </Button>
                    </div>

                    <Row >
                        <Col>
                            <Day blocks={this.scheduleList[this.state.currNum] ? this.scheduleList[this.state.currNum].mon : NaN}
                                title={'Mon'} start={7} end={19} height={650} width='12vw' />
                        </Col>
                        <Col>
                            <Day blocks={this.scheduleList[this.state.currNum] ? this.scheduleList[this.state.currNum].tue : NaN}
                                title={'Tue'} start={7} end={19} height={650} width='12vw' />
                        </Col>
                        <Col>
                            <Day blocks={this.scheduleList[this.state.currNum] ? this.scheduleList[this.state.currNum].wed : NaN}
                                title={'Wed'} start={7} end={19} height={650} width='12vw' />
                        </Col>
                        <Col>
                            <Day blocks={this.scheduleList[this.state.currNum] ? this.scheduleList[this.state.currNum].thu : NaN}
                                title={'Thu'} start={7} end={19} height={650} width='12vw' />
                        </Col>
                        <Col>
                            <Day blocks={this.scheduleList[this.state.currNum] ? this.scheduleList[this.state.currNum].fri : NaN}
                                title={'Fri'} start={7} end={19} height={650} width='12vw' />
                        </Col>
                    </Row>
                </Card>
            </>
        )
    }
}
export default Calendar;