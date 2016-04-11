angular.module('wpIonic.services', [])

/**
 * 一个简单的数据加载services
 */
.factory('DataLoader', function( $http, $log ) {

  return {
    get: function(url) {
      // Simple index lookup
      return $http.get( url );
    },

    /*招聘详情中数据处理*/
    subHtmlStr : function (str) {
      return str.substring(str.indexOf('<h4'),str.lastIndexOf('<form'));
    }
  }

})

// .factory('Bookmark', function( CacheFactory ) {

//   if ( ! CacheFactory.get('bookmarkCache') ) {
//     CacheFactory.createCache('bookmarkCache');
//   }

//   var bookmarkCache = CacheFactory.get( 'bookmarkCache' );

//   return {
//     set: function(id) {
//       bookmarkCache.put( id, 'bookmarked' );
//     },
//     get: function(id) {
//       bookmarkCache.get( id );
//       console.log( id );
//     },
//     check: function(id) {
//       var keys = bookmarkCache.keys();
//       var index = keys.indexOf(id);
//       if(index >= 0) {
//         return true;
//       } else {
//         return false;
//       }
//     },
//     remove: function(id) {
//       bookmarkCache.remove(id);
//     }
//   }

// })

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
