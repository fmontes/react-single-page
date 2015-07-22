import Header from './Header';
import PageHeader from './PageHeader';
import React from 'react';

export default class Main extends React.Component {
    constructor(props)  {
        super(props);
    }
    render() {
        return (
            <div className="container">
                <Header />
                <PageHeader title={this.props.children.props.route.title} />
                {this.props.children}
            </div>
        );
    }
};
