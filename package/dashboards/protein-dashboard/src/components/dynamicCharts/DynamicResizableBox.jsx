import React from 'react';
import { ResizableBox } from 'react-resizable';
import "./styles/DynamicResizableBox.css"

class DynamicResizableBox extends React.Component {


  handleResizeStart = (e, data) => {
    console.log('Resize started', e, data);
  };

  handleResize = (e, data) => {
    console.log('Resizing', e, data);
  };

  handleResizeStop = (e, data) => {
    console.log('Resize stopped', e, data);
  };

  render() {
    const {
      width,
      height,
      handleSize,
      lockAspectRatio,
      axis,
      minConstraints,
      maxConstraints,
      draggableOpts,
      children
    } = this.props;

    const handle = (
      <div>
        {/* <span className="handle handle-sw" /> */}
        <span className="handle handle-se" />
        {/* <span className="handle handle-nw" /> */}
        {/* <span className="handle handle-ne" /> */}
      </div>
    );

    return (
      <ResizableBox
        width={width}
        height={height}
        handleSize={handleSize}
        lockAspectRatio={lockAspectRatio}
        axis={axis}
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
        onResizeStop={this.handleResizeStop}
        onResizeStart={this.handleResizeStart}
        onResize={this.handleResize}
        draggableOpts={draggableOpts}
        handle={handle}
      >
        {children}
      </ResizableBox>
    );
  }
}

DynamicResizableBox.defaultProps = {
  height: "",
  width: "",
  handleSize: [10, 10],
  lockAspectRatio: false,
  axis: 'both',
  minConstraints: [10, 10],
  maxConstraints: [Infinity, Infinity],
  draggableOpts: {}
};

export default DynamicResizableBox;
