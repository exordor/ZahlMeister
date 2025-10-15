// 德语数字转换工具

// 基础数字词汇
const basicNumbers = {
  0: "null",
  1: "eins",
  2: "zwei",
  3: "drei",
  4: "vier",
  5: "fünf",
  6: "sechs",
  7: "sieben",
  8: "acht",
  9: "neun",
  10: "zehn",
  11: "elf",
  12: "zwölf"
};

// 十位数字
const tens = {
  10: "zehn",
  20: "zwanzig",
  30: "dreißig",
  40: "vierzig",
  50: "fünfzig",
  60: "sechzig",
  70: "siebzig",
  80: "achtzig",
  90: "neunzig"
};

/**
 * 将整数部分转换为德语单词
 * @param {number} num - 要转换的整数
 * @returns {string} 德语数字单词
 */
function integerToGerman(num) {
  if (num < 0 || num > 1000) {
    throw new Error("数字必须在0-1000范围内");
  }

  // 0-12: 直接使用基础数字
  if (num <= 12) {
    return basicNumbers[num];
  }

  // 13-19: 个位数 + zehn
  if (num <= 19) {
    const ones = num - 10;
    return basicNumbers[ones] + "zehn";
  }

  // 20-99: 个位 + und + 十位
  if (num <= 99) {
    const ones = num % 10;
    const tensDigit = Math.floor(num / 10) * 10;
    
    if (ones === 0) {
      return tens[tensDigit];
    }
    
    return basicNumbers[ones] + "und" + tens[tensDigit];
  }

  // 100-999: 百位数
  if (num <= 999) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    
    let result = "";
    
    // 百位部分
    if (hundreds === 1) {
      result = "einhundert";
    } else {
      result = basicNumbers[hundreds] + "hundert";
    }
    
    // 添加剩余部分
    if (remainder > 0) {
      result += numberToGerman(remainder);
    }
    
    return result;
  }

  // 1000
  if (num === 1000) {
    return "eintausend";
  }

  throw new Error("不支持的数字范围");
}

/**
 * 将小数部分转换为德语单词
 * @param {string} decimalPart - 小数部分字符串
 * @returns {string} 德语小数部分
 */
function decimalToGerman(decimalPart) {
  return decimalPart.split('').map(digit => basicNumbers[parseInt(digit)]).join(' ');
}

/**
 * 将数字转换为德语单词（支持小数）
 * @param {number} num - 要转换的数字
 * @returns {string} 德语数字单词
 */
function numberToGerman(num) {
  // 检查是否为小数
  if (num % 1 !== 0) {
    const integerPart = Math.floor(num);
    const decimalPart = num.toString().split('.')[1];
    
    const integerWord = integerToGerman(integerPart);
    const decimalWord = decimalToGerman(decimalPart);
    
    return `${integerWord} Komma ${decimalWord}`;
  }
  
  // 整数情况
  return integerToGerman(num);
}

/**
 * 生成指定范围内的随机数字
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {boolean} allowDecimal - 是否允许小数
 * @param {number} decimalPlaces - 小数位数
 * @returns {number} 随机数字
 */
function generateRandomNumber(min = 0, max = 100, allowDecimal = false, decimalPlaces = 1) {
  if (allowDecimal) {
    const multiplier = Math.pow(10, decimalPlaces);
    const randomInteger = Math.random() * (max - min) + min;
    return Math.round(randomInteger * multiplier) / multiplier;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 获取随机数字及其德语表示
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {boolean} allowDecimal - 是否允许小数
 * @param {number} decimalPlaces - 小数位数
 * @returns {object} 包含数字和德语单词的对象
 */
function getRandomGermanNumber(min = 0, max = 100, allowDecimal = false, decimalPlaces = 1) {
  const number = generateRandomNumber(min, max, allowDecimal, decimalPlaces);
  const germanWord = numberToGerman(number);
  
  return {
    number,
    germanWord,
    settings: {
      min,
      max,
      allowDecimal,
      decimalPlaces
    }
  };
}

module.exports = {
  numberToGerman,
  generateRandomNumber,
  getRandomGermanNumber,
  integerToGerman,
  decimalToGerman
};
