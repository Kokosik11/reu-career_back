const Subscribe = require('../models/Subscribe.model');
const Company = require('../models/Company.model');
const User = require('../models/User.model');

const events = require('events');

const em = new events.EventEmitter();

em.on('subscribeToCompany', async ({ user, company }) => {
    User.findById(user).then(user => {
        if(!user) console.log(user);
        Company.findByIdAndUpdate(company).then(company => {
            const message = `${user.username.lastname} ${user.username.firstname} подписался на вас!`

            company.notifications.push({ message });

            company.save(err => {
                console.error(err);
            });
        })
    })
})

const isSubscribed = async (userId, companyId) => {
    return await Subscribe.find({_userId: userId, _companyId: companyId})
}

const subscribeUserToCompany = async (userId, companyId, cb) => {
    isSubscribed(userId, companyId).then(status => {
        if(!status.length) {
            let subscribe = new Subscribe({ _userId: userId, _companyId: companyId });
            subscribe.save(err => {
                if(err) console.error(err);
                em.emit('subscribeToCompany', { user: userId, company: companyId });
                return cb(null, true);
            })
        } else {
            return cb(companyId, false);
        }
    })
}

const unsubscribe = async (userId, companyId, cb) => {
    isSubscribed(userId, companyId).then(status => {
        if(status.length) {
            // Subscribe.findByIdAndRemove()
            status.forEach(s => {
                Subscribe.deleteMany({ _id: s._id }).exec();
            })

            return cb(null, true)
        } else {
            return cb(null, false)
        }
    })
}

module.exports = { isSubscribed, subscribeUserToCompany, unsubscribe }