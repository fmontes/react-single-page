import React from 'react';

export default class NotFound extends React.Component {
    constructor(props)  {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-12">
                    <h1 className="page-header">Nothing to see here, move along...</h1>
                </div>
            </div>
        )
    }
};
