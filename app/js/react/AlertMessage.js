import React from 'react';

export default class Main extends React.Component {
    constructor(props)  {
        super(props);
    }

    render() {
        return (
            <div className='row'>
                <div className='col-sm-12'>
                    <div className={'alert alert-' + this.props.type} role='alert'>
                        {this.props.msg}
                    </div>
                </div>
            </div>
        );
    }
};
