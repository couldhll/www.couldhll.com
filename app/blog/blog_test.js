'use strict';

describe('myApp.blog module', function() {

  beforeEach(module('myApp.blog'));

  describe('blog view controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var blogViewController = $controller('blogViewController');
      expect(blogViewController).toBeDefined();
    }));

  });
});