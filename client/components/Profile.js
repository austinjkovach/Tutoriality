var m              = require('mithril');
var _              = require('underscore');
var User = require('../models/users.js');
var Profile = module.exports;
var mainLayout = require('../layouts/main.js');
var Tutorial = require('../models/tutorials.js')

Profile.controller = function () {
  var ctrl = this;
  ctrl.tutorials = [];
  Tutorial.fetchByUserID(User.getID()).then(function(tutorials) {
    ctrl.tutorials = _.map(tutorials, function(tutorial) {
        return {
          id: tutorial._id,
          title: tutorial.title,
          content: m('.tutorial-content', tutorial.description)
        };
      });
  });
  Tutorial.fetchUserFavorites(User.getID()).then(function(favorites) {
    console.log(favorites)
    ctrl.favorites = _.map(favorites, function(favorite) {
        return {
          id: favorite._id,
          title: favorite.title,
          content: m('.tutorial-content', favorite.description)
        };
      });
  });
  ctrl.delete = function(dlt){
    Tutorial.delete(dlt).then(function(res){
      ctrl.tutorials.forEach(function(data, index){
        if(data.id === dlt){
          ctrl.tutorials.splice(index, 1);
        }
      });
    })
  }
}

Profile.view = function (ctrl, options) {
  var attributes = {
    onclick : function() {
      ctrl.signIn();
    }
  };
  var view = m('.profile', [
        m('img.avatar', { src: User.getPic(), width: '200', height: '200' }),
        m('h2', User.getName()),
        m('hr'),
        m('h2', 'My Tutorials'),
        //m('div', editBtn(options, ctrl.tutorial)),
        //render my tutorials
        ctrl.tutorials.map(function(tutorial) {
          return m('div.panel.panel-default.profile-tutorials-container', [
            m('div', editBtn(tutorial)),
            m('button.btn', {onclick: function(e){
              e.preventDefault();
              ctrl.delete(tutorial.id);
            }},'Delete'),
            m('div.panel-heading', [
              m('h3.panel-title.list-link', {onclick: function(e){
                // grab tutorial id and pass to read using variadic route
                m.route('/read/' + tutorial.id)
              }}, tutorial.title)
            ])
          ],
          m('div.panel-body', tutorial.content.children[0]));
        }),
        m('hr'),
        m('h2', 'My Favorites'),
        ctrl.favorites.map(function(favorite) {
          return m('div.panel.panel-default', [
            m('div.panel-heading', [
              m('h3.panel-title.list-link', {onclick: function(e){
                // grab favorite id and pass to read using variadic route
                m.route('/read/' + favorite.id)
              }}, favorite.title)
            ])
          ],
          m('div.panel-body', favorite.content.children[0]));
        }),
      ])
  return mainLayout(view);
}

var editBtn = function(tutorial) {
  return m('button.btn', {onclick : function(){
    m.route('/edit/' + tutorial.id);
  }}, "Edit")
}
