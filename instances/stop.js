'use strict';

const AWS = require('aws-sdk');
const PublicHoliday = require('public-holiday');
const Ec2Controller = require('ec2-controller');

module.exports.handler = function(event, context) {

  var enableStates = ['pending', 'running', 'stopping', 'stopped'];

  var holiday = new PublicHoliday(process.env['public_holiday_api']);
  if (holiday.isHoliday()) {
    console.info("Scripts are skipped due to holidays.");
    return;
  }

  var selector = new Ec2Controller(process.env['tag_name']);
  selector.select(enableStates, function(instanceIds) {
    if (instanceIds.length > 0) {
      var ec2 = new AWS.EC2();
      ec2.stopInstances({InstanceIds: instanceIds}, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
      });
    } else {
      console.info("No instance has been specified to stop.");
    }
  });
};
