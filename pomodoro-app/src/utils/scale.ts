import { useWindowDimensions, PixelRatio } from 'react-native';

const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

export function useScaledSize() {
  const { width, height } = useWindowDimensions();

  const scaleWidth = width / DESIGN_WIDTH;
  const scaleHeight = height / DESIGN_HEIGHT;
  const scale = Math.min(scaleWidth, scaleHeight);

  const fontScale = PixelRatio.getFontScale();

  const hs = (size: number) => Math.round(size * scaleWidth);
  const vs = (size: number) => Math.round(size * scaleHeight);
  const ms = (size: number) => Math.round(size * scale);
  const fs = (size: number) => Math.round((size * scale) / fontScale);

  return {
    hs,
    vs,
    ms,
    fs,
    width,
    height,
    scale,
    fontScale,
    isSmallScreen: width < 375,
    isLargeScreen: width >= 428,
  };
}