/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('SidebarCtrl', SidebarCtrl);

  /** @ngInject */
  function SidebarCtrl($scope, $timeout, $location, $rootScope, layoutSizes, sidebarService) {

    $scope.menuItems = sidebarService.getMenuItems();

    function changeSelectElemTopValue() {
      $timeout(function () {
        var selectedItem = $('.al-sidebar-list-item.selected');
        if (selectedItem) {
          $scope.selectElemTop = selectedItem.position().top;
        }
      }, 101);
    }

    function selectMenuItem() {
      $.each($scope.menuItems, function (index, value) {
        value.selected = value.root === '#' + $location.$$url;

        if (value.subMenu) {
          var hasSelectedSubmenu = false;
          $.each(value.subMenu, function (subIndex, subValue) {
            subValue.selected = subValue.root === '#' + $location.$$url;
            if (subValue.selected) {
              hasSelectedSubmenu = true;
            }
          });
          value.selected = hasSelectedSubmenu;
        }
      });
      changeSelectElemTopValue();
    }

    selectMenuItem();

    $scope.$on('$locationChangeSuccess', function () {
      selectMenuItem();
    });

    $scope.menuExpand = function () {
      $rootScope.$isMenuCollapsed = false;
    };

    $scope.menuCollapse = function () {
      $rootScope.$isMenuCollapsed = true;
    };

    $rootScope.$watch('$isMenuCollapsed', function (newValue) {
      if (!newValue && !$scope.selectElemTop) {
        changeSelectElemTopValue();
      }
    });

    // watch window resize to change menu collapsed state if needed
    $(window).resize(function () {
      var isMenuShouldCollapsed = $(window).width() <= layoutSizes.resWidthCollapseSidebar;
      if ($scope.isMenuShouldCollapsed !== isMenuShouldCollapsed) {
        $scope.$apply(function () {
          $rootScope.$isMenuCollapsed = isMenuShouldCollapsed;
        });
      }
      $scope.isMenuShouldCollapsed = isMenuShouldCollapsed;
    });

    $scope.toggleSubMenu = function ($event, item) {
      var submenu = $($event.currentTarget).next();

      if ($rootScope.$isMenuCollapsed) {
        if (!item.slideRight) {
          $timeout(function () {
            item.slideRight = true;
            $scope.anySlideRight = true;
          }, 20);
        }
      } else {
        submenu.slideToggle(100);
        changeSelectElemTopValue();
      }
    };

    window.onclick = function () {
      $timeout(function () {

        if ($scope.anySlideRight) {
          $scope.menuItems.map(function (val) {
            return val.slideRight = false;
          });
          $scope.anySlideRight = false;
        }

      }, 10);
    };

    $scope.hoverItem = function ($event) {
      $scope.showHoverElem = true;
      var menuTopValue = 66;
      $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
    };

    $scope.collapseSidebarIfSmallRes = function () {
      if (window.innerWidth <= layoutSizes.resWidthCollapseSidebar) {
        $rootScope.$isMenuCollapsed = true;
      }
    };
  }
})();