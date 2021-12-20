const Subscribe = require('../models/Subscribe.model');

const isSubscribed = async (userId, companyId) => {
    return await Subscribe.find({_userId: userId, companyId: companyId})
}

const subscribeUserToCompany = async (userId, companyId, cb) => {
    isSubscribed(userId, companyId).then(status => {
        if(!status.length) {
            let subscribe = new Subscribe({ _userId: userId, _companyId: companyId });
            subscribe.save(err => {
                if(err) console.error(err);
                return cb(null, true);
            })
        } else {
            return cb(companyId, false);
        }
    })
}

module.exports = { isSubscribed, subscribeUserToCompany }