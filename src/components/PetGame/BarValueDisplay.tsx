import './BarValueDisplay.css';
import BarMeter from './BarMeter';

const barValueDisplay = (props: any) => {
    const width = props.width || 200;
    const height = props.height || 10;

    return <div className={'BarValueDisplay'} >
        {props.name}
        <div className={'BarValueDisplayMeter'}>
            <BarMeter name={props.name} width={width} height={height} fill={'#FFFFFF'} percent={props.percent} clicked={props.clicked} />
        </div>
    </div>

}

export default barValueDisplay;