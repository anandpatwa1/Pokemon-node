function get_current_date(){
    const moment   = require('moment-timezone');
    const currentMoment = moment();
    const kolkataTime   = currentMoment.tz('Asia/Kolkata');
    var formatted       = kolkataTime.format('YYYY-MM-DD HH:mm:ss');
    return formatted; 
}

module.exports = {get_current_date}