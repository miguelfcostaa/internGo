import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const RequiredFieldTooltip = ({ 
  message = "Campo obrigatório", 
  placement = "top",
  children,
  className = ""
}) => {
  const renderTooltip = (props) => (
    <Tooltip 
      id="required-field-tooltip" 
      {...props}
      style={{
        '--bs-tooltip-bg': '#dc3545',
        '--bs-tooltip-color': '#ffffff',
        ...props.style
      }}
    >
      {message}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement={placement} overlay={renderTooltip}>
      <span 
        className={`text-danger ${className}`} 
        style={{ cursor: 'pointer', color: 'red' }}
      >
        {children || '*'}
      </span>
    </OverlayTrigger>
  );
};

export default RequiredFieldTooltip;
