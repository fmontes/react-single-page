import Config from './../config/index';
import request  from 'superagent-es6-promise';
import UserService from './UserService';
import UserStore from '../flux/stores/UserStore';

export default {
    get() {
        return request
            .get('/api/config')
            .query({ id: UserStore.getUserInformation().configId })
            .set('X-User-Id', Config.xUserId)
            .promise();
    },
    
    put(data) {
        Object.assign(data, {cookie: UserStore.getUserInformation().token});
        return request
            .put('/api/config')
            .send(data)
            .set('X-User-Id', Config.xUserId)
            .promise();
    }
}
