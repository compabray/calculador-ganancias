export function groupByProperty(arr, property) {
    const groups = {};
  
    // Group the items by the property
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      const group = item[property];
  
      // Skip the item if it doesn't have the property
      if (!group) {
        continue;
      }
  
      // Create the group if it doesn't exist
  
      if (!groups[group]) {
        groups[group] = [];
      }
  
      // Add the item to the group
  
      groups[group].push(item);
    }
  
    const result = [];
  
    // Create the result array
  
    for (let group in groups) {
      result.push(groups[group]);
    }
  
    return result;
}

