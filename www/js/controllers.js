angular.module('wpIonic.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce, DataLoader, $rootScope, $log ) {
  
  // 根url
  $rootScope.url = 'http://japi.juhe.cn/joke/';
  $rootScope.key = 'e2d4647cb0d828b72840bb3b555a2a81';
})
.controller('IntroCtrl', function ( $scope, $state, $localstorage,$ionicSlideBoxDelegate, $ionicHistory,$log) {

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
  if ($localstorage.get('hasStartApp',false) == 'true') { $state.go('app.jokes'); }

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // 切换
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };

})
.controller('JokesCtrl',function ( $scope, $http, $ionicPopup, $ionicLoading,$localstorage,DataLoader, $timeout, $ionicSlideBoxDelegate,$ionicSideMenuDelegate, $rootScope, $log ) {
  $scope.morejokes = true;
  $scope.getApi = function () {
    return $rootScope.url + 'content/text.from?key='+$rootScope.key+'&page='+$scope.loadPage+'&pagesize=20';
  };

  /*暂时解决滑动手势冲突 待解决*/
  $scope.toggle = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  Array.prototype.containsJoke = function (arr){    
    for(var i=0;i<this.length;i++){
    //this指向真正调用这个方法的对象  
        if(this[i].content == arr.content){  
        return true;
        }  
    }
    return false;  
  };
  $scope.showConfirm = function (joke) {
    // 用于重置缓存
    // $localstorage.setObject('myStars',[]); 
    // $log.log($localstorage.getObject('myStars',[]));

    //解决内存为空时的bug
    if ($localstorage.getObject('myStars',[]).length != 0 && $localstorage.getObject('myStars',[]).containsJoke(joke)) {
      var alertPopup = $ionicPopup.alert({
       title: '收藏笑话',
       template: '您之前已经收藏了本笑话！'
       });
      alertPopup.then(function(res) {
       console.log('已收藏');
      });
    } else {
    var confirmPopup = $ionicPopup.confirm({
      title : '收藏笑话',
      template : '确定要收藏笑话么，将保存在 我的收藏 中。'
    });
    confirmPopup.then(function (res) {
      if(res) {
        $scope.starJoke(joke);
      }
     });
    }
  }
  $scope.starJoke = function (joke) {
    var starJokes = $localstorage.getObject('myStars',[]);
    if(starJokes.length == 0) { starJokes = [joke]; }
    // else if(starJokes.containsJoke(joke)) { $log.log('inArray');}
    else { starJokes.push(joke);}
    $localstorage.setObject('myStars',starJokes);
    $log.log($localstorage.getObject('myStars',[]));
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

      $log.log($scope.getApi(), response);
      $timeout(function () {
      $ionicLoading.hide();
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $scope.$broadcast('scroll.resize');
      },500);
    },function(response) {
      $log.log($scope.getApi(), response);
      $scope.morejokes = false;
      $timeout(function () {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.resize');
      },500);
    });
      
  };
        $scope.doRefresh = function () {
          $scope.loadPage = 1;
          DataLoader.get($scope.getApi()).then(function (response) {
          $scope.jokes = response.data.result.data;
          $scope.loadPage++;
          $scope.$broadcast('scroll.resize');
          $timeout(function () {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },500);
         },function (response) {
          $log.log($scope.GetApi(),response);
          $scope.$broadcast('scroll.resize');
          $timeout(function () {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$broadcast('scroll.infiniteScrollComplete');
          },500);
         });
        };
        $scope.loadPage = 1;
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
        };
        $scope.moreDataExists = function () {
          return $scope.morejokes;
        };

})
.controller('myStarCtrl', function( $scope,$ionicSideMenuDelegate, $timeout,$localstorage ,$log, CacheFactory ) {
  // TODO
  $scope.starJokes = [];
  $scope.doRefresh = function () {
  $scope.starJokes = $localstorage.getObject('myStars',[]);
  $timeout(function () {
    $scope.$broadcast('scroll.refreshComplete');
  },500);
  };
  $scope.doRefresh();
  // $scope.delJoke = function (joke) {
  //   $scope.starJokes.remove(joke);
  //   $localstorage.setObject('myStars',$scope.starJokes);
  // };
  /*暂时解决滑动手势冲突 待解决*/
  $scope.toggle = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

})

//趣图笑话
.controller('PhotoesCtrl',function ($scope,$rootScope,$ionicLoading,$ionicSideMenuDelegate,DataLoader, $timeout,$localstorage ,$log) {

  /*暂时解决滑动手势冲突 待解决*/
  $scope.toggle = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.watchImg = function (photo) {
    $log.log('watchImg');
  };
  $scope.page = 1;
  $scope.gteUrl = function () {
    return $rootScope.url + 'img/text.from?key=' + $rootScope.key + '&pagesize=10&page=' + $scope.page; 
    
  };
  $scope.moreData = true;
  $scope.loadPhotoes = function () {
    if (!$scope.moreData) {return;};
    DataLoader.get( $scope.gteUrl() ).then(function (response) {
      $scope.photoes = response.data.result.data;
      $scope.page++;
      $timeout(function () {
        $scope.$broadcast('scroll.resize');
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide();
      },500);
    },function (response) {
      $log.log(response);
      $scope.$broadcast('scroll.refreshComplete');
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $ionicLoading.hide();
      $scope.moreData = false;
    });
  };
  $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
  });
  $scope.loadPhotoes();
  $scope.doRefresh = function () {
    $scope.page = 1;
    $scope.loadPhotoes();
  };
  $scope.loadMore = function () {    
    DataLoader.get( $scope.gteUrl() ).then(function (response) {
      $log.log(response);
      $scope.photoes = $scope.photoes.concat(response.data.result.data);
      $scope.page++;
      $timeout(function () {
        $scope.$broadcast('scroll.resize');
        $scope.$broadcast('scroll.infiniteScrollComplete');
      },500);
    },function (response) {
      $log.log(response);
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $ionicLoading.hide();
      $scope.moreData = false;
    });
  };
  $scope.moreDataExists = function () {
    return $scope.moreData;
  }
})


//宣讲会controller
.controller('talkCtrl',function ($scope,DataLoader,$timeout,$log,$ionicSlideBoxDelegate) {

})

.controller('campusCtrl', function ($scope,$state,$ionicLoading,DataLoader,$ionicSideMenuDelegate,$timeout,$log,$ionicSlideBoxDelegate) {

  /*暂时解决滑动手势冲突 待解决*/
  $scope.toggle = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.page = 1;
  $scope.moreItems = false;
  $scope.GetApi = function () {
    return 'http://m.dajie.com/progress/list?page='+$scope.page;
  };
  $scope.getData = function () { 
    DataLoader.get($scope.GetApi()).then(function (response) {
        var data = response.data.data;
        if ($scope.progressArr == null) {
          $scope.progressArr = data.list;
        } else {
          $scope.progressArr = $scope.progressArr.concat(data.list);
        }
        $scope.$broadcast('scroll.resize');
        $scope.moreItems = true;
        $log.log($scope.GetApi(),response);
        $scope.page++;
        $timeout(function() {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.resize');
          $ionicLoading.hide();
         }, 500);
      },function (response) {
        $log.log($scope.GetApi(),response);
        $timeout(function() {
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.resize');
          $ionicLoading.hide();
         }, 500);
    })
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
      $timeout(function () {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.resize');
      },500);
        $scope.page++;
    },function (response) {
        $timeout(function () {
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.$broadcast('scroll.resize');
        },500);
    });
  };

  $scope.moreDataExists = function () {
    return $scope.moreItems;
  };
  $scope.loadMore = function () {
    $scope.getData();
    
  }
  $scope.hasActived = [];
  $scope.detailRootUrl = 'http://m.dajie.com';
  $scope.moreDetail = function (url,index) {
    //已访问，改变其样式
    $scope.hasActived[index] = true;

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
    //   $timeout(function () {
    //     $ionicLoading.hide();
    // },1200);
    },function (response) {
    //   $log.log(url,response.data);
    //   $timeout(function () {
    //     $ionicLoading.hide();
    // },1200);
    });

})
.controller('customCtrl', function ($scope) {
  $scope.openGithub = function () {
    window.open('https://github.com/SuuQi','_system');
  };
  $scope.openGithubApp = function () {
    window.open('https://github.com/SuuQi/jobcjlu','_system');
  };
})
.controller('settingsCtrl', function ($scope,$ionicPopup,$localstorage,$log) {
  $scope.clearLocal = function () {
    var confirmPopup = $ionicPopup.confirm({
      title : '清空缓存数据',
      template : '确定要清空缓存数据么？'
    });
    confirmPopup.then(function (res) {
      if(res) {
         // 用于重置缓存
        $localstorage.setObject('myStars',[]); 
        $localstorage.set('hasStartApp',false); 
        $log.log($localstorage.getObject('myStars',[]));
        // 手动置0，否则有0.04
        $scope.localSave = 0;
      }
     });
  }

  //获取本地储存的localStorage缓存
  $scope.localSave = parseInt((unescape(encodeURIComponent(JSON.stringify(localStorage))).length / 1024.0   *   100 + 0.5))/100;
});