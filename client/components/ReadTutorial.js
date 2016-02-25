var m              = require('mithril');
var Read           = module.exports;
var mainLayout     = require('../layouts/main');
var User           = require('../models/users');
var _              = require('underscore');
var Tutorial       = require('../models/tutorials');
var MarkDownText = require('../components/MarkDownText');


Read.controller = function () {
  var ctrl = this;
  console.log('error',ctrl.error)

  ctrl.id = m.route.param('id');
  console.log('id',ctrl.id)
  User.confirmLoggedIn();

  ctrl.tutorial = null;;
  ctrl.listSteps = null
  // ctrl.userCanEdit = function() {
  //   return ctrl.tutorial && ctrl.tutorial.created_by &&
  // }


  Tutorial.fetchByID(ctrl.id).then(function(tutorial) {
     ctrl.tutorial = tutorial
  })
};

Read.view = function (ctrl, options) {
    // var id = 0;
    var view =  m('.content-read.col-md-6.col-md-offset-3.col-sm-12', [
                  m('.tutorial-header', [
                  m('h2', ctrl.tutorial.title),
                  m('p', ctrl.tutorial.description),
                  m('.auth-edit', [
                  //edit  to creator of tutorial
                  User.isUserMatch(ctrl.tutorial.created_by) ? [
                    m('div', editBtn(options, ctrl.tutorial))
                  ] : null,
               ])
             ]),
        m('.content-steps', [
            ctrl.tutorial.steps.map(function(list, index) {
              index = index+1;
              console.log('content steps', list);
                // id++
                 // return m('.panel-group', { 'aria-multiselectable': 'true', id: 'accordion', role: 'tablist' }, [
                          return m('div', {'aria-multiselectable': 'true'}, [
                            // m('.panel-heading', { id: 'heading' + id, role: 'tab' }, [
                              // m('h4.panel-title', [
                                // m('a', { 'aria-controls': 'collapse' + id, 'aria-expanded': 'false', 'data-parent': '#accordion', href: '#collapse' + id, role: 'button' }, [
                                  m('h3', 'Step ' + index + ': ' + list.title),
                               // ])
                              // ]),
                            // ]),
                          // m('.panel-collapse', { 'aria-labelledby': 'heading' + id, id: 'collapse' + id, role: 'tabpanel' }, [
                            m('.step-container', [
                              m('p', m.component(MarkDownText, list.content))
                            ])
                          ])
                        // ])
               // ])
            })
        ])
    ]);
    return mainLayout(view);
};

var editBtn = function(options, tutorial) {
    return m('button.btn', {onclick : function(){
      m.route('/edit/' + tutorial._id);
    }}, "Edit")
    // return m('div.btn', [
    //     m('button.btn.btn-primary.btn-md', { 'data-target': '#myModal', 'data-toggle': 'modal', type: 'button' }, [
    //         m('div.edit', 'Edit')
    //      ]),
    //     m('.modal.fade', { 'aria-labelledby': 'myModalLabel', id: 'myModal', role: 'dialog', tabcounter: '-1' },  [
    //         m('.modal-dialog', { role: 'document' }, [
    //             m('.modal-content', [
    //                 m('.modal-header', [
    //                     m('button.close', { 'aria-label': 'Close', 'data-dismiss': 'modal', type: 'button' }, [
    //                         m('span', { 'aria-hidden': true }, 'x')]),
    //                     m('h4.modal-title', { id: 'myModalLabel' }, "Edit Tutorial")
    //                 ]),
    //                 m('.modal-body', [

    //                     // console.log(document.getElementsByClassName("content-read"))
    //                     m('textarea', { rows:'3', type:'text', style: 'width:75%; height:175px', value: document.getElementsByClassName(".read").value }) //trying to create edit
    //                 ]),
    //                 m('.modal-footer', [
    //                     m('button.btn.btn-default', { 'data-dismiss': 'modal', type: 'button' }, "Close"),
    //                     m('button.btn.btn-primary', { type: 'button' }, "Save Changes")
    //                 ])
    //             ])
    //         ])
    //      ])
    // ])
}
