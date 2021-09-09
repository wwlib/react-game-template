import './PieTimerDisplay.css';
import PieMeter from './PieMeter';

const pieTimerDisplay = (props: any) => {
    return <div className={'PieTimerDisplay'}>
        {props.name}
        <div className={'PieTimerDisplayMeter'}>
            <PieMeter name={props.name} width={100} height={100} fill={'#FFFFFF'} percent={props.percent} clicked={props.clicked} />
        </div>
    </div>

}

export default pieTimerDisplay;