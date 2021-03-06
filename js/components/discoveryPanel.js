/**
 * Panel component for Discovery Screen
 *
 * @module DiscoveryPanel
 */
var React = require('react'),
    ClassNames = require('classnames'),
    CONSTANTS = require('../constants/constants'),
    Utils = require('./utils'),
    CountDownClock = require('./countDownClock');

var DiscoveryPanel = React.createClass({
  propTypes: {
    responsiveView: React.PropTypes.string,
    videosPerPage: React.PropTypes.objectOf(React.PropTypes.number),
    discoveryData: React.PropTypes.shape({
      relatedVideos: React.PropTypes.arrayOf(React.PropTypes.shape({
        preview_image_url: React.PropTypes.string,
        name: React.PropTypes.string
      }))
    }),
    skinConfig: React.PropTypes.shape({
      discoveryScreen: React.PropTypes.shape({
        showCountDownTimerOnEndScreen: React.PropTypes.bool,
        countDownTime: React.PropTypes.number,
        contentTitle: React.PropTypes.shape({
          show: React.PropTypes.bool
        })
      }),
      icons: React.PropTypes.objectOf(React.PropTypes.object)
    }),
    controller: React.PropTypes.shape({
      sendDiscoveryClickEvent: React.PropTypes.func
    })
  },

  getDefaultProps: function () {
    return {
      videosPerPage: {
        small: 2,
        medium: 6,
        large: 10
      },
      skinConfig: {
        discoveryScreen: {
          showCountDownTimerOnEndScreen: true,
          countDownTime: 10,
          contentTitle: {
            show: true
          }
        },
        icons: {
          pause:{fontStyleClass:'icon icon-pause'},
          discovery:{fontStyleClass:'icon icon-topmenu-discovery'},
          left:{fontStyleClass:'icon icon-left'},
          right:{fontStyleClass:'icon icon-right'}
        },
        responsive: {
          breakpoints: {
            sm: {name: 'small'},
            lg: {name: 'large'}
          }
        }
      },
      discoveryData: {
        relatedVideos: []
      },
      controller: {
        sendDiscoveryClickEvent: function(a,b){}
      }
    };
  },

  getInitialState: function() {
    return {
      showDiscoveryCountDown: this.props.skinConfig.discoveryScreen.showCountDownTimerOnEndScreen,
      currentPage: 1
    };
  },

  handleLeftButtonClick: function(event) {
    event.preventDefault();
    this.setState({
      currentPage: this.state.currentPage - 1
    });
  },

  handleRightButtonClick: function(event) {
    event.preventDefault();
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  },

  handleDiscoveryContentClick: function(index) {
    var eventData = {
      "clickedVideo": this.props.discoveryData.relatedVideos[index],
      "custom": this.props.discoveryData.custom
    };
    // TODO: figure out countdown value
    // eventData.custom.countdown = 0;
    this.props.controller.sendDiscoveryClickEvent(eventData, false);
  },

  shouldShowCountdownTimer: function() {
    return this.state.showDiscoveryCountDown && this.props.playerState === CONSTANTS.STATE.END;
  },

  handleDiscoveryCountDownClick: function(event) {
    event.preventDefault();
    this.setState({
      showDiscoveryCountDown: false
    });
    this.refs.CountDownClock.handleClick(event);
  },

  render: function() {
    var relatedVideos = this.props.discoveryData.relatedVideos;

    // if no discovery data render message
    if (relatedVideos.length < 1) {
      // TODO: get msg if no discovery related videos
    }

    //pagination
    var videosPerPage;
    switch (this.props.responsiveView) {
      case this.props.skinConfig.responsive.breakpoints.sm.name:
        videosPerPage = this.props.videosPerPage.small;
        break;
      case this.props.skinConfig.responsive.breakpoints.lg.name:
        videosPerPage = this.props.videosPerPage.large;
        break;
      default:
        videosPerPage = this.props.videosPerPage.medium;
    }
    var startAt = videosPerPage * (this.state.currentPage - 1);
    var endAt = videosPerPage * this.state.currentPage;
    var relatedVideoPage = relatedVideos.slice(startAt,endAt);

    // discovery content
    var panelTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.DISCOVER, this.props.localizableStrings);
    var discoveryContentName = ClassNames({
      'discoveryContentName': true,
      'hidden': !this.props.skinConfig.discoveryScreen.contentTitle.show
    });
    var discoveryCountDownWrapperStyle = ClassNames({
      'discoveryCountDownWrapperStyle': true,
      'hidden': !this.state.showDiscoveryCountDown
    });
    var leftButtonClass = ClassNames({
      'leftButton': true,
      'hidden': this.state.currentPage <= 1
    });
    var rightButtonClass = ClassNames({
      'rightButton': true,
      'hidden': endAt >= relatedVideos.length
    });
    var countDownClock = (
      <div className={discoveryCountDownWrapperStyle}>
        <a className="discoveryCountDownIconStyle" onClick={this.handleDiscoveryCountDownClick}>
          <CountDownClock {...this.props} timeToShow={this.props.skinConfig.discoveryScreen.countDownTime} ref="CountDownClock" />
          <span className={this.props.skinConfig.icons.pause.fontStyleClass}></span>
        </a>
      </div>
    );

    // Build discovery content blocks
    var discoveryContentBlocks = [];
    for (var i = 0; i < relatedVideoPage.length; i++) {
      discoveryContentBlocks.push(
        <div className="discoveryImageWrapperStyle" key={i}>
          <a onClick={this.handleDiscoveryContentClick.bind(this, videosPerPage * (this.state.currentPage - 1) + i)}>
            <img className="imageStyle" src={relatedVideoPage[i].preview_image_url} />
            <span className={discoveryContentName}>{relatedVideoPage[i].name}</span>
          </a>
          {(this.shouldShowCountdownTimer() && i === 0) ? countDownClock : ''}
        </div>
      );
    }

    return (
      <div className="discovery-panel">
        <div className="discovery-panel-title">
          {panelTitle}
          <span className={this.props.skinConfig.icons.discovery.fontStyleClass}></span>
        </div>

        <div className="discoveryToasterContainerStyle flexcontainer" id="DiscoveryToasterContainer" ref="DiscoveryToasterContainer">
          {discoveryContentBlocks}
        </div>

        <a className={leftButtonClass} ref="ChevronLeftButton" onClick={this.handleLeftButtonClick}>
          <span className={this.props.skinConfig.icons.left.fontStyleClass} aria-hidden="true"></span>
        </a>
        <a className={rightButtonClass} ref="ChevronRightButton" onClick={this.handleRightButtonClick}>
          <span className={this.props.skinConfig.icons.right.fontStyleClass}  aria-hidden="true"></span>
        </a>
      </div>
    );
  }
});
module.exports = DiscoveryPanel;