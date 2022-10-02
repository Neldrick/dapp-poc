export const numberEnumToKeyValueArray = (
  aEnum: any
): {
  key: string
  value: number
}[] =>
  Object.entries(aEnum)
    .filter((e) => isNaN(e[0] as any))
    .map((e) => ({ key: e[0], value: Number(e[1]) }))

export const numberWithCommas = (x: string) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const getTimeOfStartOfToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today.getTime()
}
export function getEnumKeyByEnumValue(myEnum: any, enumValue: number | string): string {
  const keys = Object.keys(myEnum).filter((x) => myEnum[x] == enumValue)
  return keys.length > 0 ? keys[0] : ''
}
export function setObjectKeyValue<ObjType, KeyType extends keyof ObjType>(
  obj: ObjType,
  key: KeyType,
  value: ObjType[KeyType]
): ObjType {
  obj[key] = value
  return obj
}
