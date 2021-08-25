import * as React from "react";

import './Checkbox.css';

export interface CheckboxProps {
    label: string;
    isChecked: boolean;
    changed: any,
}

export interface CheckboxState {
    isChecked: boolean;
}

export default class Checkbox extends React.Component<CheckboxProps, CheckboxState> {

    public displayName: string = 'checkbox';

    // constructor(props: CheckboxProps) {
    //     super(props);
    // }

    UNSAFE_componentWillMount() {
        this.setState({ isChecked: this.props.isChecked });
    }

    UNSAFE_componentWillReceiveProps(nextProps: CheckboxProps) {
        this.setState({ isChecked: nextProps.isChecked });
    }

    onChange = (event: any) => {
        this.setState({ isChecked: !this.state.isChecked }, () => {
            if (this.props.changed) {
                this.props.changed(this.state.isChecked);
            }
        });
    }

    render() {
        const label: string = this.props.label;
        const isChecked: boolean = this.state.isChecked;

        return (
            <div className={'Checkbox'}>
                <label>
                    <input type="checkbox" value={label} checked={isChecked} onChange={this.onChange} /> {label}
                </label>
            </div>
        );
    }
}