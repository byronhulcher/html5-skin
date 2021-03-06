jest.dontMock('../../js/components/videoQualityPanel')
    .dontMock('../../js/components/utils')
    .dontMock('../../js/constants/constants')
    .dontMock('classnames');

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var CONSTANTS = require('../../js/constants/constants');
var VideoQualityPanel = require('../../js/components/videoQualityPanel');
var skinConfig = require('../../config/skin.json');
var Utils = require('../../js/components/utils');

// start unit test
describe('VideoQualityPanel', function () {
  var selectedBitrate = null;

  var mockController = {
    state: {
      isMobile: false,
      volumeState: {
        volume: 1
      },
      closedCaptionOptions: {availableLanguages: true}
    },
    sendVideoQualityChangeEvent: function(selectedData){
      selectedBitrate = selectedData;
    }
  };

  var availableBitrates = [{"id":"auto", "bitrate":0}, {"id":"1", "bitrate":1000}, {"id":"2", "bitrate":2000}, {"id":"3", "bitrate":3000}, {"id":"4", "bitrate":4000}, {"id":"5", "bitrate":5000}]
  var bitrateLabels = ['1 kbps', '2 kbps','3 kbps','4 kbps','5 kbps']

  var mockProps = {
    controller: mockController,
    videoQualityOptions: {
      availableBitrates: availableBitrates,
      selectedBitrate: null
    }
  };

  it('creates video quality panel', function () {
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'quality-btn');
    expect(bitrateItems.length).toBe(availableBitrates.length-1);

    for (i=0; i<bitrateItems.length; i++){
      var itemText = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'quality-btn')[i].getDOMNode().textContent;
      expect(itemText).toEqual(bitrateLabels[i]);
    }
  });

  it('selects item from video quality panel', function () {
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'selected');
    expect(bitrateItems.length).toBe(1);
    expect(bitrateItems[0].getDOMNode().textContent).toBe('Auto');

    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'quality-btn');
    expect(bitrateItems.length).toBe(availableBitrates.length-1);

    for (i=0; i<bitrateItems.length; i++){
      var newBitrate = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'quality-btn')[i];
      TestUtils.Simulate.click(newBitrate);
      expect(selectedBitrate.id).toBe(availableBitrates[i+1].id);
    }
  });

  it('checks selected item is still there', function () {
    var mockProps = {
      controller: mockController,
      videoQualityOptions: {
        availableBitrates: availableBitrates,
        selectedBitrate: availableBitrates[1]
      }
    }
    var DOM = TestUtils.renderIntoDocument(
      <VideoQualityPanel {...mockProps} />
    );
    var bitrateItems = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'selected');
    expect(bitrateItems.length).toBe(1);
    expect(bitrateItems[0].getDOMNode().textContent).toBe(bitrateLabels[0]);
  });
});