import React from 'react';
import './PieMeter.css';



const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

const pieMeter = (props: any) => {
    const fill = props.fill || "#C7F2E4";
    const x = props.x || 10;
    const y = props.y || 10;
    const width = props.width || 100;
    const height = props.height || 100;
    const percent = props.percent || 1.0;
    let cumulativePercent = 0;
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    cumulativePercent += percent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    const largeArcFlag = percent > .5 ? 1 : 0;
    const pathData = [
        `M ${startX} ${startY}`, // Move
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
        `L 0 0`, // Line
    ].join(' ');

    const onClick = (event) => {
        if (props.clicked) {
            props.clicked(props.name, event);
        }
    }

    // <div className='PieMeter' onClick={(event) => props.clicked(props.name, event)}>

    return (
        <svg
            viewBox={'-1 -1 2 2'}
            x={x} y={y} width={width} height={height}
            onClick={onClick}
        >
            <circle stroke={'none'} fill={'#666666'} cx='0' cy='0' r='1'/>
            <path fill={fill} d={pathData} transform={'rotate(-90)'} ></path>
            
            {/* <path fill={fill} d={'M 1 0 A 1 1 0 0 1 0.8 0.59 L 0 0'}></path> */}
        </svg>
    );

}

export default pieMeter;