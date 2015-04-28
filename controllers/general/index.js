/**
 * Created by Kamaron on 4/22/2015.
 */

var counter_dao = require('../../dao/counters'),
    competition_dao = require('../../dao/competition_dao'),
    counters_dao = require('../../dao/counters');

exports.get = function (req, res) {
    var params = {
        title: 'USU ACM Competition Framework',
        subtitle: 'Version 0.3.1 - Zora',
        redirect_url: '/'
    };

    exports.fill_data(req, params, function (new_data) {
        res.render('./general/index', new_data);
    });
};

exports.fill_data = function (req, data, cb) {
    data = data || {};

    competition_dao.get_previous_competitions(function (err, res) {
        if (err) {
            console.log('index controller - fill_data - An error occurred getting previous competitions - ' + err);
        } else {
            data.previous_comps = res;
            fd_upcoming_comps();
        }
    });

    function fd_upcoming_comps() {
        competition_dao.get_upcoming_competitions(function (err, res) {
            if (err) {
                console.log('index controller - fill_data - error getting upcoming competitions - ' + err);
            } else {
                data.upcoming_comps = res;
                fd_ongoing_comps();
            }
        });
    }

    function fd_ongoing_comps() {
        competition_dao.get_ongoing_competitions(function (err, res) {
            if (err) {
                console.log('index controller - fill_data - error getting ongoing competitions - ' + err);
            } else {
                data.ongoing_comps = res;
                fd_finish();
            }
        });
    }

    function fd_finish() {
        data.login_error = req.session.login_error;
        data.user_data = req.session.user_data;
        cb(data);
    }
};