// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: purple; icon-glyph: magic;
/*=========================================================
 * WIDGET CONFIGURATIONS
 ========================================================*/

 const WIDGET_CONFIGURATIONS = {

    // If this is true, it opens a prompt to select a 
    // background image from the photo gallery,
    // when the widget is run from the Scriptable app
    useBackgroundImage: true,
  
    // If useBackgroundImage is set to false, this background
    // color gradient will be use. Feel free to set to your
    // own colors
    backgroundColor: [
      new Color("#ffffff")
    ],
  
    // The font to use for the words in the word clock
    font: 'JejuMyeongjo',
  
    // The font size to use for the words in the word clock
    fontSize: 25,
  
    // The color to use for the "highlighted" words.
    // The "highlighted" words tells the time
    textColorHighlighted: Color.white(),
  
    // The color of the highlighted text shadow
    textShadowHighlighted: Color.cyan(),
  
    // The radius of the highlighted text shadow
    textShadowHighlightedRadius: 3,
  
    // The color of the words that are NOT highlighted
    textColorBackground: Color.lightGray(),
  
    // The opacity of the non-highlighted words 
    // 1 -> opaque; 0 -> transparent
    textAlphaBackground: 0.5,
  
    // The spacing between the lines of words of the clock
    spacingBetweenLines: 4,
    
    // The spacing between each individual word, within the
    // same line
    spacingBetweenWords: 25,
  }
  
  /*=========================================================
   * WIDGET SET UP / PRESENTATION
   ========================================================*/
  
  /**
   * The words to display for the clock. If you want to use
   * other words, make sure to update getHighlightedWords()
   * accordingly.
   */ 
  const TIME_WORDS_MATRIX = [
    ['낮', '다', '일', '세', '네'],
    ['여', '섯', '곱', '열', '한'],
    ['덟', '아', '홉', '두', '시'],
    ['밤', '정', '이', '삼', '십'],
    ['사', '오', '십', '오', '분'],
  ];
  
  const widget = new ListWidget();
  
  await setBackground(widget, WIDGET_CONFIGURATIONS);
  
  drawWidget(widget, WIDGET_CONFIGURATIONS);
  
  if (config.runsInWidget) {
    Script.setWidget(widget);
    Script.complete();
  } else {
    Script.setWidget(widget);
    widget.presentSmall();
    Script.complete();
  }
  
  /*=========================================================
   * FUNCTIONS
   ========================================================*/
  
  /**
   * Main widget rendering function.
   * 
   * Lays out the widget as a vertical list of stacks, 
   * containing texts.
   */ 
  function drawWidget(widget, { 
    font,
    fontSize,
    textColorHighlighted,
    textShadowHighlighted,
    textShadowHighlightedRadius,
    textColorBackground,
    textAlphaBackground,
    spacingBetweenLines,
    spacingBetweenWords,
  }) {
    const mainStack = widget.addStack();
    mainStack.layoutVertically();
    mainStack.spacing = spacingBetweenLines;
  
    const highlightedWords = getHighlightedWords();
  
    for (let i = 0; i < TIME_WORDS_MATRIX.length; i++) {
      const numWords = TIME_WORDS_MATRIX[i].length;
      
      const textStack = mainStack.addStack();
      textStack.layoutHorizontally();
      textStack.spacing = spacingBetweenWords;
  
      for (let j = 0; j < numWords; j++) {
        const text = textStack.addText(TIME_WORDS_MATRIX[i][j]);
        text.font = new Font(font, fontSize);
        if (highlightedWords[i] && highlightedWords[i][j]) {
          text.textColor = textColorHighlighted;
          text.shadowColor = textShadowHighlighted;
          text.shadowRadius = textShadowHighlightedRadius;
        } else {
          text.textColor = textColorBackground;
          text.alpha = textAlphaBackground;
        }
      }
    }
  }
  
  /**
   * Based on the input time, returns an array of arrays of
   * which "time" words should be highlighted.
   * 
   * This is used as a look-up when adding texts to the 
   * stack.
   */
  function getHighlightedWords() {
    // The dimensions of this should match the dimensions of
    // TIME_WORDS_MATRIX
    const defaultHighlights = [
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
      [false, false, false, false, false],
    ];
  
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
  
    if (minute === 0 && hour === 12) {
      defaultHighlights[3][1] = true;
      defaultHighlights[4][1] = true;
    }

    if (minute >= 5 && minute < 10) {
      // 오분
      defaultHighlights[4][3] = true;
      defaultHighlights[4][4] = true;
    } else if (minute >= 10 && minute < 15) {
      // 십분
      defaultHighlights[4][2] = true;
      defaultHighlights[4][4] = true;
    } else if (minute >= 15 && minute < 20) {
      // 십오분
      defaultHighlights[4][2] = true;
      defaultHighlights[4][3] = true;
      defaultHighlights[4][4] = true;
    } else if (minute >= 20 && minute < 25) {
      // 이십분
      defaultHighlights[3][2] = true;
      defaultHighlights[4][2] = true;
      defaultHighlights[4][4] = true;
    } else if (minute >= 25 && minute < 30) {
      // 이십오분
      defaultHighlights[3][2] = true;
      defaultHighlights[4][2] = true;
      defaultHighlights[4][3] = true;
      defaultHighlights[4][4] = true;
    } else if (minute >= 30 && minute < 35) {
      // 삼십분
      defaultHighlights[3][3] = true;
      defaultHighlights[3][4] = true;
      defaultHighlights[4][4] = true;
    } else if (minute >= 35 && minute < 40) {
      // 삼십오분
      defaultHighlights[3][3] = true;
      defaultHighlights[3][4] = true;
      defaultHighlights[4][3] = true;
      defaultHighlights[4][4] = true;
    } else if (minute >= 40 && minute < 45) {
      // 사십분
      defaultHighlights[4][0] = true;
      defaultHighlights[4][2] = true;
      defaultHighlights[4][4] = true;
    } else if (minute >= 45 && minute < 50) {
      // 사십오분
      defaultHighlights[4][0] = true;
      defaultHighlights[4][2] = true;
      defaultHighlights[4][3] = true;
      defaultHighlights[4][4] = true;
    } else if (minute >= 50 && minute < 55) {
      // 오십분
      defaultHighlights[4][1] = true;
      defaultHighlights[4][2] = true;
      defaultHighlights[4][4] = true;
    } else if (minute >= 50 && minute < 60) {
      // 오십오분
      defaultHighlights[4][1] = true;
      defaultHighlights[4][2] = true;
      defaultHighlights[4][3] = true;
      defaultHighlights[4][4] = true;
    } else if (minute >= 0 && minute < 5) {
      // 정시
      defaultHighlights[3][1] = false;
      defaultHighlights[3][2] = false;
      defaultHighlights[3][3] = false;
      defaultHighlights[3][4] = false;
      defaultHighlights[4][0] = false;
      defaultHighlights[4][1] = false;
      defaultHighlights[4][2] = false;
      defaultHighlights[4][3] = false;
      defaultHighlights[4][4] = false;
    }

    if (hour >= 6 && hour < 19) {
      defaultHighlights[0][0] = true;
    } else {
      defaultHighlights[3][0] = true;
    }
    
    if (hour >= 1 && hour < 2) {
      // 한시
      defaultHighlights[1][4] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 2 && hour < 3) {
      // 두시
      defaultHighlights[2][3] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 3 && hour < 4) {
      // 세시
      defaultHighlights[0][3] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 4 && hour < 5) {
      // 네시
      defaultHighlights[0][4] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 5 && hour < 6) {
      // 다섯시
      defaultHighlights[0][1] = true;
      defaultHighlights[1][1] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 6 && hour < 7) {
      // 여섯시
      defaultHighlights[1][0] = true;
      defaultHighlights[1][1] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 7 && hour < 8) {
      // 일곱시
      defaultHighlights[0][2] = true;
      defaultHighlights[1][2] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 8 && hour < 9) {
      // 여덟시
      defaultHighlights[1][0] = true;
      defaultHighlights[2][0] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 9 && hour < 10) {
      // 아홉시
      defaultHighlights[2][1] = true;
      defaultHighlights[2][2] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 10 && hour < 11) {
      // 열시
      defaultHighlights[1][3] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 11 && hour < 12) {
      // 열한시
      defaultHighlights[1][3] = true;
      defaultHighlights[1][4] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 12 && hour < 13) {
      // 열두시
      defaultHighlights[1][3] = true;
      defaultHighlights[2][3] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 13 && hour < 14) {
      // 한시
      defaultHighlights[1][4] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 14 && hour < 15) {
      // 두시
      defaultHighlights[2][3] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 15 && hour < 16) {
      // 세시
      defaultHighlights[0][3] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 16 && hour < 17) {
      // 네시
      defaultHighlights[0][4] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 17 && hour < 18) {
      // 다섯시
      defaultHighlights[0][1] = true;
      defaultHighlights[1][1] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 18 && hour < 19) {
      // 여섯시
      defaultHighlights[1][0] = true;
      defaultHighlights[1][1] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 19 && hour < 20) {
      // 일곱시
      defaultHighlights[0][2] = true;
      defaultHighlights[1][2] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 20 && hour < 21) {
      // 여덟시
      defaultHighlights[1][0] = true;
      defaultHighlights[2][0] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 21 && hour < 22) {
      // 아홉시
      defaultHighlights[2][1] = true;
      defaultHighlights[2][2] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 22 && hour < 23) {
      // 열시
      defaultHighlights[1][3] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 23 && hour < 24) {
      // 열한시
      defaultHighlights[1][3] = true;
      defaultHighlights[1][4] = true;
      defaultHighlights[2][4] = true;
    } else if (hour >= 0 && hour < 1) {
      // 열두시
      defaultHighlights[1][3] = true;
      defaultHighlights[2][3] = true;
      defaultHighlights[2][4] = true;
    } 
  
    return defaultHighlights;
  }
  
  /**
   * Sets the background on the widget.
   * 
   * If the script/widget is running as a widget, 
   * set the background from the cache. 
   * 
   * If no background image is in the cache,
   * default to the gray gradient.
   * 
   * If running in the app, prompt the user to select a 
   * background image. Persist in cache.
   */ 
   async function setBackground(widget, {
     useBackgroundImage, 
     backgroundColor,
  }) {
    if (useBackgroundImage) {
      // Determine if our image exists and when it was saved.
      const files = FileManager.local();
      const path = files.joinPath(
        files.documentsDirectory(), 
        'word-clock-widget-background'
      );
      const exists = files.fileExists(path);
  
      // If it exists and we're running in the widget, 
      // use photo from cache
      // Or we're invoking the script to run FROM the widget 
      // with a widgetParameter
      if (exists && config.runsInWidget 
          || args.widgetParameter === 'callback') {
        widget.backgroundImage = files.readImage(path);
  
        // If it's missing when running in the widget, 
        // fallback to backgroundColor
      } else if (!exists && config.runsInWidget) {
        const bgColor = new LinearGradient();
        bgColor.colors = backgroundColor;
        bgColor.locations = [0.0, 1.0];
        widget.backgroundGradient = bgColor;
  
        // But if we're running in app, prompt the user for 
        // the image.
      } else if (config.runsInApp) {
        const img = await Photos.fromLibrary();
        widget.backgroundImage = img;
        files.writeImage(path, img);
      }
    } else {
      const bgColor = new LinearGradient();
      bgColor.colors = backgroundColor;
      bgColor.locations = [0.0, 1.0];
      widget.backgroundGradient = bgColor;
    }
  }
