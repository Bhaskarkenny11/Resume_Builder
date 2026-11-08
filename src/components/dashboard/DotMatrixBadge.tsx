import React from 'react';

/**
 * 5x7 Dot-Matrix Font Definition for uppercase letters A-Z, 0-9 and common glyphs.
 * Each character is 7 rows high; each row is a 5-bit binary mask (0b00000 to 0b11111).
 */
const DOT_FONT_5X7: Record<string, number[]> = {
  'A': [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  'B': [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  'C': [0b01111, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b01111],
  'D': [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  'E': [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  'F': [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  'G': [0b01111, 0b10000, 0b10000, 0b10111, 0b10001, 0b10001, 0b01110],
  'H': [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  'I': [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b11111],
  'J': [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  'K': [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  'L': [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  'M': [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  'N': [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  'O': [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  'P': [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  'Q': [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10011, 0b01101],
  'R': [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  'S': [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  'T': [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  'U': [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  'V': [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  'W': [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
  'X': [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  'Y': [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  'Z': [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  '0': [0b01110, 0b10011, 0b10101, 0b10101, 0b11001, 0b10001, 0b01110],
  '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  '2': [0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b01000, 0b11111],
  '3': [0b11110, 0b00001, 0b00001, 0b01110, 0b00001, 0b00001, 0b11110],
  '4': [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  '5': [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  '6': [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  '7': [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  '8': [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  '9': [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100],
  '-': [0b00000, 0b00000, 0b00000, 0b11111, 0b00000, 0b00000, 0b00000],
  ' ': [0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000],
};

interface DotMatrixBadgeProps {
  code: string;
  size?: 'sm' | 'md' | 'lg';
  activeColor?: string;
  inactiveColor?: string;
  glow?: boolean;
}

export const DotMatrixBadge: React.FC<DotMatrixBadgeProps> = ({
  code,
  size = 'md',
  activeColor = '#ffffff',
  inactiveColor = 'rgba(255, 255, 255, 0.07)',
  glow = true,
}) => {
  const chars = code.toUpperCase().slice(0, 4).split('');
  const numChars = chars.length;

  // Grid dimensions
  const charWidth = 5;
  const charHeight = 7;
  const charGap = 1;

  const totalCols = numChars * charWidth + (numChars - 1) * charGap;
  const totalRows = charHeight;

  // Sizing scale
  const dotRadius = size === 'sm' ? 1.0 : size === 'lg' ? 1.7 : 1.35;
  const dotSpacing = size === 'sm' ? 2.8 : size === 'lg' ? 4.8 : 3.6;
  const svgWidth = totalCols * dotSpacing + 2;
  const svgHeight = totalRows * dotSpacing + 2;

  return (
    <div className="inline-flex items-center justify-center select-none" title={code}>
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="overflow-visible"
        style={{
          filter: glow ? 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.6))' : 'none',
        }}
        aria-label={code}
      >
        {chars.map((char, charIdx) => {
          const charPattern = DOT_FONT_5X7[char] || DOT_FONT_5X7[' '];
          const colOffset = charIdx * (charWidth + charGap);

          return (
            <g key={charIdx}>
              {Array.from({ length: totalRows }).map((_, row) => {
                const rowMask = charPattern[row] ?? 0;

                return Array.from({ length: charWidth }).map((_, col) => {
                  const isLit = Boolean((rowMask >> (4 - col)) & 1);
                  const cx = (colOffset + col) * dotSpacing + dotSpacing / 2 + 1;
                  const cy = row * dotSpacing + dotSpacing / 2 + 1;

                  return (
                    <circle
                      key={`${row}-${col}`}
                      cx={cx}
                      cy={cy}
                      r={dotRadius}
                      fill={isLit ? activeColor : inactiveColor}
                    />
                  );
                });
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
