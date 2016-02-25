var m              = require('mithril');
var _              = require('underscore');
var Accordian      = require('./Accordion.js');
var Tutorial       = require('../models/tutorials.js')
var mainLayout     = require('../layouts/main');
var Read           = require('./ReadTutorial.js');
var List           = module.exports;


List.controller = function () {
  var ctrl = this;
  ctrl.tutorials = [];
  Tutorial.fetchAll().then(function(tutorials) {
    ctrl.tutorials = _.map(tutorials, function(tutorial) {
        return {
          id: tutorial._id,
          title: tutorial.title,
          content: m('.tutorial-content', tutorial.description)
        };
      });
  });
};

List.view = function (ctrl, options) {
  var view = m('.listView.col-md-6.col-offset-3.col-sm-12', [

    m('div.page-header', [
      m('h1', 'Tutorial List')
    ]),

    m('div.content-area', [
      ctrl.tutorials.map(function(tutorial) {
        return m('div.panel.panel-default', [
          m('div.panel-heading', [
            m('a[href=#/read/' + tutorial.id + '].panel-title.list-link', tutorial.title)
          ])
        ],
        m('div.panel-body', tutorial.content.children[0]));
      })
    ])

  ]);

  return mainLayout(view);
};
