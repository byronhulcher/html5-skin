jest.dontMock('../../js/views/pauseScreen')
    .dontMock('classnames');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var PauseScreen = require('../../js/views/pauseScreen');
var ClassNames = require('classnames');

describe('PauseScreen', function () {
  it('creates an PauseScreen', function () {
    var clicked = false;
    var mockController = {
      state: {
        accessibilityControlsEnabled: false,
        upNextInfo: {
          showing: false
        }
      },
      togglePlayPause: function(){clicked = true}
    };
    var mockContentTree = {
      title: "title"
    };
    var mockSkinConfig = {
      startScreen:{
        titleFont: {
          color: "white"
        },
        descriptionFont: {
          color: "white"
        }
      },
      pauseScreen: {
        infoPanelPosition: "topLeft",
        pauseIconPosition: "center",
        PauseIconStyle: {
          color: "white",
          opacity: "1"
        },
        showPauseIcon: true,
      },
      icons: {
        pause: {
          fontStyleClass: "pause"
        }
      }
    };

    // Render pause screen into DOM
    var DOM = TestUtils.renderIntoDocument(<PauseScreen skinConfig={mockSkinConfig} controller = {mockController} contentTree = {mockContentTree}/>);

    var pauseIcon = TestUtils.findRenderedDOMComponentWithClass(DOM, 'action-icon-pause').getDOMNode();
    TestUtils.Simulate.click(pauseIcon);
    expect(clicked).toBe(true);
  });
});