angular.module('wpIonic.directives',[])

.directive('myDetail',function ($timeout,$ionicScrollDelegate) {
	return {
		scope : false,
		restrict : 'EAC',
		//让内容可以滚动起来
		template : '<ion-content delegate-handle="detailScroll"  class="wrap"><div class="scroll"></div></ion-content>',
		replace : true,
		link : function (scope,iEle,iAttrs) {
			$timeout(function () {
				scope.$apply(function () {
				//网络获取的html
				iEle.children().eq(0).html(scope.htmlStr);
				$ionicScrollDelegate.$getByHandle("detailScroll").resize();
				});
			},2000);
			
		}
	};
});