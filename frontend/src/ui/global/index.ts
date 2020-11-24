import { createGlobalStyle } from 'styled-components';

export const GlobalFontStyle = createGlobalStyle`
  @font-face {
    font-family:'Roboto';
    font-style:normal;
    font-weight:400;
    font-display:block;
    src:url('https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2') format('woff2');
  }

  @font-face {
    font-family:'Josefin Sans';
    font-style:normal;
    font-weight:400;
    font-display:block;
    src: url('https://fonts.gstatic.com/s/josefinsans/v16/Qw3aZQNVED7rKGKxtqIqX5EUDXx4Vn8sig.woff2') format('woff2');
  }
`;
