// Ionic wpIonic App
angular.module('wpIonic', ['ionic','ionic.service.core', 'wpIonic.controllers', 'wpIonic.services', 'wpIonic.filters', 'wpIonic.directives','ngCordova', 'angular-cache'])

.run(function($ionicPlatform,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    
    if(navigator && navigator.splashscreen) {
            navigator.splashscreen.hide();
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, CacheFactoryProvider) {

  angular.extend(CacheFactoryProvider.defaults, { 
    'storageMode': 'localStorage',
    'capacity': 10,
    'maxAge': 10800000,
    'deleteOnExpire': 'aggressive',
    'recycleFreq': 10000
  })

  // Native scrolling
  if( ionic.Platform.isAndroid() ) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }
  $ionicConfigProvider.platform.ios.tabs.style('standard'); 
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('bottom');
  $ionicConfigProvider.backButton.text('返回');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');
  $stateProvider

  // 默认的页面
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.intro', {
    url: "/intro",
    views: {
      'menuContent': {
        templateUrl: "templates/intro.html",
        controller: 'IntroCtrl'
      }
    }
  })

  // 笑话--开心一刻
  .state('app.jokes', {
    url: "/jokes",
    views: {
      'menuContent': {
        templateUrl: "templates/jokes.html",
        controller: 'JokesCtrl'
      }
    }
  })

  .state('app.talk', {
    url: "/talk",
    views: {
      'menuContent': {
        templateUrl: "templates/talk.html",
        controller: 'talkCtrl'
      }
    }
  })
  .state('app.myStar', {
    url: "/myStar",
    views: {
      'menuContent': {
        templateUrl: "templates/myStar.html",
        controller: 'myStarCtrl'
      }
    }
  })


  .state('app.custom', {
    url: "/custom",
    views: {
      'menuContent': {
        templateUrl: "templates/custom.html",
        controller: 'customCtrl'
      }
    }
  })

  .state('app.campus', {
    url: "/campus",
    views: {
      'menuContent': {
        templateUrl: "templates/campus.html",
        controller: 'campusCtrl'
      }
    }
  })

  .state('app.campusDetail', {
    cache: false,
    url: "/campusDetail/:url",
    views: {
      'menuContent': {
        templateUrl: "templates/campusDetail.html",
        controller: 'campusDetailCtrl'
      }
    }
  })

  .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent': {
          templateUrl: "templates/settings.html",
          controller: 'settingsCtrl'
        }
      }
    });
  // 如果没有找到就显示应用简介
  $urlRouterProvider.otherwise('/app/intro');
});