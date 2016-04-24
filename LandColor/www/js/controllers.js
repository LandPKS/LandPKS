angular.module('starter')
  .controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.showMenu = function () {
      $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.showRightMenu = function () {
      $ionicSideMenuDelegate.toggleRight();
    };
  })

  .controller('imageController',function($scope,$state, $cordovaCamera,$cordovaDevice, $cordovaFile, $ionicPlatform, $ionicActionSheet,ImageService,CanvasService){

    $scope.addImage = function(){
        var options = {
          //quality: 96 // Quality of the saved image, range of 0 - 100
          destinationType : Camera.DestinationType.DATA_URL,
          allowEdit : false, //Allow simple editing of image before selection
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions, // iOS-only options that specify popover location in iPad
          //targetHeight: 2000,
          //targetWidth: 2000
          correctOrientation: $scope.iOS // correct camera captured images in case wrong orientation
          //cameraDirection: 0 // Back = 0, Front-facing = 1
        };
        // prompt user for Camera or Gallery
        $ionicActionSheet.show({
          buttons: [
            { text: '<i class="icon ion-camera"></i>Camera' },
            { text: '<i class="icon ion-images"></i>Photo Gallery' }
          ],
          cancelText: 'Cancel',
          cancel: function () {
            return true;
          },
          buttonClicked: function (index) {
            switch (index) {
              case 0:
                options.sourceType = Camera.PictureSourceType.CAMERA;
                break;
              case 1:
                options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                break;
            }
            // Call ngCordova module: cordovaCamera to bring up camera
            $cordovaCamera.getPicture(options).then(function(imageBase64) {
              ImageService.setMainPic(imageBase64);
            });
            $state.go('card', {});
            return true;

          }
        });
    };
    $scope.$watch(function() {
      $scope.mainPic = ImageService.getMainPic();
    });
    $scope.touchMe = function(event) {
      var imageURL = ImageService.getMainPic();
      var img = new Image();
      img.src = "data:image/jpeg;base64,"+ imageURL;
      var ogHeight = img.height;
      var ogWidth = img.width;
      if($state.is('card')) {
        var imgContainer = document.getElementById("cardPic");
      }
      else{
        var imgContainer = document.getElementById("soilPic")
      }
      var conHeight = imgContainer.clientHeight;
      var conWidth = imgContainer.clientWidth;
      var x = event.offsetX;
      var y = event.offsetY;
      var xPixel = ogWidth*(x/conWidth);
      var yPixel = ogHeight*(y/conHeight);
      if($state.is('card')){
        CanvasService.setCard(xPixel,yPixel);
        CanvasService.createCardCanvas(img);
      }
      else{
        CanvasService.setSoil(xPixel,yPixel);
        CanvasService.createSoilCanvas(img);
      }
    }
  })
  .controller('soilController',function($scope,CanvasService){


})
  .controller('resultsController',function($scope,$state,ImageService,CanvasService,ColorService){
    ColorService.getColor();
    $scope.$watch(function() {
      $scope.soilLAB = ColorService.getLAB();
    });

  });


