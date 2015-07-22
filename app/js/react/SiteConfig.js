import AlertMessage from './AlertMessage';
import React from 'react';
import SiteConfigActions from '../flux/actions/SiteConfigActions';
import SiteConfigStore from '../flux/stores/SiteConfigStore';
import UserActions from '../flux/actions/UserActions';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.domain = '';
        this.state.redirects = {};
        this.state.rewriterule = {};
        this.state.scripts = [];
    }

    componentDidMount() {
        SiteConfigStore.addChangeListener(this.onChange.bind(this));
    }

    componentWillMount() {
        var that = this;
        SiteConfigStore.fetch()
            .then(function(res) {
                that.setState(res.body);
            }, function(error) {
                console.log('Error fetching configs');
            });

    }

    getNumbers(text) {
        return parseInt(text.match(/\d+/g)[0]);
    }

    getText(text) {
        return text.match(/[a-zA-Z]+/g)[0];
    }

    handleChangeScripts(e) {
        var target = e.currentTarget; // should be .target but there's a bug in React 0.14 beta
        var position = this.getNumbers(target.id);

        var newData = this.state.scripts;
        if (target.value) {
            newData[position] = target.value;
        } else {
            newData.splice(position, 1);
        }
        this.setState({ scripts: newData });
    }

    handleChangeRewriteRule(e) {
        var target = e.currentTarget;
        var key = this.getNumbers(target.id);
        var field = this.getText(target.id);
        var newData = this.state.rewriterule;
        var rule = newData[key];

        if (rule) {
            rule[field] = target.value;
        } else {
            var newRule = {};
            newRule[key] = {};
            newRule[key][field] = target.value;
            Object.assign(newData, newRule);
        }

        if (!target.value) {
            if (!rule.flag && !rule.pattern && !rule.substitution) {
                delete newData[key]; // can't delete 'rule' only object properties
            }
        }

        this.setState({ rewriterule: newData });
    }

    handleChange(e) {
        var target = e.currentTarget; // should be .target but there's a bug in React 0.14 beta
        var id = target.id;
        var newData = {};

        if (id === 'subdomain' || id === 'to') {
            newData = this.state.redirects;
            newData[id] = target.value;
        } else {
            newData[id] = target.value;
        }

        this.setState(newData);
    }

    onChange(res) {
        this.setState({ notification: res.status === 200 });
    }

    saveConfig(e) {
        e.preventDefault();
        SiteConfigActions.save(this.state);
    }

    render() {
        if (Object.keys(this.state).length) {
            var that = this;
            var formLines = [];
            var domain = this.state.domain;
            var redirects = this.state.redirects;
            var scripts = this.state.scripts;
            var rewriterule = this.state.rewriterule;

            formLines.push(
                <div className='form-group' key='domain'>
                    <label className='control-label'>Domain</label>
                    <input type='url' className='form-control' id='domain' placeholder='Domain' ref='domain' value={domain} onChange={this.handleChange.bind(this)} />
                    <hr/>
                </div>
            );

            formLines.push(
                <div className='form-group' key='redirects'>
                    <label className='control-label'>Redirects</label>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <input type='text' className='form-control' id='subdomain' placeholder='Subdomain' ref='subdomain' value={redirects.subdomain} onChange={this.handleChange.bind(this)} />
                        </div>
                        <div className='col-sm-6'>
                            <input type='text' className='form-control' id='to' placeholder='To' ref='to' value={redirects.to} onChange={this.handleChange.bind(this)} />
                        </div>
                    </div>
                    <hr/>
                </div>
            );

            var scriptTags = [];
            if (scripts) {
                scripts.forEach(function (script, index) {
                    scriptTags.push(
                        <div className='form-group' key={'scripts-' + index}>
                            <input type='text' className='form-control' id={'script' + index}
                                   placeholder={'Script no. ' + (index + 1)} value={scripts[index]}
                                   onChange={that.handleChangeScripts.bind(that)}/>
                        </div>
                    );
                });
            }

            scriptTags.push(
                <div className='form-group' key={'scripts-' + scripts.length}>
                    <input type='url' className='form-control' id={'script' + scripts.length}
                           placeholder={'Script no. ' + (scripts.length + 1)}
                           onChange={that.handleChangeScripts.bind(that)}/>
                </div>
            );


            formLines.push(
                <div key='scripts'>
                    <label className='control-label'>Scripts</label>
                    {scriptTags}
                    <hr/>
                </div>
            );

            var ruleTags =[];
            Object.keys(rewriterule).forEach(function (key, index) {
                ruleTags.push(
                    <div className='form-group' key={key}>
                        <div className='row'>
                            <div className='col-sm-5'>
                                <input type='text' className='form-control' id={key + '-pattern'} placeholder='Pattern' value={rewriterule[key].pattern} onChange={that.handleChangeRewriteRule.bind(that)} />
                            </div>
                            <div className='col-sm-5'>
                                <input type='text' className='form-control' id={key + '-substitution'} placeholder='Substitution' value={rewriterule[key].substitution} onChange={that.handleChangeRewriteRule.bind(that)} />
                            </div>
                            <div className='col-sm-2'>
                                <input type='text' className='form-control' id={key + '-flag'} placeholder='Flags' value={rewriterule[key].flag} onChange={that.handleChangeRewriteRule.bind(that)} />
                            </div>
                        </div>
                    </div>
                )
            });

            var id = Date.now();
            ruleTags.push(
                <div className='form-group' key={id}>
                    <div className='row'>
                        <div className='col-sm-5'>
                            <input type='text' className='form-control' id={id + '-pattern'} placeholder='Pattern' onChange={that.handleChangeRewriteRule.bind(that)} />
                        </div>
                        <div className='col-sm-5'>
                            <input type='text' className='form-control' id={id + '-substitution'} placeholder='Substitution' onChange={that.handleChangeRewriteRule.bind(that)} />
                        </div>
                        <div className='col-sm-2'>
                            <input type='text' className='form-control' id={id + '-flag'} placeholder='Flags' onChange={that.handleChangeRewriteRule.bind(that)} />
                        </div>
                    </div>
                </div>
            );

            formLines.push(
                <div className='form-group' key='rewrite'>
                    <label className='control-label'>Rewrite Rules</label>
                    {ruleTags}
                    <hr/>
                </div>
            );

            formLines.push(<button type='submit' className='btn btn-default' onClick={this.saveConfig.bind(this)} key='save-button'>Save</button>);

            if (this.state.notification) {
                var noti = <AlertMessage msg="Your site configuration has been saved!" type="success" />;
            }
        }

        return (
            <div>
                <div className='row'>
                    <div className='col-sm-8 col-sm-offset-2'>
                        {noti}
                        <div className='panel panel-default'>
                            <div className='panel-body'>
                                <form>
                                    {formLines}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};
