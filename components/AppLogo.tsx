import Svg, { Ellipse, Path, Rect } from 'react-native-svg'

type Props = {
  size?: number
  showText?: boolean
}

export default function AppLogo({ size = 120, showText = true }: Props) {
  const scale = size / 180

  return (
    <Svg width={size} height={showText ? size * 1.4 : size} viewBox="0 0 180 180">
      <Ellipse cx="90" cy="90" rx="88" ry="88" fill="#2D6A4F"/>
      <Ellipse cx="90" cy="90" rx="72" ry="72" fill="#F8F9FA"/>
      <Path d="M48 98 Q48 142 90 148 Q132 142 132 98 Q132 82 90 82 Q48 82 48 98Z" fill="#2D6A4F"/>
      <Rect x="62" y="74" width="4" height="30" rx="2" fill="#2D6A4F"/>
      <Rect x="80" y="68" width="4" height="36" rx="2" fill="#2D6A4F"/>
      <Rect x="98" y="68" width="4" height="36" rx="2" fill="#2D6A4F"/>
      <Rect x="116" y="74" width="4" height="30" rx="2" fill="#2D6A4F"/>
      <Path d="M38 100 L142 100" stroke="#2D6A4F" strokeWidth="3.5" strokeLinecap="round"/>
      <Path d="M108 38 C108 38 124 28 128 42 C132 56 118 62 108 52 C98 62 84 56 88 42 C92 28 108 38 108 38Z" fill="#52B788"/>
    </Svg>
  )
}