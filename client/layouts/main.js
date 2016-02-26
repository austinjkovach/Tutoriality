var m = require('mithril');
var User = require('../models/users');
var Notification = require('../models/notifications');
module.exports = function(body) {
	console.log(body);
	return m('.main', [
		navSubView(),
		Notification.isShown() ? notificationSubView() : null,
		m('.container',[
			m('.col-sm-12 .col-md-6 .col-md-offset-3',[
				body]),
		]),
	]);
}

var notificationSubView = function() {
 	var attr = {
 		role : 'alert',
 	};
	return m('div.alert.alert-danger.alert-dismissible', attr, [
		closeButton(),
		m('strong', 'Error Encountered! ')
	], Notification.getMessage());
};

var closeButton = function() {
	var attr = {
		"data-dismiss" : 'alert',
		'aria-label':'Close',
	};
	return m('button.close[type=button]', attr, [
		m('span', {"aria-hidden" : "true"}, 'x')
	]);
}

var signIn = function() {
  User.signIn().then(function(response){
    m.route("/");
  });
}

var navSubView = function() {
	return m('nav.navbar-default', [
		m('div.container-fluid', [
			m('div.navbar-header', [
				m('a.navbar-brand[href="/"]', {config: m.route}, 'Tutoriality')
			]),
			m('ul.nav.nav-pills.navbar-right', [        
				m('li[role=presentation].active', [
          User.getInfo() ? m('a[href="/create"]', {config: m.route}, 'Create') : ''
				]),
        m('li[role=presentation].active', [
          User.getInfo() ? m('a[href="/profile"]', {config: m.route}, 'Profile') : ''
        ]),
				m('li[role=presentation].active', [
					User.getInfo() ? m('a[href="/"]', {onclick : function(event){
						event.preventDefault();
						User.signOut().then(function(){
							m.route('/');
						});
					}}, 'Sign Out') :
          m('a[href="/"]', {onclick : function(event) {
              event.preventDefault();
              signIn();
            }
          }, [ m('i.fa.fa-github-alt'), " Sign in with Github"])
				])
			])
		]),
	]);
}
