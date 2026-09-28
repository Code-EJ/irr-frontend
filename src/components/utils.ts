export const applyMask = (value: string, mask: string) => {
    let maskedValue = "";
    let valueIndex = 0;
  
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === "#") {
        if (value[valueIndex]) {
          maskedValue += value[valueIndex];
          valueIndex++;
        } else {
          break;
        }
      } else {
        maskedValue += mask[i];
      }
    }
  
    return maskedValue;
  };
  