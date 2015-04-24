'use strict';

describe('myApp.three module', function() {

  beforeEach(module('myApp.three'));

  describe('three view controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var threeViewController = $controller('threeViewController');
      expect(threeViewController).toBeDefined();
    }));

  });
});