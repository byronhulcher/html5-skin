jest.dontMock('../../js/components/spinner');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Spinner = require('../../js/components/spinner');
var skinConfig = require('../../config/skin.json');
var Utils = require('../../js/components/utils');

describe('Spinner', function () {
  it('tests spinner', function () {
    var mockProps = {
      skinConfig: skinConfig
    }
    
    //Render spinner into DOM
    var DOM = TestUtils.renderIntoDocument(<Spinner {... mockProps} />);
  });
});