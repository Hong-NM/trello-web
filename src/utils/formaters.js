
/**
 * Capitalize the first letter of a string
 */
 export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
 * Example:
 */
// const stringTest = 'MinhHong'
// const capString = capitalizeFirstLetter(stringTest)

// console.log('stringTest:', stringTest)
// console.log('capString:', capString)
/**
 * Results:
 * 
 * stringTest: Of course, nothing changes =))
 * capString: MinhHong
 */