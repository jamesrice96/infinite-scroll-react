import React, { Component } from 'react';

export default class Image extends Component {
  render() {
    const { image } = this.props;
    return (
      <div className="col-md-4">
        <img
          src={`${image.urls.raw}&w=400&h=400&fit=crop`}
          alt={image.alt_description ? image.alt_description : ''}
          className="img-fluid mb-4"
        />
      </div>
    );
  }
}
