import React, { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/align-content
 */
export enum AlignContent {
  Start = 'start',
  Center = 'center',
  SpaceBetween = 'space-between',
  SpaceAround = 'space-around',
  SpaceEvenly = 'space-evenly',
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/align-items
 */
export enum AlignItems {
  Stretch = 'stretch',
  Center = 'center',
  Start = 'start',
  End = 'end',
}
/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/align-self
 */
export enum AlignSelf {
  Stretch = 'stretch',
  Center = 'center',
  Start = 'start',
  End = 'end',
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content
 */
export enum JustifyContent {
  Start = 'start',
  Center = 'center',
  SpaceBetween = 'space-between',
  SpaceAround = 'space-around',
  SpaceEvenly = 'space-evenly',
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction
 */
export enum FlexDirection {
  Row = 'row',
  Column = 'column',
}

type LayoutProps = PropsWithChildren<{
  alignContent?: AlignContent;
  alignItems?: AlignItems;
  alignSelf?: AlignSelf;
  background?: string;
  flexDirection?: FlexDirection;
  flexGrow?: number;
  flexShrink?: number;
  fullHeight?: boolean;
  fullWidth?: boolean;
  height?: string;
  justifyContent?: JustifyContent;
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

const calculateHeightCss = (props: {
  fullHeight?: boolean;
  height?: string;
}) => {
  if (props.fullHeight) {
    return css`
      height: 100%;
    `;
  } else if (props.height) {
    return css`
      height: ${props.height};
    `;
  } else {
    return css``;
  }
};

const calculateWidthCss = (props: { fullWidth?: boolean; width?: string }) => {
  if (props.fullWidth) {
    return css`
      width: 100%;
    `;
  } else if (props.width) {
    return css`
      width: ${props.width};
    `;
  } else {
    return css``;
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
  }
  return css`
    ${props.paddingBottom && `padding-bottom: ${props.paddingBottom};`}
    ${props.paddingLeft && `padding-left: ${props.paddingLeft};`}
    ${props.paddingRight && `padding-right: ${props.paddingRight};`}
    ${props.paddingTop && `padding-top: ${props.paddingTop};`}
  `;
};

const ScLayout = styled.div<LayoutProps>`
  display: 'flex';
  ${(p) => p.alignContent && `align-content: ${p.alignContent};`}
  ${(p) => p.alignItems && `align-items: ${p.alignItems};`}
  ${(p) => p.alignSelf && `align-self: ${p.alignSelf};`}
  ${(p) => p.background && `background: ${p.background};`}
  ${(p) => p.flexDirection && `flex-direction: ${p.flexDirection};`}
  ${(p) => p.flexGrow && `flex-grow: ${p.flexGrow}`};
  ${(p) => p.flexShrink && `flex-shrink: ${p.flexShrink}`};
  ${(p) => p.justifyContent && `justify-content: ${p.justifyContent};`}
  ${(p) => calculateHeightCss(p)}
  ${(p) => calculateMarginCss(p)}
  ${(p) => calculatePaddingCss(p)}
  ${(p) => calculateWidthCss(p)}
`;

/**
 * A component that uses flexbox as its layout mechanism.
 * Intended to be used as a basic building block for laying out content
 * within a page.
 */
export const Layout: React.FC<LayoutProps> = ({ children, ...otherProps }) => {
  return <ScLayout {...otherProps} children={children} />;
};
