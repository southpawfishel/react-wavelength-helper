import React, { PropsWithChildren } from 'react';
import styled, { css } from 'styled-components';

type TextProps = PropsWithChildren<{
  color?: string;
  font?: string;
  fontFamily?: string;
  fontSize?: string;
  fontStyle?: string;
  fontWeight?: string;
}>;

const getFontCss = (props: TextProps) => {
  if (props.font) {
    return css`
      font: ${props.font};
    `;
  } else {
    return css`
      ${props.fontFamily && `font-family: ${props.fontFamily};`}
      ${props.fontSize && `font-size: ${props.fontSize};`}
      ${props.fontStyle && `font-style: ${props.fontStyle};`}
      ${props.fontWeight && `font-weight: ${props.fontWeight};`}
    `;
  }
};

const ScTextSpan = styled.span<TextProps>`
  ${(props) => getFontCss(props)}
  ${(props) => props.color && `color: ${props.color}`}
`;

// "Josefin Sans script=latin rev=1"
export const Text: React.FC<TextProps> = ({
  children,
  fontFamily = "'Helvetica Neue', 'Roboto', sans-serif",
  ...otherProps
}) => {
  return (
    <ScTextSpan fontFamily={fontFamily} {...otherProps}>
      {children}
    </ScTextSpan>
  );
};
