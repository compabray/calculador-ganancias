function getTotalIncomes(group) {
    let total = 0;
    group.forEach((item) => {
      if (item.gasto === false) {
        const value = Number(item.valor);
        if (!isNaN(value)) {
          total += value;
        }
      }
    });
    return total;
  }

function getTotalProfit(group) {
    let total = 0;
    group.forEach((item) => {
      const value = Number(item.valor);
      if (!isNaN(value)) {
        if (item.gasto === false) {
          total += value;
        } else {
          total -= value;
        }
      }
    });
    return total;
  }


function getTotalSpent(group) {
    let total = 0;
    group.forEach((item) => {
      if (item.gasto === true) {
        const value = Number(item.valor);
        if (!isNaN(value)) {
          total += value;
        }
      }
    });
    return total;
  }
  
  export { getTotalIncomes, getTotalProfit, getTotalSpent};