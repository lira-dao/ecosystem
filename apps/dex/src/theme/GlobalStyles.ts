import { createGlobalStyle } from '@xstyled/styled-components';
import ApercuMonoProBold from './fonts/ApercuMonoProBold.ttf';
import ApercuMonoProMedium from './fonts/ApercuMonoProMedium.ttf';
import ApercuMonoProRegular from './fonts/ApercuMonoProRegular.ttf';
import ApercuMonoProLight from './fonts/ApercuMonoProLight.ttf';
import AvenirNextBold from './fonts/AvenirNextLTPro-Bold.otf';
import AvenirNextRegular from './fonts/AvenirNextLTPro-Regular.otf';
import AvenirNextLite from './fonts/AvenirNextLTPro-It.otf';


export const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: "Apercu Mono Pro";
    src: url(${ApercuMonoProBold}) format("truetype");
    font-weight: 700;
  }

  @font-face {
    font-family: "Apercu Mono Pro";
    src: url(${ApercuMonoProMedium}) format("truetype");
    font-weight: 300;
  }

  @font-face {
    font-family: "Apercu Mono Pro";
    src: url(${ApercuMonoProRegular}) format("truetype");
    font-weight: 500;
  }

  @font-face {
    font-family: "Apercu Mono Pro";
    src: url(${ApercuMonoProLight}) format("truetype");
    font-weight: 400;
  }

  @font-face {
    font-family: "Avenir Next";
    src: url(${AvenirNextBold}) format("opentype");
    font-weight: 700;
  }

  @font-face {
    font-family: "Avenir Next";
    src: url(${AvenirNextRegular}) format("opentype");
    font-weight: 500;
  }

  @font-face {
    font-family: "Avenir Next";
    src: url(${AvenirNextLite}) format("opentype");
    font-weight: 400;
  }

  body {
    min-height: 100vh;
    margin: 0;
    color: white;
    background-color: #0A0A0A;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a,
  a:visited {
    color: #09FEF5;
    text-decoration: none;
  }

  *:focus,
  button:focus {
    outline: none;
  }
`;
