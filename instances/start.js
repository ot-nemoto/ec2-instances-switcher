'use strict';

const AWS = require('aws-sdk');
const request = require('sync-request');
const jschardet = require('jschardet');
const Iconv = require('iconv').Iconv;

module.exports.handler = function(event, context) {
  var ec2 = new AWS.EC2();
  var tagName = process.env['tag_name'];
  var params = {
    Filters: [{Name: `tag:${tagName}`, Values: ['ON', 'On', 'on', 'TRUE', 'True', 'true', '1']}]
  };
  var enable_state = ['pending', 'running', 'stopping', 'stopped'];

  // Check Public Holiday
  try {
    var response = request('GET', process.env['public_holiday_api']);
    let detectResult = jschardet.detect(response.body);
    console.log("charset: " + detectResult.encoding);
    let iconv = new Iconv(detectResult.encoding, 'UTF-8//TRANSLIT//IGNORE');
    let convertedString = iconv.convert(response.body).toString();
    console.log(convertedString);
    if (JSON.parse(convertedString).publicHoliday) {
      console.info("Scripts are skipped due to holidays.");
      return;
    }
  } catch(e) {
    console.warn(e.message);
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
