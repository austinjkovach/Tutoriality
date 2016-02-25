//node dependencies
var m              = require('mithril');
var marked         = require('marked');
//file dependencies
var mainLayout     = require('../layouts/main.js');
var Tutorial       = require('../models/tutorials')
var User           = require('../models/users');
//exports
var CreateTutorial = module.exports;

//Main tutorial creator controller
CreateTutorial.controller = function () {
  var ctrl = this;
//passes in the 'id' parameter into the controller
  ctrl.tutorialID = function() {
    return m.route.param('id');
  };
//This decides whether or not to use a blank template, or import another tutorial for an edit
  ctrl.populate = function() {
    var tutorialID = ctrl.tutorialID();
    ctrl.tutorial = null;
    //checks to see if an ID was passed in
    if(tutorialID) {
    //if an ID was passed in, fetch that tutorial by it's ID
       Tutorial.fetchByID(tutorialID)
      .then(function(tutorial){
        //then assign that to our tutorial model
        ctrl.tutorial = tutorial;
      })
    }
    else {
      //else, create a new tutorial using our view model
      ctrl.tutorial = Tutorial.tutorialVM()
    }
  }

//Has two routes: Either creates a new tutorial or updates a tutorial
  ctrl.save = function (tutorial) {
    //checking again to see if a tutorial ID was passed in
    var tutorialID = ctrl.tutorialID();
    //if one was passed in, delete the tutorial by ID, and then update the tutorial in the database with new info
    if(tutorialID) {
      delete tutorial['_id'];
      console.log(tutorial);
      Tutorial.updateByID(tutorialID, tutorial);
    }
    else {
      //otherwise create a new tutorial with info passed in
      Tutorial.create(tutorial)
    }
  }

//This removes the first step.
  ctrl.removeStep = function (idx) {
    console.log('all steps: ', ctrl.tutorial.steps);
    ctrl.tutorial.steps.pop();
  }
//confirms login:
  User.confirmLoggedIn();
//sets controller to a blank template or populates with data
  ctrl.populate();
}
//Main Create view composed of all sub views in desired order of appearance
CreateTutorial.view = function (ctrl, options) {
  //what is going to be included in the create view tutorial
    var view = m('.tutorial-view', [
      createTemplate(ctrl),
      stepHeader(ctrl),
      makeSteps(ctrl),
      buttons(ctrl),
    ]);
    //inserts in our created view into our mainLayout to keep views consistent
    return mainLayout(view);

}

//Create sub view
var createTemplate = function(ctrl, options) {

  return m('.CreateTutorial', [
            m('h2', 'Create Tutorial'),
          m('div', [
            m('fieldset', [
              // m('legend', 'Tutorial Information'),
                m('form', 'Title: ', { type: 'text' }, [
                  m('br'),
                  m('input.form-control', {
                    type: 'text',
                    placeholder: 'Enter Title',
                    style: 'width: 75%;',
                    value : ctrl.tutorial.title,
                    //prevent default function keeps onchange from running when page loads
                    onchange: function(e) { e.preventDefault(); ctrl.tutorial.title = this.value }
                  })
                ]),
                m('form', 'Description: ', { type: 'text' }, [
                  m('br'),
                  m('textarea.form-control', {
                    type: 'text',
                    placeholder: 'Enter Description',
                    style: 'width: 75%;',
                    value : ctrl.tutorial.description,
                    onchange: function(e) { e.preventDefault(); ctrl.tutorial.description = this.value }
                  })
                ]),
            ]),
          ]),
         ])
};

//A header to come before the steps:
var stepHeader = function() {
    return m('div', [
            m('br'),
            m('fieldset', [
              m('legend', 'Create your steps!'),
            ])
          ])
}

//Make steps sub view:
var makeSteps = function(ctrl) {
  return m('.steps', [
//maps over objects in steps array and creates input fields for properties in objects
    ctrl.tutorial.steps.map(function(step, idx){
      return  m('.panel', [
              m('.panel-header', [
              m('form', 'Step Title:', { type: 'text',  style: 'margin-right: 40%;' }, [
              m('i.trash.glyphicon.glyphicon-trash'),
              m('br'),
              m('.panel-body', [
              m('input.form-control', {
                type: 'text',
                placeholder: 'Give a short description of step',
                style: 'width: 75%',
                value : step.title,
                onchange: function() { step.title = this.value }
                 }),
              m('br'),
              m('form', { type: 'text' }),
              m('textarea.form-control', {
                rows:'3',
                type:'text',
                placeholder:'Step it out!',
                style: 'width:75%; height:175px ',
                value : step.content,
                onchange: function() { step.content = this.value }
                 }),
              m('br'),
             ])
            ])
          ])
        ])
    })
  ])
}


//add step, delete step, save tutorial buttons
var buttons = function(ctrl) {
  return m('.button-container', [
      m(".btn-group[aria-label='...'][role='group']", [
        m("button.btn.btn-primary.btn-lrg[type='button']", {
          //onclick pushes a new step object into the steps array, the map function maps over it and changes view
          onclick:  function(e) { e.preventDefault(); ctrl.tutorial.steps.push( Tutorial.stepVM() );}
        }, "Add Step"),
        m("button.btn.btn-primary.btn-lrg[type='button']", {
          //calls the delete step function
          onclick: function(e) { e.preventDefault(); ctrl.removeStep(this.idx) }
        }, "Delete Step"),
        m("button.btn.btn-success.btn-lrg[type='button']", {
          //calls the ctrl.save function which updates or creates, and then reroutes back to the main page
          onclick: function(e) { e.preventDefault(); ctrl.save(ctrl.tutorial); m.route('/'); }
        }, "Save"),
        m("button.btn.btn-danger.button-lrg[type='button']", {
          onclick: function(e) {e.preventDefault(); m.route('/'); }
        }, "Cancel"),
      ]),
      m('br'),
      m('br'),
    ])
}
//Deletes step. should possibly be in model?
// var removeStep = function(ctrl, idx) {
//   if (ctrl.tutorial.steps.length >= 2) {
//     return m('button', { onclick: ctrl.tutorial.removeStep(idx) }, 'Remove Step')
//   }
// }

