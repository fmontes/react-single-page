import AlertMessage from './AlertMessage';
import FieldValidation from '../services/FieldValidation';
import Input from './Input';
import React from 'react';
import UserActions from '../flux/actions/UserActions';
import UserStore from '../flux/stores/UserStore';
import { Link } from 'react-router';

export default class LoginForm extends React.Component {
    constructor(props)  {
        super(props);
        this.state = {};
        this.state.email = '';
        this.state.password = '';
        this.state.forceFormValidation = false;
    }

    componentDidMount() {
        UserStore.addChangeListener(this.onChange.bind(this));
    }

    handleChange(e) {
        var data = {};
        data[e.id] = e.value;
        this.setState(data);
    }


    login(e) {
        e.preventDefault();
        if (FieldValidation.validateEmail(this.state.email) && FieldValidation.isRequired(this.state.password)) {
            UserActions.login({email: this.state.email, password: this.state.password});
        } else {
            this.setState({forceFormValidation: true});
        }
    }

    onChange(res) {
        if (res) this.setState({ status: res.status });
    }

    render() {
        if (this.state.status === 401) {
            var noti = <AlertMessage msg="Please check your email and password and try again" type="danger" />;
        }
        return (
            <div>
                <div className="row">
                    <div className="col-sm-4 col-sm-offset-4">
                        {noti}
                        <div className="panel panel-default">
                            <div className="panel-body">
                                <form>
                                    <Input type="email" id="email" placeholder="Email" label="Email" onChange={this.handleChange.bind(this)} valid={FieldValidation.validateEmail(this.state.email)} value={this.state.email} force={this.state.forceFormValidation} />
                                    <Input type="password" id="password" placeholder="Password" label="Password" onChange={this.handleChange.bind(this)} valid={FieldValidation.isRequired(this.state.password)} value={this.state.password} force={this.state.forceFormValidation} />
                                    <button type="submit" className="btn btn-default" onClick={this.login.bind(this)}>Sign in</button>
                                    <Link to="create" className="btn btn-link">Create Account</Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};
