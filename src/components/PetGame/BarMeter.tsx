import React from 'react';

const barMeter = (props: any) => {
    const stroke = "#FFFFFF";
    const fill = props.fill || "#C7F2E4";
    const percent = props.percent;
    const width = props.width || 200;
    const height = props.height || 10;
    const barWidth = width * percent;
    
    const onClick = (event) => {
        if (props.clicked) {
            props.clicked(props.name, percent, event);
        }
    }

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ border: '1px solid grey' }} width={width} height={height} onClick={onClick}>
            <rect stroke={stroke} fill={fill} width={barWidth} height={height} />
        </svg>
    );

}

export default barMeter;