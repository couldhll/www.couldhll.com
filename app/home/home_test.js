'use strict';

describe('myApp.home module', function() {

  beforeEach(module('myApp.home'));

  describe('home view controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var homeViewController = $controller('homeViewController');
      expect(homeViewController).toBeDefined();
    }));

  });
});