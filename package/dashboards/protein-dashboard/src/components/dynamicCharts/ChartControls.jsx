import React from 'react';
import "./styles/ChartControls.css"

class ChartControls extends React.Component {
  handleInputChange = (propertyPath, value) => {
    const newSpec = { ...this.props.spec };
    const pathSegments = propertyPath.split('.');
    let current = newSpec;

    pathSegments.forEach((segment, index) => {
      if (index === pathSegments.length - 1) {
        current[segment] = value;
      } else {
        if (!current[segment]) {
          current[segment] = {};
        }
        current = current[segment];
      }
    });

    this.props.onSpecChange(newSpec);
  };

  renderControl = (label, propertyPath, value) => {
    return (
      <div key={propertyPath} className="control-group">
        <label className="control-label">{label}:</label>
        <input
          className="control-input"
          type="text"
          value={value || ''}
          onChange={(e) => this.handleInputChange(propertyPath, e.target.value)}
        />
      </div>
    );
  };

  render() {
    const { spec } = this.props;
    const controls = [];

    // Chart title
    if (spec.title) {
      controls.push(this.renderControl('Title', 'title', spec.title));
    }

    // Mark type
    if (spec.mark) {
      controls.push(
        <div key="mark" className="control-group">
          <label className="control-label">Mark Type:</label>
          <select
            className="control-select"
            value={spec.mark}
            onChange={(e) => this.handleInputChange('mark', e.target.value)}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="point">Point</option>
            <option value="area">Area</option>
            <option value="rect">Rect</option>
            <option value="boxplot">Boxplot</option>
            {/* Add other mark types as needed */}
          </select>
        </div>
      );
    }

    // Encoding properties
    if (spec.encoding) {
      Object.keys(spec.encoding).forEach((channel) => {
        const channelSpec = spec.encoding[channel];
        if (channelSpec.axis && channelSpec.axis.title) {
          controls.push(
            this.renderControl(
              `${channel.toUpperCase()} Axis Title`,
              `encoding.${channel}.axis.title`,
              channelSpec.axis.title
            )
          );
        }
        if (channelSpec.field) {
          controls.push(
            this.renderControl(
              `${channel.toUpperCase()} Field`,
              `encoding.${channel}.field`,
              channelSpec.field
            )
          );
        }
        if (channelSpec.type) {
          controls.push(
            <div key={`encoding.${channel}.type`} className="control-group">
              <label className="control-label">{`${channel.toUpperCase()} Type`}:</label>
              <select
                className="control-select"
                value={channelSpec.type}
                onChange={(e) => this.handleInputChange(`encoding.${channel}.type`, e.target.value)}
              >
                <option value="nominal">Nominal</option>
                <option value="ordinal">Ordinal</option>
                <option value="quantitative">Quantitative</option>
                <option value="temporal">Temporal</option>
                {/* Add other types as needed */}
              </select>
            </div>
          );
        }
      });
    }

    // Color scheme
    if (spec.encoding && spec.encoding.color && spec.encoding.color.scale) {
      controls.push(
        <div key="color" className="control-group">
          <label className="control-label">Color Scheme:</label>
          <input
            className="control-color"
            type="color"
            value={spec.encoding.color.scale.range ? spec.encoding.color.scale.range[0] : '#000000'}
            onChange={(e) => this.handleInputChange('encoding.color.scale.range', [e.target.value])}
          />
        </div>
      );
    }

    // Tooltip fields
    if (spec.encoding && spec.encoding.tooltip) {
      spec.encoding.tooltip.forEach((tooltip, index) => {
        controls.push(
          this.renderControl(
            `Tooltip ${index + 1} Field`,
            `encoding.tooltip[${index}].field`,
            tooltip.field
          )
        );
      });
    }

    return (
      <div className="controls-panel">
        <h2>{spec.title}</h2>
        {controls}
      </div>
    );
  }
}

export default ChartControls;
