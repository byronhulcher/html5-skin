var React = require('react');

var Spinner = React.createClass({
  render: function() {
    var loadingImageUrl = this.props.skinConfig.general.loadingImage.imageResource.url;
    return (
      <div className="spinner-screen">
        <div className="spinner-wrapper">
          <img src={loadingImageUrl} className="spinner" />
        </div>
      </div>
    );
  }
});
module.exports = Spinner;