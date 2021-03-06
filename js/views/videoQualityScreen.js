/********************************************************************
 VIDEO QUALITY SCREEN
 *********************************************************************/
/**
 * This screen displays when user selects video quality.
 *
 * @class VideoQualityScreen
 * @constructor
 */
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    VideoQualityPanel = require('../components/videoQualityPanel'),
    CloseButton = require('../components/closeButton'),
    AccessibilityMixin = require('../mixins/accessibilityMixin');

var VideoQualityScreen = React.createClass({
  mixins: [AccessibilityMixin],

  handleClose: function(event) {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN);
  },

  render: function() {
    return (
      <div className="state-screen quality-screen">
        <div className="quality-panel-title">
          Video Quality
          <span className={this.props.skinConfig.icons.quality.fontStyleClass}></span>
        </div>
        <VideoQualityPanel {...this.props} />
        <CloseButton closeAction={this.handleClose} fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass} />
      </div>
    );
  }
});

VideoQualityScreen.propTypes = {
  skinConfig: React.PropTypes.shape({
    icons: React.PropTypes.shape({
      dismiss: React.PropTypes.shape({
        fontStyleClass: React.PropTypes.string
      })
    })
  })
};

VideoQualityScreen.defaultProps = {
  skinConfig: {
    icons: {
      dismiss:{fontStyleClass:'icon icon-close'}
    }
  },
  controller: {
    toggleScreen: function(){},
    state: {
      accessibilityControlsEnabled: true
    }
  }
};

module.exports = VideoQualityScreen;