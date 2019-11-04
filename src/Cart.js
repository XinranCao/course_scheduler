import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form'

class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSection: {},
            checkboxChecked: {},
            selectedCourses: {}
        };
    }

    clickToShow(key) {
        let newShowSection = Object.assign({}, this.state.showSection);
        if (newShowSection[key]) delete newShowSection[key];
        else newShowSection[key] = true;
        this.setState({ showSection: newShowSection });
    }

    updateSelectedCourses(option, courseNum, sectionNum, subsectionNum, flag) {
        let newCheckboxChecked = Object.assign({}, this.state.checkboxChecked);
        let newSelectedCourses = Object.assign({}, this.state.selectedCourses);

        if (option === 'all') {
            if (newCheckboxChecked[courseNum + sectionNum + subsectionNum]) {

                delete newCheckboxChecked[courseNum + sectionNum + subsectionNum];

                Object.keys(newCheckboxChecked).forEach(key => {
                    Object.keys(this.props.data[courseNum].sections).forEach(section => {
                        if (key === courseNum + section + NaN) { delete newCheckboxChecked[key]; }

                        Object.keys(this.props.data[courseNum].sections[section].subsections).forEach(subsection => {
                            if (key === courseNum + section + subsection) { delete newCheckboxChecked[key]; }
                        });
                    });
                });

                delete newSelectedCourses[courseNum];

            } else if (flag){

                newCheckboxChecked[courseNum + sectionNum + subsectionNum] = true;

                Object.keys(this.props.data[courseNum].sections).forEach(section => {
                    newCheckboxChecked[courseNum + section + NaN] = true;

                    Object.keys(this.props.data[courseNum].sections[section].subsections).forEach(subsection => {
                        newCheckboxChecked[courseNum + section + subsection] = true;
                    });
                });

                let name = JSON.parse(JSON.stringify(this.props.data[courseNum].name));
                let credit = JSON.parse(JSON.stringify(this.props.data[courseNum].credit));
                let sections = JSON.parse(JSON.stringify(this.props.data[courseNum].sections));

                newSelectedCourses[courseNum] =
                {
                    "name": name,
                    "credit": credit,
                    "number": courseNum,
                    "sections": sections
                };
            }

        } else if (option === 'section') {
            if (newCheckboxChecked[courseNum + sectionNum + subsectionNum]) {
                delete newCheckboxChecked[courseNum + sectionNum + subsectionNum];

                Object.keys(newCheckboxChecked).forEach(key => {
                    Object.keys(this.props.data[courseNum].sections[sectionNum].subsections).forEach(subsection => {
                        if (key === courseNum + sectionNum + subsection) { delete newCheckboxChecked[key]; }
                    });
                });

                delete newSelectedCourses[courseNum].sections[sectionNum];

                var item = newSelectedCourses[courseNum].sections;
                // when all sections are deleted, delete the course
                if (Object.entries(item).length === 0 && item.constructor === Object) {
                    delete newCheckboxChecked[courseNum + NaN + subsectionNum];
                    delete newSelectedCourses[courseNum];

                }
            } else if (flag){

                newCheckboxChecked[courseNum + sectionNum + subsectionNum] = true;

                if (newCheckboxChecked[courseNum + NaN + subsectionNum]) {

                    Object.keys(this.props.data[courseNum].sections[sectionNum].subsections).forEach(subsection => {
                        newCheckboxChecked[courseNum + sectionNum + subsection] = true;
                    });

                    newSelectedCourses[courseNum].sections[sectionNum] = JSON.parse(JSON.stringify(this.props.data[courseNum].sections[sectionNum]));
                
                } else {

                    newCheckboxChecked[courseNum + NaN + subsectionNum] = true;

                    Object.keys(this.props.data[courseNum].sections[sectionNum].subsections).forEach(subsection => {
                        newCheckboxChecked[courseNum + sectionNum + subsection] = true;
                    });

                    let name = JSON.parse(JSON.stringify(this.props.data[courseNum].name));
                    let credit = JSON.parse(JSON.stringify(this.props.data[courseNum].credit));
                    let section = JSON.parse(JSON.stringify(this.props.data[courseNum].sections[sectionNum]));
                    newSelectedCourses[courseNum] =
                    {
                        "name": name,
                        "credit": credit,
                        "number": courseNum,
                        "sections": { [sectionNum]: section }
                    };
                }
            }

        } else {
            if (newCheckboxChecked[courseNum + sectionNum + subsectionNum]) {

                delete newCheckboxChecked[courseNum + sectionNum + subsectionNum];
                
                // delete subsection
                delete newSelectedCourses[courseNum].sections[sectionNum].subsections[subsectionNum];

                var item1 = newSelectedCourses[courseNum].sections[sectionNum].subsections;
                // when all subsections are deleted, delete the section
                if (Object.entries(item1).length === 0 && item1.constructor === Object) {
                    delete newSelectedCourses[courseNum].sections[sectionNum];
                    delete newCheckboxChecked[courseNum + sectionNum + NaN];
                    let item2 = newSelectedCourses[courseNum].sections;
                    // when all ections a deleted, delete the course
                    if (Object.entries(item2).length === 0 && item2.constructor === Object)
                    delete newSelectedCourses[courseNum];
                    delete newCheckboxChecked[courseNum + NaN + NaN];
                }

            } else if (flag){

                newCheckboxChecked[courseNum + sectionNum + subsectionNum] = true;

                // check if the course is already in schedule
                if (newCheckboxChecked[courseNum + NaN + NaN]) {

                    //check if the section is already in schedule
                    if (newCheckboxChecked[courseNum + sectionNum + NaN]) {
                        newSelectedCourses[courseNum].sections[sectionNum].subsections[subsectionNum] = JSON.parse(JSON.stringify(this.props.data[courseNum].sections[sectionNum].subsections[subsectionNum]));
                    }
                    else {

                        newCheckboxChecked[courseNum + NaN + NaN] = true;

                        let time = JSON.parse(JSON.stringify(this.props.data[courseNum].sections[sectionNum].time));
                        let subsection = JSON.parse(JSON.stringify(this.props.data[courseNum].sections[sectionNum].subsections[subsectionNum]));
                        newSelectedCourses[courseNum].sections[sectionNum] = {
                            "time": time,
                            "subsections": { [subsectionNum]: subsection }
                        }
                    }

                } else {
                    newCheckboxChecked[courseNum + NaN + NaN] = true;
                    newCheckboxChecked[courseNum + sectionNum + NaN] = true;

                    let name = JSON.parse(JSON.stringify(this.props.data[courseNum].name));
                    let credit = JSON.parse(JSON.stringify(this.props.data[courseNum].credit));
                    let time = JSON.parse(JSON.stringify(this.props.data[courseNum].sections[sectionNum].time));
                    let subsection = JSON.parse(JSON.stringify(this.props.data[courseNum].sections[sectionNum].subsections[subsectionNum]));
                    newSelectedCourses[courseNum] =
                    {
                        "name": name,
                        "credit": credit,
                        "number": courseNum,
                        "sections": {
                            [sectionNum]: {
                                "time": time,
                                "subsections": { [subsectionNum]: subsection }
                            }
                        }
                    };
                }
            }
        }
        this.setState({
            checkboxChecked: newCheckboxChecked,
            selectedCourses: newSelectedCourses
        });
        
    }

    showSubSections(courseNum, sectionNum, subsections) {
        return Object.keys(subsections).map((key, index) => {
            return (
                <tr key={key}>
                    <td>
                        <Form.Group>
                            <Form.Check label={key}
                                checked={this.state.checkboxChecked[courseNum + sectionNum + key]}
                                onChange={() => this.updateSelectedCourses("subsection", courseNum, sectionNum, key, true)}
                                id={key} />
                        </Form.Group>
                    </td>
                    <td>{Object.entries(subsections[key].time).join('; ')}</td>
                    <td><Button variant="outline-danger" size="sm" style={{ float: 'right' }}
                        onClick={() => {this.props.callBackCartToApp('subSections', this.props.data[courseNum], sectionNum, key)
                                        this.updateSelectedCourses('subsection', courseNum, sectionNum, key, false)}}>Remove</Button>
                    </td>
                </tr>
            )
        })
    }

    showSections(courseNum, sections) {
        // console.log(sections);
        return Object.keys(sections).map((key, index) => {
            return (
                <div>
                    <Table responsive key={key}>
                        <tbody style={{ fontSize: '14px', padding: '5px', backgroundColor: '#f0f0f0' }}>
                            <tr>
                                <td>
                                    <Form.Group>
                                        <Form.Check label={key}
                                            checked={this.state.checkboxChecked[courseNum + key + NaN]}
                                            onChange={() => this.updateSelectedCourses("section", courseNum, key, NaN, true)}
                                            id={key} />
                                    </Form.Group>
                                </td>

                                <td>{Object.entries(sections[key].time).join("; ")}</td>
                                <td><Button variant="outline-danger" size="sm" style={{ float: 'right' }}
                                    onClick={() => {this.props.callBackCartToApp('sections', this.props.data[courseNum], key, NaN)
                                                    this.updateSelectedCourses('section', courseNum, key, NaN, false)}}>Remove</Button></td>
                            </tr>
                            {this.showSubSections(courseNum, key, sections[key].subsections)}
                        </tbody>
                    </Table>
                </div>
            )
        })
    }

    showCourseInCart() {
        var courses = this.props.data;
        // console.log(this.state.selectedCourses);
        return Object.keys(courses).map((key, index) => {
            return (
                <>
                    <Card key={key}>
                        <Card.Body>
                            <Form.Group style={{ float: 'left' }}>
                                <Form.Check
                                    checked={this.state.checkboxChecked[key + NaN + NaN]}
                                    onChange={() => this.updateSelectedCourses("all", key, NaN, NaN, true)}
                                    id={key} />
                            </Form.Group>

                            <Button variant="outline-danger" size="sm" style={{ float: 'right' }}
                                onClick={() => {this.props.callBackCartToApp('all', courses[key], NaN, NaN)
                                                this.updateSelectedCourses('all', key, NaN, NaN, false)}}>Remove
                            </Button>
                            <Card.Title>
                                {key}

                                <div className="mb-2 text-muted" style={{ fontSize: '20px', marginTop: '4px', float: 'right' }}>
                                    {courses[key].credit} Credits {'\xa0\xa0'}
                                </div>
                            </Card.Title>
                            <div style={{ marginTop: '15px', marginLeft: '15px' }}>
                                <Button id="show_hide" size='sm' variant="outline-info" style={{ width: '35px', height: '25px', fontSize: '15px', marginLeft: '12px' }}
                                    onClick={() => this.clickToShow(key)}>
                                    ▼
                                </Button>
                            </div>
                            <div style={{ marginTop: '12px' }}>
                                {this.state.showSection[key] ? this.showSections(key, courses[key].sections) : ""}
                            </div>
                        </Card.Body>
                    </Card>
                </>
            )
        })
    }

    calculateCredits() {
        let totalCredits = 0;
        Object.keys(this.state.selectedCourses).forEach(course => {
            // console.log(course);
            totalCredits += this.state.selectedCourses[course].credit;
        });
        // this.setState({credits: totalCredits});
        return totalCredits;
    }

    render() {
        return (
            <>
                <Card style={{width: 'calc(30vw - 5px)', height: 'calc(100vh - 7vh)', marginTop: '5px', marginLeft: '5px', position: 'fixed' }}>
                    <Card.Header style={{ fontSize: "30px" }}>Cart</Card.Header>
                    <Card.Header style={{ fontSize: "22px" }}>
                        Credits chosen: {this.calculateCredits()}
                        <Button style={{ width: '225px', float: "right" }}
                                onClick={() => this.props.callBackCartToSchedule(this.state.selectedCourses)}>
                            Generate Schedule ->
                        </Button>
                    </Card.Header>
                    <div style={{ overflow: 'auto', marginTop: '5px' }}>{this.showCourseInCart()}</div>
                </Card>
            </>
        )
    }
}

export default Cart;