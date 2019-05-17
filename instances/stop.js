'use strict';

const PublicHoliday = require('public-holiday');
const Ec2Controller = require('ec2-controller');

module.exports.handler = function(event, context) {

  if ((new PublicHoliday(process.env['public_holiday_api'])).isHoliday()) {
    console.info("Scripts are skipped due to holidays.");
    return;
  }

  (new Ec2Controller(process.env['tag_name'])).stop();
};
