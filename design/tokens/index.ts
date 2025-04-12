// 디자인 토큰 시스템
// 앱 전체에서 일관된 디자인 요소를 관리하는 중앙 저장소

export const tokens = {
  // 색상 시스템
  colors: {
    // 브랜드 색상
    brand: {
      primary: {
        50: "hsl(217, 71%, 95%)",
        100: "hsl(217, 71%, 90%)",
        200: "hsl(217, 71%, 80%)",
        300: "hsl(217, 71%, 70%)",
        400: "hsl(217, 71%, 60%)",
        500: "hsl(217, 71%, 50%)",
        600: "hsl(217, 71%, 40%)",
        700: "hsl(217, 71%, 30%)",
        800: "hsl(217, 71%, 23%)", // 기본 #1A365D
        900: "hsl(217, 71%, 15%)",
      },
      secondary: {
        50: "hsl(210, 40%, 98%)",
        100: "hsl(210, 40%, 96%)",
        200: "hsl(210, 40%, 90%)",
        300: "hsl(210, 40%, 80%)",
        400: "hsl(210, 40%, 70%)",
        500: "hsl(210, 40%, 60%)",
        600: "hsl(210, 40%, 50%)",
        700: "hsl(210, 40%, 40%)",
        800: "hsl(210, 40%, 30%)",
        900: "hsl(210, 40%, 20%)",
      },
    },
    // 의미적 색상
    semantic: {
      success: {
        50: "hsl(142, 76%, 95%)",
        100: "hsl(142, 72%, 90%)",
        500: "hsl(142, 71%, 45%)",
        600: "hsl(142, 72%, 35%)",
      },
      warning: {
        50: "hsl(48, 96%, 95%)",
        100: "hsl(48, 96%, 90%)",
        500: "hsl(48, 96%, 53%)",
        600: "hsl(48, 96%, 43%)",
      },
      error: {
        50: "hsl(0, 86%, 95%)",
        100: "hsl(0, 86%, 90%)",
        500: "hsl(0, 84%, 60%)",
        600: "hsl(0, 84%, 50%)",
      },
      info: {
        50: "hsl(210, 100%, 95%)",
        100: "hsl(210, 100%, 90%)",
        500: "hsl(210, 100%, 50%)",
        600: "hsl(210, 100%, 40%)",
      },
    },
    // 중립 색상
    neutral: {
      50: "hsl(0, 0%, 98%)",
      100: "hsl(0, 0%, 96%)",
      200: "hsl(0, 0%, 90%)",
      300: "hsl(0, 0%, 80%)",
      400: "hsl(0, 0%, 70%)",
      500: "hsl(0, 0%, 60%)",
      600: "hsl(0, 0%, 50%)",
      700: "hsl(0, 0%, 40%)",
      800: "hsl(0, 0%, 30%)",
      900: "hsl(0, 0%, 20%)",
    },
    // 배경 색상
    background: {
      primary: "hsl(40, 33%, 96%)", // #F8F6F2
      secondary: "hsl(0, 0%, 100%)", // #FFFFFF
      tertiary: "hsl(0, 0%, 98%)", // #FAFAFA
    },
  },

  // 타이포그래피
  typography: {
    fontFamily: {
      base: "Inter, sans-serif",
      heading: "Inter, sans-serif",
    },
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
    letterSpacing: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // 간격
  spacing: {
    0: "0",
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    32: "8rem", // 128px
  },

  // 그림자
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    none: "none",
  },

  // 테두리 반경
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },

  // 애니메이션
  animation: {
    durations: {
      fast: "150ms",
      normal: "300ms",
      slow: "500ms",
    },
    timingFunctions: {
      ease: "ease",
      easeIn: "ease-in",
      easeOut: "ease-out",
      easeInOut: "ease-in-out",
      linear: "linear",
    },
  },

  // 미디어 쿼리 브레이크포인트
  breakpoints: {
    xs: "320px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // z-index 레이어
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    auto: "auto",
  },
}

// 확장 고려:
// 1. 다크 모드 토큰 추가
// 2. 테마 변형 지원
// 3. 접근성 관련 토큰 (포커스 스타일 등)

