import React, { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';
import { darken, desaturate, lighten } from 'polished';

type ButtonProps = PropsWithChildren<{
  alt?: string;
  background: string;
  border?: string;
  borderColor?: string;
  borderRadius?: string;
  borderStyle?: string;
  borderWidth?: string;
  onClick: () => void;
  disabled?: boolean;
  height?: string;
  margin?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  padding?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  width?: string;
}>;

const calculateBorderCss = (props: ButtonProps) => {
  if (props.border) {
    return css`
      border: ${props.border};
    `;
  } else {
    return css`
      border-color: ${props.borderColor ?? '#000000'};
      border-radius: ${props.borderRadius ?? '0px'};
      border-style: ${props.borderStyle ?? 'none'};
      border-width: ${props.borderWidth ?? '0px'};
    `;
  }
};

const calculateMarginCss = (props: {
  margin?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
}) => {
  if (props.margin) {
    return css`
      margin: ${props.margin};
    `;
  }
  return css`
    ${props.marginBottom && `margin-bottom: ${props.marginBottom};`}
    ${props.marginLeft && `margin-left: ${props.marginLeft};`}
    ${props.marginRight && `margin-right: ${props.marginRight};`}
    ${props.marginTop && `margin-top: ${props.marginTop};`}
  `;
};

const calculatePaddingCss = (props: {
  padding?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
}) => {
  if (props.padding) {
    return css`
      padding: ${props.padding};
    `;
  } else if (
    !props.paddingBottom &&
    !props.paddingLeft &&
    !props.paddingRight &&
    !props.paddingTop
  ) {
    return css`
      padding: 1rem 2rem;
    `;
  }
  return css`
    ${props.paddingBottom && `padding-bottom: ${props.paddingBottom};`}
    ${props.paddingLeft && `padding-left: ${props.paddingLeft};`}
    ${props.paddingRight && `padding-right: ${props.paddingRight};`}
    ${props.paddingTop && `padding-top: ${props.paddingTop};`}
  `;
};

const ScButton = styled.button<ButtonProps>`
  background-color: ${(props) => props.background};
  ${(props) => props.width && `width: ${props.width};`}
  ${(props) => props.height && `height: ${props.height};`}
  ${(props) => calculateBorderCss(props)}
  ${(props) => calculateMarginCss(props)}
  ${(props) => calculatePaddingCss(props)}

  &:active {
    background-color: ${(props) => darken(0.05, props.background)};
  }

  &:hover {
    &:active {
      background-color: ${(props) => darken(0.05, props.background)};
    }
    background-color: ${(props) => lighten(0.1, props.background)};
  }

  &:focus {
    outline-color: ${(props) =>
      props.background
        ? lighten(0.2, props.background)
        : '-webkit-focus-ring-color'};
    outline-style: auto;
    outline-width: 1px;
  }

  &:disabled {
    background-color: ${(props) => desaturate(0.9, props.background)};
  }
`;

export const Button: React.FC<ButtonProps> = ({
  alt,
  borderRadius = '0.5rem',
  disabled = false,
  children,
  ...otherProps
}) => {
  return (
    <ScButton
      alt={alt}
      borderRadius={borderRadius}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </ScButton>
  );
};
