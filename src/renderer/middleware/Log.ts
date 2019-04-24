/* eslint no-console: 0 */
export default class Log {
  static notUTF8 = (encoding: string) => {
    console.error(`ERR: Character code must UTF-8 ( with or without a BOM ). But actual '${encoding}'`)
  }
  static notExistSignature = () => {
    console.error('ERR: Not existing "WEBVTT" at top of file.')
  }
  static invalidAttribute = (l: number, category: string, attribute: string) => {
    console.error(`ERR: Invalid attribute; line ${l}, "${category}::${attribute}".`)
  }
  static invalidValue = (l: number, attribute: string, value: string) => {
    console.error(`ERR: Invalid value(s); line ${l}, "${attribute} => ${value}".`)
  }

  static generalError = (l: number) => {
    console.error(`ERR: General error; Probably line ${l}.`)
  }

  static invalidTimestamp = (l: number, cat: 'Hour' | 'Minute' | 'Second' | 'MilliSecond', val: string) => {
    let stamp = ''
    switch (cat) {
      case 'Hour':
        stamp = 'be a positive number of 2-digits or more. (ex: "00", "01", ...)'
        break
      case 'Minute':
        stamp = 'fit between "00" to "59" (and must 2-digits.)'
        break
      case 'Second':
        stamp = 'fit between "00" to "59" (and must 2-digits.)'
        break
      case 'MilliSecond':
        stamp = 'fit between "000" to "999" (and must 3-digits.)'
        break
    }
    console.error(`ERR: Invalid timestamp; line ${l}, ${cat}'s value must ${stamp}. But your value is "${val}".`)
  }
}
