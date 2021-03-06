/********************************************************************
  UP NEXT PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class UpNextPanel
* @constructor
*/
var React = require('react'),
    ClassNames = require('classnames'),
    CONSTANTS = require('./../constants/constants'),
    Utils = require('./utils'),
    CloseButton = require('./closeButton'),
    CountDownClock = require('./countDownClock');

var UpNextPanel = React.createClass({
  propTypes: {
    upNextInfo: React.PropTypes.shape({
      upNextData: React.PropTypes.shape({
        preview_image_url: React.PropTypes.string,
        name: React.PropTypes.string,
        description:React.PropTypes.string
      })
    }),
    skinConfig: React.PropTypes.shape({
      upNext: React.PropTypes.shape({
        timeToShow: React.PropTypes.number
      }),
      icons: React.PropTypes.objectOf(React.PropTypes.object)
    })
  },

  getDefaultProps: function () {
    return {
      skinConfig: {
        upNext: {
          timeToShow: 10
        },
        icons: {
          play:{fontStyleClass:'icon icon-play'},
          dismiss:{fontStyleClass:'icon icon-close'}
        }
      },
      upNextInfo: {
        upNextData: {}
      },
      controller: {
        upNextDismissButtonClicked: function(){},
        sendDiscoveryClickEvent: function(a,b){}
      }
    };
  },

  closeUpNextPanel: function() {
    this.props.controller.upNextDismissButtonClicked();
  },

  handleStartUpNextClick: function(event) {
    event.preventDefault();
    // Use the same way as sending out the click event on discovery content
    var eventData = {
      "clickedVideo": this.props.upNextInfo.upNextData,
      "custom": {
        "source": CONSTANTS.SCREEN.UP_NEXT_SCREEN,
        "countdown": 0,
        "autoplay": true
      }
    };
    this.props.controller.sendDiscoveryClickEvent(eventData, false);
  },

  render: function() {
    var upNextString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.UP_NEXT, this.props.localizableStrings);
    var upNextPanel = ClassNames({
      'upNextPanel': true,
      'upNextPanelBottom': this.props.controlBarVisible
    });

    return (
      <div className={upNextPanel}>
        <a className="upNextContent" onClick={this.handleStartUpNextClick}>
          <img className="contentImage" src={this.props.upNextInfo.upNextData.preview_image_url} />
          <span className={this.props.skinConfig.icons.play.fontStyleClass} aria-hidden="true"></span>
        </a>

        <div className="contentMetadata">
          <div className="upNextTitle">
            <CountDownClock {...this.props} timeToShow={this.props.skinConfig.upNext.timeToShow} currentPlayhead={this.props.currentPlayhead}/>

            <div className="upNextTitleText text-truncate text-capitalize">
              {upNextString}: {this.props.upNextInfo.upNextData.name}
            </div>
          </div>

          <div className="contentDescription text-truncate text-capitalize">
            {this.props.upNextInfo.upNextData.description}
          </div>
        </div>

        <CloseButton cssClass="upNextCloseBtn" closeAction={this.closeUpNextPanel} fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass} />
      </div>
    );
  }
});
module.exports = UpNextPanel;