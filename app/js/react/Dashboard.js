import Chart from './Chart';
import React from 'react';
import ReportActions from '../flux/actions/ReportActions';
import ReportStore from '../flux/stores/ReportStore';
import UserStores from '../flux/stores/UserStore';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.data = [];
    }

    componentDidMount() {
        var that = this;
        ReportStore.fetch()
            .then(function(res) {
                that.setState({
                    data: res
                });
            }, function(error) {
                console.log(error);
            });
    }

    render() {
        var graph = [];
        if (this.state.data.length) {
            graph = <Chart data={this.state.data} />;
        }
        return (
            <div>
                <div className="row">
                    <div className="col-sm-12">
                        {graph}
                    </div>
                </div>
            </div>
        )
    }
};
