'use strict';

const AWS = require('aws-sdk');
const PublicHoliday = require('public-holiday');

module.exports.handler = function(event, context) {
  var ec2 = new AWS.EC2();
  var tagName = process.env['tag_name'];
  var params = {
    Filters: [{Name: `tag:${tagName}`, Values: ['ON', 'On', 'on', 'TRUE', 'True', 'true', '1']}]
  };
  var enable_state = ['pending', 'running', 'stopping', 'stopped'];

  var ph = new PublicHoliday(process.env['public_holiday_api']);
  if (ph.isHoliday()) {
    console.info("Scripts are skipped due to holidays.");
    return;
  }

  ec2.describeInstances(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      var instanceIds = [];
      data.Reservations.forEach(function (reservation) {
        reservation.Instances.forEach(function (instance) {
          if (enable_state.indexOf(instance.State.Name) >= 0) {
            instanceIds.push(instance.InstanceId);
          }
        });
      });

      if (instanceIds.length > 0) {
        ec2.startInstances({InstanceIds: instanceIds}, function(err, data) {
          if (err) console.log(err, err.stack);
          else     console.log(data);
        });
      } else {
        console.info("No instance has been specified to launch.");
      }
    }
  });
};
