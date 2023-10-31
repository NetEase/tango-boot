function hasKey(obj: any, key: string) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

function isSimpleObject(obj: any) {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    !Array.isArray(obj) &&
    !(obj instanceof Date) &&
    !(obj instanceof RegExp)
  );
}

export function mergeObjects(obj1: object, obj2: object) {
  if (!obj1) {
    return obj2;
  }

  if (!obj2) {
    return obj1;
  }

  const result: object = {};

  for (const key in obj1) {
    if (hasKey(obj1, key)) {
      if (isSimpleObject(obj1[key]) && isSimpleObject(obj2[key])) {
        result[key] = mergeObjects(obj1[key], obj2[key]) as any;
      } else {
        result[key] = obj1[key];
      }
    }
  }

  for (const key in obj2) {
    if (hasKey(obj2, key)) {
      if (isSimpleObject(obj2[key]) && !hasKey(result, key)) {
        result[key] = mergeObjects({}, obj2[key]) as any;
      } else if (!hasKey(result, key)) {
        result[key] = obj2[key];
      }
    }
  }

  return result;
}
