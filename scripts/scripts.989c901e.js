"use strict";function rdLoading(){var a={restrict:"AE",template:'<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'};return a}function rdWidget(){var a={transclude:!0,template:'<div class="widget" ng-transclude></div>',restrict:"EA"};return a}function rdWidgetBody(){var a={requires:"^rdWidget",scope:{loading:"@?",classes:"@?"},transclude:!0,template:'<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',restrict:"E"};return a}function rdWidgetFooter(){var a={requires:"^rdWidget",transclude:!0,template:'<div class="widget-footer" ng-transclude></div>',restrict:"E"};return a}function rdWidgetTitle(){var a={requires:"^rdWidget",scope:{title:"@",icon:"@"},transclude:!0,template:'<div class="widget-header"><div class="row"><div class="pull-left"><i class="fa" ng-class="icon"></i> {{title}} </div><div class="pull-right col-xs-6 col-sm-4" ng-transclude></div></div></div>',restrict:"E"};return a}function AlertsCtrl(a){a.alerts=[{type:"success",msg:"Thanks for visiting! Feel free to create pull requests to improve the dashboard!"},{type:"danger",msg:"Found a bug? Create an issue with as many details as you can."}],a.addAlert=function(){a.alerts.push({msg:"Another alert!"})},a.closeAlert=function(b){a.alerts.splice(b,1)}}angular.module("eDashboardApp",["ngAnimate","ngCookies","ngRoute","ngSanitize","ngTouch","firebase","firebase.ref","firebase.auth","ui.bootstrap","mwl.calendar","ui.router"]).run(["$rootScope","$state",function(a,b){a.$on("$stateChangeError",function(a,c,d,e,f,g){"AUTH_REQUIRED"===g&&b.go("login")})}]).config(["$stateProvider","$urlRouterProvider","calendarConfigProvider",function(a,b,c){b.otherwise("/"),a.state("app.inicio",{url:"/",templateUrl:"views/dashboard.home.html"}).state("app",{"abstract":!0,templateUrl:"views/app.html",controller:"MainCtrl",resolve:{currentAuth:["Auth","cacheService",function(a,b){return a.$requireAuth().then(function(a){b.put("authData",a),console.log("cache",b.get("authData"))})}]}}).state("app.cuenta",{url:"/cuenta",templateUrl:"views/account.html",controller:"AccountCtrl"}).state("app.reserva",{url:"/reserva",templateUrl:"views/reserva.html",controller:"ReservaCtrl"}).state("app.calendario",{url:"/calendario",templateUrl:"views/calendario.html",controller:"CalendarioCtrl"}).state("app.productos",{url:"/productos",templateUrl:"views/productos.html",controller:"ProductosCtrl"}).state("app.clientes",{url:"/clientes",templateUrl:"views/clientes.html",controller:"ClientesCtrl"}).state("login",{url:"/login",templateUrl:"views/login.html",controller:"LoginCtrl"}),c.setDateFormatter("moment"),c.setDateFormats({hour:"HH:mm"}),c.setI18nStrings({eventsLabel:"Eventos",timeLabel:"Horario"})}]),angular.module("eDashboardApp").controller("MainCtrl",["$scope","cacheService",function(a,b){a.authData=b.get("authData");var c,d=992;a.getWidth=function(){return window.innerWidth},a.$watch(a.getWidth,function(e,f){c=e,e>=d?angular.isDefined(b.get("toggle"))?a.toggle=b.get("toggle")?!0:!1:a.toggle=!0:a.toggle=!1}),a.toggleSidebar=function(){a.toggle=!a.toggle,b.put("toggle",a.toggle)},a.forceSidebar=function(c){a.toggle=c,b.put("toggle",c)},a.mouseEnterFix=function(){c>=d&&a.forceSidebar(!0)},window.onresize=function(){a.$apply()}}]),angular.module("firebase.config",[]).constant("FBURL","https://elasticmania.firebaseio.com").constant("SIMPLE_LOGIN_PROVIDERS",["password","facebook","google"]).constant("loginRedirectPath","/login"),angular.module("firebase.ref",["firebase","firebase.config"]).factory("Ref",["$window","FBURL",function(a,b){return new a.Firebase(b)}]),angular.module("eDashboardApp").filter("reverse",function(){return function(a){return angular.isArray(a)?a.slice().reverse():[]}}),function(){angular.module("firebase.auth",["firebase","firebase.ref"]).factory("Auth",["$firebaseAuth","Ref",function(a,b){return a(b)}])}(),angular.module("eDashboardApp").controller("LoginCtrl",["$scope","Auth","$location","$q","Ref","$timeout",function(a,b,c,d,e,f){function g(a){return h(a.substr(0,a.indexOf("@"))||"")}function h(a){a+="";var b=a.charAt(0).toUpperCase();return b+a.substr(1)}function i(){c.path("/inicio")}function j(b){a.err=b}a.oauthLogin=function(c){a.err=null,b.$authWithOAuthPopup(c,{rememberMe:!0}).then(i,j)},a.anonymousLogin=function(){a.err=null,b.$authAnonymously({rememberMe:!0}).then(i,j)},a.passwordLogin=function(c,d){a.err=null,b.$authWithPassword({email:c,password:d},{rememberMe:!0}).then(i,j)},a.createAccount=function(c,h,k){function l(a){var b=e.child("users",a.uid),h=d.defer();return b.set({email:c,name:g(c)},function(a){f(function(){a?h.reject(a):h.resolve(b)})}),h.promise}a.err=null,h?h!==k?a.err="Passwords do not match":b.$createUser({email:c,password:h}).then(function(){return b.$authWithPassword({email:c,password:h},{rememberMe:!0})}).then(l).then(i,j):a.err="Please enter a password"}}]),angular.module("eDashboardApp").controller("AccountCtrl",["$scope","cacheService","Auth","$timeout","$state","userFactory",function(a,b,c,d,e,f){a.user=b.get("authData");var g=f.getPerfil(a.user.uid);g.$bindTo(a,"profile"),g.$loaded().then(function(){console.log("exitosamente loaded profile record:",g.$id,g.name)}),f.loadUserEvents(a.user.uid),a.logout=function(){b.remove("authData"),g.$destroy(),e.go("login"),c.$unauth()},a.changePassword=function(b,c,d){a.err=null,b&&c?c!==d?console.log("Passwords do not match"):f.changePass(b,c).then(function(a){console.log("Password changed",a)},function(a){console.log(a.code,a.message)}):console.log("Please enter all fields")}}]),angular.module("eDashboardApp").directive("ngShowAuth",["Auth","$timeout",function(a,b){return{restrict:"A",link:function(c,d){function e(){b(function(){d.toggleClass("ng-cloak",!a.$getAuth())},0)}d.addClass("ng-cloak"),a.$onAuth(e),e()}}}]),angular.module("eDashboardApp").directive("ngHideAuth",["Auth","$timeout",function(a,b){return{restrict:"A",link:function(c,d){function e(){b(function(){d.toggleClass("ng-cloak",!!a.$getAuth())},0)}d.addClass("ng-cloak"),a.$onAuth(e),e()}}}]),angular.module("eDashboardApp").factory("cacheService",["$cacheFactory",function(a){var b=a("appcache");return b}]),angular.module("eDashboardApp").factory("userFactory",["Ref","$firebaseObject","cacheService","Auth","$firebaseArray",function(a,b,c,d,e){var f=a.child("users"),g=a.child("eventos");return{getPerfil:function(a){return b(f.child(a))},changePass:function(a,b){return d.$changePassword({email:c.get("authData").password.email,oldPassword:a,newPassword:b})},crearEvento:function(a){var b={by:a,tipo:"cumpleaños",ubicacion:"salón cumbres del alma",paquete:[{objeto1:1},{objeto2:2}]},c=e(g);c.$add(b).then(function(a){console.log(a);var b=a.key();console.log("added record with id "+b),c.$indexFor(b)},function(a){console.log("Hubo un error horrible:",a)})},loadUserEvents:function(a){g.orderByChild("by").equalTo(a).on("child_added",function(a){console.log(a,a.key())})}}}]),angular.module("eDashboardApp").directive("rdLoading",rdLoading),angular.module("eDashboardApp").directive("rdWidget",rdWidget),angular.module("eDashboardApp").directive("rdWidgetBody",rdWidgetBody),angular.module("eDashboardApp").directive("rdWidgetFooter",rdWidgetFooter),angular.module("eDashboardApp").directive("rdWidgetHeader",rdWidgetTitle),angular.module("eDashboardApp").controller("AlertsCtrl",["$scope",AlertsCtrl]),angular.module("eDashboardApp").controller("ReservaCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("eDashboardApp").controller("CalendarioCtrl",["$scope","$modal","moment",function(a,b,c){function d(a,c){b.open({template:"<h2>Un loco evento aparece acá.</h2>",controller:function(){var b=this;b.action=a,b.event=c},controllerAs:"vm"})}var e=new Date;a.calendarView="month",a.calendarDay=e,a.events=[{title:"Un evento",type:"warning",startsAt:c().startOf("week").subtract(2,"days").add(8,"hours").toDate(),endsAt:c().startOf("week").add(1,"week").add(9,"hours").toDate(),draggable:!0,resizable:!0},{title:'<i class="glyphicon glyphicon-asterisk"></i> <span class="text-primary">Otro evento</span>, con <i>html</i> title',type:"info",startsAt:c().subtract(1,"day").toDate(),endsAt:c().add(5,"days").toDate(),draggable:!0,resizable:!0},{title:"Este es un evento que ocurre todos los años",type:"important",startsAt:c().startOf("day").add(7,"hours").toDate(),endsAt:c().startOf("day").add(19,"hours").toDate(),recursOn:"year",draggable:!0,resizable:!0,cssClass:"a-css-class-name"}],a.calendarTitle="Encabezado de calendario",a.eventClicked=function(a){d("Clicked",a)},a.eventEdited=function(a){alert(a),console.log(a)},a.eventDeleted=function(a){alert(a),console.log(a)}}]),angular.module("eDashboardApp").controller("ClientesCtrl",["$scope","$timeout",function(a,b){a.clientes=[{id:"1",name:"José",apellido:"Gervasio",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"2",name:"Benito",apellido:"Calcaño",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"3",name:"Debora",apellido:"Meltrozo",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"4",name:"Iván",apellido:"Eltro Lazo",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"5",name:"Juan",apellido:"Bolas",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"6",name:"Luis",apellido:"Suarez",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"7",name:"Tu",apellido:"Hermana",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"8",name:"Cacho",apellido:"Bochinche",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"9",name:"San",apellido:"Toto",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"10",name:"José",apellido:"Gervasio",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"11",name:"Benito",apellido:"Calcaño",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"12",name:"Debora",apellido:"Meltrozo",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"13",name:"Iván",apellido:"Eltro Lazo",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"14",name:"Juan",apellido:"Bolas",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"15",name:"Luis",apellido:"Suarez",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"16",name:"Tu",apellido:"Hermana",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]},{id:"17",name:"Cacho",apellido:"Bochinche",tel:"098123123",email:"verga@entuculo.com",eventos:["ng1Ksdqo31:Kjsvk1","ng1Ksdqo31:Kjsvk2","ng1Ksdqo31:Kjsvk4"]}],a.select=function(b){a.selection=b},a.resultados=[],a.loadingUsers=!1,a.buscarPor={string:"name",index:0},a.busquedaParametros=[{id:"name",n:"Nombre"},{id:"apellido",n:"Apellido"},{id:"tel",n:"Teléfono"}],a.buscarFiltro=function(b,c){a.buscarPor={string:b,index:c}},a.buscarUser=function(c){a.resultados=[],a.loadingUsers=!0,b(function(){a.loadingUsers=!1,console.log(a.buscarPor.string,c),angular.forEach(a.clientes,function(b,d){"name"===a.buscarPor.string&&b.name===c?a.resultados.push(b):"apellido"===a.buscarPor.string&&b.apellido===c?a.resultados.push(b):"tel"===a.buscarPor.string&&b.tel===c&&a.resultados.push(b)})},1500)}}]),angular.module("eDashboardApp").controller("ProductosCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("eDashboardApp").directive("reserva",function(){return{template:"<div></div>",restrict:"E",link:function(a,b,c){b.text("this is the reserva directive")}}}),angular.module("eDashboardApp").directive("calendario",function(){return{template:"<div></div>",restrict:"E",link:function(a,b,c){b.text("this is the calendario directive")}}}),angular.module("eDashboardApp").directive("notificaciones",function(){return{template:"<div></div>",restrict:"E",link:function(a,b,c){b.text("this is the notificaciones directive")}}}),angular.module("eDashboardApp").directive("alertas",function(){return{template:"<div></div>",restrict:"E",link:function(a,b,c){b.text("this is the alertas directive")}}}),angular.module("eDashboardApp").constant("angularMomentConfig",{timezone:"America/Argentina/Buenos_Aires"}),angular.module("eDashboardApp").directive("avatar",function(){return{template:'<img src="{{src}}" title="{{nombre}}"/>',restrict:"E",link:function(a,b,c){function d(a){switch(a.provider){case"password":return a.password.email.replace(/@.*/,"");case"google":return a.google.displayName;case"facebook":return a.facebook.displayName;default:return"Usuario desconocido"}}function e(a){switch(a.provider){case"password":return a.password.profileImageURL;case"google":return a.google.profileImageURL;case"facebook":return a.facebook.profileImageURL;default:return"images/avatar.jpg"}}a.src=e(a.authData),a.nombre=d(a.authData)}}});