/********************************************************************
  SCRUBBER BAR
*********************************************************************/
var React = require('react'),
    ResizeMixin = require('../mixins/resizeMixin'),
    Utils = require('./utils'),
    ClassNames = require('classnames'),
    CONSTANTS = require('../constants/constants');

var ScrubberBar = React.createClass({
  mixins: [ResizeMixin],

  getDefaultProps: function () {
    return {
      skinConfig: {
        controlBar: {
          scrubberBar: {
            backgroundColor: 'rgba(5,175,175,1)',
            bufferedColor: 'rgba(127,5,127,1)',
            playedColor: 'rgba(67,137,5,1)'
          },
          adScrubberBar: {
            backgroundColor: 'rgba(175,175,5,1)',
            bufferedColor: 'rgba(127,5,127,1)',
            playedColor: 'rgba(5,63,128,1)'
          }
        }
      }
    };
  },

  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    this.responsiveUIMultiple = this.getResponsiveUIMultiple(this.props.responsiveView);
    this.lastScrubX = null;
    this.scrubberBarWidth = 0;
    this.playheadWidth = 0;
    return {
      scrubbingPlayheadX: 0,
      currentPlayhead: 0,
      transitionedDuringSeek: false
    };
  },

  componentWillMount: function() {
    if (this.props.seeking) {
      this.setState({transitionedDuringSeek: true});
    }
  },

  componentDidUpdate: function () {
    this.responsiveUIMultiple = this.getResponsiveUIMultiple(this.props.responsiveView);
  },

  componentWillUnmount: function() {
    if (!this.isMobile){
      this.getDOMNode().parentNode.removeEventListener("mousemove", this.handlePlayheadMouseMove);
      document.removeEventListener("mouseup", this.handlePlayheadMouseUp, true);
    }
    else{
      this.getDOMNode().parentNode.removeEventListener("touchmove", this.handlePlayheadMouseMove);
      document.removeEventListener("touchend", this.handlePlayheadMouseUp, true);
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.transitionedDuringSeek && !nextProps.seeking) {
      this.setState({transitionedDuringSeek: false});
    }
  },

  componentDidMount: function() {
    this.scrubberBarWidth = this.getDOMNode().querySelector(".scrubberBar").clientWidth;
    this.playheadWidth = this.getDOMNode().querySelector(".playhead").clientWidth;
  },

  getResponsiveUIMultiple: function(responsiveView){
    return responsiveView == this.props.skinConfig.responsive.breakpoints.sm.name ?
      this.props.skinConfig.responsive.breakpoints.sm.multiplier :
      this.props.skinConfig.responsive.breakpoints.md.multiplier;
  },

  handleResize: function() {
    this.scrubberBarWidth = this.getDOMNode().querySelector(".scrubberBar").clientWidth;
    this.playheadWidth = this.getDOMNode().querySelector(".playhead").clientWidth;
  },

  handlePlayheadMouseDown: function(evt) {
    if (this.props.controller.state.screenToShow == CONSTANTS.SCREEN.AD_SCREEN) return;
    this.props.controller.startHideControlBarTimer();
    if (evt.type == 'touchstart' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      evt.preventDefault();
      if (this.isMobile){
        evt = evt.touches[0];
      }

      // we enter the scrubbing state to prevent constantly seeking while dragging
      // the playhead icon
      this.props.controller.beginSeeking();
      this.props.controller.renderSkin();

      if (!this.lastScrubX) {
        this.lastScrubX = evt.clientX;
      }

      if (!this.isMobile){
        this.getDOMNode().parentNode.addEventListener("mousemove", this.handlePlayheadMouseMove);
        // attach a mouseup listener to the document for usability, otherwise scrubbing
        // breaks if your cursor leaves the player element
        document.addEventListener("mouseup", this.handlePlayheadMouseUp, true);
      }
      else {
        this.getDOMNode().parentNode.addEventListener("touchmove", this.handlePlayheadMouseMove);
        document.addEventListener("touchend", this.handlePlayheadMouseUp, true);
      }
    }
  },

  handlePlayheadMouseMove: function(evt) {
    this.props.controller.startHideControlBarTimer();
    evt.preventDefault();
    if (this.props.seeking) {
      if (this.isMobile){
        evt = evt.touches[0];
      }
      var deltaX = evt.clientX - this.lastScrubX;
      var scrubbingPlayheadX = this.props.currentPlayhead * this.scrubberBarWidth / this.props.duration + deltaX;
      this.props.controller.updateSeekingPlayhead((scrubbingPlayheadX / this.scrubberBarWidth) * this.props.duration);
      this.setState({
        scrubbingPlayheadX: scrubbingPlayheadX
      });
      this.lastScrubX = evt.clientX;
    }
  },

  handlePlayheadMouseUp: function(evt) {
    if (!this.isMounted()) {
      return;
    }
    this.props.controller.startHideControlBarTimer();
    evt.preventDefault();
    // stop propagation to prevent it from bubbling up to the skin and pausing
    evt.stopPropagation(); // W3C
    evt.cancelBubble = true; // IE

    this.lastScrubX = null;
    if (!this.isMobile){
      this.getDOMNode().parentNode.removeEventListener("mousemove", this.handlePlayheadMouseMove);
      document.removeEventListener("mouseup", this.handlePlayheadMouseUp, true);
    }
    else{
      this.getDOMNode().parentNode.removeEventListener("touchmove", this.handlePlayheadMouseMove);
      document.removeEventListener("touchend", this.handlePlayheadMouseUp, true);
    }
    this.props.controller.seek(this.props.currentPlayhead);
    this.setState({
      currentPlayhead: this.props.currentPlayhead,
      scrubbingPlayheadX: 0
    });
    this.props.controller.endSeeking();
  },

  handleScrubberBarMouseDown: function(evt) {
    if (this.props.controller.state.screenToShow == CONSTANTS.SCREEN.AD_SCREEN) return;
    if (evt.target.className.match("playhead")) { return; }
    var offsetX = 0;
    if (this.isMobile){
      offsetX = evt.targetTouches[0].pageX - evt.target.getBoundingClientRect().left;
    }
    else {
      offsetX = evt.nativeEvent.offsetX;
    }

    this.setState({
      scrubbingPlayheadX: offsetX
    });
    this.props.controller.updateSeekingPlayhead((offsetX / this.scrubberBarWidth) * this.props.duration);
    this.handlePlayheadMouseDown(evt);
  },

  render: function() {
    var scrubberBarStyle = {
      backgroundColor: this.props.skinConfig.controlBar.scrubberBar.backgroundColor
    };
    var bufferedIndicatorStyle = {
      width: (parseFloat(this.props.buffered) / parseFloat(this.props.duration)) * 100 + "%",
      backgroundColor: this.props.skinConfig.controlBar.scrubberBar.bufferedColor
    };
    var playedIndicatorStyle = {
      width: Math.min((parseFloat(this.props.currentPlayhead) / parseFloat(this.props.duration)) * 100, 100) + "%",
      backgroundColor: this.props.skinConfig.controlBar.scrubberBar.playedColor
    };

    var playheadStyle = {};
    var playheadPaddingStyle = {};

    if (!this.state.transitionedDuringSeek) {

        if (this.state.scrubbingPlayheadX && this.state.scrubbingPlayheadX != 0) {
          playheadPaddingStyle.left = this.state.scrubbingPlayheadX;
        } else {
          playheadPaddingStyle.left = ((parseFloat(this.props.currentPlayhead) /
            parseFloat(this.props.duration)) * this.scrubberBarWidth);
        }

        playheadPaddingStyle.left = Math.max(
          Math.min(this.scrubberBarWidth - parseInt(this.playheadWidth)/2,
            playheadPaddingStyle.left), 0);
    }

    var playheadMouseDown = this.handlePlayheadMouseDown;
    var scrubberBarMouseDown = this.handleScrubberBarMouseDown;
    var playedIndicatorClassName = "playedIndicator";
    var playheadClassName = "playhead";

    if (this.props.controller.state.screenToShow == CONSTANTS.SCREEN.AD_SCREEN){
      playheadClassName += " adPlayhead";
      playedIndicatorClassName += " playedAdIndicator";
      playheadMouseDown = null;

      scrubberBarStyle.backgroundColor = this.props.skinConfig.controlBar.adScrubberBar.backgroundColor;
      bufferedIndicatorStyle.backgroundColor = this.props.skinConfig.controlBar.adScrubberBar.bufferedColor;
      playedIndicatorStyle.backgroundColor = this.props.skinConfig.controlBar.adScrubberBar.playedColor;
    }

    var scrubberBarClass = ClassNames({
      "scrubberBarContainer": true,
      "scrubber-bar-hidden": !this.props.controlBarVisible,
      "scrubber-bar-visible": this.props.controlBarVisible
    });

    return (
      <div className={scrubberBarClass}>
        <div className="scrubberBarPadding" onMouseDown={scrubberBarMouseDown} onTouchStart={scrubberBarMouseDown}>
          <div ref="scrubberBar" className="scrubberBar" style={scrubberBarStyle}>
            <div className="bufferedIndicator" style={bufferedIndicatorStyle}></div>
            <div className={playedIndicatorClassName} style={playedIndicatorStyle}></div>
            <div className="playheadPadding" style={playheadPaddingStyle}
              onMouseDown={playheadMouseDown} onTouchStart={playheadMouseDown}>
              <div className={playheadClassName} style={playheadStyle}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = ScrubberBar;