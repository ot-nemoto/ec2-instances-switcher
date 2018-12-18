'use strict';

var AWS = require('aws-sdk');

module.exports.handler = function(event, context) {
  var ec2 = new AWS.EC2();
  var tagName = process.env['TAG_NAME'];
  var params = {
    Filters: [{Name: `tag:${tagName}`, Values: ['ON', 'On', 'on', 'TRUE', 'True', 'true', '1']}]
  };
  ec2.describeInstances(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      var instanceIds = [];
      data.Reservations.forEach(function (reservation) {
        reservation.Instances.forEach(function (instance) {
          instanceIds.push(instance.InstanceId);
        });
      });
      ec2.stopInstances({InstanceIds: instanceIds}, function(err, data) {
        if (err) console.log(err, err.stack);
        else     console.log(data);
      });
    }
  });
};
