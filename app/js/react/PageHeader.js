import React from 'react';

export default class Main extends React.Component {
    constructor(props)  {
        super(props);
    }
    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <h1 className="page-header">{this.props.title}</h1>
                </div>
            </div>
        );
    }
};
