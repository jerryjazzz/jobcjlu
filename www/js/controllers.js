angular.module('wpIonic.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce, DataLoader, $rootScope, $log ) {
  
  // Enter your site url here. You must have the WP-API v2 installed on this site. Leave /wp-json/wp/v2/ at the end.
  $rootScope.url = 'http://japi.juhe.cn/joke/';
  $rootScope.key = 'e2d4647cb0d828b72840bb3b555a2a81';
  // $rootScope.callback = '_jsonp=JSON_CALLBACK';

})

.controller('PostCtrl', function($scope, $stateParams, DataLoader, $ionicLoading, $rootScope, $sce, CacheFactory, $log, Bookmark, $timeout ) {

  // if ( ! CacheFactory.get('postCache') ) {
  //   CacheFactory.createCache('postCache');
  // }

  // var postCache = CacheFactory.get( 'postCache' );

  // $scope.itemID = $stateParams.postId;

  // var singlePostApi = $rootScope.url + 'posts/' + $scope.itemID;

  // $scope.loadPost = function() {

  //   // Fetch remote post

  //   $ionicLoading.show({
  //     noBackdrop: true
  //   });

  //   DataLoader.get( singlePostApi ).then(function(response) {

  //     $scope.post = response.data;

  //     $log.debug($scope.post);

  //     // Don't strip post html
  //     $scope.content = $sce.trustAsHtml(response.data.content.rendered);

  //     // $scope.comments = $scope.post._embedded['replies'][0];

  //     // add post to our cache
  //     postCache.put( response.data.id, response.data );

  //     $ionicLoading.hide();
  //   }, function(response) {
  //     $log.error('error', response);
  //     $ionicLoading.hide();
  //   });

  // }

  // if( !postCache.get( $scope.itemID ) ) {

  //   // Item is not in cache, go get it
  //   $scope.loadPost();

  // } else {
  //   // Item exists, use cached item
  //   $scope.post = postCache.get( $scope.itemID );
  //   $scope.content = $sce.trustAsHtml( $scope.post.content.rendered );
  //   // $scope.comments = $scope.post._embedded['replies'][0];
  // }

  // // Bookmarking
  // $scope.bookmarked = Bookmark.check( $scope.itemID );

  // $scope.bookmarkItem = function( id ) {
    
  //   if( $scope.bookmarked ) {
  //     Bookmark.remove( id );
  //     $scope.bookmarked = false;
  //   } else {
  //     Bookmark.set( id );
  //     $scope.bookmarked = true;
  //   }
  // }

  // // Pull to refresh
  // $scope.doRefresh = function() {
  
  //   $timeout( function() {

  //     $scope.loadPost();

  //     //Stop the ion-refresher from spinning
  //     $scope.$broadcast('scroll.refreshComplete');
    
  //   }, 1000);
      
  // };

})
.controller('JokesCtrl',function ( $scope, $http, $ionicLoading,DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log ) {
  $scope.morejokes = true;
  $scope.getApi = function () {
    return $rootScope.url + 'content/text.from?key='+$rootScope.key+'&page='+$scope.loadPage+'&pagesize=20';
  };

  $scope.starJoke = function (joke) {
    $log.log(joke);
  };

  $scope.loadJokes = function () {
      if (!$scope.morejokes) {return;};
      DataLoader.get( $scope.getApi() ).then(function(response) {
      $scope.morejokes = true;
      if($scope.jokes==null){
       $scope.jokes = response.data.result.data;
       } else {
        $scope.jokes = $scope.jokes.concat(response.data.result.data);
        $log.log($scope.jokes.length);
       }
      $timeout(function () {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.resize');
        $log.log($scope.getApi(), response);
      },500);
    },function(response) {
      $log.log($scope.getApi(), response);
      $scope.morejokes = false;
      $timeout(function () {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.resize');
        $log.log($scope.getApi(), response);
      },500);
    });
      
  };
        $scope.doRefresh = function () {
          $scope.loadPage = 1;
          DataLoader.get($scope.getApi()).then(function (response) {
          $scope.jokes = response.data.result.data;
          $log.log($scope.getApi(),response);
          $scope.loadPage++;
         },function (response) {
          $log.log($scope.GetApi(),response);
         });
          $scope.$broadcast('scroll.resize');
          $timeout(function () {
            $scope.$broadcast('scroll.refreshComplete');
          },500);
        };
        $scope.loadPage = 1;
        //TODO
        $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
        });
        $scope.loadJokes();

        $scope.loadMore = function () {
          $scope.loadPage++;
          $scope.loadJokes();
          $timeout(function() {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }, 1000);
        };
        $scope.moreDataExists = function () {
          return $scope.morejokes;
        };

})
/*
.controller('PostsCtrl', function( $scope, $http, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log ) {

  var postsApi = $rootScope.url + 'posts';

  $scope.moreItems = false;

  $scope.loadPosts = function() {

    // Get all of our posts
    DataLoader.get( postsApi ).then(function(response) {

      $scope.posts = response.data;

      $scope.moreItems = true;

      $log.log(postsApi, response.data);

    }, function(response) {
      $log.log(postsApi, response.data);
    });

  }

  // Load posts on page load
  $scope.loadPosts();

  paged = 2;

  // Load more (infinite scroll)
  $scope.loadMore = function() {

    if( !$scope.moreItems ) {
      return;
    }

    var pg = paged++;

    $log.log('loadMore ' + pg );

    $timeout(function() {

      DataLoader.get( postsApi + '?page=' + pg ).then(function(response) {

        angular.forEach( response.data, function( value, key ) {
          $scope.posts.push(value);
        });

        if( response.data.length <= 0 ) {
          $scope.moreItems = false;
        }
      }, function(response) {
        $scope.moreItems = false;
        $log.error(response);
      });

      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');

    }, 1000);

  }

  $scope.moreDataExists = function() {
    return $scope.moreItems;
  }

  // Pull to refresh
  $scope.doRefresh = function() {
  
    $timeout( function() {

      $scope.loadPosts();

      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
    
})
*/

.controller('myStarCtrl', function( $scope, $http, DataLoader, $timeout, $rootScope, $log, Bookmark, CacheFactory ) {

  // $scope.$on('$ionicView.enter', function(e) {

  //   if ( ! CacheFactory.get('postCache') ) {
  //     CacheFactory.createCache('postCache');
  //   }

  //   var postCache = CacheFactory.get( 'postCache' );

  //   if ( ! CacheFactory.get('bookmarkCache') ) {
  //     CacheFactory.createCache('bookmarkCache');
  //   }

  //   var bookmarkCacheKeys = CacheFactory.get( 'bookmarkCache' ).keys();

  //   $scope.posts = [];
  
  //   angular.forEach( bookmarkCacheKeys, function( value, key ) {
  //     var newPost = postCache.get( value );
  //     $scope.posts.push( newPost );
  //   });

  // });
    
})

.controller('IntroCtrl', function($scope, $state, $localstorage,$ionicSlideBoxDelegate, $ionicHistory,$log) {

  // $ionicSlideBoxDelegate.update();
  
  $ionicHistory.nextViewOptions({
    disableBack: true
  });
  // Called to navigate to the main app
  $scope.startApp = function() {
    var hasStartApp = true;
    $localstorage.set('hasStartApp',hasStartApp);
    $state.go('app.jokes');
  };
  if ($localstorage.get('hasStartApp',false)) { $state.go('app.jokes'); }

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

})
.controller('talkCtrl',function ($scope,DataLoader,$timeout,$log,$ionicSlideBoxDelegate) {




})

.controller('campusCtrl', function ($scope,$state,$ionicLoading,DataLoader,$timeout,$log,$ionicSlideBoxDelegate) {
  $scope.page = 1;
  $scope.moreItems = false;
  $scope.GetApi = function () {
    return 'http://m.dajie.com/progress/list?page='+$scope.page;
  };
  $scope.getData = function () {
//测试数据
  // $scope.progressArr = [{"location":"上海","time":"04-02 至 09-28","title":"白鹭医药2016招聘","url":"/project/69720"},{"location":"其它 其他 邯郸 海西 其他 其他 信阳 其他 厦门","time":"04-02 至 09-28","title":"美科信息2016招聘","url":"/project/69719"},{"location":"青岛","time":"04-02 至 09-28","title":"青岛陆橘科技2016招聘","url":"/project/69718"},{"location":"山东 其他 菏泽 其他 其他 其他","time":"04-02 至 09-28","title":"山东菏泽成武县事业单位2016招聘人员","url":"/project/69717"},{"location":"其他 港澳台 其他 其他 其他 扬州 江苏","time":"04-02 至 09-28","title":"宝应县教育局所属事业单位2016招聘","url":"/project/69716"},{"location":"杭州","time":"04-01 至 09-28","title":"浙江南都物业2016招聘","url":"/project/69715"},{"location":"山东 海外 其他 海外 其他 其他 其他 济宁","time":"04-02 至 09-28","title":"山东济宁金乡县事业单位2016招聘","url":"/project/69714"},{"location":"山东 其它 其他 其他 其他 其他 泰安","time":"04-02 至 09-28","title":"泰安市市直事业单位2016招聘工作人员","url":"/project/69713"},{"location":"港澳台 上海","time":"04-02 至 09-27","title":"浦发银行上海分行信用卡部2016招聘","url":"/project/69712"},{"location":"南宁 其他 其他 上海 其他 武汉 郑州 汉中 北京 黄石 海口 深圳 广州 其他","time":"04-02 至 09-28","title":"郑州信盈达2016招聘","url":"/project/69711"},{"location":"朝阳 海外 海外 港澳台 北京","time":"04-02 至 09-28","title":"大公集团2016招聘","url":"/project/69710"},{"location":"山东 曲阜 其它 其他 其他 其他 其他 济宁 青岛","time":"04-02 至 09-27","title":"山东青岛市即墨市2016招聘聘用制教师","url":"/project/69709"},{"location":"其他 其他 其他 其他 北京","time":"04-02 至 09-28","title":"中共中央对外联络部事业单位2016招聘","url":"/project/69708"},{"location":"其他 其他 其他 其他 重庆","time":"04-02 至 09-28","title":"云阳县事业单位2016公招聘工作人员","url":"/project/69707"},{"location":"广州 北京 广东","time":"04-02 至 09-28","title":"广东龙粤通信设备2016招聘","url":"/project/69706"},{"location":"北京","time":"04-02 至 09-28","title":"朵而2016招聘","url":"/project/69705"},{"location":"港澳台 阿里 北京","time":"04-02 至 09-28","title":"搜易贷2016招聘","url":"/project/69704"},{"location":"山东 其它 其他 其他 其他 其他 德州","time":"04-02 至 09-28","title":"德州平原县事业单位2016招聘工作人员","url":"/project/69703"},{"location":"东方 其它 成都 四川 吉安","time":"04-02 至 09-28","title":"成都顺势为2016招聘","url":"/project/69702"},{"location":"深圳 广州","time":"04-02 至 09-28","title":"茂鑫源电子2016招聘","url":"/project/69701"}];
  // $scope.moreItems = true;

  
    DataLoader.get($scope.GetApi()).then(function (response) {
        if ($scope.progressArr == null) {
          $scope.progressArr = response.data.data.list;
        } else {
          $scope.progressArr = $scope.progressArr.concat(response.data.data.list);
        }
        $scope.$broadcast('scroll.resize');
        $scope.moreItems = true;
        $log.log($scope.GetApi(),response);
        $scope.page++;
        $timeout(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $ionicLoading.hide();
         }, 500);

      },function (response) {
        $log.log($scope.GetApi(),response);
        $timeout(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $ionicLoading.hide();
         }, 500);
    });

    
  };

  $scope.getData();
  $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
        });
  $scope.doRefresh = function () {
    $scope.page = 1;
    DataLoader.get($scope.GetApi()).then(function (response) {
      $scope.progressArr = response.data.data.list;
        $log.log($scope.GetApi(),response);
        $scope.page++;
    },function (response) {
        $log.log($scope.GetApi(),response);
    });
    $scope.$broadcast('scroll.resize');
    $timeout(function () {
      $scope.$broadcast('scroll.refreshComplete');
    },500);
  };

  $scope.moreDataExists = function () {
    return $scope.moreItems;
  };
  $scope.loadMore = function () {
    $scope.getData();
    
  }
  $scope.detailRootUrl = 'http://m.dajie.com';
  $scope.moreDetail = function (url) {
    $scope.detailUrl = $scope.detailRootUrl + url;
    $state.go('app.campusDetail',{'url' : $scope.detailUrl});
  }
})
.controller('campusDetailCtrl', function ($scope,$ionicLoading,$timeout,$state,$stateParams,DataLoader,$timeout,$log,$ionicSlideBoxDelegate) {
    var url = $stateParams.url;
    $scope.htmlStr = "";
    $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 0
        });
    DataLoader.get( url ).then(function (response) {
      $scope.htmlStr = DataLoader.subHtmlStr(response.data);
      $log.log(url,response.data);
      $timeout(function () {
        $ionicLoading.hide();
    },1200);
    },function (response) {
      $log.log(url,response.data);
      $timeout(function () {
        $ionicLoading.hide();
    },1200);
    });

});