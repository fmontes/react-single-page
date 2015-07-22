import React from 'react';

export default class Input extends React.Component {
    constructor(props)  {
        super(props);
        this.state = {};
        this.state.validate = false;
    }

    validate(e) {
        if (!this.state.validate){
            this.setState({ validate: true });
        }
        var field = e.currentTarget;
        var value = field.value;
        var data = { value: value, id: this.props.id };
        this.props.onChange(data);
        this.setState(data);
    }

    render() {
        var className = 'form-group';
        if (this.state.validate || this.props.force) {
            className = (this.props.valid ? 'form-group' : 'form-group has-error');
        }
        return (
        <div className={className}>
            <label className="control-label">{this.props.label}</label>
            <input className="form-control" onChange={this.validate.bind(this)} type={this.props.type} placeholder={this.props.label} value={this.props.value} />
        </div>

        );
    }
}

