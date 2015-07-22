import FieldValidation from '../services/FieldValidation';
import Input from './Input';
import React from 'react';
import UserActions from '../flux/actions/UserActions';

export default class LoginForm extends React.Component {
    constructor(props)  {
        super(props);
        this.state = {};
        this.state.name = '';
        this.state.email = '';
        this.state.password = '';
        this.state.forceFormValidation = false;
    }

    create(e) {
        e.preventDefault();
        if (FieldValidation.isRequired(this.state.name) && FieldValidation.validateEmail(this.state.email) && FieldValidation.isRequired(this.state.password)) {
            UserActions.create({name: this.state.name, email: this.state.email, password: this.state.password});
        } else {
            this.setState({forceFormValidation: true});
        }
    }

    handleChange(e) {
        var data = {};
        data[e.id] = e.value;
        this.setState(data);
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4 col-sm-offset-4">
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <form>
                                    <Input type="text" id="name" placeholder="Full Name" label="Full Name" onChange={this.handleChange.bind(this)} valid={FieldValidation.isRequired(this.state.name)} value={this.state.name} force={this.state.forceFormValidation} />
                                    <Input type="email" id="email" placeholder="Email" label="Email" onChange={this.handleChange.bind(this)} valid={FieldValidation.validateEmail(this.state.email)} value={this.state.email} force={this.state.forceFormValidation} />
                                    <Input type="password" id="password" placeholder="Password" label="Password" onChange={this.handleChange.bind(this)} valid={FieldValidation.isRequired(this.state.password)} value={this.state.password} force={this.state.forceFormValidation} />
                                    <button type="submit" className="btn btn-default"  onClick={this.create.bind(this)}>Create</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};
