'use strict';

describe('myApp.about module', function() {

  beforeEach(module('myApp.about'));

  describe('about view controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var aboutViewController = $controller('aboutViewController');
      expect(aboutViewController).toBeDefined();
    }));

  });
});