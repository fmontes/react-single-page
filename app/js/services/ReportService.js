import Config from './../config/index';
import request  from 'superagent-es6-promise';
import UserService from './UserService';
import UserStore from '../flux/stores/UserStore';

export default {
    get() {
        return request
            .get('/api/report')
            .query({ cookie: UserStore.getUserInformation().token })
            .set('X-User-Id', Config.xUserId)
            .promise();
    },

    parseData(data) {
        var finalData = [];

        data.forEach(function(item, index) {
            finalData.push({
                day: new Date(item[0] / 1000000),
                item: item[1]
            })
        });

        return finalData;
    }
}
