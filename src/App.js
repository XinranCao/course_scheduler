import React from 'react'
import Old from './oldVersion/Old'
import old_screenshot from './img/old_screenshot.png'
import new_screenshot from './img/new_screenshot.png'
import './App.css'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            versionSwitch: 0,
            versionPreview: 0
        };
    }

    componentDidMount() {

    }

    clickBoxContent(index) {
        const boxes = document.getElementsByClassName('boxContent')
        const { versionPreview } = this.state

        if ( versionPreview !== index) {
            for (let i = 0; i < boxes.length; i++) {
                i === index
                ? boxes[i].classList.add('view')
                : boxes[i].classList.remove('view')
            }
            this.setState({ versionPreview: index })
        }
    }

    render() {

        const { versionSwitch, versionPreview } = this.state
        let showVersion = null
        if (versionSwitch === 1) {
            showVersion = < Old />
        } else if (versionSwitch === 2) {
            // showVersion = < Old />
            showVersion = '111'
        }

        const oldInfo = <>
            - CS639 class project, finished in Fall 2019. <br /><br />
            - I had no JS+CSS+HTML background before I took this class.
            The final product had a rough structure design, a confusing human-computer interaction design and a flawed Algorithm logic design.<br /><br />
            - This project was built with React and Bootstrap components. Basic UI design and prototyping was finished using Adobe XD <br /><br /> </>
        const newInfo = ''

        return (
            <>
                <div className='mainPage' style={{ display: versionSwitch === 0 ? '' : 'none' }}>
                    <div className='content'>
                        <div className='versionBox'>
                            {
                                [old_screenshot, new_screenshot].map((item, index) => {
                                    let initClassName = index === 0 ? 'boxContent view' : 'boxContent'
                                    return <div 
                                        key={item}
                                        className={initClassName}
                                        onClick={() => {}}>

                                        <div className='versionTitle'>Course Scheduler</div>
                                        <div
                                            className='previewBox'
                                            style={{ backgroundImage: `url(${item})` }}
                                        >
                                        </div>
                                        <div className='text'>
                                            {index === 0 ? oldInfo : newInfo}
                                            <span>CLICK TO VIEW</span>
                                        </div>
                                    </div> })
                            }
                        </div>
                        <div className='notes'>
                            {
                                ['Old Version', 'New Version'].map((item, index) => (
                                    <div 
                                        key={item}
                                        className='note' 
                                        onClick={ ()=>this.clickBoxContent(index)}
                                        style={{ 
                                            zIndex: versionPreview === index ? '20' : '0',
                                            background: versionPreview === index ? 'rgba(255, 131, 131, 1)' : 'rgba(255, 131, 131, 0.6)',
                                        }}>
                                            {item}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

                {showVersion}

            </>
        )
    }
}

export default App;